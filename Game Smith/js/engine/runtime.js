/**
 * GameSmith - Active Play Mode Game Runtime
 * Orchestrates the 60fps requestAnimationFrame game loop, state rollback, behavior updates, and debug stats.
 */

import { updatePhysics } from './physics.js';
import { EventEngine } from './events.js';
import { input } from '../core/input.js';
import { audioSynth } from '../core/audio-synth.js';

export class GameRuntime {
  constructor(renderer, spriteLibrary = {}) {
    this.renderer = renderer;
    this.spriteLibrary = spriteLibrary;
    this.eventEngine = new EventEngine(this);

    this.isPlaying = false;
    this.isPaused = false;
    this.animFrameId = null;

    // Runtime state (isolated from editor)
    this.currentScene = null;
    this.runtimeObjects = [];
    this.runtimeVariables = {};
    this.savedEditorScene = null;

    this.isFirstFrame = true;
    this.hudMessage = '';
    this.hudMessageTimer = 0;
    this.playerObj = null;

    // Camera shake
    this.shakeIntensity = 0;
    this.shakeDuration = 0;

    // Performance stats
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = 0;
    this.fpsTimer = 0;

    this.onStateChange = null;
  }

  startPlay(scene, projectVariables = {}, spriteLibrary = {}) {
    this.spriteLibrary = spriteLibrary;
    this.savedEditorScene = JSON.parse(JSON.stringify(scene));

    // Deep clone scene objects and variables
    this.currentScene = JSON.parse(JSON.stringify(scene));
    this.runtimeObjects = this.currentScene.objects || [];
    this.runtimeVariables = JSON.parse(JSON.stringify(projectVariables));

    this.isFirstFrame = true;
    this.isPlaying = true;
    this.isPaused = false;
    this.hudMessage = '';
    this.hudMessageTimer = 0;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.renderer.particles = [];

    // Find primary player object
    this.playerObj = this.runtimeObjects.find(o => o.behavior === 'player' || o.behavior === 'topdown' || o.tag === 'player') || null;

    // Reset camera position to player or center
    if (this.playerObj) {
      const vw = this.renderer.viewportWidth || this.renderer.canvas.width;
      const vh = this.renderer.viewportHeight || this.renderer.canvas.height;
      this.renderer.camera.x = this.playerObj.x + this.playerObj.width / 2 - vw / 2;
      this.renderer.camera.y = this.playerObj.y + this.playerObj.height / 2 - vh / 2;
    } else {
      this.renderer.camera.x = 0;
      this.renderer.camera.y = 0;
    }

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animFrameId = requestAnimationFrame(this.loop);

    if (this.onStateChange) this.onStateChange('playing');
  }

  stopPlay() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    input.reset();

    // Rollback to original editor state
    const originalScene = this.savedEditorScene;
    this.runtimeObjects = [];
    this.currentScene = null;

    if (this.onStateChange) this.onStateChange('stopped', originalScene);
  }

  pausePlay() {
    this.isPaused = !this.isPaused;
    if (this.onStateChange) this.onStateChange(this.isPaused ? 'paused' : 'playing');
  }

  triggerCameraShake(intensity = 8, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // Quick restart scene hotkey (R)
    if (input.isKeyDown('KeyR')) {
      this.restartScene();
    }

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();
    input.endFrame();
    this.isFirstFrame = false;

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  update(dt) {
    // 1. Update Object Behaviors (Player, Enemy Patrol, Chaser, Sine Floaters)
    this.updateBehaviors(dt);

    // 2. Physics & Collisions
    const gravity = this.currentScene.gravity !== undefined ? this.currentScene.gravity : 980;
    const collisions = updatePhysics(this.runtimeObjects, gravity, dt, this.currentScene.bounds);

    // 3. Evaluate Visual Event Rules
    this.eventEngine.evaluateRules(
      this.currentScene.events || [],
      this.runtimeObjects,
      collisions,
      this.runtimeVariables,
      dt
    );

    // 4. Update HUD message timer
    if (this.hudMessageTimer > 0) {
      this.hudMessageTimer -= dt;
      if (this.hudMessageTimer <= 0) {
        this.hudMessage = '';
      }
    }

    // 5. Update Camera & Shake
    const vw = this.renderer.viewportWidth || this.renderer.canvas.width;
    const vh = this.renderer.viewportHeight || this.renderer.canvas.height;

    if (this.playerObj && this.currentScene.cameraFollow !== false) {
      const targetX = this.playerObj.x + this.playerObj.width / 2 - vw / 2;
      const targetY = this.playerObj.y + this.playerObj.height / 2 - vh / 2;
      this.renderer.camera.x += (targetX - this.renderer.camera.x) * 0.12;
      this.renderer.camera.y += (targetY - this.renderer.camera.y) * 0.12;

      // Clamp camera within world bounds if bounds are larger than viewport
      const bounds = this.currentScene.bounds || { width: 1600, height: 800 };
      if (bounds.width > vw) {
        this.renderer.camera.x = Math.max(0, Math.min(bounds.width - vw, this.renderer.camera.x));
      }
      if (bounds.height > vh) {
        this.renderer.camera.y = Math.max(0, Math.min(bounds.height - vh, this.renderer.camera.y));
      }
    }

    // Screen Shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      this.renderer.camera.shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.renderer.camera.shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
    } else {
      this.renderer.camera.shakeX = 0;
      this.renderer.camera.shakeY = 0;
    }
  }

  updateBehaviors(dt) {
    for (let i = this.runtimeObjects.length - 1; i >= 0; i--) {
      const obj = this.runtimeObjects[i];
      if (obj.visible === false) continue;

      // 1. Platformer Player Controller
      if (obj.behavior === 'player') {
        const hAxis = input.getHorizontalAxis();
        const moveSpeed = obj.moveSpeed || 320;
        obj.vx = hAxis * moveSpeed;

        if (hAxis !== 0) {
          obj.flipX = hAxis < 0;
        }

        // Jump & Double Jump
        if (input.isJumpPressed()) {
          if (obj.isGrounded || obj.physicsType !== 'dynamic') {
            obj.vy = -(obj.jumpForce || 500);
            obj.isGrounded = false;
            obj.canDoubleJump = true;
            audioSynth.play('jump');
          } else if (obj.canDoubleJump && obj.allowDoubleJump !== false) {
            obj.vy = -(obj.jumpForce ? obj.jumpForce * 0.9 : 450);
            obj.canDoubleJump = false;
            audioSynth.play('double_jump');
            this.spawnParticles(obj.x + obj.width / 2, obj.y + obj.height, '#ffffff', 8);
          }
        }
      }

      // 2. Top-Down Player Controller
      else if (obj.behavior === 'topdown') {
        const hAxis = input.getHorizontalAxis();
        const vAxis = input.getVerticalAxis();
        const moveSpeed = obj.moveSpeed || 260;

        // Normalize diagonal speed
        const length = Math.hypot(hAxis, vAxis);
        if (length > 0) {
          obj.vx = (hAxis / length) * moveSpeed;
          obj.vy = (vAxis / length) * moveSpeed;
        } else {
          obj.vx = 0;
          obj.vy = 0;
        }

        if (hAxis !== 0) obj.flipX = hAxis < 0;
      }

      // 3. Enemy Patrol AI
      else if (obj.behavior === 'patrol') {
        const patrolSpeed = obj.patrolSpeed || 90;
        if (obj.patrolDir === undefined) obj.patrolDir = 1;

        obj.vx = obj.patrolDir * patrolSpeed;
        obj.flipX = obj.patrolDir < 0;

        obj.patrolDist = (obj.patrolDist || 0) + Math.abs(obj.vx * dt);
        if (obj.patrolDist > (obj.maxPatrolDist || 160)) {
          obj.patrolDir *= -1;
          obj.patrolDist = 0;
        }
      }

      // 4. Chaser AI
      else if (obj.behavior === 'chaser' && this.playerObj) {
        const dx = (this.playerObj.x + this.playerObj.width / 2) - (obj.x + obj.width / 2);
        const dy = (this.playerObj.y + this.playerObj.height / 2) - (obj.y + obj.height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < (obj.detectRange || 300) && dist > 5) {
          const speed = obj.chaseSpeed || 120;
          obj.vx = (dx / dist) * speed;
          if (obj.physicsType !== 'dynamic') {
            obj.vy = (dy / dist) * speed;
          }
          obj.flipX = dx < 0;
        } else {
          obj.vx = 0;
        }
      }

      // 5. Sine Wave Floating (Coins, powerups, floating islands)
      else if (obj.behavior === 'sine_hover') {
        obj.sineTimer = (obj.sineTimer || 0) + dt * (obj.sineSpeed || 3);
        if (obj.baseY === undefined) obj.baseY = obj.y;
        obj.y = obj.baseY + Math.sin(obj.sineTimer) * (obj.sineAmp || 8);
      }

      // 6. Bullet / Projectile
      else if (obj.behavior === 'bullet') {
        obj.lifespan = (obj.lifespan || 3.0) - dt;
        if (obj.lifespan <= 0) {
          this.runtimeObjects.splice(i, 1);
        }
      }
    }
  }

  render() {
    const r = this.renderer;
    r.clear(this.currentScene.bgColor || '#0d1117');

    const ctx = r.ctx;
    ctx.save();

    // Apply Camera Transform & Screen Shake
    const camX = Math.round(r.camera.x + r.camera.shakeX);
    const camY = Math.round(r.camera.y + r.camera.shakeY);
    ctx.translate(-camX, -camY);

    // Draw World Bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1600, height: 800 }, r.camera);

    // Sort objects by layer / Z-Index
    const sorted = [...this.runtimeObjects].sort((a, b) => (a.layer || 0) - (b.layer || 0));

    // Render Game Objects
    for (const obj of sorted) {
      r.renderObject(obj, false, false, this.spriteLibrary);
    }

    // Render Particles
    r.updateAndDrawParticles(1/60);

    ctx.restore();

    // Render UI / HUD Overlay
    r.drawHUD(this.runtimeVariables, this.hudMessage, this.currentScene.bounds, this.isPaused, this.fps);
  }

  spawnParticles(x, y, color = '#f85149', count = 16) {
    this.renderer.spawnParticles(x, y, color, count);
  }

  showHUDMessage(msg, duration = 3.0) {
    this.hudMessage = msg;
    this.hudMessageTimer = duration;
  }

  restartScene() {
    if (!this.savedEditorScene) return;
    this.startPlay(this.savedEditorScene, this.runtimeVariables, this.spriteLibrary);
  }

  changeScene(sceneId) {
    if (window.gameSmithApp) {
      window.gameSmithApp.switchSceneInRuntime(sceneId);
    }
  }
}

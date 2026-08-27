/**
 * GameSmith - Active Play Mode Game Runtime
 * Orchestrates the 60fps requestAnimationFrame game loop, state rollback, behavior updates, and debug stats.
 */

import { updatePhysics } from './physics.js';
import { EventEngine } from './events.js';
import { input } from '../core/input.js';

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
    this.renderer.particles = [];

    // Find primary player object
    this.playerObj = this.runtimeObjects.find(o => o.behavior === 'player' || o.tag === 'player') || null;

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

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = 0;
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
    // 1. Update Object Behaviors (Player, Enemy Patrol, Bullets)
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

    // 5. Update Camera to Follow Player
    if (this.playerObj && this.currentScene.cameraFollow !== false) {
      const targetX = this.playerObj.x + this.playerObj.width / 2 - this.renderer.canvas.width / 2;
      const targetY = this.playerObj.y + this.playerObj.height / 2 - this.renderer.canvas.height / 2;
      this.renderer.camera.x += (targetX - this.renderer.camera.x) * 0.1;
      this.renderer.camera.y += (targetY - this.renderer.camera.y) * 0.1;
    }
  }

  updateBehaviors(dt) {
    for (let i = this.runtimeObjects.length - 1; i >= 0; i--) {
      const obj = this.runtimeObjects[i];
      if (obj.visible === false) continue;

      // Platformer Player Controller
      if (obj.behavior === 'player') {
        const hAxis = input.getHorizontalAxis();
        const moveSpeed = obj.moveSpeed || 320;
        obj.vx = hAxis * moveSpeed;

        if (hAxis !== 0) {
          obj.flipX = hAxis < 0;
        }

        // Jump
        if (input.isJumpPressed() && (obj.isGrounded || obj.physicsType !== 'dynamic')) {
          obj.vy = -(obj.jumpForce || 480);
          obj.isGrounded = false;
        }
      }

      // Top-Down Player Controller
      else if (obj.behavior === 'topdown') {
        const hAxis = input.getHorizontalAxis();
        const vAxis = input.getVerticalAxis();
        const moveSpeed = obj.moveSpeed || 250;
        obj.vx = hAxis * moveSpeed;
        obj.vy = vAxis * moveSpeed;

        if (hAxis !== 0) obj.flipX = hAxis < 0;
      }

      // Enemy Patrol AI
      else if (obj.behavior === 'patrol') {
        const patrolSpeed = obj.patrolSpeed || 100;
        if (obj.patrolDir === undefined) obj.patrolDir = 1;

        obj.vx = obj.patrolDir * patrolSpeed;
        obj.flipX = obj.patrolDir < 0;

        // Turn around on patrol distance
        obj.patrolDist = (obj.patrolDist || 0) + Math.abs(obj.vx * dt);
        if (obj.patrolDist > (obj.maxPatrolDist || 200)) {
          obj.patrolDir *= -1;
          obj.patrolDist = 0;
        }
      }

      // Bullet / Projectile
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

    // Apply Camera Transform
    ctx.translate(-r.camera.x, -r.camera.y);

    // Draw World Bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1280, height: 720 }, r.camera);

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
    r.drawHUD(this.runtimeVariables, this.hudMessage, this.currentScene.bounds);
  }

  spawnParticles(x, y, color) {
    this.renderer.spawnParticles(x, y, color);
  }

  showHUDMessage(msg, duration = 3.0) {
    this.hudMessage = msg;
    this.hudMessageTimer = duration;
  }

  restartScene() {
    const currentId = this.currentScene.id;
    this.changeScene(currentId);
  }

  changeScene(sceneId) {
    if (window.gameSmithApp) {
      window.gameSmithApp.switchSceneInRuntime(sceneId);
    }
  }
}

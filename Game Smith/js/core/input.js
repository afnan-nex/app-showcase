/**
 * GameSmith - Input Manager
 * Tracks keyboard, mouse, and touch events for both editor canvas and play mode runtime.
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};

    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.mouseClicked = false;

    // Virtual Touch Joystick / Button state for Mobile Play
    this.virtualAxisX = 0;
    this.virtualAxisY = 0;
    this.virtualJump = false;
    this.virtualAction = false;
    this.virtualDash = false;

    this.initListeners();
  }

  initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const code = e.code;
      if (!this.keys[code]) {
        this.keysDown[code] = true;
      }
      this.keys[code] = true;

      // Prevent page scrolling on Arrow keys and Space during play
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        if (window.gameSmithApp?.isPlaying) {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      this.keys[code] = false;
      this.keysUp[code] = true;
    });

    window.addEventListener('blur', () => {
      this.reset();
    });
  }

  updateMouse(canvasX, canvasY, isDown = false) {
    this.mouseX = canvasX;
    this.mouseY = canvasY;
    if (isDown && !this.isMouseDown) {
      this.mouseClicked = true;
    }
    this.isMouseDown = isDown;
  }

  setVirtualInput({ axisX = 0, axisY = 0, jump = false, action = false, dash = false } = {}) {
    this.virtualAxisX = axisX;
    this.virtualAxisY = axisY;
    if (jump && !this.virtualJump) {
      this.keysDown['Space'] = true;
    }
    if (action && !this.virtualAction) {
      this.keysDown['KeyJ'] = true;
    }
    this.virtualJump = jump;
    this.virtualAction = action;
    this.virtualDash = dash;
  }

  endFrame() {
    this.keysDown = {};
    this.keysUp = {};
    this.mouseClicked = false;
  }

  isKey(code) {
    return !!this.keys[code];
  }

  isKeyDown(code) {
    return !!this.keysDown[code];
  }

  isKeyUp(code) {
    return !!this.keysUp[code];
  }

  getHorizontalAxis() {
    let axis = this.virtualAxisX;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) axis -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) axis += 1;
    return Math.max(-1, Math.min(1, axis));
  }

  getVerticalAxis() {
    let axis = this.virtualAxisY;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) axis -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) axis += 1;
    return Math.max(-1, Math.min(1, axis));
  }

  isJumpPressed() {
    return this.virtualJump || this.isKeyDown('Space') || this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW');
  }

  isShootPressed() {
    return this.virtualAction || this.isKeyDown('KeyJ') || this.isKeyDown('KeyZ') || this.isKeyDown('KeyX') || this.mouseClicked;
  }

  isDashPressed() {
    return this.virtualDash || this.isKeyDown('ShiftLeft') || this.isKeyDown('KeyK') || this.isKeyDown('KeyC');
  }

  reset() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};
    this.isMouseDown = false;
    this.mouseClicked = false;
    this.virtualAxisX = 0;
    this.virtualAxisY = 0;
    this.virtualJump = false;
    this.virtualAction = false;
    this.virtualDash = false;
  }
}

export const input = new InputManager();
export default input;

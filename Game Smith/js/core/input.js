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

    this.initListeners();
  }

  initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Don't capture inputs when typing in input fields or textareas
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
    let axis = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) axis -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) axis += 1;
    return axis;
  }

  getVerticalAxis() {
    let axis = 0;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) axis -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) axis += 1;
    return axis;
  }

  isJumpPressed() {
    return this.isKeyDown('Space') || this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW');
  }

  isShootPressed() {
    return this.isKeyDown('KeyJ') || this.isKeyDown('KeyZ') || this.isKeyDown('KeyX') || this.mouseClicked;
  }

  reset() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};
    this.isMouseDown = false;
    this.mouseClicked = false;
  }
}

export const input = new InputManager();
export default input;

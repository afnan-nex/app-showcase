/**
 * MediaStudio — History & Undo/Redo Engine
 */

export class HistoryEngine {
  constructor(maxStates = 40) {
    this.maxStates = maxStates;
    this.stack = [];
    this.currentIndex = -1;
    this.listeners = [];
    this.isApplyingHistory = false;
  }

  /**
   * Register a state change listener
   */
  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      cb({
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        stack: this.stack,
        currentIndex: this.currentIndex
      });
    }
  }

  /**
   * Push a new state onto the history stack
   */
  pushState(stateData, actionName = 'Action') {
    if (this.isApplyingHistory) return;

    // If we were in the middle of the stack, drop subsequent redo states
    if (this.currentIndex < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.currentIndex + 1);
    }

    // Clone state deeply
    const snapshot = {
      actionName,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(stateData))
    };

    this.stack.push(snapshot);

    // Limit stack size
    if (this.stack.length > this.maxStates) {
      this.stack.shift();
    } else {
      this.currentIndex++;
    }

    this.notify();
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.stack.length - 1;
  }

  /**
   * Undo to previous state
   */
  undo() {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    this.notify();
    return this.getCurrentState();
  }

  /**
   * Redo to next state
   */
  redo() {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    this.notify();
    return this.getCurrentState();
  }

  /**
   * Jump directly to a step in history
   */
  jumpTo(index) {
    if (index >= 0 && index < this.stack.length && index !== this.currentIndex) {
      this.currentIndex = index;
      this.notify();
      return this.getCurrentState();
    }
    return null;
  }

  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.stack.length) {
      return this.stack[this.currentIndex].data;
    }
    return null;
  }

  clear() {
    this.stack = [];
    this.currentIndex = -1;
    this.notify();
  }
}

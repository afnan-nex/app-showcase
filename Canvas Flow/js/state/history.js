/* ==========================================================================
   CANVASFLOW — History & Undo/Redo Engine
   Immutable Snapshot Management & Command Transactions
   ========================================================================== */

import { eventBus } from './event-bus.js';

export class HistoryManager {
  constructor(options = {}) {
    this.maxDepth = options.maxDepth || 60;
    this.undoStack = [];
    this.redoStack = [];
    this.isApplying = false;
    this.inTransaction = false;
    this.transactionInitialState = null;
  }

  /**
   * Push a new snapshot of objects onto the undo stack
   */
  push(objectsList, description = 'Edit') {
    if (this.isApplying || this.inTransaction) return;

    const snapshot = JSON.stringify(objectsList);

    // Don't push identical consecutive states
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1].data === snapshot) {
      return;
    }

    this.undoStack.push({
      data: snapshot,
      description,
      timestamp: Date.now()
    });

    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }

    // Clear redo stack on new action
    this.redoStack = [];

    this._notify();
  }

  /**
   * Begin a multi-step user transaction (e.g. continuous dragging, resizing, or continuous drawing)
   */
  beginTransaction(currentObjectsList) {
    if (this.inTransaction) return;
    this.inTransaction = true;
    this.transactionInitialState = JSON.stringify(currentObjectsList);
  }

  /**
   * Commit a transaction when the user finishes (pointer up)
   */
  commitTransaction(finalObjectsList, description = 'Modify') {
    if (!this.inTransaction) return;
    this.inTransaction = false;

    const finalState = JSON.stringify(finalObjectsList);
    if (this.transactionInitialState && this.transactionInitialState !== finalState) {
      this.undoStack.push({
        data: this.transactionInitialState,
        description,
        timestamp: Date.now()
      });

      if (this.undoStack.length > this.maxDepth) {
        this.undoStack.shift();
      }

      this.redoStack = [];
      this._notify();
    }

    this.transactionInitialState = null;
  }

  /**
   * Cancel an in-progress transaction
   */
  cancelTransaction() {
    this.inTransaction = false;
    this.transactionInitialState = null;
  }

  /**
   * Undo to previous state
   */
  undo(currentObjectsList) {
    if (this.undoStack.length === 0) return null;

    this.isApplying = true;
    const currentState = JSON.stringify(currentObjectsList);
    const previousSnapshot = this.undoStack.pop();

    this.redoStack.push({
      data: currentState,
      description: previousSnapshot.description,
      timestamp: Date.now()
    });

    this._notify();
    this.isApplying = false;

    return JSON.parse(previousSnapshot.data);
  }

  /**
   * Redo to forward state
   */
  redo(currentObjectsList) {
    if (this.redoStack.length === 0) return null;

    this.isApplying = true;
    const currentState = JSON.stringify(currentObjectsList);
    const nextSnapshot = this.redoStack.pop();

    this.undoStack.push({
      data: currentState,
      description: nextSnapshot.description,
      timestamp: Date.now()
    });

    this._notify();
    this.isApplying = false;

    return JSON.parse(nextSnapshot.data);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this._notify();
  }

  _notify() {
    eventBus.emit('history:changed', {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    });
  }
}

/**
 * AudioDeck - HistoryManager
 * Provides complete Undo / Redo capability across project edits.
 */
export class HistoryManager {
    constructor(project, maxStack = 40) {
        this.project = project;
        this.maxStack = maxStack;
        this.undoStack = [];
        this.redoStack = [];
        this._isApplying = false;
    }

    /**
     * Pushes current project state snapshot into undo history
     * @param {string} actionName 
     */
    pushState(actionName = 'Edit') {
        if (this._isApplying) return;

        const snapshot = this.project.serialize();
        this.undoStack.push({ actionName, state: snapshot });
        if (this.undoStack.length > this.maxStack) {
            this.undoStack.shift();
        }
        // Clear redo stack on new action
        this.redoStack = [];
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    undo() {
        if (!this.canUndo()) return null;
        const currentSnapshot = this.project.serialize();
        const prev = this.undoStack.pop();
        this.redoStack.push({ actionName: prev.actionName, state: currentSnapshot });

        this._isApplying = true;
        this.project.deserialize(prev.state);
        this._isApplying = false;
        return prev.actionName;
    }

    redo() {
        if (!this.canRedo()) return null;
        const currentSnapshot = this.project.serialize();
        const next = this.redoStack.pop();
        this.undoStack.push({ actionName: next.actionName, state: currentSnapshot });

        this._isApplying = true;
        this.project.deserialize(next.state);
        this._isApplying = false;
        return next.actionName;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}

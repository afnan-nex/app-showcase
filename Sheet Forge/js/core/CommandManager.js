/**
 * SheetForge - Command Manager (Undo / Redo)
 * Implements standard Command Pattern with stack history limits and transaction grouping
 */
export class Command {
    execute() {
        throw new Error('Command.execute() must be implemented');
    }
    undo() {
        throw new Error('Command.undo() must be implemented');
    }
    redo() {
        this.execute();
    }
}

export class BatchCommand extends Command {
    constructor(commands = [], description = 'Batch Action') {
        super();
        this.commands = commands;
        this.description = description;
    }

    add(command) {
        this.commands.push(command);
    }

    execute() {
        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].execute();
        }
    }

    undo() {
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }

    redo() {
        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].redo();
        }
    }
}

export class CommandManager {
    constructor(maxHistory = 100, eventEmitter = null) {
        this.undoStack = [];
        this.redoStack = [];
        this.maxHistory = maxHistory;
        this.emitter = eventEmitter;
        this._isExecuting = false;
    }

    execute(command) {
        if (this._isExecuting) return;
        this._isExecuting = true;
        try {
            command.execute();
            this.undoStack.push(command);
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift();
            }
            this.redoStack = [];
            this._notify();
        } finally {
            this._isExecuting = false;
        }
    }

    undo() {
        if (!this.canUndo() || this._isExecuting) return false;
        this._isExecuting = true;
        try {
            const command = this.undoStack.pop();
            command.undo();
            this.redoStack.push(command);
            this._notify();
            return true;
        } finally {
            this._isExecuting = false;
        }
    }

    redo() {
        if (!this.canRedo() || this._isExecuting) return false;
        this._isExecuting = true;
        try {
            const command = this.redoStack.pop();
            command.redo();
            this.undoStack.push(command);
            this._notify();
            return true;
        } finally {
            this._isExecuting = false;
        }
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
        if (this.emitter) {
            this.emitter.emit('history:changed', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                undoCount: this.undoStack.length,
                redoCount: this.redoStack.length
            });
        }
    }
}

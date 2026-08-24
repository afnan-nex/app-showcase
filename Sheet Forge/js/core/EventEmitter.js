/**
 * SheetForge - Event Emitter
 * Lightweight Pub/Sub event dispatcher for modular communication
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        return () => this.off(event, listener);
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        return this.on(event, wrapper);
    }

    off(event, listener) {
        if (this.events.has(event)) {
            this.events.get(event).delete(listener);
            if (this.events.get(event).size === 0) {
                this.events.delete(event);
            }
        }
    }

    emit(event, ...args) {
        if (this.events.has(event)) {
            for (const listener of this.events.get(event)) {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in event listener for "${event}":`, error);
                }
            }
        }
    }

    clear() {
        this.events.clear();
    }
}

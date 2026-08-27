/**
 * AudioDeck - KnobControl
 * Reusable rotary knob UI controller with vertical drag, fine-tune (Shift),
 * double-click default reset, and numerical tooltips.
 */
export class KnobControl {
    /**
     * @param {HTMLElement} element 
     * @param {Object} options { min, max, value, defaultValue, step, unit, onChange }
     */
    constructor(element, options = {}) {
        this.element = element;
        this.min = options.min !== undefined ? options.min : 0;
        this.max = options.max !== undefined ? options.max : 100;
        this.value = options.value !== undefined ? options.value : this.min;
        this.defaultValue = options.defaultValue !== undefined ? options.defaultValue : this.value;
        this.step = options.step || 1;
        this.unit = options.unit || '';
        this.onChange = options.onChange || null;

        // Angle limits: -135deg to +135deg (270deg total sweep)
        this.minAngle = -135;
        this.maxAngle = 135;

        this._initDOM();
        this._bindEvents();
        this.setValue(this.value, false);
    }

    _initDOM() {
        this.element.classList.add('audio-knob-container');
        this.element.innerHTML = `
            <div class="audio-knob">
                <div class="audio-knob-indicator"></div>
            </div>
            <div class="audio-knob-val-tip"></div>
        `;
        this.knobEl = this.element.querySelector('.audio-knob');
        this.indicatorEl = this.element.querySelector('.audio-knob-indicator');
        this.tipEl = this.element.querySelector('.audio-knob-val-tip');
    }

    _bindEvents() {
        let isDragging = false;
        let startY = 0;
        let startVal = 0;

        const onMouseDown = (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            startY = e.clientY;
            startVal = this.value;
            this.element.classList.add('active');
            document.body.style.cursor = 'ns-resize';
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const deltaY = startY - e.clientY;
            const range = this.max - this.min;
            const sensitivity = e.shiftKey ? 400 : 120; // Shift for fine-tuning
            const deltaVal = (deltaY / sensitivity) * range;
            let newVal = startVal + deltaVal;

            if (this.step > 0) {
                newVal = Math.round(newVal / this.step) * this.step;
            }
            this.setValue(newVal, true);
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            this.element.classList.remove('active');
            document.body.style.cursor = '';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        this.element.addEventListener('mousedown', onMouseDown);
        this.element.addEventListener('dblclick', () => {
            this.setValue(this.defaultValue, true);
        });

        // Wheel support
        this.element.addEventListener('wheel', (e) => {
            e.preventDefault();
            const stepVal = (e.shiftKey ? (this.step || 0.1) : (this.step * 2 || 1)) * (e.deltaY < 0 ? 1 : -1);
            this.setValue(this.value + stepVal, true);
        }, { passive: false });
    }

    setValue(val, triggerCallback = true) {
        this.value = Math.max(this.min, Math.min(this.max, val));
        
        // Calculate rotation angle
        const ratio = (this.value - this.min) / (this.max - this.min || 1);
        const angle = this.minAngle + ratio * (this.maxAngle - this.minAngle);

        if (this.knobEl) {
            this.knobEl.style.transform = `rotate(${angle}deg)`;
        }

        const displayVal = Number.isInteger(this.value) ? this.value : this.value.toFixed(1);
        if (this.tipEl) {
            this.tipEl.textContent = `${displayVal}${this.unit}`;
        }

        if (triggerCallback && this.onChange) {
            this.onChange(this.value);
        }
    }
}

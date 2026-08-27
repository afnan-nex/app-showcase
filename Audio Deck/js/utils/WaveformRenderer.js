/**
 * AudioDeck - WaveformRenderer
 * Canvas waveform drawing with peak caching and high-DPI rendering.
 */
export class WaveformRenderer {
    static _peaksCache = new WeakMap();

    /**
     * Extracts peak min/max data from an AudioBuffer
     * @param {AudioBuffer} buffer 
     * @param {number} numBins 
     * @returns {Float32Array}
     */
    static getPeaks(buffer, numBins = 800) {
        if (this._peaksCache.has(buffer)) {
            const cached = this._peaksCache.get(buffer);
            if (cached.length === numBins * 2) return cached;
        }

        const channelData = buffer.getChannelData(0);
        const totalSamples = channelData.length;
        const step = Math.max(1, Math.floor(totalSamples / numBins));
        const peaks = new Float32Array(numBins * 2); // [min0, max0, min1, max1, ...]

        for (let i = 0; i < numBins; i++) {
            const start = i * step;
            const end = Math.min(start + step, totalSamples);
            let min = 1.0;
            let max = -1.0;

            for (let j = start; j < end; j++) {
                const val = channelData[j];
                if (val < min) min = val;
                if (val > max) max = val;
            }

            peaks[i * 2] = min;
            peaks[i * 2 + 1] = max;
        }

        this._peaksCache.set(buffer, peaks);
        return peaks;
    }

    /**
     * Renders waveform onto a 2D canvas context
     * @param {HTMLCanvasElement} canvas 
     * @param {AudioBuffer} buffer 
     * @param {Object} options { color, offsetSec, durationSec, totalDurationSec }
     */
    static render(canvas, buffer, options = {}) {
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth || 300;
        const height = canvas.clientHeight || 80;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const color = options.color || '#3b82f6';
        const numBins = Math.min(Math.floor(width), 1000);
        const peaks = this.getPeaks(buffer, numBins);

        const centerY = height / 2;
        const halfHeight = (height / 2) * 0.88;

        // Waveform gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, color);

        ctx.fillStyle = grad;
        ctx.beginPath();

        // Draw top half
        for (let x = 0; x < numBins; x++) {
            const max = peaks[x * 2 + 1];
            const y = centerY - max * halfHeight;
            const canvasX = (x / numBins) * width;
            if (x === 0) ctx.moveTo(canvasX, y);
            else ctx.lineTo(canvasX, y);
        }

        // Draw bottom half
        for (let x = numBins - 1; x >= 0; x--) {
            const min = peaks[x * 2];
            const y = centerY - min * halfHeight;
            const canvasX = (x / numBins) * width;
            ctx.lineTo(canvasX, y);
        }

        ctx.closePath();
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Center zero line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.restore();
    }
}

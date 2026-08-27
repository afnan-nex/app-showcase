/**
 * AudioDeck - WavExporter
 * Converts Web Audio AudioBuffers into standard 16-bit PCM WAV blobs for client-side download.
 */
export class WavExporter {
    /**
     * Converts an AudioBuffer into a WAV Blob
     * @param {AudioBuffer} audioBuffer
     * @param {boolean} as32BitFloat - if true, exports 32-bit IEEE float, default 16-bit PCM
     * @returns {Blob}
     */
    static bufferToWaveBlob(audioBuffer, as32BitFloat = false) {
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numOfChan * (as32BitFloat ? 4 : 2) + 44;
        const outBuffer = new ArrayBuffer(length);
        const view = new DataView(outBuffer);
        const channels = [];
        let sampleRate = audioBuffer.sampleRate;
        let pos = 0;

        // Collect channel data
        for (let i = 0; i < numOfChan; i++) {
            channels.push(audioBuffer.getChannelData(i));
        }

        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }

        // write WAVE header
        // "RIFF"
        setUint32(0x46464952);
        // file length - 8
        setUint32(length - 8);
        // "WAVE"
        setUint32(0x45564157);
        // "fmt " chunk
        setUint32(0x20746d66);
        // format chunk length (16 for PCM)
        setUint32(16);
        // sample format (1 = PCM, 3 = IEEE float)
        setUint16(as32BitFloat ? 3 : 1);
        // channel count
        setUint16(numOfChan);
        // sample rate
        setUint32(sampleRate);
        // byte rate = sampleRate * channels * bytesPerSample
        setUint32(sampleRate * numOfChan * (as32BitFloat ? 4 : 2));
        // block align = channels * bytesPerSample
        setUint16(numOfChan * (as32BitFloat ? 4 : 2));
        // bits per sample
        setUint16(as32BitFloat ? 32 : 16);
        // "data" chunk header
        setUint32(0x61746164);
        // data chunk length
        setUint32(length - pos - 4);

        // Interleave channel samples
        if (as32BitFloat) {
            for (let i = 0; i < audioBuffer.length; i++) {
                for (let ch = 0; ch < numOfChan; ch++) {
                    view.setFloat32(pos, channels[ch][i], true);
                    pos += 4;
                }
            }
        } else {
            for (let i = 0; i < audioBuffer.length; i++) {
                for (let ch = 0; ch < numOfChan; ch++) {
                    let sample = Math.max(-1, Math.min(1, channels[ch][i]));
                    // 16-bit signed integer conversion
                    sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                    view.setInt16(pos, sample, true);
                    pos += 2;
                }
            }
        }

        return new Blob([outBuffer], { type: 'audio/wav' });
    }

    /**
     * Triggers browser download of a blob
     * @param {Blob} blob 
     * @param {string} filename 
     */
    static downloadBlob(blob, filename = 'audiodeck-export.wav') {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(() => {
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        }, 1000);
    }
}

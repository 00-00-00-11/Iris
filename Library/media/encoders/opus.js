"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioOpus = exports.ValidSampleRates = exports.MIN_BITRATE = exports.MAX_BITRATE = exports.CTL = exports.Applications = exports.DependencyTypes = void 0;
exports.DependencyTypes = Object.freeze({
    DISCORDJS_OPUS: '@discordjs/opus',
    NODE_OPUS: 'node-opus',
    OPUSSCRIPT: 'opusscript',
});
const DEPENDENCY_TYPES = Object.values(exports.DependencyTypes);
const Opus = {};
for (let dependency of DEPENDENCY_TYPES) {
    try {
        Opus[dependency] = require(dependency);
    }
    catch (e) { }
}
exports.Applications = Object.freeze({
    VOIP: 2048,
    AUDIO: 2049,
    RESTRICTED_LOWDELAY: 2051,
});
exports.CTL = Object.freeze({
    BITRATE: 4002,
    FEC: 4012,
    PLP: 4014,
});
exports.MAX_BITRATE = 128000;
exports.MIN_BITRATE = 16000;
exports.ValidSampleRates = [
    8000,
    12000,
    16000,
    24000,
    48000,
];
class AudioOpus {
    constructor(sampleRate, channels, options = {}) {
        this.application = 0;
        this.channels = 0;
        this.sampleRate = 0;
        this.use = '';
        Object.defineProperties(this, {
            application: { configurable: true, writable: false },
            channels: { configurable: true, writable: false },
            opus: { configurable: true, enumerable: false, writable: false },
            sampleRate: { configurable: true, writable: false },
            use: { configurable: true, writable: false },
        });
        this.setApplication(options.application || exports.Applications.AUDIO);
        this.setChannels(channels);
        this.setSampleRate(sampleRate);
        this.setModule(options.use || DEPENDENCY_TYPES.find((m) => m in Opus));
        this.recreate();
    }
    get module() {
        if (!this.use) {
            throw new Error('Module missing, cannot opus encode/decode.');
        }
        return Opus[this.use];
    }
    get enabled() {
        return !!this.opus;
    }
    delete() {
        if (this.enabled) {
            switch (this.use) {
                case exports.DependencyTypes.OPUSSCRIPT:
                    {
                        this.opus.delete();
                    }
                    ;
                    break;
            }
            Object.defineProperty(this, 'opus', { value: null });
        }
        return this;
    }
    recreate() {
        if (!this.use) {
            throw new Error('Module missing, set one using setModule()');
        }
        if (!this.application) {
            throw new Error('Cannot create an Opus object without an application setting!');
        }
        if (!this.channels) {
            throw new Error('Cannot create an Opus object without a channels setting!');
        }
        if (!this.sampleRate) {
            throw new Error('Cannot create an Opus object without a sampleRate setting!');
        }
        if (this.enabled) {
            this.delete();
        }
        let opus;
        switch (this.use) {
            case exports.DependencyTypes.DISCORDJS_OPUS:
            case exports.DependencyTypes.NODE_OPUS:
                {
                    opus = new this.module.OpusEncoder(this.sampleRate, this.channels, this.application);
                }
                ;
                break;
            case exports.DependencyTypes.OPUSSCRIPT:
                {
                    opus = new this.module(this.sampleRate, this.channels, this.application);
                }
                ;
                break;
        }
        Object.defineProperty(this, 'opus', { value: opus });
        return this;
    }
    setApplication(value) {
        Object.defineProperty(this, 'application', { value });
        return (this.enabled) ? this.recreate() : this;
    }
    setChannels(value) {
        Object.defineProperty(this, 'channels', { value });
        return (this.enabled) ? this.recreate() : this;
    }
    setSampleRate(value) {
        if (!exports.ValidSampleRates.includes(value)) {
            throw new Error(`Invalid Sample Rate provided, please choose one of: ${JSON.stringify(exports.ValidSampleRates)}`);
        }
        Object.defineProperty(this, 'sampleRate', { value });
        return (this.enabled) ? this.recreate() : this;
    }
    setModule(value) {
        if (value === undefined) {
            if (this.use) {
                value = this.use;
            }
            else {
                throw new Error('Provide a module to use.');
            }
        }
        if (!DEPENDENCY_TYPES.includes(value)) {
            throw new Error(`Invalid module '${value}', please use one of: ${JSON.stringify(DEPENDENCY_TYPES)}`);
        }
        if (!(value in Opus)) {
            throw new Error(`Module '${value}' is not installed, please use one of: ${JSON.stringify(DEPENDENCY_TYPES)}`);
        }
        Object.defineProperty(this, 'use', { value });
        return (this.enabled) ? this.recreate() : this;
    }
    /* CTL stuff */
    setBitrate(bitrate) {
        bitrate = Math.min(exports.MAX_BITRATE, Math.max(exports.MIN_BITRATE, bitrate));
        return this.setCTL(exports.CTL.BITRATE, bitrate);
    }
    setFEC(enabled) {
        const value = +!!enabled;
        return this.setCTL(exports.CTL.FEC, value);
    }
    setPLP(percentage) {
        percentage = Math.min(100, Math.max(0, percentage));
        return this.setCTL(exports.CTL.PLP, percentage);
    }
    setCTL(flag, value) {
        if (!this.enabled) {
            throw new Error('Object was deleted, reinitialize with recreate()');
        }
        switch (this.use) {
            case exports.DependencyTypes.DISCORDJS_OPUS:
            case exports.DependencyTypes.NODE_OPUS:
                {
                    this.opus.applyEncoderCTL([flag, value]);
                }
                ;
                break;
            case exports.DependencyTypes.OPUSSCRIPT:
                {
                    this.opus.encoderCTL([flag, value]);
                }
                ;
                break;
        }
        return this;
    }
    decode(buf, frameDuration = 20) {
        if (!this.enabled) {
            throw new Error('Object was deleted, reinitialize with recreate()');
        }
        const frameSize = (this.sampleRate / 1000) * frameDuration;
        let packet;
        switch (this.use) {
            case exports.DependencyTypes.DISCORDJS_OPUS:
                {
                    packet = this.opus.decode(buf);
                }
                ;
                break;
            case exports.DependencyTypes.NODE_OPUS:
                {
                    packet = this.opus.decode(buf, frameSize);
                }
                ;
                break;
            case exports.DependencyTypes.OPUSSCRIPT:
                {
                    packet = this.opus.decode(buf);
                }
                ;
                break;
            default:
                {
                    throw new Error('Unknown Module');
                }
                ;
        }
        return packet;
    }
    encode(buf, frameDuration = 20) {
        if (!this.enabled) {
            throw new Error('Object was deleted, reinitialize with recreate()');
        }
        const frameSize = (this.sampleRate / 1000) * frameDuration;
        let packet;
        switch (this.use) {
            case exports.DependencyTypes.DISCORDJS_OPUS:
                {
                    packet = this.opus.encode(buf);
                }
                ;
                break;
            case exports.DependencyTypes.NODE_OPUS:
                {
                    packet = this.opus.encode(buf, frameSize);
                }
                ;
                break;
            case exports.DependencyTypes.OPUSSCRIPT:
                {
                    packet = this.opus.encode(buf, frameSize);
                }
                ;
                break;
            default:
                {
                    throw new Error('Unknown Module');
                }
                ;
        }
        return packet;
    }
}
exports.AudioOpus = AudioOpus;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceConnection = void 0;
const detritus_client_socket_1 = require("../../Iris-Client-Socket");
const iris_utils_1 = require("../../Iris-Utils");
const { MediaCodecs, MediaCodecTypes, } = detritus_client_socket_1.Constants;
const basecollection_1 = require("../collections/basecollection");
const constants_1 = require("../constants");
const audioformat_1 = require("../utils/audioformat");
const encoders_1 = require("./encoders");
const handler_1 = require("./handler");
const OpusProperties = [
    'application',
    'channels',
    'sampleRate',
    'use',
];
/**
 * Voice Connection
 * @category Media
 */
class VoiceConnection extends iris_utils_1.EventSpewer {
    constructor(client, gateway, options = {}) {
        super();
        this.client = client;
        this.gateway = gateway;
        this.handler = new handler_1.MediaHandler(this);
        this.decodeAudio = !!options.decodeAudio;
        this.opusDecoder = null;
        this.opusDecoders = new basecollection_1.BaseCollection();
        this.opusEncoder = null;
        this.formats = {
            audio: new audioformat_1.AudioFormat({
                channels: constants_1.DiscordOpusFormat.CHANNELS,
                sampleRate: constants_1.DiscordOpusFormat.SAMPLE_RATE,
            }),
        };
        if (options.opusDecoder || options.decodeAudio) {
            this.setOpusDecoder(options.opusDecoder);
            this.decodeAudio = true;
        }
        if (options.opusEncoder) {
            this.setOpusEncoder(options.opusEncoder);
        }
        Object.defineProperties(this, {
            client: { enumerable: false, writable: false },
            decodeAudio: { configurable: true, enumerable: false, writable: false },
            formats: { writable: false },
            gateway: { enumerable: false, writable: false },
            handler: { enumerable: false, writable: false },
            opusDecoder: { configurable: true, enumerable: false, writable: false },
            opusDecoders: { enumerable: false, writable: false },
            opusEncoder: { configurable: true, enumerable: false, writable: false },
        });
    }
    get channel() {
        if (this.channelId !== null) {
            return this.client.channels.get(this.channelId) || null;
        }
        return null;
    }
    get channelId() {
        return this.gateway.channelId;
    }
    get guild() {
        if (this.guildId !== null) {
            return this.client.guilds.get(this.guildId) || null;
        }
        return null;
    }
    get guildId() {
        return this.gateway.guildId;
    }
    get killed() {
        return this.gateway.killed;
    }
    get member() {
        if (this.guildId !== null) {
            return this.client.members.get(this.guildId, this.userId) || null;
        }
        return null;
    }
    get serverId() {
        return this.gateway.serverId;
    }
    get user() {
        return this.client.users.get(this.userId) || null;
    }
    get userId() {
        return this.gateway.userId;
    }
    get voiceState() {
        return this.client.voiceStates.get(this.serverId, this.userId) || null;
    }
    decode(userId, data, options = {}) {
        const format = options.format || MediaCodecTypes.AUDIO;
        const frameDuration = options.frameDuration || this.formats.audio.frameDuration;
        const type = options.type || MediaCodecs.OPUS;
        switch (format) {
            case MediaCodecTypes.AUDIO:
                {
                    if (type === MediaCodecs.OPUS) {
                        const opusDecoder = this.fetchOpusDecoder(userId);
                        return opusDecoder.decode(data, frameDuration);
                    }
                }
                ;
                break;
        }
        throw new Error(`Cannot decode ${options.format}-${options.type} type data`);
    }
    fetchOpusDecoder(userId) {
        if (!this.opusDecoder) {
            throw new Error('Create an opus decoder before trying to decode opus!');
        }
        if (this.opusDecoders.has(userId)) {
            return this.opusDecoders.get(userId);
        }
        const opusDecoder = new encoders_1.Opus.AudioOpus(this.opusDecoder.sampleRate, this.opusDecoder.channels, {
            application: this.opusDecoder.application,
            use: this.opusDecoder.use,
        });
        this.opusDecoders.set(userId, opusDecoder);
        return opusDecoder;
    }
    kill() {
        this.client.voiceConnections.delete(this.serverId);
        this.gateway.kill();
        this.setOpusEncoder({ kill: true });
        this.setOpusDecoder({ kill: true });
        this.emit('killed');
        this.removeAllListeners();
    }
    sendAudio(data, options = {}) {
        if (this.killed) {
            return;
        }
        if (!this.gateway.transport) {
            throw new Error('Transport isn\'t initialized yet!');
        }
        if (!options.isOpus) {
            if (this.opusEncoder === null) {
                throw new Error('Cannot send in Non-Opus Data without an opus encoder!');
            }
            data = this.opusEncoder.encode(data, this.formats.audio.frameDuration);
        }
        // assume its 48000 sample rate, 2 channels
        this.gateway.transport.sendAudioFrame(data, {
            incrementTimestamp: true,
            timestamp: this.formats.audio.samplesPerFrame,
        });
    }
    sendAudioSilenceFrame() {
        if (this.killed) {
            return;
        }
        if (!this.gateway.transport) {
            throw new Error('Transport isn\'t initialized yet!');
        }
        return this.gateway.transport.sendAudioSilenceFrame();
    }
    setDecodeAudio(value) {
        Object.defineProperty(this, 'decodeAudio', { value });
    }
    setOpusDecoder(options = {}) {
        options = Object.assign({}, options);
        if (options.kill) {
            if (this.opusDecoder !== null) {
                Object.defineProperty(this, 'opusDecoder', { value: null });
            }
            if (this.opusDecoders.length) {
                for (let [userId, decoder] of this.opusDecoders) {
                    decoder.delete();
                }
                this.opusDecoders.clear();
            }
            return;
        }
        if (options.use === undefined) {
            // Check Decoder first
            if (this.opusDecoder !== null) {
                options.use = this.opusDecoder.use;
            }
            else if (this.opusEncoder !== null) {
                options.use = this.opusEncoder.use;
            }
        }
        if (this.opusDecoder !== null) {
            const noChanges = OpusProperties.every((property) => {
                return options[property] === this.opusDecoder[property];
            });
            if (noChanges) {
                return;
            }
        }
        const value = {
            application: options.application || encoders_1.Opus.Applications.AUDIO,
            channels: options.channels || this.formats.audio.channels,
            sampleRate: options.sampleRate || this.formats.audio.sampleRate,
            use: options.use,
        };
        Object.defineProperty(this, 'opusDecoder', { value });
        for (let [userId, decoder] of this.opusDecoders) {
            decoder.delete();
            this.fetchOpusDecoder(userId);
        }
    }
    setOpusEncoder(options = {}) {
        options = Object.assign({}, options);
        if (options.kill) {
            if (this.opusEncoder !== null) {
                this.opusEncoder.delete();
                Object.defineProperty(this, 'opusEncoder', { value: null });
            }
            return;
        }
        if (options.use === undefined) {
            // Check Encoder first
            if (this.opusEncoder !== null) {
                options.use = this.opusEncoder.use;
            }
            else if (this.opusDecoder !== null) {
                options.use = this.opusDecoder.use;
            }
        }
        if (this.opusEncoder !== null) {
            const anyChanges = OpusProperties.some((property) => {
                return options[property] !== this.opusEncoder[property];
            });
            if (anyChanges) {
                this.opusEncoder.delete();
                Object.defineProperty(this, 'opusEncoder', { value: null });
            }
        }
        const opusEncoder = new encoders_1.Opus.AudioOpus(options.sampleRate || this.formats.audio.sampleRate, options.channels || this.formats.audio.channels, {
            application: options.application || encoders_1.Opus.Applications.AUDIO,
            use: options.use,
        });
        Object.defineProperty(this, 'opusEncoder', { value: opusEncoder });
    }
    /* Gateway Functions */
    async setSpeaking(options) {
        return new Promise((resolve) => {
            this.gateway.sendSpeaking(options, resolve);
        });
    }
    async setState(options) {
        return new Promise((resolve) => {
            this.gateway.sendStateUpdate(options, resolve);
        });
    }
    setDeaf(selfDeaf) {
        return this.setState({ selfDeaf });
    }
    setMute(selfMute) {
        return this.setState({ selfMute });
    }
    setVideo(selfVideo) {
        return this.setState({ selfVideo });
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.VoiceConnection = VoiceConnection;

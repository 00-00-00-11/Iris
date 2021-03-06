"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const iris_utils_1 = require("../../Iris-Utils")
const basesocket_1 = require("./basesocket");
const bucket_1 = require("./bucket");
const constants_1 = require("./constants");
const mediaudp_1 = require("./mediaudp");
const defaultOptions = {
    receive: false,
    serverId: null,
    userId: null,
    video: false,
};
class Socket extends iris_utils_1.EventSpewer {
    constructor(gateway, options) {
        super();
        this.state = constants_1.SocketStates.CLOSED;
        this._heartbeat = {
            ack: false,
            lastAck: null,
            lastSent: null,
            interval: new iris_utils_1.Timers.Interval(),
            intervalTime: null,
            nonce: null,
        };
        this.bucket = new bucket_1.Bucket(120, 60 * 1000);
        this.endpoint = null;
        this.forceMode = null;
        this.identified = false;
        this.killed = false;
        this.promises = new Set();
        this.protocol = null;
        this.ready = false;
        this.receiveEnabled = false;
        this.reconnects = 0;
        this.socket = null;
        this.ssrcs = {
            [constants_1.MediaSSRCTypes.AUDIO]: new Map(),
            [constants_1.MediaSSRCTypes.VIDEO]: new Map(),
        };
        this.transport = null;
        this.token = null;
        this.gateway = gateway;
        options = Object.assign({}, defaultOptions, options);
        this.channelId = options.channelId;
        this.serverId = options.serverId;
        this.userId = options.userId;
        this.receiveEnabled = !!options.receive;
        this.videoEnabled = !!options.video;
        if (options.forceMode !== undefined) {
            if (!constants_1.MEDIA_ENCRYPTION_MODES.includes(options.forceMode)) {
                throw new Error('Unknown Encryption Mode');
            }
            this.forceMode = options.forceMode;
        }
        Object.defineProperties(this, {
            _heartbeat: { enumerable: false, writable: false },
            channelId: { configurable: true, writable: false },
            gateway: { enumerable: false, writable: false },
            killed: { configurable: true, writable: false },
            protocol: { configurable: true, writable: false },
            ready: { configurable: true, writable: false },
            serverId: { writable: false },
            state: { configurable: true, writable: false },
            token: { configurable: true, writable: false },
            userId: { writable: false },
        });
        this.setProtocol(constants_1.MediaProtocols.UDP);
    }
    get closed() {
        return !!this.socket && this.socket.closed;
    }
    get closing() {
        return !!this.socket && this.socket.closing;
    }
    get connected() {
        return !!this.socket && this.socket.connected;
    }
    get connecting() {
        return !!this.socket && this.socket.connecting;
    }
    get guildId() {
        return (this.inDm) ? null : this.serverId;
    }
    get inDm() {
        return this.serverId === this.channelId;
    }
    get sessionId() {
        return this.gateway.sessionId;
    }
    get audioSSRC() {
        return (this.transport) ? this.transport.ssrc : 0;
    }
    get videoSSRC() {
        return (this.videoEnabled) ? this.audioSSRC + 1 : 0;
    }
    get rtxSSRC() {
        return (this.videoEnabled) ? this.videoSSRC + 1 : 0;
    }
    resolvePromises(error) {
        this.promises.forEach((promise) => {
            this.promises.delete(promise);
            if (error) {
                promise.reject(error);
            }
            else {
                promise.resolve();
            }
        });
    }
    setChannelId(value) {
        Object.defineProperty(this, 'channelId', { value });
    }
    setEndpoint(value) {
        this.endpoint = (value) ? `wss://${value.split(':').shift()}` : null;
        this.identified = false;
        if (this.connected) {
            this.connect();
        }
    }
    setProtocol(value) {
        if (this.transport) {
            throw new Error('Cannot change protocols after transport connection.');
        }
        if (value !== constants_1.MediaProtocols.UDP) {
            throw new Error('UDP is currently the only protocol supported.');
        }
        if (!constants_1.MEDIA_PROTOCOLS.includes(value)) {
            throw new Error('Invalid Protocol Type');
        }
        Object.defineProperty(this, 'protocol', { value });
    }
    setState(value) {
        if (value in constants_1.SocketStates && value !== this.state) {
            Object.defineProperty(this, 'state', { value });
            this.emit(constants_1.SocketEvents.STATE, { state: value });
        }
    }
    setToken(value) {
        Object.defineProperty(this, 'token', { value });
        if (!this.identified) {
            this.resolvePromises();
            this.connect();
        }
    }
    ssrcToUserId(ssrc, type = constants_1.MediaSSRCTypes.AUDIO) {
        if (!(type in this.ssrcs)) {
            throw new Error('Invalid SSRC Type');
        }
        if (this.ssrcs[type].has(ssrc)) {
            return this.ssrcs[type].get(ssrc);
        }
        return null;
    }
    userIdToSSRC(userId, type = constants_1.MediaSSRCTypes.AUDIO) {
        if (!(type in this.ssrcs)) {
            throw new Error(`Invalid SSRC Type`);
        }
        for (let [ssrc, uid] of this.ssrcs[type]) {
            if (userId === uid) {
                return ssrc;
            }
        }
        return null;
    }
    cleanup(code) {
        Object.defineProperty(this, 'ready', { value: false });
        this.bucket.clear();
        this.bucket.lock();
        this.ssrcs[constants_1.MediaSSRCTypes.AUDIO].clear();
        this.ssrcs[constants_1.MediaSSRCTypes.VIDEO].clear();
        // unresumable events
        // 1000 Normal Disconnected
        // 4014 Voice Channel Kick/Deleted
        // 4015 Voice Server Crashed
        switch (code) {
            case constants_1.SocketCloseCodes.NORMAL:
            case constants_1.SocketMediaCloseCodes.DISCONNECTED:
            case constants_1.SocketMediaCloseCodes.VOICE_SERVER_CRASHED:
                {
                    this.identified = false;
                }
                ;
                break;
        }
        this._heartbeat.interval.stop();
        this._heartbeat.ack = false;
        this._heartbeat.lastAck = null;
        this._heartbeat.lastSent = null;
        this._heartbeat.intervalTime = null;
        this._heartbeat.nonce = null;
    }
    connect(endpoint) {
        if (this.killed) {
            return;
        }
        if (this.connected) {
            this.disconnect();
        }
        if (endpoint) {
            this.setEndpoint(endpoint);
        }
        if (!this.endpoint) {
            throw new Error('Media Endpoint is null');
        }
        const url = new URL(this.endpoint);
        url.searchParams.set('v', String(constants_1.ApiVersions.MEDIA_GATEWAY));
        url.pathname = url.pathname || '/';
        const ws = this.socket = new basesocket_1.BaseSocket(url.href);
        this.setState(constants_1.SocketStates.CONNECTING);
        this.emit(constants_1.SocketEvents.SOCKET, ws);
        ws.socket.onclose = this.onClose.bind(this, ws);
        ws.socket.onerror = this.onError.bind(this, ws);
        ws.socket.onmessage = this.onMessage.bind(this, ws);
        ws.socket.onopen = this.onOpen.bind(this, ws);
    }
    decode(data) {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            this.emit(constants_1.SocketEvents.WARN, error);
        }
    }
    disconnect(code = constants_1.SocketCloseCodes.NORMAL, reason) {
        this.cleanup(code);
        if (this.socket) {
            if (!reason && (code in constants_1.SocketInternalCloseReasons)) {
                reason = constants_1.SocketInternalCloseReasons[code];
            }
            this.socket.close(code, reason);
            this.socket = null;
        }
    }
    encode(data) {
        try {
            return JSON.stringify(data);
        }
        catch (error) {
            this.emit(constants_1.SocketEvents.WARN, error);
        }
        return null;
    }
    handle(data) {
        const packet = this.decode(data);
        if (!packet) {
            return;
        }
        this.emit(constants_1.SocketEvents.PACKET, packet);
        switch (packet.op) {
            case constants_1.MediaOpCodes.READY:
                {
                    const data = packet.d;
                    this.reconnects = 0;
                    Object.defineProperty(this, 'ready', { value: true });
                    this.identified = true;
                    this.bucket.unlock();
                    this.transportConnect(data);
                    this.setState(constants_1.SocketStates.READY);
                    this.emit(constants_1.SocketEvents.READY);
                }
                ;
                break;
            case constants_1.MediaOpCodes.RESUMED:
                {
                    this.reconnects = 0;
                    Object.defineProperty(this, 'ready', { value: true });
                    this.bucket.unlock();
                    this.setState(constants_1.SocketStates.READY);
                    this.emit(constants_1.SocketEvents.READY);
                }
                ;
                break;
            case constants_1.MediaOpCodes.CLIENT_CONNECT:
                {
                    const data = packet.d;
                    this.ssrcs[constants_1.MediaSSRCTypes.AUDIO].set(data.audio_ssrc, data.user_id);
                    if (data['video_ssrc'] !== undefined) {
                        this.ssrcs[constants_1.MediaSSRCTypes.VIDEO].set(data.video_ssrc, data.user_id);
                    }
                    // start the user id's decode/encoders
                }
                ;
                break;
            case constants_1.MediaOpCodes.CLIENT_DISCONNECT:
                {
                    const data = packet.d;
                    const audioSSRC = this.userIdToSSRC(data.user_id, constants_1.MediaSSRCTypes.AUDIO);
                    if (audioSSRC !== null) {
                        this.ssrcs[constants_1.MediaSSRCTypes.AUDIO].delete(audioSSRC);
                    }
                    const videoSSRC = this.userIdToSSRC(data.user_id, constants_1.MediaSSRCTypes.VIDEO);
                    if (videoSSRC !== null) {
                        this.ssrcs[constants_1.MediaSSRCTypes.VIDEO].delete(videoSSRC);
                    }
                }
                ;
                break;
            case constants_1.MediaOpCodes.HELLO:
                {
                    const data = packet.d;
                    this.setHeartbeat(data);
                }
                ;
                break;
            case constants_1.MediaOpCodes.HEARTBEAT_ACK:
                {
                    const data = packet.d;
                    if (data !== this._heartbeat.nonce) {
                        this.disconnect(constants_1.SocketInternalCloseCodes.HEARTBEAT_ACK_NONCE);
                        this.connect();
                        return;
                    }
                    this._heartbeat.ack = true;
                    this._heartbeat.lastAck = Date.now();
                }
                ;
                break;
            case constants_1.MediaOpCodes.SELECT_PROTOCOL_ACK:
                {
                    if (this.protocol === constants_1.MediaProtocols.UDP) {
                        const { audio_codec: audioCodec, mode, media_session_id: mediaSessionId, secret_key: secretKey, video_codec: videoCodec, } = packet.d;
                        this.transport
                            .setAudioCodec(audioCodec)
                            .setVideoCodec(videoCodec)
                            .setKey(secretKey)
                            .setMode(mode)
                            .setTransportId(mediaSessionId);
                        this.emit(constants_1.SocketEvents.TRANSPORT_READY, this.transport);
                    }
                    else if (this.protocol === constants_1.MediaProtocols.WEBRTC) {
                        const data = packet.d;
                    }
                }
                ;
                break;
            case constants_1.MediaOpCodes.SESSION_UPDATE:
                {
                    const { audio_codec: audioCodec, media_session_id: mediaSessionId, video_codec: videoCodec, video_quality_changes: videoQualityChanges, } = packet.d;
                    this.transport
                        .setAudioCodec(audioCodec)
                        .setVideoCodec(videoCodec)
                        .setTransportId(mediaSessionId);
                    if (videoQualityChanges) {
                        videoQualityChanges.forEach((change) => {
                        });
                    }
                }
                ;
                break;
            case constants_1.MediaOpCodes.SPEAKING:
                {
                    const data = packet.d;
                    this.ssrcs[constants_1.MediaSSRCTypes.AUDIO].set(data.ssrc, data.user_id);
                    // use the bitmasks Constants.Discord.SpeakingFlags
                    // emit it?
                    // check to see if it already existed, if not, create decode/encoders
                }
                ;
                break;
            case constants_1.MediaOpCodes.VIDEO_SINK_WANTS:
                {
                    const data = packet.d;
                }
                ;
                break;
        }
    }
    kill(error) {
        if (this.killed) {
            return;
        }
        const serverId = (this.inDm) ? null : this.serverId;
        this.gateway.voiceStateUpdate(serverId, null);
        Object.defineProperty(this, 'killed', { value: true });
        this.gateway.mediaGateways.delete(this.serverId);
        this.disconnect(constants_1.SocketCloseCodes.NORMAL);
        if (this.transport) {
            this.transport.disconnect();
            this.transport.removeAllListeners();
            this.transport = null;
        }
        this.resolvePromises(error || new Error('Media Gateway was killed.'));
        this.emit(constants_1.SocketEvents.KILLED);
        this.removeAllListeners();
    }
    onClose(target, event) {
        let { code, reason } = event;
        if (!reason && (code in constants_1.SocketInternalCloseReasons)) {
            reason = constants_1.SocketInternalCloseReasons[code];
        }
        this.emit(constants_1.SocketEvents.CLOSE, { code, reason });
        if (!this.socket || this.socket === target) {
            this.setState(constants_1.SocketStates.CLOSED);
            this.cleanup(code);
            if (this.gateway.autoReconnect && !this.killed) {
                if (this.gateway.reconnectMax < this.reconnects) {
                    this.kill();
                }
                else {
                    this.emit(constants_1.SocketEvents.RECONNECTING);
                    setTimeout(() => {
                        this.connect();
                        this.reconnects++;
                    }, this.gateway.reconnectDelay);
                }
            }
        }
    }
    onError(target, event) {
        this.emit(constants_1.SocketEvents.WARN, event.error);
    }
    onMessage(target, event) {
        if (this.socket === target) {
            const { data } = event;
            this.handle(data);
        }
        else {
            target.close(constants_1.SocketInternalCloseCodes.OTHER_SOCKET_MESSAGE);
        }
    }
    onOpen(target) {
        this.emit(constants_1.SocketEvents.OPEN, target);
        if (this.socket === target) {
            this.setState(constants_1.SocketStates.OPEN);
            if (this.identified && this.transport) {
                this.resume();
            }
            else {
                this.identify();
            }
        }
        else {
            target.close(constants_1.SocketInternalCloseCodes.OTHER_SOCKET_OPEN);
        }
    }
    async ping(timeout) {
        if (!this.connected) {
            throw new Error('Socket is still initializing!');
        }
        return this.socket.ping(timeout);
    }
    send(op, d, callback, direct = false) {
        if (!this.connected) {
            return;
        }
        const data = this.encode({ op, d });
        if (!data) {
            return;
        }
        if (direct) {
            this.socket.send(data, callback);
        }
        else {
            const throttled = () => {
                if (this.bucket.locked || !this.identified || !this.connected) {
                    if (!this.bucket.locked) {
                        this.bucket.lock();
                    }
                    this.bucket.add(throttled, true);
                    return;
                }
                try {
                    this.socket.send(data, callback);
                }
                catch (error) {
                    this.emit(constants_1.SocketEvents.WARN, error);
                }
            };
            this.bucket.add(throttled);
        }
    }
    heartbeat(fromInterval = false) {
        if (fromInterval && (this._heartbeat.lastSent && !this._heartbeat.ack)) {
            this.disconnect(constants_1.SocketInternalCloseCodes.HEARTBEAT_ACK);
            this.connect();
        }
        else {
            this._heartbeat.ack = false;
            this._heartbeat.lastSent = Date.now();
            this._heartbeat.nonce = Date.now();
            this.send(constants_1.MediaOpCodes.HEARTBEAT, this._heartbeat.nonce, undefined, true);
        }
    }
    setHeartbeat(data) {
        if (!data || !data.heartbeat_interval) {
            return;
        }
        this.heartbeat();
        this._heartbeat.ack = true;
        this._heartbeat.lastAck = Date.now();
        this._heartbeat.intervalTime = data.heartbeat_interval;
        this._heartbeat.interval.start(this._heartbeat.intervalTime, () => {
            this.heartbeat(true);
        });
    }
    identify() {
        this.send(constants_1.MediaOpCodes.IDENTIFY, {
            server_id: this.serverId,
            session_id: this.sessionId,
            token: this.token,
            user_id: this.userId,
            video: this.videoEnabled,
        }, () => {
            this.setState(constants_1.SocketStates.IDENTIFYING);
        }, true);
    }
    resume() {
        this.send(constants_1.MediaOpCodes.RESUME, {
            server_id: this.serverId,
            session_id: this.sessionId,
            token: this.token,
        }, () => {
            this.setState(constants_1.SocketStates.RESUMING);
        }, true);
    }
    transportConnect(data) {
        this.ssrcs[constants_1.MediaSSRCTypes.AUDIO].set(data.ssrc, this.gateway.userId);
        if (!this.transport) {
            if (this.protocol === constants_1.MediaProtocols.UDP) {
                this.transport = new mediaudp_1.Socket(this);
            }
            else {
                this.emit(constants_1.SocketEvents.WARN, new Error(`Unsupported Media Transport Protocol: ${this.protocol}`));
                return;
            }
        }
        else {
            this.transport.disconnect();
        }
        if (this.protocol === constants_1.MediaProtocols.UDP) {
            let mode = null;
            if (this.forceMode && constants_1.MEDIA_ENCRYPTION_MODES.includes(this.forceMode)) {
                mode = this.forceMode;
            }
            else {
                for (let value of data.modes) {
                    let m = value;
                    if (constants_1.MEDIA_ENCRYPTION_MODES.includes(m)) {
                        mode = m;
                        break;
                    }
                }
            }
            let transport = this.transport;
            if (mode) {
                transport.setMode(mode);
                transport.setSSRC(data.ssrc);
                transport.connect(data.ip, data.port);
                this.emit(constants_1.SocketEvents.TRANSPORT, transport);
            }
            else {
                transport.disconnect();
                this.transport = null;
                this.emit(constants_1.SocketEvents.WARN, new Error(`No supported voice mode found in ${JSON.stringify(data.modes)}`));
            }
        }
        else {
            this.emit(constants_1.SocketEvents.WARN, new Error(`Unsupported Media Transport Protocol: ${this.protocol}`));
        }
    }
    sendClientConnect(callback) {
        this.send(constants_1.MediaOpCodes.CLIENT_CONNECT, {
            audio_ssrc: this.audioSSRC,
            video_ssrc: this.videoSSRC,
            rtx_ssrc: this.rtxSSRC,
        }, callback);
    }
    sendSelectProtocol(options, callback) {
        options = Object.assign({
            protocol: constants_1.MediaProtocols.UDP,
        }, options);
        const data = {
            codecs: options.codecs,
            data: options.data,
            experiments: options.experiments,
            protocol: options.protocol,
            rtc_connection_id: options.rtcConnectionId,
        };
        this.send(constants_1.MediaOpCodes.SELECT_PROTOCOL, data, callback);
    }
    sendSpeaking(options, callback) {
        options = Object.assign({
            delay: 0,
            ssrc: this.transport.ssrc,
        }, options);
        const data = {
            delay: options.delay,
            ssrc: options.ssrc,
            speaking: constants_1.MediaSpeakingFlags.NONE,
        };
        if (options.soundshare) {
            data.speaking |= constants_1.MediaSpeakingFlags.SOUNDSHARE;
        }
        if (options.voice) {
            data.speaking |= constants_1.MediaSpeakingFlags.VOICE;
        }
        this.send(constants_1.MediaOpCodes.SPEAKING, data, callback);
    }
    sendStateUpdate(options = {}, callback) {
        this.gateway.voiceStateUpdate(this.guildId, this.channelId, options, callback);
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.Socket = Socket;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const os = require("os");
const url_1 = require("url");
const iris_utils_1 = require("../../Iris-Utils")
const basesocket_1 = require("./basesocket");
const bucket_1 = require("./bucket");
const decompressor_1 = require("./decompressor");
const errors_1 = require("./errors");
const media_1 = require("./media");
const constants_1 = require("./constants");
const Dependencies = {
    Erlpack: null,
};
try {
    Dependencies.Erlpack = require('erlpack');
}
catch (e) { }
const IdentifyProperties = Object.freeze({
    $browser: process.version.replace(/^v/, (process.release.name || 'node') + '/'),
    $device: `Detritus v${constants_1.Package.VERSION}`,
    $os: `${os.type()} ${os.release()}; ${os.arch()}`,
});
const defaultOptions = Object.freeze({
    autoReconnect: true,
    compress: true,
    encoding: (Dependencies.Erlpack) ? constants_1.EncodingTypes.ETF : constants_1.EncodingTypes.JSON,
    guildSubscriptions: true,
    largeThreshold: 250,
    presence: null,
    reconnectDelay: constants_1.DEFAULT_SHARD_LAUNCH_DELAY,
    reconnectMax: 5,
    shardCount: constants_1.DEFAULT_SHARD_COUNT,
    shardId: 0,
});
const defaultPresence = Object.freeze({
    afk: false,
    since: null,
    status: constants_1.GatewayPresenceStatuses.ONLINE,
});
class Socket extends iris_utils_1.EventSpewer {
    constructor(token, options = { intents: constants_1.GATEWAY_INTENTS_ALL_UNPRIVILEGED }) {
        super();
        this.state = constants_1.SocketStates.CLOSED;
        this._heartbeat = {
            ack: false,
            lastAck: null,
            lastSent: null,
            interval: new iris_utils_1.Timers.Interval(),
            intervalTime: null,
        };
        this.discordTrace = [];
        this.identifyProperties = Object.assign({}, IdentifyProperties);
        this.intents = constants_1.GATEWAY_INTENTS_ALL_UNPRIVILEGED;
        this.killed = false;
        this.mediaGateways = new iris_utils_1.BaseCollection();
        this.presence = null;
        this.reconnects = 0;
        this.resuming = false;
        this.sequence = 0;
        this.sessionId = null;
        this.socket = null;
        this.url = null;
        this.userId = null;
        options = Object.assign({
            disabledEvents: [],
        }, defaultOptions, options);
        if (typeof (options.compress) === 'boolean') {
            if (options.compress) {
                options.compress = decompressor_1.Decompressor.supported().shift();
            }
            else {
                options.compress = constants_1.CompressTypes.NONE;
            }
        }
        this.autoReconnect = !!options.autoReconnect;
        this.compress = options.compress.toLowerCase();
        this.encoding = options.encoding.toLowerCase();
        this.disabledEvents = options.disabledEvents;
        this.guildSubscriptions = !!options.guildSubscriptions;
        this.largeThreshold = options.largeThreshold;
        this.reconnectDelay = options.reconnectDelay;
        this.reconnectMax = options.reconnectMax;
        this.shardCount = options.shardCount;
        this.shardId = options.shardId;
        this.token = token;
        this.onIdentifyCheck = options.onIdentifyCheck || this.onIdentifyCheck;
        if (options.presence) {
            this.presence = Object.assign({}, defaultPresence, options.presence);
        }
        Object.assign(this.identifyProperties, options.identifyProperties);
        if (!constants_1.COMPRESS_TYPES.includes(this.compress)) {
            throw new Error(`Compress type must be of: '${constants_1.COMPRESS_TYPES.join(', ')}'`);
        }
        if (this.compress === constants_1.CompressTypes.PAYLOAD) {
            throw new Error(`Compress type '${this.compress}' is currently not supported.`);
        }
        if (this.shardCount <= this.shardId) {
            throw new Error('Shard count cannot be less than or equal to the Shard Id!');
        }
        if (!Object.values(constants_1.EncodingTypes).includes(this.encoding)) {
            throw new Error(`Invalid Encoding Type, valid: ${JSON.stringify(Object.values(constants_1.EncodingTypes))}`);
        }
        if (this.encoding === constants_1.EncodingTypes.ETF && !Dependencies.Erlpack) {
            throw new Error('Install `Erlpack` to use ETF encoding.');
        }
        this.bucket = new bucket_1.Bucket(120, 60 * 1000);
        this.decompressor = null;
        switch (this.compress) {
            case constants_1.CompressTypes.ZLIB:
                {
                    if (!decompressor_1.Decompressor.supported().includes(this.compress)) {
                        throw new Error(`Missing modules for ${this.compress} Compress Type`);
                    }
                    this.decompressor = new decompressor_1.Decompressor({ type: this.compress });
                    this.decompressor.on('data', (data) => {
                        this.handle(data, true);
                    }).on('error', (error) => {
                        this.disconnect(constants_1.SocketInternalCloseCodes.INVALID_DATA);
                        this.emit(constants_1.SocketEvents.WARN, error);
                    });
                }
                ;
        }
        if (options.intents !== undefined) {
            this.intents = 0;
            if (options.intents === 'ALL') {
                this.intents = constants_1.GATEWAY_INTENTS_ALL;
            }
            else if (options.intents === 'ALL_UNPRIVILEGED') {
                this.intents = constants_1.GATEWAY_INTENTS_ALL_UNPRIVILEGED;
            }
            else {
                const intents = (Array.isArray(options.intents)) ? options.intents : [options.intents];
                for (let intent of intents) {
                    if (typeof (intent) === 'string') {
                        intent = intent.toUpperCase();
                        if (intent in constants_1.GatewayIntents) {
                            this.intents |= constants_1.GatewayIntents[intent];
                        }
                    }
                    else if (typeof (intent) === 'number') {
                        this.intents |= intent;
                    }
                    else {
                        throw new Error(`Invalid intent received: ${intent}`);
                    }
                }
            }
        }
        Object.defineProperties(this, {
            _heartbeat: { enumerable: false, writable: false },
            identifyProperties: { enumerable: false },
            killed: { configurable: true },
            state: { configurable: true, writable: false },
            token: { enumerable: false, writable: false },
        });
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
    setState(value) {
        if (value in constants_1.SocketStates && value !== this.state) {
            Object.defineProperty(this, 'state', { value });
            this.emit(constants_1.SocketEvents.STATE, { state: value });
        }
    }
    makePresence(options = {}) {
        options = this.presence = Object.assign({}, defaultPresence, this.presence, options);
        const data = {
            activities: [],
            afk: !!options.afk,
            since: options.since || null,
            status: options.status || defaultPresence.status,
        };
        const activities = [...(options.activities || [])];
        if (options.activity) {
            activities.unshift(options.activity);
        }
        if (options.game) {
            activities.unshift(options.game);
        }
        if (activities.length) {
            for (let activity of activities) {
                const raw = {
                    application_id: activity.applicationId,
                    assets: undefined,
                    details: activity.details,
                    emoji: undefined,
                    flags: activity.flags,
                    metadata: activity.metadata,
                    name: activity.name,
                    party: undefined,
                    platform: activity.platform,
                    secrets: undefined,
                    session_id: activity.sessionId,
                    state: activity.state,
                    sync_id: activity.syncId,
                    timestamps: undefined,
                    type: activity.type,
                    url: activity.url,
                };
                if (activity.assets) {
                    raw.assets = {
                        large_image: activity.assets.largeImage,
                        large_text: activity.assets.largeText,
                        small_image: activity.assets.smallImage,
                        small_text: activity.assets.smallText,
                    };
                }
                if (activity.emoji) {
                    raw.emoji = {
                        animated: activity.emoji.animated,
                        id: activity.emoji.id,
                        name: activity.emoji.name,
                    };
                }
                if (activity.party) {
                    raw.party = {
                        id: activity.party.id,
                        size: activity.party.size,
                    };
                }
                if (activity.secrets) {
                    raw.secrets = {
                        join: activity.secrets.join,
                        match: activity.secrets.match,
                        spectate: activity.secrets.spectate,
                    };
                }
                if (activity.timestamps) {
                    raw.timestamps = {
                        end: activity.timestamps.end,
                        start: activity.timestamps.start,
                    };
                }
                data.activities.push(raw);
            }
        }
        return data;
    }
    getIdentifyData() {
        const data = {
            /* payload compression, rather use transport compression, using the get params overrides this */
            compress: (this.compress === constants_1.CompressTypes.PAYLOAD),
            guild_subscriptions: this.guildSubscriptions,
            intents: this.intents,
            large_threshold: this.largeThreshold,
            properties: this.identifyProperties,
            token: this.token,
        };
        if (constants_1.DEFAULT_SHARD_COUNT < this.shardCount) {
            data.shard = [this.shardId, this.shardCount];
        }
        if (this.presence) {
            data.presence = this.makePresence();
        }
        return data;
    }
    getResumeData() {
        return {
            seq: this.sequence || null,
            session_id: this.sessionId,
            token: this.token,
        };
    }
    cleanup(code, reason) {
        this.bucket.clear();
        this.bucket.lock();
        if (this.decompressor) {
            this.decompressor.reset();
        }
        // un-resumable events
        // 1000
        // un-resumable and kill socket
        // 4004 Authentication Failed
        // 4010 Invalid Shard Sent
        // 4011 Sharding Required
        // 4012 Invalid Gateway Version
        // 4013 Invalid Intents Sent
        switch (code) {
            case constants_1.SocketCloseCodes.NORMAL:
                {
                    this.sequence = 0;
                    this.sessionId = null;
                }
                ;
                break;
            case constants_1.SocketGatewayCloseCodes.AUTHENTICATION_FAILED:
            case constants_1.SocketGatewayCloseCodes.INVALID_SHARD:
            case constants_1.SocketGatewayCloseCodes.SHARDING_REQUIRED:
            case constants_1.SocketGatewayCloseCodes.INVALID_VERSION:
            case constants_1.SocketGatewayCloseCodes.INVALID_INTENTS:
            case constants_1.SocketGatewayCloseCodes.DISALLOWED_INTENTS:
                {
                    this.kill(new errors_1.SocketKillError(code, reason));
                }
                ;
                break;
        }
        this._heartbeat.interval.stop();
        this._heartbeat.ack = false;
        this._heartbeat.lastAck = null;
        this._heartbeat.lastSent = null;
        this._heartbeat.intervalTime = null;
    }
    connect(url) {
        if (this.killed) {
            return;
        }
        if (this.connected) {
            this.disconnect();
        }
        if (!url) {
            url = this.url;
        }
        if (!url) {
            throw new Error('Socket requires a url to connect to.');
        }
        this.url = new url_1.URL('', url);
        this.url.searchParams.set('encoding', this.encoding);
        this.url.searchParams.set('v', String(constants_1.ApiVersions.GATEWAY));
        this.url.pathname = this.url.pathname || '/';
        switch (this.compress) {
            case constants_1.CompressTypes.ZLIB:
                {
                    this.url.searchParams.set('compress', this.compress);
                }
                ;
                break;
        }
        this.socket = new basesocket_1.BaseSocket(this.url.href);
        this.socket.on(constants_1.SocketEventsBase.CLOSE, this.onClose.bind(this, this.socket));
        this.socket.on(constants_1.SocketEventsBase.ERROR, this.onError.bind(this, this.socket));
        this.socket.on(constants_1.SocketEventsBase.MESSAGE, this.onMessage.bind(this, this.socket));
        this.socket.on(constants_1.SocketEventsBase.OPEN, this.onOpen.bind(this, this.socket));
        this.setState(constants_1.SocketStates.CONNECTING);
        this.emit(constants_1.SocketEvents.SOCKET, this.socket);
    }
    decode(data, uncompressed = false) {
        try {
            if (data instanceof ArrayBuffer) {
                data = Buffer.from(new Uint8Array(data));
            }
            else if (Array.isArray(data)) {
                data = Buffer.concat(data);
            }
            if (!uncompressed) {
                if (this.decompressor) {
                    this.decompressor.feed(data);
                    return null;
                }
            }
            switch (this.encoding) {
                case constants_1.EncodingTypes.ETF: return Dependencies.Erlpack.unpack(data);
                case constants_1.EncodingTypes.JSON: return JSON.parse(data);
            }
        }
        catch (error) {
            this.emit(constants_1.SocketEvents.WARN, error);
        }
    }
    disconnect(code = constants_1.SocketCloseCodes.NORMAL, reason) {
        this.cleanup(code, reason);
        if (this.socket) {
            if (!reason && (code in constants_1.SocketInternalCloseReasons)) {
                reason = constants_1.SocketInternalCloseReasons[code];
            }
            this.socket.close(code, reason);
            this.socket = null;
        }
        this.resuming = false;
    }
    handle(data, uncompressed = false) {
        const packet = this.decode(data, uncompressed);
        if (!packet) {
            return;
        }
        if (packet.s !== null) {
            this.sequence = packet.s;
        }
        switch (packet.op) {
            case constants_1.GatewayOpCodes.HEARTBEAT:
                {
                    this.heartbeat();
                }
                ;
                break;
            case constants_1.GatewayOpCodes.HEARTBEAT_ACK:
                {
                    this._heartbeat.ack = true;
                    this._heartbeat.lastAck = Date.now();
                }
                ;
                break;
            case constants_1.GatewayOpCodes.HELLO:
                {
                    const data = packet.d;
                    this.setHeartbeat(data);
                    if (this.sessionId) {
                        this.resume();
                    }
                    else {
                        this.identifyTry();
                    }
                }
                ;
                break;
            case constants_1.GatewayOpCodes.INVALID_SESSION:
                {
                    const shouldResume = packet.d;
                    setTimeout(() => {
                        if (shouldResume) {
                            this.resume();
                        }
                        else {
                            this.sequence = 0;
                            this.sessionId = null;
                            this.identifyTry();
                        }
                    }, Math.floor(Math.random() * 5 + 1) * 1000);
                }
                ;
                break;
            case constants_1.GatewayOpCodes.RECONNECT:
                {
                    this.disconnect(constants_1.SocketInternalCloseCodes.RECONNECTING);
                    this.connect();
                }
                ;
                break;
            case constants_1.GatewayOpCodes.DISPATCH:
                {
                    this.handleDispatch(packet.t, packet.d);
                }
                ;
                break;
        }
        setImmediate(() => {
            this.emit(constants_1.SocketEvents.PACKET, packet);
        });
    }
    handleDispatch(name, data) {
        switch (name) {
            case constants_1.GatewayDispatchEvents.READY:
                {
                    this.bucket.unlock();
                    this.reconnects = 0;
                    this.discordTrace = data['_trace'];
                    this.sessionId = data['session_id'];
                    this.userId = data['user']['id'];
                    this.setState(constants_1.SocketStates.READY);
                    this.emit(constants_1.SocketEvents.READY);
                }
                ;
                break;
            case constants_1.GatewayDispatchEvents.RESUMED:
                {
                    this.reconnects = 0;
                    this.resuming = false;
                    this.bucket.unlock();
                    this.setState(constants_1.SocketStates.READY);
                    this.emit(constants_1.SocketEvents.READY);
                }
                ;
                break;
            case constants_1.GatewayDispatchEvents.GUILD_DELETE:
                {
                    const serverId = data['id'];
                    if (this.mediaGateways.has(serverId)) {
                        const mGateway = this.mediaGateways.get(serverId);
                        if (data['unavailable']) {
                            mGateway.kill(new Error('The guild this voice was connected to became unavailable'));
                        }
                        else {
                            mGateway.kill(new Error('Left the guild this voice was connected to'));
                        }
                    }
                }
                ;
                break;
            case constants_1.GatewayDispatchEvents.VOICE_SERVER_UPDATE:
                {
                    const serverId = (data['guild_id'] || data['channel_id']);
                    if (this.mediaGateways.has(serverId)) {
                        const gateway = this.mediaGateways.get(serverId);
                        gateway.setEndpoint(data['endpoint']);
                        gateway.setToken(data['token']);
                    }
                }
                ;
                break;
            case constants_1.GatewayDispatchEvents.VOICE_STATE_UPDATE:
                {
                    const userId = data['user_id'];
                    if (userId !== this.userId) {
                        // not our voice state update
                        return;
                    }
                    const serverId = (data['guild_id'] || data['channel_id']);
                    if (this.mediaGateways.has(serverId)) {
                        const gateway = this.mediaGateways.get(serverId);
                        if (!data['channel_id']) {
                            gateway.kill();
                        }
                        else if (gateway.sessionId !== data['session_id']) {
                            gateway.kill(new Error('Connected to this server from a different session'));
                        }
                        else {
                            gateway.setChannelId(data['channel_id']);
                            gateway.resolvePromises();
                        }
                    }
                }
                ;
                break;
        }
    }
    kill(error) {
        if (!this.killed) {
            Object.defineProperty(this, 'killed', { value: true });
            this.disconnect(constants_1.SocketCloseCodes.NORMAL);
            for (let [serverId, socket] of this.mediaGateways) {
                socket.kill(error);
            }
            this.emit(constants_1.SocketEvents.KILLED, { error });
            this.removeAllListeners();
        }
    }
    onClose(target, code, reason) {
        if (code === undefined) {
            code = constants_1.SocketInternalCloseCodes.CONNECTION_ERROR;
        }
        if (!reason && (code in constants_1.SocketInternalCloseReasons)) {
            reason = constants_1.SocketInternalCloseReasons[code];
        }
        this.emit(constants_1.SocketEvents.CLOSE, { code, reason });
        if (!this.socket || this.socket === target) {
            this.setState(constants_1.SocketStates.CLOSED);
            this.disconnect(code, reason);
            if (this.autoReconnect && !this.killed) {
                if (this.reconnectMax < this.reconnects) {
                    this.kill(new Error(`Tried reconnecting more than ${this.reconnectMax} times.`));
                }
                else {
                    this.emit(constants_1.SocketEvents.RECONNECTING);
                    setTimeout(() => {
                        this.connect();
                        this.reconnects++;
                    }, this.reconnectDelay);
                }
            }
        }
    }
    onError(target, error) {
        this.emit(constants_1.SocketEvents.WARN, error);
    }
    onMessage(target, data) {
        if (this.socket === target) {
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
        }
        else {
            target.close(constants_1.SocketInternalCloseCodes.OTHER_SOCKET_OPEN);
        }
    }
    async ping(timeout) {
        if (!this.connected || !this.socket) {
            throw new Error('Socket is still initializing!');
        }
        return this.socket.ping(timeout);
    }
    send(op, d, callback, direct = false) {
        const packet = { op, d };
        let data;
        try {
            switch (this.encoding) {
                case constants_1.EncodingTypes.JSON:
                    data = JSON.stringify(packet);
                    break;
                case constants_1.EncodingTypes.ETF:
                    data = Dependencies.Erlpack.pack(packet);
                    break;
                default:
                    {
                        throw new errors_1.DroppedPacketError(packet, `Invalid encoding: ${this.encoding}`);
                    }
                    ;
            }
        }
        catch (error) {
            this.emit(constants_1.SocketEvents.WARN, error);
        }
        if (data !== undefined) {
            if (direct) {
                if (this.connected && this.socket) {
                    this.socket.send(data, callback);
                }
                else {
                    this.emit(constants_1.SocketEvents.WARN, new errors_1.DroppedPacketError(packet, 'Socket isn\'t connected'));
                }
            }
            else {
                const throttled = () => {
                    if (this.bucket.locked || !this.connected) {
                        if (!this.bucket.locked) {
                            this.bucket.lock();
                        }
                        this.bucket.add(throttled, true);
                    }
                    else {
                        try {
                            this.socket.send(data, callback);
                        }
                        catch (error) {
                            this.emit(constants_1.SocketEvents.WARN, error);
                        }
                    }
                };
                this.bucket.add(throttled);
            }
        }
    }
    heartbeat(fromInterval = false) {
        if (fromInterval && !this._heartbeat.ack) {
            this.disconnect(constants_1.SocketInternalCloseCodes.HEARTBEAT_ACK);
            this.connect();
        }
        else {
            this._heartbeat.ack = false;
            this._heartbeat.lastSent = Date.now();
            const sequence = (this.sequence) ? this.sequence : null;
            this.send(constants_1.GatewayOpCodes.HEARTBEAT, sequence, undefined, true);
        }
    }
    setHeartbeat(data) {
        if (data) {
            this.heartbeat();
            this._heartbeat.ack = true;
            this._heartbeat.lastAck = Date.now();
            this._heartbeat.intervalTime = data['heartbeat_interval'];
            this._heartbeat.interval.start(this._heartbeat.intervalTime, () => {
                this.heartbeat(true);
            });
            this.discordTrace = data._trace;
        }
    }
    identify() {
        const data = this.getIdentifyData();
        this.send(constants_1.GatewayOpCodes.IDENTIFY, data, () => {
            this.setState(constants_1.SocketStates.IDENTIFYING);
        }, true);
    }
    async identifyTry() {
        if (!this.onIdentifyCheck || (await Promise.resolve(this.onIdentifyCheck()))) {
            this.identify();
        }
    }
    resume() {
        this.resuming = true;
        const data = this.getResumeData();
        this.send(constants_1.GatewayOpCodes.RESUME, data, () => {
            this.setState(constants_1.SocketStates.RESUMING);
        }, true);
    }
    /* user callable function */
    callConnect(channelId, callback) {
        this.send(constants_1.GatewayOpCodes.CALL_CONNECT, {
            channel_id: channelId,
        }, callback);
    }
    guildStreamCreate(guildId, options, callback) {
        this.send(constants_1.GatewayOpCodes.STREAM_CREATE, {
            channel_id: options.channelId,
            guild_id: guildId,
            preferred_region: options.preferredRegion,
            type: 'guild',
        }, callback);
    }
    lobbyConnect(lobbyId, lobbySecret, callback) {
        this.send(constants_1.GatewayOpCodes.LOBBY_CONNECT, {
            lobby_id: lobbyId,
            lobby_secret: lobbySecret,
        }, callback);
    }
    lobbyDisconnect(lobbyId, callback) {
        this.send(constants_1.GatewayOpCodes.LOBBY_DISCONNECT, {
            lobby_id: lobbyId,
        }, callback);
    }
    lobbyVoiceStatesUpdate(voiceStates, callback) {
        this.send(constants_1.GatewayOpCodes.LOBBY_VOICE_STATES_UPDATE, voiceStates.map((voiceState) => {
            return {
                lobby_id: voiceState.lobbyId,
                self_deaf: voiceState.selfDeaf,
                self_mute: voiceState.selfMute,
            };
        }), callback);
    }
    requestGuildMembers(guildIds, options, callback) {
        this.send(constants_1.GatewayOpCodes.REQUEST_GUILD_MEMBERS, {
            guild_id: guildIds,
            limit: options.limit,
            nonce: options.nonce,
            presences: options.presences,
            query: options.query,
            user_ids: options.userIds,
        }, callback);
    }
    requestApplicationCommands(guildId, options) {
        this.send(constants_1.GatewayOpCodes.REQUEST_APPLICATION_COMMANDS, {
            application_id: options.applicationId,
            guild_id: guildId,
            limit: options.limit,
            nonce: options.nonce,
            offset: options.offset,
            query: options.query,
        });
    }
    setPresence(options = {}, callback) {
        const data = this.makePresence(options);
        this.send(constants_1.GatewayOpCodes.PRESENCE_UPDATE, data, callback);
    }
    streamDelete(streamKey, callback) {
        this.send(constants_1.GatewayOpCodes.STREAM_DELETE, {
            stream_key: streamKey,
        }, callback);
    }
    streamPing(streamKey, callback) {
        this.send(constants_1.GatewayOpCodes.STREAM_PING, {
            stream_key: streamKey,
        }, callback);
    }
    streamSetPaused(streamKey, paused, callback) {
        this.send(constants_1.GatewayOpCodes.STREAM_SET_PAUSED, {
            stream_key: streamKey,
            paused,
        }, callback);
    }
    streamWatch(streamKey, callback) {
        this.send(constants_1.GatewayOpCodes.STREAM_WATCH, {
            stream_key: streamKey,
        }, callback);
    }
    syncGuild(guildIds, callback) {
        this.send(constants_1.GatewayOpCodes.SYNC_GUILD, guildIds, callback);
    }
    updateGuildSubscriptions(guildId, options = {}, callback) {
        this.send(constants_1.GatewayOpCodes.GUILD_SUBSCRIPTIONS, {
            activities: options.activities,
            channels: options.channels,
            guild_id: guildId,
            members: options.members,
            typing: options.typing,
        }, callback);
    }
    voiceServerPing(callback) {
        this.send(constants_1.GatewayOpCodes.VOICE_SERVER_PING, null, callback);
    }
    voiceStateUpdate(guildId = null, channelId = null, options = {}, callback) {
        this.send(constants_1.GatewayOpCodes.VOICE_STATE_UPDATE, {
            channel_id: channelId,
            guild_id: guildId,
            preferred_region: options.preferredRegion,
            self_deaf: options.selfDeaf,
            self_mute: options.selfMute,
            self_video: options.selfVideo,
        }, callback);
    }
    async voiceConnect(guildId, channelId, options = {
        receive: true,
        timeout: constants_1.DEFAULT_VOICE_TIMEOUT,
    }) {
        if (!guildId && !channelId) {
            throw new Error('A Guild Id or a Channel Id is required.');
        }
        if (options.timeout === undefined) {
            options.timeout = constants_1.DEFAULT_VOICE_TIMEOUT;
        }
        if (options.selfVideo && options.video === undefined) {
            options.video = options.selfVideo;
        }
        const serverId = (guildId || channelId);
        let gateway;
        if (this.mediaGateways.has(serverId)) {
            gateway = this.mediaGateways.get(serverId);
            if (!channelId) {
                gateway.kill();
                return null;
            }
            if (channelId === gateway.channelId) {
                return gateway;
            }
        }
        else {
            if (!channelId) {
                this.voiceStateUpdate(guildId, channelId, options);
                return null;
            }
            gateway = new media_1.Socket(this, {
                channelId,
                forceMode: options.forceMode,
                receive: options.receive,
                serverId,
                userId: this.userId,
                video: options.video,
            });
            this.mediaGateways.set(serverId, gateway);
        }
        const timeout = new iris_utils_1.Timers.Timeout();
        if (options.timeout) {
            timeout.start(options.timeout, () => {
                gateway.kill(new Error(`Voice Gateway took longer than ${options.timeout}ms.`));
            });
        }
        return new Promise((resolve, reject) => {
            gateway.promises.add({ resolve, reject });
            this.voiceStateUpdate(guildId, channelId, options);
        }).then(() => {
            timeout.stop();
            return (channelId) ? gateway : null;
        }).catch((error) => {
            timeout.stop();
            throw error;
        });
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.Socket = Socket;

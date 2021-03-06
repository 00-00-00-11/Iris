"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardClient = void 0;
const Crypto = require("crypto");
const iris_client_rest_1 = require("../Iris-Client-Rest");
const iris_client_socket_1 = require("../Iris-Client-Socket");
const iris_utils_1 = require("../Iris-Utils");
const constants_1 = require("./constants");
const handler_1 = require("./gateway/handler");
const rest_1 = require("./rest");
const basecollection_1 = require("./collections/basecollection");
const baseset_1 = require("./collections/baseset");
const collections_1 = require("./collections");
const voiceconnection_1 = require("./media/voiceconnection");
const structures_1 = require("./structures");
/**
 * Shard Client, represents one gateway connection
 * @category Clients
 */
class ShardClient extends iris_utils_1.EventSpewer {
    constructor(token, options = {}) {
        super();
        /**
         * @ignore
         */
        this._isBot = true;
        this._killed = false;
        this.application = null;
        this.cluster = null;
        this.commandClient = null;
        /** Default Image Format to use for any url getters*/
        this.imageFormat = constants_1.ImageFormats.PNG;
        /**
         * If this is a bot, this will be filled with it's application owner or all of the application's team owners
         * If this is a user, this will only include the user object
         * Only fills once we receive the Ready payload
         */
        this.owners = new basecollection_1.BaseCollection();
        /** If the client is ran or not */
        this.ran = false;
        /** Us, only fills once we received the Ready payload from the gateway */
        this.user = null;
        if (!token) {
            throw new Error('Token is required for this library to work.');
        }
        this.token = token;
        options = Object.assign({}, options);
        if (options.cache === undefined) {
            options.cache = {};
        }
        if (options.pass === undefined) {
            options.pass = {};
        }
        this.cluster = options.pass.cluster || this.cluster;
        this.commandClient = options.pass.commandClient || this.commandClient;
        this.gateway = new iris_client_socket_1.Gateway.Socket(token, options.gateway);
        this.gatewayHandler = new handler_1.GatewayHandler(this, options.gateway);
        this.rest = new rest_1.RestClient(token, Object.assign({
            authType: (options.isBot) ? constants_1.AuthTypes.BOT : constants_1.AuthTypes.USER,
        }, options.rest), this);
        if (options.isBot !== undefined) {
            this._isBot = !!options.isBot;
        }
        if (options.imageFormat) {
            const imageFormat = options.imageFormat.toLowerCase();
            if (!constants_1.IMAGE_FORMATS.includes(imageFormat)) {
                throw new Error(`Image format must be one of ${JSON.stringify(constants_1.IMAGE_FORMATS)}`);
            }
            this.imageFormat = imageFormat;
        }
        Object.defineProperties(this, {
            _isBot: { configurable: true, enumerable: false, writable: false },
            _killed: { configurable: true, enumerable: false, writable: false },
            cluster: { enumerable: false, writable: false },
            commandClient: { configurable: true, enumerable: false, writable: false },
            gateway: { enumerable: false, writable: false },
            ran: { configurable: true, writable: false },
            rest: { enumerable: false, writable: false },
            token: { enumerable: false, writable: false },
        });
        if (typeof (options.cache) === 'boolean') {
            const enabled = options.cache;
            options.cache = {
                applications: { enabled },
                channels: { enabled },
                connectedAccounts: { enabled },
                emojis: { enabled },
                guilds: { enabled },
                members: { enabled },
                messages: { enabled },
                notes: { enabled },
                presences: { enabled },
                relationships: { enabled },
                roles: { enabled },
                sessions: { enabled },
                typings: { enabled },
                users: { enabled },
                voiceCalls: { enabled },
                voiceConnections: { enabled },
                voiceStates: { enabled },
            };
        }
        this.applications = options.pass.applications || new collections_1.Applications(this, options.cache.applications);
        this.channels = options.pass.channels || new collections_1.Channels(this, options.cache.channels);
        this.connectedAccounts = options.pass.connectedAccounts || new collections_1.ConnectedAccounts(this, options.cache.connectedAccounts);
        this.emojis = options.pass.emojis || new collections_1.Emojis(this, options.cache.emojis);
        this.guilds = options.pass.guilds || new collections_1.Guilds(this, options.cache.guilds);
        this.members = options.pass.members || new collections_1.Members(this, options.cache.members);
        this.messages = options.pass.messages || new collections_1.Messages(this, options.cache.messages);
        this.notes = options.pass.notes || new collections_1.Notes(this, options.cache.notes);
        this.presences = options.pass.presences || new collections_1.Presences(this, options.cache.presences);
        this.relationships = options.pass.relationships || new collections_1.Relationships(this, options.cache.relationships);
        this.roles = options.pass.roles || new collections_1.Roles(this, options.cache.roles);
        this.sessions = options.pass.sessions || new collections_1.Sessions(this, options.cache.sessions);
        this.typings = options.pass.typings || new collections_1.TypingCollection(this, options.cache.typings);
        this.users = options.pass.users || new collections_1.Users(this, options.cache.users);
        this.voiceCalls = options.pass.voiceCalls || new collections_1.VoiceCalls(this, options.cache.voiceCalls);
        this.voiceConnections = options.pass.voiceConnections || new collections_1.VoiceConnections(this, options.cache.voiceConnections);
        this.voiceStates = options.pass.voiceStates || new collections_1.VoiceStates(this, options.cache.voiceStates);
    }
    get clientId() {
        if (this.application) {
            return this.application.id;
        }
        return this.userId;
    }
    get isBot() {
        if (this.user) {
            return this.user.bot;
        }
        return this._isBot;
    }
    get killed() {
        return this._killed && this.gateway.killed;
    }
    get shardCount() {
        return this.gateway.shardCount;
    }
    get shardId() {
        return this.gateway.shardId;
    }
    get userId() {
        return this.gateway.userId || '';
    }
    _mergeOauth2Application(data) {
        let oauth2Application;
        if (this.application) {
            oauth2Application = this.application;
            oauth2Application.merge(data);
        }
        else {
            oauth2Application = new structures_1.Oauth2Application(this, data);
            this.application = oauth2Application;
        }
        if (oauth2Application.owner) {
            this.owners.clear();
            this.owners.set(oauth2Application.owner.id, oauth2Application.owner);
            if (oauth2Application.team) {
                for (let [userId, member] of oauth2Application.team.members) {
                    this.owners.set(userId, member.user);
                }
            }
        }
        return oauth2Application;
    }
    isOwner(userId) {
        return this.owners.has(userId);
    }
    kill(error) {
        if (!this.killed) {
            Object.defineProperty(this, '_killed', { value: true });
            this.gateway.kill(error);
            this.reset();
            if (this.cluster) {
                // must be a better way to handle this
                // maybe kill the entire cluster?
                this.cluster.shards.delete(this.shardId);
            }
            this.emit(constants_1.ClientEvents.KILLED, { error });
            this.rest.raw.removeAllListeners();
            this.removeAllListeners();
        }
    }
    async ping() {
        const [gateway, response] = await Promise.all([
            this.gateway.ping(),
            this.rest.request({
                dataOnly: false,
                route: {
                    path: iris_client_rest_1.Endpoints.Api.ME,
                },
            }),
        ]);
        return { gateway, rest: response.took };
    }
    async requestGuildMembers(guildId, oldOptions) {
        const options = Object.assign({
            limit: 0,
            timeout: 1500,
        }, oldOptions);
        let key = `${guildId}:${options.limit}:${options.query}:${options.presences}`;
        if (options.userIds && options.userIds.length) {
            if (options.userIds.length <= 10) {
                key += `:${options.userIds.join('.')}`;
            }
            else {
                key += `:amount.${options.userIds.length}`;
            }
        }
        const nonce = options.nonce = Crypto.createHash('md5').update(key).digest('hex');
        let cache;
        if (this.gatewayHandler._chunksWaiting.has(nonce)) {
            cache = this.gatewayHandler._chunksWaiting.get(nonce);
        }
        else {
            const promise = {};
            promise.wait = new Promise((res, rej) => {
                promise.resolve = res;
                promise.reject = rej;
            });
            cache = {
                members: new basecollection_1.BaseCollection(),
                notFound: new baseset_1.BaseSet(),
                presences: new basecollection_1.BaseCollection(),
                promise,
                waiting: 0,
            };
            this.gatewayHandler._chunksWaiting.set(nonce, cache);
            this.gateway.requestGuildMembers(guildId, options);
        }
        cache.waiting++;
        const timeout = new is_ils_1.Timers.Timeout();
        return new Promise((resolve, reject) => {
            cache.promise.wait.then(resolve).catch(reject);
            timeout.start(options.timeout, () => {
                reject(new Error(`Guild chunking took longer than ${options.timeout}ms.`));
                cache.waiting--;
                if (cache.waiting <= 0) {
                    this.gatewayHandler._chunksWaiting.delete(nonce);
                }
            });
        }).then(() => {
            timeout.stop();
            this.gatewayHandler._chunksWaiting.delete(nonce);
            return {
                members: cache.members,
                nonce,
                notFound: cache.notFound,
                presences: cache.presences,
            };
        });
    }
    reset() {
        this.applications.clear();
        this.channels.clear();
        this.connectedAccounts.clear();
        this.guilds.clear();
        this.members.clear();
        this.messages.clear();
        this.notes.clear();
        this.presences.clear();
        this.relationships.clear();
        this.sessions.clear();
        this.users.clear();
        this.voiceCalls.clear();
        this.voiceConnections.clear();
        this.voiceStates.clear();
    }
    async run(options = {}) {
        const wait = options.wait || options.wait === undefined;
        let url;
        if (options.url) {
            url = options.url;
        }
        else {
            const data = await this.rest.fetchGateway();
            url = data.url;
        }
        this.gateway.connect(url);
        if (wait) {
            await new Promise((resolve, reject) => {
                this.once(constants_1.ClientEvents.GATEWAY_READY, resolve);
                this.once(constants_1.ClientEvents.KILLED, ({ error }) => reject(error));
            });
        }
        Object.defineProperty(this, 'ran', { value: true });
        return this;
    }
    /**
     *
     * @param guildId Guild Id you want to connect to, if a user and wanting to connect to a Dm Channel, keep this blank
     * @param channelId Channel Id you want to connect to or move to
     * @param options Options to pass into the `Iris-Client-Socket`'s gateway's voiceConnect
     * @returns Returns a promise that resolves into a Voice Connection object and an isNew variable.
     *          isNew is used to see if the connection was reused (e.g. changing channels) so you can put listeners on or not
     */
    async voiceConnect(guildId, channelId, options = {}) {
        options.selfDeaf = options.selfDeaf || options.deaf;
        options.selfMute = options.selfMute || options.mute;
        const gateway = await this.gateway.voiceConnect(guildId, channelId, options);
        const serverId = (guildId || channelId);
        if (gateway) {
            if (this.voiceConnections.has(serverId)) {
                return {
                    connection: this.voiceConnections.get(serverId),
                    isNew: false,
                };
            }
            try {
                const payload = {
                    connection: new voiceconnection_1.VoiceConnection(this, gateway, options),
                    isNew: true,
                };
                this.voiceConnections.insert(payload.connection);
                if (options.wait || options.wait === undefined) {
                    return new Promise((resolve) => {
                        payload.connection.once('ready', () => {
                            resolve(payload);
                        });
                    });
                }
                else {
                    return payload;
                }
            }
            catch (error) {
                gateway.kill(error);
                throw error;
            }
        }
        else {
            if (this.voiceConnections.has(serverId)) {
                this.voiceConnections.get(serverId).kill();
            }
        }
        return null;
    }
    toString() {
        return `Iris Client (Shard ${this.shardId})`;
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
    subscribe(event, listener) {
        return super.subscribe(event, listener);
    }
}
exports.ShardClient = ShardClient;

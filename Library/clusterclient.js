"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterClient = void 0;
const iris_client_rest_1 = require("../Iris-Client-Rest");
const iris_utils_1 = require("../Iris-Utils");
const bucket_1 = require("./bucket");
const client_1 = require("./client");
const processchild_1 = require("./cluster/processchild");
const basecollection_1 = require("./collections/basecollection");
const constants_1 = require("./constants");
class ClusterClient extends iris_utils_1.EventSpewer {
    constructor(token, options = {}) {
        super();
        this._refresh = {
            applications: { last: 0, time: 4 * (60 * 60) * 1000 },
            oauth2Application: { last: 0, time: 4 * (60 * 60) * 1000 },
        };
        this._shardsWaiting = new basecollection_1.BaseCollection();
        this.commandClient = null;
        this.manager = null;
        this.buckets = new basecollection_1.BaseCollection();
        this.maxConcurrency = 1;
        this.ran = false;
        this.shardCount = 0;
        this.shardEnd = -1;
        this.shardStart = 0;
        this.shards = new basecollection_1.BaseCollection();
        this.shardOptions = {};
        options = Object.assign({}, options);
        const isUsingClusterManager = process.env.CLUSTER_MANAGER === 'true';
        if (isUsingClusterManager) {
            const { CLUSTER_SHARD_COUNT, CLUSTER_SHARD_END, CLUSTER_SHARD_START, CLUSTER_TOKEN, MAX_CONCURRENCY, } = process.env;
            token = CLUSTER_TOKEN;
            options.maxConcurrency = +MAX_CONCURRENCY;
            options.shardCount = +CLUSTER_SHARD_COUNT;
            options.shards = [
                +CLUSTER_SHARD_START,
                +CLUSTER_SHARD_END,
            ];
        }
        if (!token) {
            throw new Error('Token is required for this library to work.');
        }
        this.token = token;
        this.maxConcurrency = options.maxConcurrency || this.maxConcurrency;
        this.shardCount = +(options.shardCount || this.shardCount);
        if (Array.isArray(options.shards)) {
            if (options.shards.length !== 2) {
                throw new Error('Shards need to be in the format of [shardStart, shardEnd]');
            }
            const [shardStart, shardEnd] = options.shards;
            this.shardEnd = +shardEnd;
            this.shardStart = +shardStart;
        }
        Object.assign(this.shardOptions, options);
        this.shardOptions.isBot = true;
        this.shardOptions.rest = Object.assign({}, this.shardOptions.rest);
        this.shardOptions.rest.authType = constants_1.AuthTypes.BOT;
        this.rest = new iris_client_rest_1.Client(token, this.shardOptions.rest);
        this.shardOptions.rest.globalBucket = this.rest.globalBucket;
        this.shardOptions.rest.routesCollection = this.rest.routes;
        this.shardOptions.pass = Object.assign({}, this.shardOptions.pass);
        this.shardOptions.pass.cluster = this;
        if (this.shardOptions.pass.commandClient !== undefined) {
            this.commandClient = this.shardOptions.pass.commandClient;
        }
        if (isUsingClusterManager) {
            this.manager = new processchild_1.ClusterProcessChild(this);
        }
        Object.defineProperties(this, {
            commandClient: { configurable: true, enumerable: false, writable: false },
            manager: { configurable: false, writable: false },
            ran: { configurable: true, writable: false },
            rest: { enumerable: false, writable: false },
            shardCount: { writable: false },
            shardEnd: { configurable: true, writable: false },
            shardStart: { configurable: true, writable: false },
            shards: { writable: false },
            shardOptions: { enumerable: false, writable: false },
            token: { enumerable: false, writable: false },
        });
    }
    setShardCount(value) {
        Object.defineProperty(this, 'shardCount', { value });
    }
    setShardEnd(value) {
        Object.defineProperty(this, 'shardEnd', { value });
    }
    setShardStart(value) {
        Object.defineProperty(this, 'shardStart', { value });
    }
    /** @hidden */
    _eval(code) {
        return eval(code);
    }
    kill(error) {
        for (let [shardId, shard] of this.shards) {
            shard.kill(error);
        }
        this.shards.clear();
        Object.defineProperty(this, 'ran', { value: false });
        this.emit(constants_1.ClientEvents.KILLED, { error });
        this.removeAllListeners();
    }
    hookedHasEventListener(shard, name) {
        return super.hasEventListener(name) || super.hasEventListener.call(shard, name);
    }
    hookedEmit(shard, name, event) {
        if (name !== constants_1.ClientEvents.READY) {
            if (this.hasEventListener(name)) {
                const clusterEvent = Object.assign({}, event, { shard });
                this.emit(name, clusterEvent);
            }
        }
        return super.emit.call(shard, name, event);
    }
    async fillApplications() {
        const refresh = this._refresh.applications;
        if (Date.now() - refresh.last < refresh.time) {
            return;
        }
        const firstShard = this.shards.first();
        const enabled = (firstShard) ? firstShard.applications.enabled : false;
        if (enabled) {
            const applications = await this.rest.fetchApplicationsDetectable();
            refresh.last = Date.now();
            for (let [shardId, shard] of this.shards) {
                shard.applications.fill(applications);
            }
        }
    }
    async fillOauth2Application() {
        const refresh = this._refresh.oauth2Application;
        if (Date.now() - refresh.last < refresh.time) {
            return;
        }
        const data = await this.rest.fetchOauth2Application();
        refresh.last = Date.now();
        for (let [shardId, shard] of this.shards) {
            shard._mergeOauth2Application(data);
        }
    }
    async run(options = {}) {
        if (this.ran) {
            return this;
        }
        options = Object.assign({
            delay: constants_1.DEFAULT_SHARD_LAUNCH_DELAY,
            url: process.env.GATEWAY_URL,
        }, options, {
            wait: false,
        });
        const delay = +options.delay;
        let maxConcurrency = +(options.maxConcurrency || this.maxConcurrency);
        let shardCount = options.shardCount || this.shardCount || 0;
        if (options.url === undefined || !shardCount || !maxConcurrency) {
            const data = await this.rest.fetchGatewayBot();
            maxConcurrency = data.session_start_limit.max_concurrency;
            shardCount = shardCount || data.shards;
            options.url = options.url || data.url;
        }
        if (!shardCount) {
            throw new Error('Shard Count cannot be 0, pass in one via the options or the constructor.');
        }
        this.maxConcurrency = maxConcurrency;
        this.setShardCount(shardCount);
        if (this.shardEnd === -1) {
            this.setShardEnd(shardCount - 1);
        }
        for (let shardId = this.shardStart; shardId <= this.shardEnd; shardId++) {
            const ratelimitKey = this.getRatelimitKey(shardId);
            if (!this.buckets.has(ratelimitKey)) {
                const bucket = new bucket_1.Bucket(1, delay, true);
                this.buckets.set(ratelimitKey, bucket);
            }
            const shardOptions = Object.assign({}, this.shardOptions);
            shardOptions.gateway = Object.assign({}, shardOptions.gateway, { shardCount, shardId });
            if (this.commandClient) {
                shardOptions.pass = Object.assign({}, shardOptions.pass);
                shardOptions.pass.commandClient = this.commandClient;
            }
            const shard = new client_1.ShardClient(this.token, shardOptions);
            Object.defineProperties(shard, {
                hasEventListener: { value: this.hookedHasEventListener.bind(this, shard) },
                emit: { value: this.hookedEmit.bind(this, shard) },
            });
            this.shards.set(shardId, shard);
            if (!this.manager) {
                shard.gateway.on('state', ({ state }) => {
                    switch (state) {
                        case constants_1.SocketStates.READY:
                            {
                                const waiting = this._shardsWaiting.get(shardId);
                                if (waiting) {
                                    waiting.resolve();
                                }
                                this._shardsWaiting.delete(shardId);
                            }
                            ;
                            break;
                    }
                });
                shard.gateway.onIdentifyCheck = () => {
                    const bucket = this.buckets.get(ratelimitKey);
                    if (bucket) {
                        bucket.add(() => {
                            shard.gateway.identify();
                            return new Promise((resolve, reject) => {
                                const waiting = this._shardsWaiting.get(shardId);
                                if (waiting) {
                                    waiting.reject(new Error('Received new Identify Request with same shard id, unknown why'));
                                }
                                this._shardsWaiting.set(shardId, { resolve, reject });
                            });
                        });
                    }
                    return false;
                };
            }
            this.emit(constants_1.ClientEvents.SHARD, { shard });
        }
        await this.fillApplications();
        await this.fillOauth2Application();
        for (let [shardId, shard] of this.shards) {
            await shard.run(options);
        }
        Object.defineProperty(this, 'ran', { value: true });
        this.emit(constants_1.ClientEvents.READY);
        return this;
    }
    getRatelimitKey(shardId) {
        return shardId % this.maxConcurrency;
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
exports.ClusterClient = ClusterClient;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterManager = void 0;
const path = require("path");
const iris_client_rest_1 = require("../Iris-Client-Rest");
const iris_utils_1 = require("../Iris-Utils");
const bucket_1 = require("./bucket");
const process_1 = require("./cluster/process");
const basecollection_1 = require("./collections/basecollection");
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
class ClusterManager extends iris_utils_1.EventSpewer {
    constructor(file, token, options = {}) {
        super();
        this.buckets = new basecollection_1.BaseCollection();
        this.maxConcurrency = 1;
        this.processes = new basecollection_1.BaseCollection();
        this.ran = false;
        this.respawn = true;
        this.shardCount = 0;
        this.shardEnd = -1;
        this.shardStart = 0;
        this.shardsPerCluster = 4;
        this.file = file;
        if (!options.isAbsolute) {
            if (require.main) {
                this.file = path.join(path.dirname(require.main.filename), this.file);
            }
        }
        if (!token) {
            throw new Error('Token is required for this library to work.');
        }
        this.token = token;
        this.maxConcurrency = options.maxConcurrency || this.maxConcurrency;
        this.respawn = (options.respawn || options.respawn === undefined);
        this.rest = new iris_client_rest_1.Client(token, { authType: constants_1.AuthTypes.BOT });
        this.shardCount = +(options.shardCount || this.shardCount);
        if (Array.isArray(options.shards)) {
            if (options.shards.length !== 2) {
                throw new Error('Shards need to be in the format of [shardStart, shardEnd]');
            }
            const [shardStart, shardEnd] = options.shards;
            this.shardEnd = +shardEnd;
            this.shardStart = +shardStart;
        }
        this.shardsPerCluster = +(options.shardsPerCluster || this.shardsPerCluster);
        Object.defineProperties(this, {
            ran: { configurable: true, writable: false },
            rest: { enumerable: false, writable: false },
            token: { enumerable: false, writable: false },
        });
        process.env.CLUSTER_MANAGER = String(true);
        process.env.CLUSTER_TOKEN = this.token;
    }
    get clusterCount() {
        return Math.ceil(this.shardCount / this.shardsPerCluster);
    }
    async run(options = {}) {
        if (this.ran) {
            return this;
        }
        options = Object.assign({
            delay: constants_1.DEFAULT_SHARD_LAUNCH_DELAY,
        }, options);
        const delay = +options.delay;
        let maxConcurrency = +(options.maxConcurrency || this.maxConcurrency);
        let shardCount = +(options.shardCount || this.shardCount || 0);
        let url = options.url || '';
        if (!url || !shardCount || !maxConcurrency) {
            const data = await this.rest.fetchGatewayBot();
            maxConcurrency = data.session_start_limit.max_concurrency;
            shardCount = shardCount || data.shards;
            url = url || data.url;
        }
        if (!shardCount) {
            throw new Error('Shard Count cannot be 0, pass in one via the options or the constructor.');
        }
        this.maxConcurrency = maxConcurrency;
        this.shardCount = shardCount;
        if (this.shardEnd === -1) {
            this.shardEnd = shardCount - 1;
        }
        this.buckets.clear();
        for (let ratelimitKey = 0; ratelimitKey < maxConcurrency; ratelimitKey++) {
            const bucket = new bucket_1.Bucket(1, delay, true);
            this.buckets.set(ratelimitKey, bucket);
        }
        // now use these buckets whenever we identify
        let clusterId = 0;
        for (let shardStart = this.shardStart; shardStart <= this.shardEnd; shardStart += this.shardsPerCluster) {
            shardStart = Math.min(shardStart, this.shardEnd);
            const shardEnd = Math.min(shardStart + this.shardsPerCluster - 1, this.shardEnd);
            const clusterProcess = new process_1.ClusterProcess(this, {
                clusterId,
                env: {
                    GATEWAY_URL: url,
                    MAX_CONCURRENCY: String(maxConcurrency),
                },
                shardCount,
                shardEnd,
                shardStart,
            });
            this.processes.set(clusterId, clusterProcess);
            this.emit(constants_1.ClientEvents.CLUSTER_PROCESS, { clusterProcess });
            await clusterProcess.run();
            clusterId++;
        }
        Object.defineProperty(this, 'ran', { value: true });
        return this;
    }
    async broadcast(message) {
        const promises = this.processes.map((clusterProcess) => {
            return clusterProcess.send(message);
        });
        return Promise.all(promises);
    }
    async broadcastEvalRaw(code, nonce = utils_1.Snowflake.generate().id) {
        const promises = this.processes.map((clusterProcess) => {
            return clusterProcess.eval(code, nonce);
        });
        const results = await Promise.all(promises);
        return results.filter((item) => item);
    }
    async broadcastEval(code, nonce = utils_1.Snowflake.generate().id) {
        const results = await this.broadcastEvalRaw(code, nonce);
        return results.map(([result, isError]) => {
            if (isError) {
                return new errors_1.ClusterIPCError(result);
            }
            return result;
        });
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
exports.ClusterManager = ClusterManager;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterProcess = void 0;
const child_process_1 = require("child_process");
const iris_utils_1 = require("../../Iris-Utils");
const basecollection_1 = require("../collections/basecollection");
const constants_1 = require("../constants");
class ClusterProcess extends iris_utils_1.EventSpewer {
    constructor(manager, options) {
        super();
        this._evalsWaiting = new basecollection_1.BaseCollection();
        this._shardsWaiting = new basecollection_1.BaseCollection();
        this.clusterId = -1;
        this.env = {};
        this.process = null;
        this.manager = manager;
        this.clusterId = options.clusterId;
        Object.assign(this.env, process.env, options.env, {
            CLUSTER_COUNT: String(this.manager.clusterCount),
            CLUSTER_ID: String(this.clusterId),
            CLUSTER_SHARD_COUNT: String(options.shardCount),
            CLUSTER_SHARD_END: String(options.shardEnd),
            CLUSTER_SHARD_START: String(options.shardStart),
        });
        Object.defineProperties(this, {
            clusterId: { writable: false },
            manager: { enumerable: false, writable: false },
        });
    }
    get file() {
        return this.manager.file;
    }
    async onMessage(message) {
        // our child has sent us something
        if (message && typeof (message) === 'object') {
            try {
                switch (message.op) {
                    case constants_1.ClusterIPCOpCodes.CLOSE:
                        {
                            const data = message.data;
                            this.emit('shardClose', data);
                        }
                        ;
                        return;
                    case constants_1.ClusterIPCOpCodes.EVAL:
                        {
                            if (message.request) {
                                const data = message.data;
                                try {
                                    const results = await this.manager.broadcastEvalRaw(data.code, data.nonce);
                                    await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, {
                                        ...data,
                                        results,
                                    });
                                }
                                catch (error) {
                                    await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, {
                                        ...data,
                                        error: {
                                            message: error.message,
                                            name: error.name,
                                            stack: error.stack,
                                        },
                                    });
                                }
                            }
                        }
                        ;
                        return;
                    case constants_1.ClusterIPCOpCodes.IDENTIFY_REQUEST:
                        {
                            const { shardId } = message.data;
                            const ratelimitKey = this.manager.getRatelimitKey(shardId);
                            const bucket = this.manager.buckets.get(ratelimitKey);
                            if (bucket) {
                                bucket.add(() => {
                                    return new Promise(async (resolve, reject) => {
                                        await this.sendIPC(constants_1.ClusterIPCOpCodes.IDENTIFY_REQUEST, { shardId });
                                        const waiting = this._shardsWaiting.get(shardId);
                                        if (waiting) {
                                            const error = new Error('Received new Identify Request with same shard id, unknown why');
                                            waiting.reject(error);
                                            this.emit('warn', { error });
                                        }
                                        this._shardsWaiting.set(shardId, { resolve, reject });
                                    });
                                });
                            }
                        }
                        ;
                        return;
                    case constants_1.ClusterIPCOpCodes.READY:
                        {
                            this.emit('ready');
                        }
                        ;
                        return;
                    case constants_1.ClusterIPCOpCodes.RESPAWN_ALL:
                        {
                        }
                        ;
                        return;
                    case constants_1.ClusterIPCOpCodes.SHARD_STATE:
                        {
                            const data = message.data;
                            switch (data.state) {
                                case constants_1.SocketStates.READY:
                                    {
                                        const waiting = this._shardsWaiting.get(data.shardId);
                                        if (waiting) {
                                            waiting.resolve();
                                        }
                                        this._shardsWaiting.delete(data.shardId);
                                    }
                                    ;
                                    break;
                            }
                            this.emit('shardState', data);
                        }
                        ;
                        return;
                }
            }
            catch (error) {
                this.emit('warn', { error });
            }
        }
        this.emit('message', message);
    }
    async onExit(code, signal) {
        this.emit('close', { code, signal });
        Object.defineProperty(this, 'ran', { value: false });
        this.process = null;
        const error = new Error(`Process has closed with '${code}' code and '${signal}' signal.`);
        for (let [nonce, item] of this._evalsWaiting) {
            item.resolve([error, true]);
            this._evalsWaiting.delete(nonce);
        }
        for (let [shardId, item] of this._shardsWaiting) {
            item.reject(error);
            this._shardsWaiting.delete(shardId);
        }
        if (this.manager.respawn) {
            try {
                await this.run();
            }
            catch (error) {
                this.emit('warn', { error });
            }
        }
    }
    async eval(code, nonce) {
        if (this.process === null) {
            throw new Error('Cannot eval without a child!');
        }
        if (this._evalsWaiting.has(nonce)) {
            return this._evalsWaiting.get(nonce).promise;
        }
        // incase the process dies
        const child = this.process;
        return new Promise((resolve, reject) => {
            const promise = new Promise(async (res, rej) => {
                const listener = (message) => {
                    if (message && typeof (message) === 'object') {
                        switch (message.op) {
                            case constants_1.ClusterIPCOpCodes.EVAL:
                                {
                                    const data = message.data;
                                    if (data.nonce === nonce) {
                                        child.removeListener('message', listener);
                                        this._evalsWaiting.delete(nonce);
                                        if (data.ignored) {
                                            res(null);
                                        }
                                        else {
                                            if (data.error) {
                                                res([data.error, true]);
                                            }
                                            else {
                                                res([data.result, false]);
                                            }
                                        }
                                    }
                                }
                                ;
                                break;
                        }
                    }
                };
                child.addListener('message', listener);
                if (typeof (code) === 'function') {
                    code = `(${String(code)})(this)`;
                }
                try {
                    await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, { code, nonce }, true);
                }
                catch (error) {
                    child.removeListener('message', listener);
                    rej(error);
                }
            });
            this._evalsWaiting.set(nonce, { promise, resolve, reject });
            promise.then(resolve).catch(reject);
        });
    }
    async send(message) {
        if (this.process != null) {
            const child = this.process;
            await new Promise((resolve, reject) => {
                child.send(message, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
    async sendIPC(op, data = null, request = false, shard) {
        return this.send({ op, data, request, shard });
    }
    async run(options = {}) {
        if (this.process) {
            return this.process;
        }
        const process = child_process_1.fork(this.file, [], { env: this.env });
        this.process = process;
        this.process.on('message', this.onMessage.bind(this));
        this.process.on('exit', this.onExit.bind(this));
        if (options.wait || options.wait === undefined) {
            return new Promise((resolve, reject) => {
                const timeout = new iris_utils_1.Timers.Timeout();
                if (options.timeout) {
                    timeout.start(options.timeout, () => {
                        if (this.process === process) {
                            this.process.kill();
                            this.process = null;
                        }
                        reject(new Error('Cluster Child took too long to ready up'));
                    });
                }
                this.once('ready', () => {
                    timeout.stop();
                    resolve(process);
                });
            });
        }
        return process;
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.ClusterProcess = ClusterProcess;

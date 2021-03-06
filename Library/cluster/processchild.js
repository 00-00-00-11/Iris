"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterProcessChild = void 0;
const iris_utils_1 = require("../../Iris-Utils");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
class ClusterProcessChild extends iris_utils_1.EventSpewer {
    constructor(cluster) {
        super();
        this._shardsIdentifying = new baseset_1.BaseSet();
        this.clusterCount = 1;
        this.clusterId = -1;
        this.cluster = cluster;
        this.clusterCount = +(process.env.CLUSTER_COUNT || this.clusterCount);
        this.clusterId = +(process.env.CLUSTER_ID || this.clusterId);
        process.on('message', this.onMessage.bind(this));
        process.on('message', this.emit.bind(this, 'ipc'));
        this.cluster.on('ready', () => this.sendIPC(constants_1.ClusterIPCOpCodes.READY));
        this.cluster.on('shard', ({ shard }) => {
            shard.gateway.on('state', async ({ state }) => {
                const { shardId } = shard;
                if (state === constants_1.SocketStates.READY) {
                    this._shardsIdentifying.delete(shardId);
                }
                const data = { shardId, state };
                await this.sendIPCOrWarn(constants_1.ClusterIPCOpCodes.SHARD_STATE, data, false);
            });
            shard.gateway.on('close', async (payload) => {
                const data = {
                    ...payload,
                    shardId: shard.shardId,
                };
                await this.sendIPCOrWarn(constants_1.ClusterIPCOpCodes.CLOSE, data, false);
            });
            shard.gateway.onIdentifyCheck = async () => {
                const { shardId } = shard;
                if (this._shardsIdentifying.has(shardId)) {
                    return true;
                }
                else {
                    await this.sendIPC(constants_1.ClusterIPCOpCodes.IDENTIFY_REQUEST, { shardId: shard.shardId });
                }
                return false;
            };
        });
        Object.defineProperties(this, {
            cluster: { enumerable: false, writable: false },
            clusterId: { writable: false },
        });
    }
    async onMessage(message) {
        if (!message || typeof (message) !== 'object') {
            return;
        }
        try {
            switch (message.op) {
                case constants_1.ClusterIPCOpCodes.EVAL:
                    {
                        if (message.request) {
                            // we received a request to eval from the parent
                            const data = message.data;
                            if (message.shard != null && !this.cluster.shards.has(message.shard)) {
                                await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, {
                                    ...data,
                                    ignored: true,
                                });
                            }
                            else {
                                try {
                                    const result = await Promise.resolve(this.cluster._eval(data.code));
                                    await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, {
                                        ...data,
                                        result,
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
                    }
                    ;
                    return;
                case constants_1.ClusterIPCOpCodes.IDENTIFY_REQUEST:
                    {
                        // we received an ok to identify
                        const { shardId } = message.data;
                        const shard = this.cluster.shards.get(shardId);
                        if (shard) {
                            this._shardsIdentifying.add(shardId);
                            shard.gateway.identify();
                        }
                    }
                    ;
                    return;
            }
        }
        catch (error) {
            const payload = { error };
            this.cluster.emit(constants_1.ClientEvents.WARN, payload);
        }
    }
    async send(message) {
        const parent = process;
        return new Promise((resolve, reject) => {
            parent.send(message, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async sendIPC(op, data = null, request = false, shard) {
        return this.send({ op, data, request, shard });
    }
    async sendIPCOrWarn(op, data = null, request = false, shard) {
        try {
            await this.sendIPC(op, data, request, shard);
        }
        catch (error) {
            const payload = { error };
            this.cluster.emit(constants_1.ClientEvents.WARN, payload);
        }
    }
    async broadcastEval(code, ...args) {
        const parent = process;
        const nonce = utils_1.Snowflake.generate().id;
        return new Promise(async (resolve, reject) => {
            const listener = (message) => {
                if (message && typeof (message) === 'object') {
                    if (message.request) {
                        return;
                    }
                    switch (message.op) {
                        case constants_1.ClusterIPCOpCodes.EVAL:
                            {
                                const data = message.data;
                                if (data.nonce === nonce) {
                                    parent.removeListener('message', listener);
                                    if (data.error) {
                                        reject(new errors_1.ClusterIPCError(data.error));
                                    }
                                    else {
                                        const results = (data.results || []).map(([result, isError]) => {
                                            if (isError) {
                                                return new errors_1.ClusterIPCError(result);
                                            }
                                            return result;
                                        });
                                        resolve(results);
                                    }
                                }
                            }
                            ;
                            break;
                    }
                }
            };
            parent.addListener('message', listener);
            if (typeof (code) === 'function') {
                const evalArgs = ['this'];
                for (let arg of args) {
                    switch (typeof (arg)) {
                        case 'boolean':
                        case 'number':
                            {
                                evalArgs.push(`${arg}`);
                            }
                            ;
                            break;
                        default:
                            {
                                evalArgs.push(`"${arg}"`);
                            }
                            ;
                    }
                }
                code = `(${String(code)})(${evalArgs.join(', ')})`;
            }
            try {
                await this.sendIPC(constants_1.ClusterIPCOpCodes.EVAL, { code, nonce }, true);
            }
            catch (error) {
                parent.removeListener('message', listener);
                reject(error);
            }
        });
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.ClusterProcessChild = ClusterProcessChild;

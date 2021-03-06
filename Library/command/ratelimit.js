"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRatelimit = void 0;
const iris_utils_1 = require("../../Iris-Utils");
const basecollection_1 = require("../collections/basecollection");
const constants_1 = require("../constants");
/**
 * Command Ratelimit Options and Cache
 * @category Command
 */
class CommandRatelimit {
    constructor(options = {}) {
        this.cache = new basecollection_1.BaseCollection();
        this.duration = 5000;
        this.limit = 5;
        this.type = constants_1.CommandRatelimitTypes.USER;
        options = Object.assign({}, options);
        this.duration = options.duration || this.duration;
        this.limit = options.limit || this.limit;
        if (options.type) {
            this.type = options.type.toLowerCase();
        }
        if (!constants_1.COMMAND_RATELIMIT_TYPES.includes(this.type)) {
            this.type = constants_1.CommandRatelimitTypes.USER;
        }
        Object.defineProperties(this, {
            cache: { enumerable: false, writable: false },
            command: { enumerable: false, writable: false },
        });
    }
    get(cacheId) {
        let ratelimit;
        if (this.cache.has(cacheId)) {
            ratelimit = this.cache.get(cacheId);
        }
        else {
            const timeout = new iris_utils_1.Timers.Timeout();
            timeout.start(this.duration, () => {
                this.cache.delete(cacheId);
            });
            ratelimit = {
                replied: false,
                start: Date.now(),
                timeout,
                usages: 0,
            };
            this.cache.set(cacheId, ratelimit);
        }
        return ratelimit;
    }
}
exports.CommandRatelimit = CommandRatelimit;

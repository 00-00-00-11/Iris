"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyBaseCollection = exports.EmptyBaseCollection = exports.BaseClientGuildReferenceCache = exports.BaseClientCollectionCache = exports.BaseClientCollection = exports.BaseCollectionCache = exports.BaseCollection = void 0;
const iris_utils_1 = require("../../Iris-Utils");
Object.defineProperty(exports, "BaseCollection", { enumerable: true, get: function () { return iris_utils_1.BaseCollection; } });
class BaseCollectionCache extends iris_utils_1.BaseCollectionMixin {
    constructor(options) {
        super();
        this.caches = new iris_utils_1.BaseCollection();
        this.options = {};
        Object.assign(this.options, options);
        Object.defineProperties(this, {
            caches: { enumerable: false },
            options: { enumerable: false },
        });
    }
    get size() {
        let size = 0;
        for (let [cacheKey, cache] of this.caches) {
            size += cache.size;
        }
        return size;
    }
    clear() {
        for (let [cacheKey, cache] of this.caches) {
            cache.clear();
        }
        return this.caches.clear();
    }
    delete(cacheKey, key) {
        if (cacheKey) {
            if (key) {
                const cache = this.caches.get(cacheKey);
                if (cache) {
                    return cache.delete(key);
                }
            }
            else {
                return this.caches.delete(cacheKey);
            }
        }
        else if (key) {
            let deleted = false;
            for (let [ck, cache] of this.caches) {
                if (cache.delete(key)) {
                    deleted = true;
                }
            }
            return deleted;
        }
        return false;
    }
    forEach(func, thisArg) {
        for (let [cacheKey, cache] of this.caches) {
            for (let [k, v] of cache) {
                func.call(thisArg, v, k, cache);
            }
        }
    }
    get(cacheKey, key) {
        if (cacheKey) {
            const cache = this.caches.get(cacheKey);
            if (key) {
                if (cache) {
                    return cache.get(key);
                }
            }
            else {
                return cache;
            }
        }
        else if (key) {
            for (let [ck, cache] of this.caches) {
                if (cache.has(key)) {
                    return cache.get(key);
                }
            }
        }
        return undefined;
    }
    has(cacheKey, key) {
        if (cacheKey) {
            if (key) {
                const cache = this.caches.get(cacheKey);
                if (cache) {
                    return cache.has(key);
                }
            }
            else {
                return this.caches.has(cacheKey);
            }
        }
        else if (key) {
            for (let [ck, cache] of this.caches) {
                if (cache.has(key)) {
                    return true;
                }
            }
        }
        return false;
    }
    insertCache(cacheKey) {
        let cache = this.caches.get(cacheKey);
        if (!cache) {
            cache = new iris_utils_1.BaseCollection(this.options);
            this.caches.set(cacheKey, cache);
        }
        return cache;
    }
    set(cacheKey, key, value) {
        const cache = this.insertCache(cacheKey);
        cache.set(key, value);
        return this;
    }
    *keys() {
        for (let cache of this.caches.values()) {
            for (let key of cache.keys()) {
                yield key;
            }
        }
    }
    *values() {
        for (let cache of this.caches.values()) {
            for (let value of cache.values()) {
                yield value;
            }
        }
    }
    *[Symbol.iterator]() {
        for (let [cacheKey, cache] of this.caches) {
            for (let [key, value] of cache) {
                yield [key, value];
            }
        }
    }
    get [Symbol.toStringTag]() {
        return `BaseCollectionCache (${this.caches.size.toLocaleString()} caches, ${this.size.toLocaleString()} items)`;
    }
}
exports.BaseCollectionCache = BaseCollectionCache;
/**
 * Basic Client Collection, the ShardClient instance is attached to this
 * @category Collections
 */
class BaseClientCollection extends iris_utils_1.BaseCollection {
    constructor(client, options = {}) {
        if (typeof (options) === 'boolean') {
            options = { enabled: options };
        }
        super(options);
        this.client = client;
        this.enabled = !!(options.enabled || options.enabled === undefined);
        Object.defineProperties(this, {
            client: { enumerable: false, writable: false },
            enabled: { configurable: true, writable: false },
        });
    }
    setEnabled(value) {
        Object.defineProperty(this, 'enabled', { value });
    }
}
exports.BaseClientCollection = BaseClientCollection;
/**
 * Basic Client Cache Collection, the ShardClient instance is attached to this
 * @category Collections
 */
class BaseClientCollectionCache extends BaseCollectionCache {
    constructor(client, options = {}) {
        super(options);
        this.client = client;
        this.enabled = !!(options.enabled || options.enabled === undefined);
        Object.defineProperties(this, {
            client: { enumerable: false, writable: false },
            enabled: { configurable: true, writable: false },
        });
    }
    setEnabled(value) {
        Object.defineProperty(this, 'enabled', { value });
    }
}
exports.BaseClientCollectionCache = BaseClientCollectionCache;
class BaseClientGuildReferenceCache extends iris_utils_1.BaseCollectionMixin {
    constructor(client, options = {}) {
        super();
        this.key = '';
        this.options = {};
        Object.assign(this.options, options);
        this.client = client;
        this.enabled = !!(options.enabled || options.enabled === undefined);
        Object.defineProperties(this, {
            client: { enumerable: false, writable: false },
            enabled: { configurable: true, writable: false },
            options: { enumerable: false },
        });
    }
    get guilds() {
        return this.client.guilds;
    }
    get size() {
        let size = 0;
        for (let [guildId, guild] of this.guilds) {
            const cache = guild[this.key];
            size += cache.size;
        }
        return size;
    }
    setEnabled(value) {
        Object.defineProperty(this, 'enabled', { value });
    }
    clear() {
        for (let [guildId, guild] of this.guilds) {
            const cache = guild[this.key];
            cache.clear();
        }
    }
    delete(guildId, key) {
        if (guildId && key) {
            const guild = this.guilds.get(guildId);
            if (guild) {
                const cache = guild[this.key];
                return cache.delete(key);
            }
        }
        else if (key) {
            let deleted = false;
            for (let [guildId, guild] of this.guilds) {
                const cache = guild[this.key];
                if (cache.delete(key)) {
                    deleted = true;
                }
            }
            return deleted;
        }
        return false;
    }
    forEach(func, thisArg) {
        for (let [guildId, guild] of this.guilds) {
            const cache = guild[this.key];
            for (let [k, v] of cache) {
                func.call(thisArg, v, k, cache);
            }
        }
    }
    get(guildId, key) {
        if (guildId && key) {
            const guild = this.guilds.get(guildId);
            if (guild) {
                const cache = guild[this.key];
                return cache.get(key);
            }
        }
        else if (key) {
            for (let [guildId, guild] of this.guilds) {
                const cache = guild[this.key];
                if (cache.has(key)) {
                    return cache.get(key);
                }
            }
        }
        return undefined;
    }
    has(guildId, key) {
        if (guildId && key) {
            const guild = this.guilds.get(guildId);
            if (guild) {
                const cache = guild[this.key];
                return cache.has(key);
            }
        }
        else if (key) {
            for (let [guildId, guild] of this.guilds) {
                const cache = guild[this.key];
                if (cache.has(key)) {
                    return true;
                }
            }
        }
        return false;
    }
    set(guildId, key, value) {
        const guild = this.guilds.get(guildId);
        if (guild) {
            const cache = guild[this.key];
            cache.set(key, value);
        }
        return this;
    }
    *keys() {
        for (let guild of this.guilds.values()) {
            const cache = guild[this.key];
            for (let key of cache.keys()) {
                yield key;
            }
        }
    }
    *values() {
        for (let guild of this.guilds.values()) {
            const cache = guild[this.key];
            for (let value of cache.values()) {
                yield value;
            }
        }
    }
    *[Symbol.iterator]() {
        for (let [guildId, guild] of this.guilds) {
            const cache = guild[this.key];
            for (let [key, value] of cache) {
                yield [key, value];
            }
        }
    }
    get [Symbol.toStringTag]() {
        return `BaseGuildReferenceCache (${this.guilds.size.toLocaleString()} guilds, ${this.size.toLocaleString()} items)`;
    }
}
exports.BaseClientGuildReferenceCache = BaseClientGuildReferenceCache;
class EmptyBaseCollection extends iris_utils_1.BaseCollection {
    delete() {
        return false;
    }
    has() {
        return false;
    }
    set() {
        return this;
    }
    get() {
        return undefined;
    }
}
exports.EmptyBaseCollection = EmptyBaseCollection;
const emptyBaseCollection = new EmptyBaseCollection();
exports.emptyBaseCollection = emptyBaseCollection;
Object.freeze(emptyBaseCollection);

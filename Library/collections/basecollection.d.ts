import { BaseCollection, BaseCollectionMixin, BaseCollectionOptions } from '../../Iris-Utils';
import { ShardClient } from '../client';
export { BaseCollection, BaseCollectionOptions, };
export declare class BaseCollectionCache<K, V> extends BaseCollectionMixin<K, V> {
    readonly caches: BaseCollection<K, BaseCollection<K, V>>;
    readonly options: BaseCollectionOptions;
    constructor(options?: BaseCollectionOptions);
    get size(): number;
    clear(): void;
    delete(cacheKey: K): boolean;
    delete(cacheKey: K | null | undefined, key: K): boolean;
    forEach(func: (v: V, k: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(cacheKey: K): BaseCollection<K, V> | undefined;
    get(cacheKey: K | null | undefined, key: K): V | undefined;
    has(cacheKey: K): boolean;
    has(cacheKey: K | null | undefined, key: K): boolean;
    insertCache(cacheKey: K): BaseCollection<K, V>;
    set(cacheKey: K, key: K, value: V): this;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    get [Symbol.toStringTag](): string;
}
export interface BaseClientCollectionOptions extends BaseCollectionOptions {
    enabled?: boolean;
}
/**
 * Basic Client Collection, the ShardClient instance is attached to this
 * @category Collections
 */
export declare class BaseClientCollection<K, V> extends BaseCollection<K, V> {
    client: ShardClient;
    enabled: boolean;
    constructor(client: ShardClient, options?: BaseClientCollectionOptions | boolean);
    setEnabled(value: boolean): void;
}
/**
 * Basic Client Cache Collection, the ShardClient instance is attached to this
 * @category Collections
 */
export declare class BaseClientCollectionCache<K, V> extends BaseCollectionCache<K, V> {
    client: ShardClient;
    enabled: boolean;
    constructor(client: ShardClient, options?: BaseClientCollectionOptions);
    setEnabled(value: boolean): void;
}
export declare class BaseClientGuildReferenceCache<K, V> extends BaseCollectionMixin<K, V> {
    client: ShardClient;
    enabled: boolean;
    key: string;
    options: BaseCollectionOptions;
    constructor(client: ShardClient, options?: BaseClientCollectionOptions);
    get guilds(): import("./guilds").Guilds;
    get size(): number;
    setEnabled(value: boolean): void;
    clear(): void;
    delete(guildId: K | null | undefined, key: K): boolean;
    forEach(func: (v: V, k: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(guildId: K | null | undefined, key: K): V | undefined;
    has(guildId: K | null | undefined, key: K): boolean;
    set(guildId: K, key: K, value: V): this;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    get [Symbol.toStringTag](): string;
}
export declare class EmptyBaseCollection extends BaseCollection<any, any> {
    delete(): boolean;
    has(): boolean;
    set(): this;
    get(): any;
}
declare const emptyBaseCollection: EmptyBaseCollection;
export { emptyBaseCollection };

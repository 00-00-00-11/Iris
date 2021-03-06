import { Client as DetritusRestClient } from '../Iris-Client-Rest';
import { EventSpewer, EventSubscription } from '../Iris-Utils';
import { Bucket } from './bucket';
import { ClusterProcess } from './cluster/process';
import { BaseCollection } from './collections/basecollection';
import { ClientEvents } from './constants';
export interface ClusterManagerOptions {
    isAbsolute?: boolean;
    maxConcurrency?: number;
    respawn?: boolean;
    shardCount?: number;
    shards?: [number, number];
    shardsPerCluster?: number;
}
export interface ClusterManagerRunOptions {
    delay?: number;
    maxConcurrency?: number;
    shardCount?: number;
    url?: string;
}
export declare class ClusterManager extends EventSpewer {
    buckets: BaseCollection<number, Bucket>;
    file: string;
    maxConcurrency: number;
    processes: BaseCollection<number, ClusterProcess>;
    ran: boolean;
    respawn: boolean;
    rest: DetritusRestClient;
    shardCount: number;
    shardEnd: number;
    shardStart: number;
    shardsPerCluster: number;
    token: string;
    constructor(file: string, token: string, options?: ClusterManagerOptions);
    get clusterCount(): number;
    run(options?: ClusterManagerRunOptions): Promise<ClusterManager>;
    broadcast(message: any): Promise<Array<any>>;
    broadcastEvalRaw(code: Function | string, nonce?: string): Promise<Array<[any, boolean]>>;
    broadcastEval(code: Function | string, nonce?: string): Promise<Array<any>>;
    getRatelimitKey(shardId: number): number;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: ClientEvents.CLUSTER_PROCESS, listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): this;
    on(event: 'clusterProcess', listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: ClientEvents.CLUSTER_PROCESS, listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): this;
    once(event: 'clusterProcess', listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): this;
    subscribe(event: string | symbol, listener: (...args: any[]) => void): EventSubscription;
    subscribe(event: ClientEvents.CLUSTER_PROCESS, listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): EventSubscription;
    subscribe(event: 'clusterProcess', listener: (payload: {
        clusterProcess: ClusterProcess;
    }) => any): EventSubscription;
}

import { EventSpewer } from '../../Iris-Utils';
import { ClusterClient } from '../clusterclient';
import { BaseSet } from '../collections/baseset';
import { ClusterIPCTypes } from './ipctypes';
export declare class ClusterProcessChild extends EventSpewer {
    readonly _shardsIdentifying: BaseSet<number>;
    readonly cluster: ClusterClient;
    clusterCount: number;
    clusterId: number;
    constructor(cluster: ClusterClient);
    onMessage(message: ClusterIPCTypes.IPCMessage | any): Promise<void>;
    send(message: ClusterIPCTypes.IPCMessage | any): Promise<void>;
    sendIPC(op: number, data?: any, request?: boolean, shard?: number): Promise<void>;
    sendIPCOrWarn(op: number, data?: any, request?: boolean, shard?: number): Promise<void>;
    broadcastEval(code: Function | string, ...args: any[]): Promise<Array<any>>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'ipc', listener: (message: any) => any): this;
}

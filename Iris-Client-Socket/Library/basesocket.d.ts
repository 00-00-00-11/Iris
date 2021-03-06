import { BaseCollection, EventSpewer } from '../../Iris-Utils';
export declare enum DependencyTypes {
    UWS = "uws",
    WS = "ws"
}
export declare const WebsocketDependency: {
    module: any;
    type: null | DependencyTypes;
};
export declare class BaseSocket extends EventSpewer {
    readonly pings: BaseCollection<string, {
        reject: Function;
        resolve: Function;
    }>;
    socket: any;
    constructor(url: string);
    get closed(): boolean;
    get closing(): boolean;
    get connected(): boolean;
    get connecting(): boolean;
    get using(): DependencyTypes;
    send(data: any, callback?: Function): void;
    close(code?: number, reason?: string): void;
    onClose(code: number, message: string): void;
    onPong(data: any): void;
    ping(timeout?: number): Promise<number>;
    terminate(): any;
}

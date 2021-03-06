import { EventSpewer, Timers } from '../../Iris-Utils';
import { BaseSocket } from './basesocket';
import { Bucket } from './bucket';
import { MediaEncryptionModes, MediaProtocols, MediaSSRCTypes, SocketStates } from './constants';
import { Socket as GatewaySocket } from './gateway';
import { Socket as MediaUDPSocket } from './mediaudp';
import { MediaGatewayPackets } from './types';
export interface SocketOptions {
    channelId: string;
    forceMode?: MediaEncryptionModes | string;
    receive?: boolean;
    serverId: string;
    userId: string;
    video?: boolean;
}
export declare class Socket extends EventSpewer {
    readonly state: SocketStates;
    _heartbeat: {
        ack: boolean;
        lastAck: null | number;
        lastSent: null | number;
        interval: Timers.Interval;
        intervalTime: null | number;
        nonce: null | number;
    };
    bucket: Bucket;
    channelId: string;
    endpoint: null | string;
    forceMode: MediaEncryptionModes | null;
    gateway: GatewaySocket;
    identified: boolean;
    killed: boolean;
    promises: Set<{
        reject: Function;
        resolve: Function;
    }>;
    protocol: MediaProtocols | null;
    ready: boolean;
    receiveEnabled: boolean;
    reconnects: number;
    serverId: string;
    socket: BaseSocket | null;
    ssrcs: {
        audio: Map<number, string>;
        video: Map<number, string>;
    };
    transport: MediaUDPSocket | null;
    token: null | string;
    userId: string;
    videoEnabled: boolean;
    constructor(gateway: GatewaySocket, options: SocketOptions);
    get closed(): boolean;
    get closing(): boolean;
    get connected(): boolean;
    get connecting(): boolean;
    get guildId(): null | string;
    get inDm(): boolean;
    get sessionId(): null | string;
    get audioSSRC(): number;
    get videoSSRC(): number;
    get rtxSSRC(): number;
    resolvePromises(error?: any): void;
    setChannelId(value: string): void;
    setEndpoint(value: string): void;
    setProtocol(value: MediaProtocols): void;
    setState(value: SocketStates): void;
    setToken(value: string): void;
    ssrcToUserId(ssrc: number, type?: MediaSSRCTypes): null | string;
    userIdToSSRC(userId: string, type?: MediaSSRCTypes): null | number;
    cleanup(code?: number): void;
    connect(endpoint?: string): void;
    decode(data: any): any;
    disconnect(code?: number, reason?: string): void;
    encode(data: any): null | string;
    handle(data: any): void;
    kill(error?: any): void;
    onClose(target: BaseSocket, event: {
        code: number;
        reason: string;
    }): void;
    onError(target: BaseSocket, event: {
        error: any;
    } | any): void;
    onMessage(target: BaseSocket, event: {
        data: any;
        type: string;
    }): void;
    onOpen(target: BaseSocket): void;
    ping(timeout?: number): Promise<any>;
    send(op: number, d: any, callback?: Function, direct?: boolean): void;
    heartbeat(fromInterval?: boolean): void;
    setHeartbeat(data: MediaGatewayPackets.Hello): void;
    identify(): void;
    resume(): void;
    transportConnect(data: MediaGatewayPackets.Ready): void;
    sendClientConnect(callback?: Function): void;
    sendSelectProtocol(options: {
        codecs?: Array<any>;
        data: {
            address: string;
            port: number;
            mode: string;
        };
        experiments?: Array<any>;
        protocol?: MediaProtocols | string;
        rtcConnectionId?: string;
    }, callback?: Function): void;
    sendSpeaking(options: {
        delay?: number;
        ssrc?: number;
        soundshare?: boolean;
        voice?: boolean;
    }, callback?: Function): void;
    sendStateUpdate(options?: {
        selfDeaf?: boolean;
        selfMute?: boolean;
        selfVideo?: boolean;
    }, callback?: Function): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'close', listener: (payload: {
        code: number;
        reason: string;
    }) => any): this;
    on(event: 'killed', listener: () => any): this;
    on(event: 'open', listener: (target: BaseSocket) => any): this;
    on(event: 'packet', listener: (packet: MediaGatewayPackets.Packet) => any): this;
    on(event: 'ready', listener: () => any): this;
    on(event: 'socket', listener: (socket: BaseSocket) => any): this;
    on(event: 'state', listener: ({ state }: {
        state: SocketStates;
    }) => any): this;
    on(event: 'transport', listener: (transport: MediaUDPSocket) => any): this;
    on(event: 'transportReady', listener: (transport: MediaUDPSocket) => any): this;
    on(event: 'warn', listener: (error: Error) => any): this;
}

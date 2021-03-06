/// <reference types="node" />
import { URL } from 'url';
import { EventSpewer, BaseCollection, Timers } from '../../Iris-Utils';
import { BaseSocket } from './basesocket';
import { Bucket } from './bucket';
import { Decompressor } from './decompressor';
import { Socket as MediaSocket } from './media';
import { GatewayPackets } from './types';
import { CompressTypes, EncodingTypes, SocketStates } from './constants';
export interface SocketOptions {
    autoReconnect?: boolean;
    compress?: boolean | string;
    disabledEvents?: Array<string>;
    encoding?: string;
    guildSubscriptions?: boolean;
    identifyProperties?: IdentifyDataProperties;
    intents: Array<number> | Array<string> | string | number;
    largeThreshold?: number;
    presence?: PresenceOptions;
    reconnectDelay?: number;
    reconnectMax?: number;
    shardCount?: number;
    shardId?: number;
    onIdentifyCheck?: () => boolean | Promise<boolean>;
}
export declare class Socket extends EventSpewer {
    readonly state: SocketStates;
    _heartbeat: {
        ack: boolean;
        lastAck: null | number;
        lastSent: null | number;
        interval: Timers.Interval;
        intervalTime: null | number;
    };
    autoReconnect: boolean;
    bucket: Bucket;
    compress: CompressTypes;
    disabledEvents: Array<string>;
    discordTrace: Array<any>;
    decompressor: Decompressor | null;
    encoding: EncodingTypes;
    guildSubscriptions: boolean;
    identifyProperties: IdentifyDataProperties;
    intents: number;
    killed: boolean;
    largeThreshold: number;
    mediaGateways: BaseCollection<string, MediaSocket>;
    presence: PresenceOptions | null;
    reconnectDelay: number;
    reconnectMax: number;
    reconnects: number;
    resuming: boolean;
    sequence: number;
    sessionId: null | string;
    shardCount: number;
    shardId: number;
    socket: BaseSocket | null;
    token: string;
    url: URL | null;
    userId: null | string;
    onIdentifyCheck?(): boolean | Promise<boolean>;
    constructor(token: string, options?: SocketOptions);
    get closed(): boolean;
    get closing(): boolean;
    get connected(): boolean;
    get connecting(): boolean;
    setState(value: SocketStates): void;
    makePresence(options?: PresenceOptions): RawPresence;
    getIdentifyData(): IdentifyData;
    getResumeData(): ResumeData;
    cleanup(code?: string | number, reason?: string): void;
    connect(url?: null | string | URL): void;
    decode(data: any, uncompressed?: boolean): any;
    disconnect(code?: number, reason?: string): void;
    handle(data: any, uncompressed?: boolean): void;
    handleDispatch(name: string, data: any): void;
    kill(error?: Error): void;
    onClose(target: BaseSocket, code?: number, reason?: string): void;
    onError(target: BaseSocket, error: Error): void;
    onMessage(target: BaseSocket, data: any): void;
    onOpen(target: BaseSocket): void;
    ping(timeout?: number): Promise<any>;
    send(op: number, d: any, callback?: Function, direct?: boolean): void;
    heartbeat(fromInterval?: boolean): void;
    setHeartbeat(data: GatewayPackets.Hello): void;
    identify(): void;
    identifyTry(): Promise<void>;
    resume(): void;
    callConnect(channelId: string, callback?: Function): void;
    guildStreamCreate(guildId: string, options: {
        channelId: string;
        preferredRegion?: string;
    }, callback?: Function): void;
    lobbyConnect(lobbyId: string, lobbySecret: string, callback?: Function): void;
    lobbyDisconnect(lobbyId: string, callback?: Function): void;
    lobbyVoiceStatesUpdate(voiceStates: Array<{
        lobbyId: string;
        selfDeaf: boolean;
        selfMute: boolean;
    }>, callback?: Function): void;
    requestGuildMembers(guildIds: Array<string> | string, options: {
        limit: number;
        nonce?: string;
        presences?: boolean;
        query: string;
        userIds?: Array<string>;
    }, callback?: Function): void;
    requestApplicationCommands(guildId: string, options: {
        applicationId?: string;
        applications: boolean;
        limit?: number;
        nonce: string;
        offset?: number;
        query?: string;
    }): void;
    setPresence(options?: PresenceOptions, callback?: Function): void;
    streamDelete(streamKey: string, callback?: Function): void;
    streamPing(streamKey: string, callback?: Function): void;
    streamSetPaused(streamKey: string, paused: boolean, callback?: Function): void;
    streamWatch(streamKey: string, callback?: Function): void;
    syncGuild(guildIds: Array<string>, callback?: Function): void;
    updateGuildSubscriptions(guildId: string, options?: {
        activities?: boolean;
        channels?: {
            [channelId: string]: Array<[number, number]>;
        };
        members?: Array<string>;
        typing?: boolean;
    }, callback?: Function): void;
    voiceServerPing(callback?: Function): void;
    voiceStateUpdate(guildId?: null | string, channelId?: null | string, options?: {
        preferredRegion?: string;
        selfDeaf?: boolean;
        selfMute?: boolean;
        selfVideo?: boolean;
    }, callback?: Function): void;
    voiceConnect(guildId?: null | string, channelId?: null | string, options?: {
        forceMode?: string;
        receive?: boolean;
        selfDeaf?: boolean;
        selfMute?: boolean;
        selfVideo?: boolean;
        timeout?: number;
        video?: boolean;
    }): Promise<MediaSocket | null>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'close', listener: (payload: {
        code: number;
        reason: string;
    }) => any): this;
    on(event: 'killed', listener: () => any): this;
    on(event: 'open', listener: (target: BaseSocket) => any): this;
    on(event: 'packet', listener: (packet: GatewayPackets.Packet) => any): this;
    on(event: 'ready', listener: () => any): this;
    on(event: 'socket', listener: (socket: BaseSocket) => any): this;
    on(event: 'state', listener: ({ state }: {
        state: SocketStates;
    }) => any): this;
    on(event: 'warn', listener: (error: Error) => any): this;
}
export interface IdentifyData {
    compress?: boolean;
    guild_subscriptions?: boolean;
    intents?: number;
    large_threshold?: number;
    presence?: RawPresence;
    properties: IdentifyDataProperties;
    shard?: Array<number>;
    token: string;
}
export interface IdentifyDataProperties {
    $browser?: string;
    $device?: string;
    $os?: string;
    os?: string;
    browser?: string;
    browser_user_agent?: string;
    browser_version?: string;
    client_build_number?: number;
    client_event_source?: string;
    client_version?: string;
    distro?: string;
    os_version?: string;
    os_arch?: string;
    release_channel?: string;
    window_manager?: string;
}
export interface RawPresenceActivity {
    application_id?: string;
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
    details?: string;
    emoji?: {
        animated: boolean;
        id: null | string;
        name: string;
    };
    flags?: number;
    id?: string;
    instance?: boolean;
    metadata?: {
        [key: string]: any;
    };
    name: string;
    party?: {
        id?: string;
        size?: Array<[number, number]>;
    };
    platform?: string;
    secrets?: {
        join?: string;
        match?: string;
        spectate?: string;
    };
    session_id?: string;
    state?: string;
    sync_id?: string;
    timestamps?: {
        end?: number;
        start?: number;
    };
    type: number;
    url?: string;
}
export interface RawPresence {
    activities: Array<RawPresenceActivity>;
    afk: boolean;
    since: null | number;
    status: string;
}
export interface ResumeData {
    seq?: null | number;
    session_id: null | string;
    token: string;
}
export interface PresenceActivityOptions {
    applicationId?: string;
    assets?: {
        largeImage?: string;
        largeText?: string;
        smallImage?: string;
        smallText?: string;
    };
    details?: string;
    emoji?: {
        animated: boolean;
        id: null | string;
        name: string;
    };
    flags?: number;
    metadata?: {
        [key: string]: any;
    };
    name: string;
    party?: {
        id?: string;
        size?: Array<[number, number]>;
    };
    platform?: string;
    secrets?: {
        join?: string;
        match?: string;
        spectate?: string;
    };
    sessionId?: string;
    state?: string;
    syncId?: string;
    timestamps?: {
        end?: number;
        start?: number;
    };
    type: number;
    url?: string;
}
export interface PresenceOptions {
    activities?: Array<PresenceActivityOptions>;
    activity?: PresenceActivityOptions;
    afk?: boolean;
    game?: PresenceActivityOptions;
    since?: null | number;
    status?: string;
}

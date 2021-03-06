/// <reference types="node" />
import * as dgram from 'dgram';
import { EventSpewer } from '../../Iris-Utils';
import { MediaCodecs, MediaCodecTypes } from './constants';
import { Socket as MediaSocket } from './media';
import { RTPHeader, RTPNonce } from './mediapackets/rtp';
export interface FrameOptions {
    incrementNonce?: boolean;
    incrementSequence?: boolean;
    incrementTimestamp?: boolean;
    nonce?: number;
    sequence?: number;
    timestamp?: number;
    type?: string;
    useCache?: boolean;
}
export interface IpInformation {
    ip: null | string;
    port: null | number;
}
export interface RTPPayload {
    header: RTPHeader;
    nonce?: Buffer;
    payload?: Buffer;
}
export interface TransportPacket {
    codec: MediaCodecs | null;
    data: Buffer;
    format: MediaCodecTypes | null;
    from: UDPFrom;
    rtp?: RTPPayload;
    userId: null | string;
}
export interface UDPFrom {
    address: string;
    family: string;
    port: number;
    size: number;
}
export declare class Socket extends EventSpewer {
    caches: {
        audio: Buffer;
        video?: Buffer;
    };
    codecs: {
        audio: null | string;
        video: null | string;
    };
    connected: boolean;
    headers: {
        audio: RTPHeader;
        video?: RTPHeader;
    };
    key: null | Uint8Array;
    local: IpInformation;
    mediaGateway: MediaSocket;
    mode: null | string;
    nonces: {
        audio: RTPNonce;
        video?: RTPNonce;
    };
    remote: IpInformation;
    socket: dgram.Socket | null;
    ssrc: number;
    transportId: null | string;
    constructor(mediaGateway: MediaSocket);
    get audioSSRC(): number;
    get videoSSRC(): number;
    get rtxSSRC(): number;
    get rtpAudioPayloadType(): null | number;
    get rtpVideoPayloadType(): null | number;
    get rtpRTXPayloadType(): null | number;
    get receiveEnabled(): boolean;
    get videoEnabled(): boolean;
    setAudioCodec(codec?: MediaCodecs | null | string): Socket;
    setVideoCodec(codec?: MediaCodecs | null | string): Socket;
    setKey(value: Array<number>): Socket;
    setMode(value: string): Socket;
    setSSRC(value: number): Socket;
    setTransportId(value: string): Socket;
    connect(ip?: null | string, port?: null | number): Socket;
    disconnect(): void;
    onPacket(packet: Buffer, from: UDPFrom): void;
    send(packet: Buffer): void;
    sendAudioFrame(packet: Buffer, options?: FrameOptions): void;
    sendVideoFrame(packet: Buffer, options?: FrameOptions): void;
    sendFrame(packet: Buffer, options?: FrameOptions): void;
    sendAudioSilenceFrame(): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'close', listener: () => any): this;
    on(event: 'killed', listener: () => any): this;
    on(event: 'log', listener: (error: Error) => any): this;
    on(event: 'open', listener: () => any): this;
    on(event: 'packet', listener: (packet: TransportPacket) => any): this;
    on(event: 'ready', listener: () => any): this;
    on(event: 'socket', listener: (socket: dgram.Socket) => any): this;
    on(event: 'warn', listener: (error: Error) => any): this;
}

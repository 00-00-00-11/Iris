import { Media, MediaUdp } from '../../Iris-Client-Socket';
import { ShardClient } from '../client';
import { MediaOpCodes } from '../constants';
import { MediaRawEvents } from './rawevents';
import { VoiceConnection } from './voiceconnection';s
/**
 * Voice Connection Handler
 * @category Handler
 */
export declare class MediaHandler {
    connection: VoiceConnection;
    opHandler: MediaGatewayOpHandler;
    constructor(connection: VoiceConnection);
    get client(): ShardClient;
    get gateway(): Media.Socket;
    onPacket(packet: MediaRawEvents.MediaGatewayPacket): void;
    onTransportReady(transport: MediaUdp.Socket): void;
    onTransportPacket(packet: MediaUdp.TransportPacket): void;
}
/**
 * Media Gateway Op Code Handler Function
 * @category Handlers
 */
export declare type MediaGatewayOpHandlerFunction = (data: any) => void;
/**
 * Media Gateway Op Code Handler
 * @category Handlers
 */
export declare class MediaGatewayOpHandler {
    handler: MediaHandler;
    constructor(handler: MediaHandler);
    get client(): ShardClient;
    get connection(): VoiceConnection;
    [MediaOpCodes.CLIENT_CONNECT](data: MediaRawEvents.ClientConnect): void;
    [MediaOpCodes.CLIENT_DISCONNECT](data: MediaRawEvents.ClientDisconnect): void;
    [MediaOpCodes.SPEAKING](data: MediaRawEvents.Speaking): void;
}

/// <reference types="node" />
import { Media } from '../../Iris-Client-Socket';
import { EventSpewer } from '../../Iris-Utils';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { AudioFormat } from '../utils/audioformat';
import { Channel, Guild, Member, User, VoiceState } from '../structures';
import { Opus } from './encoders';
import { MediaHandler } from './handler';
/**
 * Voice Connection .decode() Settings
 * @category Media Options
 */
export interface DecodeSettings {
    format?: string;
    frameDuration?: number;
    type?: string;
}
/**
 * Voice Connection Opus Options
 * @category Media Opus
 */
export interface OpusOptions extends Opus.AudioOpusOptions {
    application?: number;
    channels?: number;
    kill?: boolean;
    sampleRate?: number;
    use?: null | string;
}
/**
 * Voice Connection Opus Decoder Settings
 * @category Media Options
 */
export interface OpusDecoderSettings {
    application: number;
    channels: number;
    sampleRate: number;
    use?: null | string;
}
/**
 * Voice Connection .sendAudio() Settings
 * @category Media Options
 */
export interface SendAudioSettings {
    isOpus?: boolean;
}
/**
 * Voice Connection Options
 * @category Media Options
 */
export interface VoiceConnectionOptions {
    decodeAudio?: boolean;
    opusDecoder?: boolean | OpusOptions;
    opusEncoder?: boolean | OpusOptions;
}
/**
 * Voice Connection
 * @category Media
 */
export declare class VoiceConnection extends EventSpewer {
    client: ShardClient;
    decodeAudio: boolean;
    formats: {
        audio: AudioFormat;
    };
    gateway: Media.Socket;
    handler: MediaHandler;
    opusDecoder: null | OpusDecoderSettings;
    opusDecoders: BaseCollection<string, Opus.AudioOpus>;
    opusEncoder: null | Opus.AudioOpus;
    constructor(client: ShardClient, gateway: Media.Socket, options?: VoiceConnectionOptions);
    get channel(): Channel | null;
    get channelId(): string;
    get guild(): Guild | null;
    get guildId(): null | string;
    get killed(): boolean;
    get member(): Member | null;
    get serverId(): string;
    get user(): null | User;
    get userId(): string;
    get voiceState(): null | VoiceState;
    decode(userId: string, data: Buffer, options?: DecodeSettings): Buffer;
    fetchOpusDecoder(userId: string): Opus.AudioOpus;
    kill(): void;
    sendAudio(data: Buffer, options?: SendAudioSettings): void;
    sendAudioSilenceFrame(): void;
    setDecodeAudio(value: boolean): void;
    setOpusDecoder(options?: boolean | OpusOptions): void;
    setOpusEncoder(options?: boolean | OpusOptions): void;
    setSpeaking(options: {
        delay?: number;
        ssrc?: number;
        soundshare?: boolean;
        voice?: boolean;
    }): Promise<void>;
    setState(options: {
        selfDeaf?: boolean;
        selfMute?: boolean;
        selfVideo?: boolean;
    }): Promise<void>;
    setDeaf(selfDeaf: boolean): Promise<void>;
    setMute(selfMute: boolean): Promise<void>;
    setVideo(selfVideo: boolean): Promise<void>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'connect', listener: (payload: any) => any): this;
    on(event: 'disconnect', listener: (payload: any) => any): this;
    on(event: 'speaking', listener: (payload: any) => any): this;
}

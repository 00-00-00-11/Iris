import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient, VoiceConnectOptions } from '../client';
import { BaseSet } from '../collections/baseset';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { Member } from './member';
/**
 * Voice State Structure
 * @category Structure
 */
export declare class VoiceState extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly _keysSkipDifference: BaseSet<string>;
    channelId?: null | string;
    deaf: boolean;
    guildId?: null | string;
    member: Member;
    mute: boolean;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionId: string;
    suppress: boolean;
    userId: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get channel(): Channel | null;
    get guild(): Guild | null;
    get serverId(): string;
    get streamKey(): string;
    fetchStreamPreview(): Promise<any>;
    edit(options: RequestTypes.EditGuildMember): Promise<any>;
    joinVoice(options?: VoiceConnectOptions): Promise<{
        connection: import("../media/voiceconnection").VoiceConnection;
        isNew: boolean;
    } | null>;
    move(channelId: string): Promise<any>;
    setDeaf(deaf: boolean): Promise<any>;
    setMute(mute: boolean): Promise<any>;
    mergeValue(key: string, value: any): void;
}

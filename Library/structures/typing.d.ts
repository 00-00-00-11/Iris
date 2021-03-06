import { Timers } from '../../Iris-Utils';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { Member } from './member';
import { User } from './user';
/**
 * Channel Typing Structure
 * used to tell you when someone starts typing in a channel
 * @category Structure
 */
export declare class Typing extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly timeout: Timers.Timeout;
    channelId: string;
    guildId?: string;
    member?: Member;
    started: number;
    stopped: number;
    timestamp: number;
    userId: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get channel(): Channel | null;
    get guild(): Guild | null;
    get shouldStopAt(): number;
    get user(): null | User;
    _stop(emit?: boolean): void;
    mergeValue(key: string, value: any): void;
}

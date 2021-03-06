import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Emoji } from './emoji';
import { Guild } from './guild';
import { Message } from './message';
/**
 * Reaction Structure, used in [Message]
 * we don't store the userIds since we only get them on reaction adds
 * @category Structure
 */
export declare class Reaction extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    channelId: string;
    count: number;
    emoji: Emoji;
    guildId?: string;
    isPartial: boolean;
    messageId: string;
    me: boolean;
    constructor(client: ShardClient, data: BaseStructureData);
    get canClear(): boolean;
    get channel(): Channel | null;
    get guild(): Guild | null;
    get message(): Message | null;
    add(): Promise<any>;
    clear(): Promise<any>;
    delete(userId?: string): Promise<any>;
    deleteAll(): Promise<any>;
    fetchUsers(options?: RequestTypes.FetchReactions): Promise<import("detritus-utils").BaseCollection<string, import("./user").User>>;
    mergeValue(key: string, value: any): void;
}

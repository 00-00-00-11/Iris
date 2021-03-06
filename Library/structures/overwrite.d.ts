import { RequestTypes } from '../../Iris-Client-Rest';
import { BaseSet } from '../collections/baseset';
import { OverwriteTypes } from '../constants';
import { PermissionTools } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { Member } from './member';
import { Role } from './role';
/**
 * Channel Overwrite Structure, used in [ChannelGuildBase] Structures
 * @category Structure
 */
export declare class Overwrite extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly channel: Channel;
    allow: bigint;
    deny: bigint;
    id: string;
    type: OverwriteTypes;
    constructor(channel: Channel, data: BaseStructureData);
    get channelId(): string;
    get guild(): Guild | null;
    get guildId(): string;
    get isMember(): boolean;
    get isRole(): boolean;
    get member(): Member | null;
    get role(): null | Role;
    can(permissions: PermissionTools.PermissionChecks): boolean;
    delete(): Promise<any>;
    edit(options?: RequestTypes.EditChannelOverwrite): Promise<any>;
    mergeValue(key: string, value: any): void;
}

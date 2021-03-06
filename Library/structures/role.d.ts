import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { PermissionTools } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { ChannelGuildBase } from './channel';
import { Guild } from './guild';
import { Member } from './member';
/**
 * Guild Role Structure, used in [Guild]
 * @category Structure
 */
export declare class Role extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    color: number;
    guildId: string;
    hoist: boolean;
    id: string;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: bigint;
    position: number;
    tags: {
        bot_id: string;
        integration_id?: string;
        premium_subscriber?: null;
    } | null;
    constructor(client: ShardClient, data: BaseStructureData);
    get botId(): null | string;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get guild(): Guild | null;
    get integrationId(): null | string;
    get isBoosterRole(): boolean;
    get isDefault(): boolean;
    get members(): BaseCollection<string, Member>;
    get mention(): string;
    can(permissions: PermissionTools.PermissionChecks, { ignoreAdministrator }?: {
        ignoreAdministrator?: boolean;
    }): boolean;
    permissionsIn(channelId: ChannelGuildBase | string): bigint;
    delete(options?: RequestTypes.DeleteGuildRole): Promise<any>;
    edit(options: RequestTypes.EditGuildRole): Promise<Role>;
    mergeValue(key: string, value: any): void;
    toString(): string;
}

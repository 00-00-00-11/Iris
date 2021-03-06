import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { InviteTargetUserTypes } from '../constants';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { User } from './user';
/**
 * Instant Invite Structure
 * @category Structure
 */
export declare class Invite extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    channel?: Channel;
    code: string;
    createdAt?: Date;
    guild?: Guild;
    inviter?: User;
    maxAge?: number;
    maxUses?: number;
    revoked?: boolean;
    targetUser?: User;
    targetUserType?: InviteTargetUserTypes;
    temporary?: boolean;
    uses?: number;
    constructor(client: ShardClient, data: BaseStructureData);
    get createdAtUnix(): number;
    get expiresAt(): Date | null;
    get expiresAtUnix(): number;
    get isVanity(): boolean;
    get longUrl(): string;
    get url(): string;
    accept(): Promise<any>;
    delete(options?: RequestTypes.DeleteInvite): Promise<Invite>;
    fetch(options?: RequestTypes.FetchInvite): Promise<Invite>;
    mergeValue(key: string, value: any): void;
}

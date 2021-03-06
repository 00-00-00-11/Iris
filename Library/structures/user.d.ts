import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { Message } from './message';
import { Presence } from './presence';
/**
 * Basic User Structure
 * @category Structure
 */
export declare class User extends BaseStructure {
    readonly _keys: BaseSet<string>;
    avatar: string | null;
    bot: boolean;
    discriminator: string;
    id: string;
    publicFlags: number;
    system?: boolean;
    username: string;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get avatarUrl(): string;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get defaultAvatarUrl(): string;
    get dm(): Channel | null;
    get guilds(): BaseCollection<string, Guild>;
    get hasStaff(): boolean;
    get hasPartner(): boolean;
    get hasHypesquad(): boolean;
    get hasBugHunterLevel1(): boolean;
    get hasBugHunterLevel2(): boolean;
    get hasMfaSms(): boolean;
    get hasPremiumPromoDismissed(): boolean;
    get hasHypesquadHouseBravery(): boolean;
    get hasHypesquadHouseBrilliance(): boolean;
    get hasHypesquadHouseBalance(): boolean;
    get hasEarlySupporter(): boolean;
    get hasTeamUser(): boolean;
    get hasVerifiedBot(): boolean;
    get hasVerifiedDeveloper(): boolean;
    get isClientOwner(): boolean;
    get isMe(): boolean;
    get isSystem(): boolean;
    get isWebhook(): boolean;
    get jumpLink(): string;
    get mention(): string;
    get messages(): BaseCollection<string, Message>;
    get name(): string;
    get names(): Array<string>;
    get note(): string;
    get presence(): null | Presence;
    avatarUrlFormat(format?: null | string, query?: UrlQuery): string;
    hasFlag(flag: number): boolean;
    hasPublicFlag(flag: number): boolean;
    add(): Promise<any>;
    block(): Promise<any>;
    createDm(): Promise<import("./channel").ChannelDM>;
    createOrGetDm(): Promise<import("./channel").ChannelBase | import("./channel").ChannelGuildBase>;
    createMessage(options?: RequestTypes.CreateMessage | string): Promise<any>;
    deleteRelationship(): Promise<any>;
    editNote(note: string): Promise<any>;
    editRelationship(type: number): Promise<any>;
    fetchProfile(): Promise<import("./profile").Profile>;
    unadd(): Promise<any>;
    unblock(): Promise<any>;
    toString(): string;
}
/**
 * User with Token Structure
 * e.g. when you edit your user
 * @category Structure
 */
export declare class UserWithToken extends User {
    readonly _keys: BaseSet<string>;
    token: string;
    constructor(client: ShardClient, data: BaseStructureData);
}
/**
 * User with Flags Structure
 * used to describe someone's badges, you get them from me/profile/team owner
 * @category Structure
 */
export declare class UserWithFlags extends User {
    readonly _keys: BaseSet<string>;
    flags: number;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    hasFlag(flag: number): boolean;
}
/**
 * User Extended Structure
 * received from /users/@me calls with an oauth2 token with correct permissions
 * @category Structure
 */
export declare class UserExtended extends UserWithFlags {
    readonly _keys: BaseSet<string>;
    email?: string | null;
    flags: number;
    locale?: string | null;
    mfaEnabled: boolean;
    premiumType: number;
    verified: boolean;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get isClaimed(): boolean;
    get hasNitroClassic(): boolean;
    get hasNitro(): boolean;
    hasPremiumType(type: number): boolean;
}
/**
 * User Me Structure
 * the current user, it has all their details
 * @category Structure
 */
export declare class UserMe extends UserExtended {
    readonly _keys: BaseSet<string>;
    analyticsToken?: string;
    phone?: string;
    constructor(client: ShardClient, data: BaseStructureData);
}
/**
 * User Mixin Structure
 * Used to extend to receive all of [User]'s properties
 * @category Structure
 */
export declare class UserMixin extends BaseStructure {
    user: User;
    get avatar(): null | string;
    get avatarUrl(): string;
    get bot(): boolean;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get defaultAvatarUrl(): string;
    get discriminator(): string;
    get dm(): Channel | null;
    get guilds(): BaseCollection<string, Guild>;
    get hasStaff(): boolean;
    get hasPartner(): boolean;
    get hasHypesquad(): boolean;
    get hasBugHunterLevel1(): boolean;
    get hasBugHunterLevel2(): boolean;
    get hasMfaSms(): boolean;
    get hasPremiumPromoDismissed(): boolean;
    get hasHypesquadHouseBravery(): boolean;
    get hasHypesquadHouseBrilliance(): boolean;
    get hasHypesquadHouseBalance(): boolean;
    get hasEarlySupporter(): boolean;
    get hasTeamUser(): boolean;
    get hasVerifiedBot(): boolean;
    get hasVerifiedDeveloper(): boolean;
    get id(): string;
    get isClientOwner(): boolean;
    get isMe(): boolean;
    get isSystem(): boolean;
    get isWebhook(): boolean;
    get jumpLink(): string;
    get mention(): string;
    get messages(): BaseCollection<string, Message>;
    get name(): string;
    get names(): Array<string>;
    get note(): string;
    get presence(): null | Presence;
    get publicFlags(): number;
    get system(): boolean | undefined;
    get username(): string;
    avatarUrlFormat(format?: null | string, query?: UrlQuery): string;
    hasFlag(flag: number): boolean;
    hasPublicFlag(flag: number): boolean;
    add(): Promise<any>;
    block(): Promise<any>;
    createDm(): Promise<import("./channel").ChannelDM>;
    createOrGetDm(): Promise<import("./channel").ChannelBase | import("./channel").ChannelGuildBase>;
    createMessage(options?: RequestTypes.CreateMessage | string): Promise<any>;
    deleteRelationship(): Promise<any>;
    editNote(note: string): Promise<any>;
    editRelationship(type: number): Promise<any>;
    fetchProfile(): Promise<import("./profile").Profile>;
    unadd(): Promise<any>;
    unblock(): Promise<any>;
    toString(): string;
}

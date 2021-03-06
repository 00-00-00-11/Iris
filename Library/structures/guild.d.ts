import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { EmojisOptions } from '../collections/emojis';
import { MembersOptions } from '../collections/members';
import { RolesOptions } from '../collections/roles';
import { GuildExplicitContentFilterTypes, Locales, MfaLevels, PremiumGuildTiers } from '../constants';
import { PermissionTools, UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel, ChannelGuildCategory, ChannelGuildStore, ChannelGuildText, ChannelGuildVoice } from './channel';
import { Emoji } from './emoji';
import { Member } from './member';
import { Message } from './message';
import { Presence } from './presence';
import { Role } from './role';
import { User } from './user';
import { VoiceRegion } from './voiceregion';
import { VoiceState } from './voicestate';
export interface GuildCacheOptions {
    emojis?: EmojisOptions;
    fromRest?: boolean;
    members?: MembersOptions;
    roles?: RolesOptions;
}
/**
 * Base Guild Structure
 * @category Structure
 */
export declare class BaseGuild extends BaseStructure {
    readonly _keys: BaseSet<string>;
    features: BaseSet<string>;
    icon: null | string;
    id: string;
    name: string;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get acronym(): string;
    get canHaveBanner(): boolean;
    get canHaveDiscoveryFeatures(): boolean;
    get canHaveNews(): boolean;
    get canHavePublic(): boolean;
    get canHaveSplash(): boolean;
    get canHaveStore(): boolean;
    get canHaveVanityUrl(): boolean;
    get canHaveVipRegions(): boolean;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get iconUrl(): null | string;
    get isDiscoverable(): boolean;
    get isPartnered(): boolean;
    get isPublic(): boolean;
    get isVerified(): boolean;
    get jumpLink(): string;
    get widgetImageUrl(): string;
    get widgetUrl(): string;
    hasFeature(feature: string): boolean;
    iconUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    widgetImageUrlFormat(query?: UrlQuery): string;
    widgetUrlFormat(options?: RequestTypes.RouteWidget): string;
    ack(): Promise<any>;
    addMember(userId: string, options: RequestTypes.AddGuildMember): Promise<any>;
    addMemberRole(userId: string, roleId: string): Promise<any>;
    beginPrune(options?: RequestTypes.BeginGuildPrune): Promise<any>;
    createBan(userId: string, options: RequestTypes.CreateGuildBan): Promise<any>;
    createChannel(options: RequestTypes.CreateGuildChannel): Promise<Channel>;
    createEmoji(options: RequestTypes.CreateGuildEmoji): Promise<Emoji>;
    createIntegration(options: RequestTypes.CreateGuildIntegration): Promise<any>;
    createRole(options: RequestTypes.CreateGuildRole): Promise<Role>;
    createTemplate(options: RequestTypes.CreateGuildTemplate): Promise<import("./template").Template>;
    delete(): Promise<any>;
    deleteChannel(channelId: string, options?: RequestTypes.DeleteChannel): Promise<Channel>;
    deleteEmoji(emojiId: string, options?: RequestTypes.DeleteGuildEmoji): Promise<any>;
    deleteIntegration(integrationId: string, options?: RequestTypes.DeleteGuildIntegration): Promise<any>;
    deletePremiumSubscription(subscriptionId: string): Promise<any>;
    deleteRole(roleId: string, options?: RequestTypes.DeleteGuildRole): Promise<any>;
    deleteTemplate(templateId: string): Promise<any>;
    edit(options: RequestTypes.EditGuild): Promise<Guild>;
    editChannel(channelId: string, options: RequestTypes.EditChannel): Promise<Channel>;
    editChannelPositions(channels: RequestTypes.EditGuildChannels, options?: RequestTypes.EditGuildChannelsExtra): Promise<any>;
    editEmbed(options: RequestTypes.EditGuildEmbed): Promise<any>;
    editEmoji(emojiId: string, options: RequestTypes.EditGuildEmoji): Promise<Emoji>;
    editIntegration(integrationId: string, options: RequestTypes.EditGuildIntegration): Promise<any>;
    editMember(userId: string, options: RequestTypes.EditGuildMember): Promise<any>;
    editMfaLevel(options: RequestTypes.EditGuildMfaLevel): Promise<any>;
    editNick(nick: string, options?: RequestTypes.EditGuildNick): Promise<any>;
    editRole(roleId: string, options: RequestTypes.EditGuildRole): Promise<Role>;
    editRolePositions(roles: RequestTypes.EditGuildRolePositions, options?: RequestTypes.EditGuildRolePositionsExtra): Promise<BaseCollection<string, Role>>;
    editVanityUrl(code: string, options?: RequestTypes.EditGuildVanity): Promise<any>;
    fetchApplications(channelId?: string): Promise<any>;
    fetchAuditLogs(options: RequestTypes.FetchGuildAuditLogs): Promise<BaseCollection<string, import("./auditlog").AuditLog>>;
    fetchBans(): Promise<import("../rest/types").RestResponses.FetchGuildBans>;
    fetchChannels(): Promise<BaseCollection<string, Channel>>;
    fetchEmbed(): Promise<any>;
    fetchEmoji(emojiId: string): Promise<Emoji>;
    fetchEmojis(): Promise<BaseCollection<string, Emoji>>;
    fetchInvites(): Promise<BaseCollection<string, import("./invite").Invite>>;
    fetchIntegrations(): Promise<BaseCollection<string, import("./integration").Integration>>;
    fetchMember(userId: string): Promise<Member>;
    fetchMembers(options: RequestTypes.FetchGuildMembers): Promise<BaseCollection<string, Member>>;
    fetchMembersSearch(options: RequestTypes.FetchGuildMembersSearch): Promise<BaseCollection<string, Member>>;
    fetchPremiumSubscriptions(): Promise<BaseCollection<string, import("./premiumsubscription").PremiumSubscription>>;
    fetchPruneCount(): Promise<any>;
    fetchRoles(): Promise<BaseCollection<string, Role>>;
    fetchTemplates(): Promise<BaseCollection<string, import("./template").Template>>;
    fetchVanityUrl(): Promise<any>;
    fetchVoiceRegions(): Promise<BaseCollection<string, VoiceRegion>>;
    fetchWebhooks(): Promise<BaseCollection<string, import("./webhook").Webhook>>;
    fetchWidget(): Promise<any>;
    fetchWidgetJson(): Promise<any>;
    fetchWidgetPng(options?: RequestTypes.FetchGuildWidgetPng): Promise<any>;
    join(options: RequestTypes.JoinGuild): Promise<any>;
    leave(): Promise<any>;
    removeBan(userId: string, options?: RequestTypes.RemoveGuildBan): Promise<any>;
    removeMember(userId: string, options?: RequestTypes.RemoveGuildMember): Promise<any>;
    removeMemberRole(userId: string, roleId: string, options?: RequestTypes.RemoveGuildBan): Promise<any>;
    requestMembers(options: {
        limit?: number;
        presences?: boolean;
        query: string;
        timeout?: number;
        userIds?: Array<string>;
    }): Promise<{
        members: BaseCollection<string, Member>;
        nonce: string;
        notFound: BaseSet<string>;
        presences: BaseCollection<string, Presence>;
    }>;
    search(options: RequestTypes.SearchOptions, retry?: boolean): Promise<any>;
    syncIntegration(integrationId: string): Promise<any>;
    mergeValue(key: string, value: any): void;
    toString(): string;
}
/**
 * Guild Structure
 * @category Structure
 */
export declare class Guild extends BaseGuild {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly _keysSkipDifference: BaseSet<string>;
    readonly _fromRest: boolean;
    afkChannelId: null | string;
    afkTimeout: number;
    applicationId?: null | string;
    banner: null | string;
    defaultMessageNotifications: number;
    description: null | string;
    embedChannelId: null | string;
    embedEnabled: boolean;
    explicitContentFilter: GuildExplicitContentFilterTypes;
    emojis: BaseCollection<string, Emoji>;
    features: BaseSet<string>;
    discoverySplash: null | string;
    hasMetadata: boolean;
    icon: null | string;
    id: string;
    isPartial: boolean;
    isReady: boolean;
    joinedAtUnix: number;
    large: boolean;
    lazy: boolean;
    left: boolean;
    maxMembers: number;
    maxPresences: number;
    maxVideoChannelUsers: number;
    memberCount: number;
    members: BaseCollection<string, Member>;
    mfaLevel: MfaLevels;
    name: string;
    ownerId: string;
    preferredLocale: Locales;
    premiumSubscriptionCount: number;
    premiumTier: PremiumGuildTiers;
    publicUpdatesChannelId: null | string;
    region: string;
    roles: BaseCollection<string, Role>;
    rulesChannelId: null | string;
    splash: null | string;
    systemChannelFlags: number;
    systemChannelId: null | string;
    unavailable: boolean;
    vanityUrlCode: null | string;
    verificationLevel: number;
    widgetChannelId: null | string;
    widgetEnabled: boolean;
    constructor(client: ShardClient, data: BaseStructureData, cache?: GuildCacheOptions);
    get afkChannel(): Channel | null;
    get bannerUrl(): null | string;
    get categoryChannels(): BaseCollection<string, ChannelGuildCategory>;
    get channels(): BaseCollection<string, Channel>;
    get defaultRole(): null | Role;
    get discoverySplashUrl(): null | string;
    get hasSystemChannelSuppressJoinNotifications(): boolean;
    get hasSystemChannelSuppressPremiumSubscriptions(): boolean;
    get joinedAt(): Date | null;
    get maxAttachmentSize(): number;
    get maxBitrate(): number;
    get maxEmojis(): number;
    get me(): Member | null;
    get messages(): BaseCollection<string, Message>;
    get owner(): null | User;
    get preferredLocaleText(): string;
    get presences(): BaseCollection<string, Presence>;
    get publicUpdatesChannel(): Channel | null;
    get rulesChannel(): Channel | null;
    get splashUrl(): null | string;
    get storeChannels(): BaseCollection<string, ChannelGuildStore>;
    get systemChannel(): Channel | null;
    get textChannels(): BaseCollection<string, ChannelGuildText>;
    get voiceChannels(): BaseCollection<string, ChannelGuildVoice>;
    get voiceStates(): BaseCollection<string, VoiceState>;
    bannerUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    can(permissions: PermissionTools.PermissionChecks, member?: Member | null, options?: {
        ignoreAdministrator?: boolean;
        ignoreOwner?: boolean;
    }): boolean;
    discoverySplashUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    hasSystemChannelFlag(flag: number): boolean;
    isOwner(userId: string): boolean;
    splashUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    fetchVoiceRegion(): Promise<VoiceRegion>;
    mergeValue(key: string, value: any): void;
}
/**
 * Guild Me Structure
 * @category Structure
 */
export declare class GuildMe extends BaseGuild {
    readonly _keys: BaseSet<string>;
    owner: boolean;
    permissions: bigint;
    constructor(client: ShardClient, data: BaseStructureData);
    can(permissions: PermissionTools.PermissionChecks, options?: {
        ignoreAdministrator?: boolean;
        ignoreOwner?: boolean;
    }): boolean;
    mergeValue(key: string, value: any): void;
}

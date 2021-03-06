import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient, VoiceConnectOptions } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { ChannelTypes } from '../constants';
import { VoiceConnection } from '../media/voiceconnection';
import { PermissionTools, UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Guild } from './guild';
import { Member } from './member';
import { Message } from './message';
import { Overwrite } from './overwrite';
import { Role } from './role';
import { Typing } from './typing';
import { User } from './user';
import { VoiceState } from './voicestate';
export declare type Channel = (ChannelBase | ChannelDM | ChannelGuildVoice | ChannelDMGroup | ChannelGuildBase | ChannelGuildCategory | ChannelGuildText | ChannelGuildStore);
export declare function createChannelFromData(client: ShardClient, data: any): Channel;
/**
 * Basic Channel Structure
 * @category Structure
 */
export declare class ChannelBase extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    _name: string;
    _nicks?: BaseCollection<string, string>;
    _permissionOverwrites?: BaseCollection<string, Overwrite>;
    _recipients?: BaseCollection<string, User>;
    applicationId?: string;
    bitrate: number;
    deleted: boolean;
    guildId: string;
    id: string;
    icon?: null | string;
    isPartial: boolean;
    lastMessageId?: null | string;
    lastPinTimestampUnix: number;
    nsfw: boolean;
    parentId?: null | string;
    position: number;
    rateLimitPerUser: number;
    topic?: string;
    type: ChannelTypes;
    userLimit: number;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get canAddReactions(): boolean;
    get canAttachFiles(): boolean;
    get canDeafenMembers(): boolean;
    get canEdit(): boolean;
    get canEmbedLinks(): boolean;
    get canJoin(): boolean;
    get canManageMessages(): boolean;
    get canManageWebhooks(): boolean;
    get canMentionEveryone(): boolean;
    get canMessage(): boolean;
    get canMoveMembers(): boolean;
    get canMuteMembers(): boolean;
    get canPrioritySpeaker(): boolean;
    get canSendTTSMessage(): boolean;
    get canSpeak(): boolean;
    get canStream(): boolean;
    get canReadHistory(): boolean;
    get canUseExternalEmojis(): boolean;
    get canUseVAD(): boolean;
    get canView(): boolean;
    get children(): BaseCollection<string, ChannelGuildBase>;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get defaultIconUrl(): null | string;
    get guild(): Guild | null;
    get iconUrl(): null | string;
    get isDm(): boolean;
    get isDmGroup(): boolean;
    get isDmSingle(): boolean;
    get isGuildCategory(): boolean;
    get isGuildChannel(): boolean;
    get isGuildNews(): boolean;
    get isGuildStore(): boolean;
    get isGuildText(): boolean;
    get isGuildVoice(): boolean;
    get isManaged(): boolean;
    get isSyncedWithParent(): boolean;
    get isText(): boolean;
    get isVoice(): boolean;
    get joined(): boolean;
    get jumpLink(): string;
    get lastPinTimestamp(): Date | null;
    get members(): BaseCollection<string, Member>;
    get messages(): BaseCollection<string, Message>;
    get mention(): string;
    get name(): string;
    get nicks(): BaseCollection<string, string>;
    get owner(): User | null;
    get parent(): ChannelGuildCategory | null;
    get permissionOverwrites(): BaseCollection<string, Overwrite>;
    get recipients(): BaseCollection<string, User>;
    get typing(): BaseCollection<string, Typing>;
    get voiceStates(): BaseCollection<string, VoiceState>;
    can(permissions: PermissionTools.PermissionChecks, memberOrRole?: Member | Role): boolean;
    iconUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    isSyncedWith(parent: ChannelGuildCategory | null): boolean;
    addPinnedMessage(messageId: string): Promise<any>;
    addRecipient(userId: string): Promise<any>;
    bulkDelete(messageIds: Array<string>): Promise<any>;
    close(): Promise<any>;
    createInvite(options: RequestTypes.CreateChannelInvite): Promise<import("./invite").Invite>;
    createMessage(options?: RequestTypes.CreateMessage | string): Promise<any>;
    createReaction(messageId: string, emoji: string): Promise<any>;
    createWebhook(options: RequestTypes.CreateWebhook): Promise<any>;
    crosspostMessage(messageId: string): Promise<any>;
    delete(options?: RequestTypes.DeleteChannel): Promise<Channel>;
    deleteMessage(messageId: string, options?: RequestTypes.DeleteMessage): Promise<any>;
    deleteOverwrite(overwriteId: string, options?: RequestTypes.DeleteChannelOverwrite): Promise<any>;
    deletePin(messageId: string): Promise<any>;
    deleteReaction(messageId: string, emoji: string, userId?: string): Promise<any>;
    deleteReactions(messageId: string): Promise<any>;
    edit(options?: RequestTypes.EditChannel): Promise<any>;
    editMessage(messageId: string, options?: RequestTypes.EditMessage): Promise<any>;
    editOverwrite(overwriteId: string, options?: RequestTypes.EditChannelOverwrite): Promise<any>;
    fetchCallStatus(): Promise<any>;
    fetchInvites(): Promise<BaseCollection<string, import("./invite").Invite>>;
    fetchMessage(messageId: string): Promise<any>;
    fetchMessages(options?: RequestTypes.FetchMessages): Promise<any>;
    fetchPins(): Promise<any>;
    fetchReactions(messageId: string, emoji: string, options?: RequestTypes.FetchReactions): Promise<any>;
    fetchStoreListing(): Promise<any>;
    fetchWebhooks(): Promise<any>;
    follow(options: RequestTypes.FollowChannel): Promise<any>;
    grantEntitlement(): Promise<any>;
    join(...args: any[]): Promise<any>;
    publish(options: RequestTypes.CreateApplicationNews): Promise<any>;
    removeRecipient(userId: string): Promise<any>;
    search(options: RequestTypes.SearchOptions, retry?: boolean): Promise<any>;
    startCallRinging(recipients?: Array<string>): Promise<any>;
    stopCallRinging(recipients?: Array<string>): Promise<any>;
    triggerTyping(): Promise<any>;
    turnIntoNewsChannel(): Promise<any>;
    turnIntoTextChannel(): Promise<any>;
    unack(): Promise<any>;
    mergeValue(key: string, value: any): void;
    toString(): string;
}
export interface CallOptions extends VoiceConnectOptions {
    recipients?: Array<string>;
    verify?: boolean;
}
/**
 * Single DM Channel
 * @category Structure
 */
export declare class ChannelDM extends ChannelBase {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    lastMessageId?: null | string;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get iconUrl(): null | string;
    get joined(): boolean;
    get messages(): BaseCollection<string, Message>;
    get name(): string;
    get voiceStates(): BaseCollection<string, VoiceState>;
    iconUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    addPinnedMessage(messageId: string): Promise<any>;
    bulkDelete(messageIds: Array<string>): Promise<any>;
    close(): Promise<Channel>;
    createMessage(options?: RequestTypes.CreateMessage | string): Promise<Message>;
    createReaction(messageId: string, emoji: string): Promise<any>;
    deleteMessage(messageId: string, options?: RequestTypes.DeleteMessage): Promise<any>;
    deletePin(messageId: string): Promise<any>;
    deleteReaction(messageId: string, emoji: string, userId?: string): Promise<any>;
    deleteReactions(messageId: string): Promise<any>;
    editMessage(messageId: string, options?: RequestTypes.EditMessage): Promise<Message>;
    fetchCallStatus(): Promise<any>;
    fetchMessage(messageId: string): Promise<Message>;
    fetchMessages(options: RequestTypes.FetchMessages): Promise<BaseCollection<string, Message>>;
    fetchPins(): Promise<BaseCollection<string, Message>>;
    fetchReactions(messageId: string, emoji: string, options?: RequestTypes.FetchReactions): Promise<BaseCollection<string, User>>;
    join(options: CallOptions): Promise<{
        connection: VoiceConnection;
        isNew: boolean;
    } | null>;
    search(options: RequestTypes.SearchOptions, retry?: boolean): Promise<any>;
    startCallRinging(recipients?: Array<string>): Promise<any>;
    stopCallRinging(recipients?: Array<string>): Promise<any>;
    triggerTyping(): Promise<any>;
    unack(): Promise<any>;
    mergeValue(key: string, value: any): void;
}
/**
 * Group DM Channel
 * @category Structure
 */
export declare class ChannelDMGroup extends ChannelDM {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    applicationId?: string;
    icon: null | string;
    ownerId: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get defaultIconUrl(): string;
    get owner(): User | null;
    iconUrlFormat(format?: null | string, query?: UrlQuery): string;
    isOwner(userId: string): boolean;
    addRecipient(userId: string): Promise<any>;
    removeRecipient(userId: string): Promise<any>;
}
/**
 * Basic Guild Channel
 * @category Structure
 */
export declare class ChannelGuildBase extends ChannelBase {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    type: ChannelTypes;
    guildId: string;
    nsfw: boolean;
    parentId?: null | string;
    position: number;
    rateLimitPerUser: number;
    constructor(client: ShardClient, data: BaseStructureData, merge?: boolean);
    get canAddReactions(): boolean;
    get canAttachFiles(): boolean;
    get canDeafenMembers(): boolean;
    get canEdit(): boolean;
    get canEmbedLinks(): boolean;
    get canJoin(): boolean;
    get canManageMessages(): boolean;
    get canManageWebhooks(): boolean;
    get canMentionEveryone(): boolean;
    get canMessage(): boolean;
    get canMoveMembers(): boolean;
    get canMuteMembers(): boolean;
    get canPrioritySpeaker(): boolean;
    get canSendTTSMessage(): boolean;
    get canSpeak(): boolean;
    get canStream(): boolean;
    get canReadHistory(): boolean;
    get canUseExternalEmojis(): boolean;
    get canUseVAD(): boolean;
    get canView(): boolean;
    get guild(): Guild | null;
    get jumpLink(): string;
    get parent(): ChannelGuildCategory | null;
    can(permissions: PermissionTools.PermissionChecks, memberOrRole?: Member | Role, { ignoreAdministrator, ignoreOwner }?: {
        ignoreAdministrator?: boolean;
        ignoreOwner?: boolean;
    }): boolean;
    isSyncedWith(parent: ChannelGuildCategory | null): boolean;
    deleteOverwrite(overwriteId: string, options?: RequestTypes.DeleteChannelOverwrite): Promise<any>;
    editOverwrite(overwriteId: string, options?: RequestTypes.EditChannelOverwrite): Promise<any>;
    mergeValue(key: string, value: any): void;
}
/**
 * Guild Category Channel
 * @category Structure
 */
export declare class ChannelGuildCategory extends ChannelGuildBase {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    bitrate: number;
    userLimit: number;
    constructor(client: ShardClient, data: BaseStructureData);
    get children(): BaseCollection<string, Channel>;
}
/**
 * Guild Text Channel, it can also be a news channel.
 * @category Structure
 */
export declare class ChannelGuildText extends ChannelGuildBase {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    lastMessageId?: null | string;
    topic?: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get members(): BaseCollection<string, Member>;
    get messages(): BaseCollection<string, Message>;
    addPinnedMessage(messageId: string): Promise<any>;
    bulkDelete(messageIds: Array<string>): Promise<any>;
    createMessage(options?: RequestTypes.CreateMessage | string): Promise<Message>;
    createReaction(messageId: string, emoji: string): Promise<any>;
    createWebhook(options: RequestTypes.CreateWebhook): Promise<import("./webhook").Webhook>;
    crosspostMessage(messageId: string): Promise<Message>;
    deleteMessage(messageId: string, options?: RequestTypes.DeleteMessage): Promise<any>;
    deletePin(messageId: string): Promise<any>;
    deleteReaction(messageId: string, emoji: string, userId?: string): Promise<any>;
    deleteReactions(messageId: string): Promise<any>;
    editMessage(messageId: string, options?: RequestTypes.EditMessage): Promise<Message>;
    fetchMessage(messageId: string): Promise<Message>;
    fetchMessages(options: RequestTypes.FetchMessages): Promise<BaseCollection<string, Message>>;
    fetchPins(): Promise<BaseCollection<string, Message>>;
    fetchReactions(messageId: string, emoji: string, options?: RequestTypes.FetchReactions): Promise<BaseCollection<string, User>>;
    fetchWebhooks(): Promise<BaseCollection<string, import("./webhook").Webhook>>;
    follow(options: RequestTypes.FollowChannel): Promise<any>;
    publish(options: RequestTypes.CreateApplicationNews): Promise<import("./applicationnews").ApplicationNews>;
    search(options: RequestTypes.SearchOptions, retry?: boolean): Promise<any>;
    triggerTyping(): Promise<any>;
    turnIntoNewsChannel(): Promise<any>;
    turnIntoTextChannel(): Promise<any>;
    unack(): Promise<any>;
    mergeValue(key: string, value: any): void;
}
/**
 * Guild Voice Channel
 * @category Structure
 */
export declare class ChannelGuildVoice extends ChannelGuildBase {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    bitrate: number;
    userLimit: number;
    constructor(client: ShardClient, data: BaseStructureData);
    get joined(): boolean;
    get members(): BaseCollection<string, Member>;
    get voiceStates(): BaseCollection<string, VoiceState>;
    join(options: VoiceConnectOptions): Promise<{
        connection: VoiceConnection;
        isNew: boolean;
    } | null>;
}
/**
 * Guild Store Channel
 * @category Structure
 */
export declare class ChannelGuildStore extends ChannelGuildBase {
    readonly _keys: BaseSet<string>;
    type: ChannelTypes;
    bitrate: number;
    userLimit: number;
    constructor(client: ShardClient, data: BaseStructureData);
    fetchStoreListing(): Promise<import("./store").StoreListing>;
    grantEntitlement(): Promise<any>;
}

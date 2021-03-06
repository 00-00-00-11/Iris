import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { GatewayDispatchEvents } from '../constants';
import { Member, Presence } from '../structures';
import { GatewayRawEvents } from './rawevents';
export interface GatewayHandlerOptions {
    disabledEvents?: Array<string>;
    loadAllMembers?: boolean;
    whitelistedEvents?: Array<string>;
}
export interface ChunkWaiting {
    members: BaseCollection<string, Member>;
    notFound: BaseSet<string>;
    presences: BaseCollection<string, Presence>;
    promise: {
        reject: Function;
        resolve: Function;
        wait: Promise<unknown>;
    };
    waiting: number;
}
/**
 * Gateway Handler
 * @category Handler
 */
export declare class GatewayHandler {
    readonly client: ShardClient;
    readonly _chunksWaiting: BaseCollection<string, ChunkWaiting>;
    disabledEvents: BaseSet<string>;
    dispatchHandler: GatewayDispatchHandler;
    loadAllMembers: boolean;
    duplicateMemberEventsCache: BaseCollection<string, string>;
    constructor(client: ShardClient, options?: GatewayHandlerOptions);
    get shouldLoadAllMembers(): boolean;
    onKilled(payload: {
        error?: Error;
    }): void;
    onPacket(packet: GatewayRawEvents.GatewayPacket): void;
}
/**
 * Gateway Dispatch Handler Function
 * @category Handlers
 */
export declare type GatewayDispatchHandlerFunction = (data: any) => void;
/**
 * Gateway Dispatch Handler
 * @category Handlers
 */
export declare class GatewayDispatchHandler {
    handler: GatewayHandler;
    constructor(handler: GatewayHandler);
    get client(): ShardClient;
    [GatewayDispatchEvents.READY](data: GatewayRawEvents.Ready): Promise<void>;
    [GatewayDispatchEvents.RESUMED](data: GatewayRawEvents.Resumed): void;
    [GatewayDispatchEvents.ACTIVITY_JOIN_INVITE](data: GatewayRawEvents.ActivityJoinInvite): void;
    [GatewayDispatchEvents.ACTIVITY_JOIN_REQUEST](data: GatewayRawEvents.ActivityJoinRequest): void;
    [GatewayDispatchEvents.ACTIVITY_START](data: GatewayRawEvents.ActivityStart): void;
    [GatewayDispatchEvents.BRAINTREE_POPUP_BRIDGE_CALLBACK](data: GatewayRawEvents.BraintreePopupBridgeCallback): void;
    [GatewayDispatchEvents.CALL_CREATE](data: GatewayRawEvents.CallCreate): void;
    [GatewayDispatchEvents.CALL_DELETE](data: GatewayRawEvents.CallDelete): void;
    [GatewayDispatchEvents.CALL_UPDATE](data: GatewayRawEvents.CallUpdate): void;
    [GatewayDispatchEvents.CHANNEL_CREATE](data: GatewayRawEvents.ChannelCreate): void;
    [GatewayDispatchEvents.CHANNEL_DELETE](data: GatewayRawEvents.ChannelDelete): void;
    [GatewayDispatchEvents.CHANNEL_PINS_ACK](data: GatewayRawEvents.ChannelPinsAck): void;
    [GatewayDispatchEvents.CHANNEL_PINS_UPDATE](data: GatewayRawEvents.ChannelPinsUpdate): void;
    [GatewayDispatchEvents.CHANNEL_UPDATE](data: GatewayRawEvents.ChannelUpdate): void;
    [GatewayDispatchEvents.CHANNEL_RECIPIENT_ADD](data: GatewayRawEvents.ChannelRecipientAdd): void;
    [GatewayDispatchEvents.CHANNEL_RECIPIENT_REMOVE](data: GatewayRawEvents.ChannelRecipientRemove): void;
    [GatewayDispatchEvents.ENTITLEMENT_CREATE](data: GatewayRawEvents.EntitlementCreate): void;
    [GatewayDispatchEvents.ENTITLEMENT_DELETE](data: GatewayRawEvents.EntitlementDelete): void;
    [GatewayDispatchEvents.ENTITLEMENT_UPDATE](data: GatewayRawEvents.EntitlementUpdate): void;
    [GatewayDispatchEvents.FRIEND_SUGGESTION_CREATE](data: GatewayRawEvents.FriendSuggestionCreate): void;
    [GatewayDispatchEvents.FRIEND_SUGGESTION_DELETE](data: GatewayRawEvents.FriendSuggestionDelete): void;
    [GatewayDispatchEvents.GIFT_CODE_UPDATE](data: GatewayRawEvents.GiftCodeUpdate): void;
    [GatewayDispatchEvents.GUILD_BAN_ADD](data: GatewayRawEvents.GuildBanAdd): void;
    [GatewayDispatchEvents.GUILD_BAN_REMOVE](data: GatewayRawEvents.GuildBanRemove): void;
    [GatewayDispatchEvents.GUILD_CREATE](data: GatewayRawEvents.GuildCreate): void;
    [GatewayDispatchEvents.GUILD_DELETE](data: GatewayRawEvents.GuildDelete): void;
    [GatewayDispatchEvents.GUILD_EMOJIS_UPDATE](data: GatewayRawEvents.GuildEmojisUpdate): void;
    [GatewayDispatchEvents.GUILD_INTEGRATIONS_UPDATE](data: GatewayRawEvents.GuildIntegrationsUpdate): void;
    [GatewayDispatchEvents.GUILD_MEMBER_ADD](data: GatewayRawEvents.GuildMemberAdd): void;
    [GatewayDispatchEvents.GUILD_MEMBER_LIST_UPDATE](data: GatewayRawEvents.GuildMemberListUpdate): void;
    [GatewayDispatchEvents.GUILD_MEMBER_REMOVE](data: GatewayRawEvents.GuildMemberRemove): void;
    [GatewayDispatchEvents.GUILD_MEMBER_UPDATE](data: GatewayRawEvents.GuildMemberUpdate): void;
    [GatewayDispatchEvents.GUILD_MEMBERS_CHUNK](data: GatewayRawEvents.GuildMembersChunk): void;
    [GatewayDispatchEvents.GUILD_ROLE_CREATE](data: GatewayRawEvents.GuildRoleCreate): void;
    [GatewayDispatchEvents.GUILD_ROLE_DELETE](data: GatewayRawEvents.GuildRoleDelete): void;
    [GatewayDispatchEvents.GUILD_ROLE_UPDATE](data: GatewayRawEvents.GuildRoleUpdate): void;
    [GatewayDispatchEvents.GUILD_UPDATE](data: GatewayRawEvents.GuildUpdate): void;
    [GatewayDispatchEvents.INTERACTION_CREATE](data: GatewayRawEvents.InteractionCreate): void;
    [GatewayDispatchEvents.INVITE_CREATE](data: GatewayRawEvents.InviteCreate): void;
    [GatewayDispatchEvents.INVITE_DELETE](data: GatewayRawEvents.InviteDelete): void;
    [GatewayDispatchEvents.LIBRARY_APPLICATION_UPDATE](data: GatewayRawEvents.LibraryApplicationUpdate): void;
    [GatewayDispatchEvents.LOBBY_CREATE](data: GatewayRawEvents.LobbyCreate): void;
    [GatewayDispatchEvents.LOBBY_DELETE](data: GatewayRawEvents.LobbyDelete): void;
    [GatewayDispatchEvents.LOBBY_UPDATE](data: GatewayRawEvents.LobbyUpdate): void;
    [GatewayDispatchEvents.LOBBY_MEMBER_CONNECT](data: GatewayRawEvents.LobbyMemberConnect): void;
    [GatewayDispatchEvents.LOBBY_MEMBER_DISCONNECT](data: GatewayRawEvents.LobbyMemberDisconnect): void;
    [GatewayDispatchEvents.LOBBY_MEMBER_UPDATE](data: GatewayRawEvents.LobbyMemberUpdate): void;
    [GatewayDispatchEvents.LOBBY_MESSAGE](data: GatewayRawEvents.LobbyMessage): void;
    [GatewayDispatchEvents.LOBBY_VOICE_SERVER_UPDATE](data: GatewayRawEvents.LobbyVoiceServerUpdate): void;
    [GatewayDispatchEvents.LOBBY_VOICE_STATE_UPDATE](data: GatewayRawEvents.LobbyVoiceStateUpdate): void;
    [GatewayDispatchEvents.MESSAGE_ACK](data: GatewayRawEvents.MessageAck): void;
    [GatewayDispatchEvents.MESSAGE_CREATE](data: GatewayRawEvents.MessageCreate): void;
    [GatewayDispatchEvents.MESSAGE_DELETE](data: GatewayRawEvents.MessageDelete): void;
    [GatewayDispatchEvents.MESSAGE_DELETE_BULK](data: GatewayRawEvents.MessageDeleteBulk): void;
    [GatewayDispatchEvents.MESSAGE_REACTION_ADD](data: GatewayRawEvents.MessageReactionAdd): void;
    [GatewayDispatchEvents.MESSAGE_REACTION_REMOVE](data: GatewayRawEvents.MessageReactionRemove): void;
    [GatewayDispatchEvents.MESSAGE_REACTION_REMOVE_ALL](data: GatewayRawEvents.MessageReactionRemoveAll): void;
    [GatewayDispatchEvents.MESSAGE_REACTION_REMOVE_EMOJI](data: GatewayRawEvents.MessageReactionRemoveEmoji): void;
    [GatewayDispatchEvents.MESSAGE_UPDATE](data: GatewayRawEvents.MessageUpdate): void;
    [GatewayDispatchEvents.OAUTH2_TOKEN_REMOVE](data: GatewayRawEvents.Oauth2TokenRemove): void;
    [GatewayDispatchEvents.PRESENCE_UPDATE](data: GatewayRawEvents.PresenceUpdate): void;
    [GatewayDispatchEvents.PRESENCES_REPLACE](data: GatewayRawEvents.PresencesReplace): void;
    [GatewayDispatchEvents.RECENT_MENTION_DELETE](data: GatewayRawEvents.RecentMentionDelete): void;
    [GatewayDispatchEvents.RELATIONSHIP_ADD](data: GatewayRawEvents.RelationshipAdd): void;
    [GatewayDispatchEvents.RELATIONSHIP_REMOVE](data: GatewayRawEvents.RelationshipRemove): void;
    [GatewayDispatchEvents.SESSIONS_REPLACE](data: GatewayRawEvents.SessionsReplace): void;
    [GatewayDispatchEvents.STREAM_CREATE](data: GatewayRawEvents.StreamCreate): void;
    [GatewayDispatchEvents.STREAM_DELETE](data: GatewayRawEvents.StreamDelete): void;
    [GatewayDispatchEvents.STREAM_SERVER_UPDATE](data: GatewayRawEvents.StreamServerUpdate): void;
    [GatewayDispatchEvents.STREAM_UPDATE](data: GatewayRawEvents.StreamUpdate): void;
    [GatewayDispatchEvents.TYPING_START](data: GatewayRawEvents.TypingStart): void;
    [GatewayDispatchEvents.USER_ACHIEVEMENT_UPDATE](data: GatewayRawEvents.UserAchievementUpdate): void;
    [GatewayDispatchEvents.USER_CONNECTIONS_UPDATE](data: GatewayRawEvents.UserConnectionsUpdate): Promise<void>;
    [GatewayDispatchEvents.USER_FEED_SETTINGS_UPDATE](data: GatewayRawEvents.UserFeedSettingsUpdate): void;
    [GatewayDispatchEvents.USER_GUILD_SETTINGS_UPDATE](data: GatewayRawEvents.UserGuildSettingsUpdate): void;
    [GatewayDispatchEvents.USER_NOTE_UPDATE](data: GatewayRawEvents.UserNoteUpdate): void;
    [GatewayDispatchEvents.USER_PAYMENT_SOURCES_UPDATE](data: GatewayRawEvents.UserPaymentSourcesUpdate): void;
    [GatewayDispatchEvents.USER_PAYMENTS_UPDATE](data: GatewayRawEvents.UserPaymentsUpdate): void;
    [GatewayDispatchEvents.USER_REQUIRED_ACTION_UPDATE](data: GatewayRawEvents.UserRequiredActionUpdate): void;
    [GatewayDispatchEvents.USER_SETTINGS_UPDATE](data: GatewayRawEvents.UserSettingsUpdate): void;
    [GatewayDispatchEvents.USER_UPDATE](data: GatewayRawEvents.UserUpdate): void;
    [GatewayDispatchEvents.VOICE_SERVER_UPDATE](data: GatewayRawEvents.VoiceServerUpdate): void;
    [GatewayDispatchEvents.VOICE_STATE_UPDATE](data: GatewayRawEvents.VoiceStateUpdate): void;
    [GatewayDispatchEvents.WEBHOOKS_UPDATE](data: GatewayRawEvents.WebhooksUpdate): void;
}

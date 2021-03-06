import { RestClientEvents } from '../../Iris-Client-Rest';
import { GatewayRawEvents } from './rawevents';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { ClientEvents, InteractionTypes } from '../constants';
import { Channel, Emoji, Guild, Invite, Member, Message, Presence, Reaction, Relationship, Role, Session, Typing, User, UserMe, VoiceCall, VoiceState } from '../structures';
export declare namespace GatewayClientEvents {
    type Differences = {
        [key: string]: any;
    } | null;
    interface ClusterEvent {
        shard: ShardClient;
    }
    interface Killed {
        error?: Error;
    }
    interface Raw extends GatewayRawEvents.GatewayPacket {
    }
    interface RestRequest extends RestClientEvents.RequestPayload {
    }
    interface RestResponse extends RestClientEvents.ResponsePayload {
    }
    interface Unknown extends GatewayRawEvents.GatewayPacket {
    }
    interface Warn {
        error: Error;
    }
    interface ActivityJoinInvite {
    }
    interface ActivityJoinRequest {
    }
    interface ActivityStart {
    }
    interface BraintreePopupBridgeCallback {
    }
    interface CallCreate {
        call: VoiceCall;
    }
    interface CallDelete {
        channelId: string;
    }
    interface CallUpdate {
        call: VoiceCall;
        channelId: string;
        differences: Differences;
    }
    interface ChannelCreate {
        channel: Channel;
    }
    interface ChannelDelete {
        channel: Channel;
    }
    interface ChannelPinsAck {
    }
    interface ChannelPinsUpdate {
        channel: Channel | null;
        channelId: string;
        guildId: string | undefined;
        lastPinTimestamp: string;
    }
    interface ChannelUpdate {
        channel: Channel;
        differences: Differences;
    }
    interface ChannelRecipientAdd {
        channel: Channel | null;
        channelId: string;
        nick: null | string;
        user: User;
    }
    interface ChannelRecipientRemove {
        channel: Channel | null;
        channelId: string;
        nick: null | string;
        user: User;
    }
    interface EntitlementCreate {
    }
    interface EntitlementDelete {
    }
    interface EntitlementUpdate {
    }
    interface FriendSuggestionCreate {
        reasons: Array<{
            name: string;
            platformType: string;
        }>;
        user: User;
    }
    interface FriendSuggestionDelete {
        suggestedUserId: string;
    }
    interface GatewayReady {
        raw: GatewayRawEvents.Ready;
    }
    interface GatewayResumed {
        raw: GatewayRawEvents.Resumed;
    }
    interface GiftCodeUpdate {
        code: string;
        uses: number;
    }
    interface GuildBanAdd {
        guild: Guild | undefined;
        guildId: string;
        user: User;
    }
    interface GuildBanRemove {
        guild: Guild | undefined;
        guildId: string;
        user: User;
    }
    interface GuildCreate {
        fromUnavailable: boolean;
        guild: Guild;
    }
    interface GuildDelete {
        channels: BaseCollection<string, Channel> | null;
        guild: Guild | null;
        guildId: string;
        isUnavailable: boolean;
    }
    interface GuildEmojisUpdate {
        emojis: BaseCollection<string, Emoji>;
        emojisOld: BaseCollection<string, Emoji> | null;
        guild: Guild | null;
        guildId: string;
    }
    interface GuildIntegrationsUpdate {
        guildId: string;
    }
    interface GuildMemberAdd {
        guildId: string;
        isDuplicate: boolean;
        member: Member;
        userId: string;
    }
    interface GuildMemberListUpdate {
        raw: GatewayRawEvents.GuildMemberListUpdate;
    }
    interface GuildMemberRemove {
        guildId: string;
        isDuplicate: boolean;
        member: Member | null;
        user: User;
        userId: string;
    }
    interface GuildMemberUpdate {
        differences: Differences;
        guildId: string;
        member: Member;
        userId: string;
    }
    interface GuildMembersChunk {
        chunkCount: number;
        chunkIndex: number;
        guild: Guild | null;
        guildId: string;
        members: BaseCollection<string, Member> | null;
        nonce: null | string;
        notFound: Array<string> | null;
        presences: BaseCollection<string, Presence> | null;
    }
    interface GuildReady {
        guild: Guild;
    }
    interface GuildRoleCreate {
        guild: Guild | null;
        guildId: string;
        role: Role;
    }
    interface GuildRoleDelete {
        guild: Guild | null;
        guildId: string;
        role: null | Role;
        roleId: string;
    }
    interface GuildRoleUpdate {
        differences: Differences;
        guild: Guild | null;
        guildId: string;
        role: Role;
    }
    interface GuildUpdate {
        differences: Differences;
        guild: Guild;
    }
    interface InteractionCreate {
        data: GatewayRawEvents.RawApplicationCommandInteractionData;
        channelId: string;
        guildId: string;
        id: string;
        member: Member;
        token: string;
        type: InteractionTypes;
        userId: string;
        version: number;
    }
    interface InviteCreate {
        channelId: string;
        guildId: string;
        invite: Invite;
    }
    interface InviteDelete {
        channelId: string;
        code: string;
        guildId: string;
    }
    interface LibraryApplicationUpdate {
    }
    interface LobbyCreate {
    }
    interface LobbyDelete {
    }
    interface LobbyUpdate {
    }
    interface LobbyMemberConnect {
    }
    interface LobbyMemberDisconnect {
    }
    interface LobbyMemberUpdate {
    }
    interface LobbyMessage {
    }
    interface LobbyVoiceServerUpdate {
    }
    interface LobbyVoiceStateUpdate {
    }
    interface MessageAck {
    }
    interface MessageCreate {
        message: Message;
        typing: null | Typing;
    }
    interface MessageDelete {
        channelId: string;
        guildId: string | undefined;
        message: Message | null;
        messageId: string;
        raw: GatewayRawEvents.MessageDelete;
    }
    interface MessageDeleteBulk {
        amount: number;
        channelId: string;
        guildId: string | undefined;
        messages: BaseCollection<string, Message | null>;
        raw: GatewayRawEvents.MessageDeleteBulk;
    }
    interface MessageReactionAdd {
        channelId: string;
        guildId: string | undefined;
        member: Member | null;
        message: Message | null;
        messageId: string;
        raw: GatewayRawEvents.MessageReactionAdd;
        reaction: Reaction;
        user: null | User;
        userId: string;
    }
    interface MessageReactionRemove {
        channelId: string;
        guildId: string | undefined;
        message: Message | null;
        messageId: string;
        raw: GatewayRawEvents.MessageReactionRemove;
        reaction: Reaction;
        user: null | User;
        userId: string;
    }
    interface MessageReactionRemoveAll {
        channelId: string;
        guildId: string | undefined;
        message: Message | null;
        messageId: string;
    }
    interface MessageReactionRemoveEmoji {
        channelId: string;
        guildId: string | undefined;
        message: Message | null;
        messageId: string;
        raw: GatewayRawEvents.MessageReactionRemoveEmoji;
        reaction: Reaction;
    }
    interface MessageUpdate {
        channelId: string;
        differences: Differences;
        guildId: string | undefined;
        isEmbedUpdate: boolean;
        message: Message | null;
        messageId: string;
        raw: GatewayRawEvents.MessageUpdate;
    }
    interface Oauth2TokenRemove {
    }
    interface PresenceUpdate {
        differences: Differences;
        guildId: string | null;
        isGuildPresence: boolean;
        member: Member | null;
        presence: Presence;
        userId: string;
        wentOffline: boolean;
    }
    interface PresencesReplace {
        presences: BaseCollection<string, Presence>;
    }
    interface RecentMentionDelete {
    }
    interface RelationshipAdd {
        differences: Differences;
        relationship: Relationship;
        userId: string;
    }
    interface RelationshipRemove {
        relationship: Relationship;
        userId: string;
    }
    interface SessionsReplace {
        old: BaseCollection<string, Session>;
        raw: GatewayRawEvents.SessionsReplace;
    }
    interface StreamCreate {
        paused: boolean;
        region: string;
        rtcServerId: string;
        streamKey: string;
        viewerIds: Array<string>;
    }
    interface StreamDelete {
        reason: string;
        streamKey: string;
        unavailable: boolean;
    }
    interface StreamServerUpdate {
        endpoint: string;
        streamKey: string;
        token: string;
    }
    interface StreamUpdate {
        paused: boolean;
        region: string;
        streamKey: string;
        viewerIds: Array<string>;
    }
    interface TypingStart {
        channelId: string;
        guildId: string | undefined;
        typing: Typing;
        userId: string;
    }
    interface TypingStop {
        typing: Typing;
    }
    interface UserAchievementUpdate {
    }
    interface UserConnectionsUpdate {
    }
    interface UserFeedSettingsUpdate {
    }
    interface UserGuildSettingsUpdate {
    }
    interface UserNoteUpdate {
        note: string;
        user: null | User;
        userId: string;
    }
    interface UserPaymentSourcesUpdate {
    }
    interface UserPaymentsUpdate {
    }
    interface UserRequiredActionUpdate {
        differences: {
            requiredAction?: null | string;
        };
        requiredAction: null | string;
    }
    interface UserUpdate {
        differences: Differences;
        user: UserMe;
    }
    interface UsersUpdate {
        differences: Differences;
        from: ClientEvents;
        user: User;
    }
    interface VoiceServerUpdate {
        channelId: string;
        endpoint: string;
        guildId: string | undefined;
        token: string;
    }
    interface VoiceStateUpdate {
        differences: Differences;
        leftChannel: boolean;
        voiceState: VoiceState;
    }
    interface WebhooksUpdate {
        channelId: string;
        guildId: string;
    }
}

import { Tools } from 'detritus-utils';
export { AuthTypes, DiscordAbortCodes, HTTPMethods, } from '../Iris-Client-Rest/Library/constants';
export { CompressTypes, EncodingTypes, GatewayActivityActionTypes as ActivityActionTypes, GatewayActivityFlags as ActivityFlags, GatewayActivityTypes as ActivityTypes, GatewayDispatchEvents, GatewayOpCodes, GatewayPresenceStatuses as PresenceStatuses, MediaCodecs, MediaCodecTypes, MediaOpCodes, MediaSpeakingFlags as SpeakingFlags, SocketCloseCodes, SocketGatewayCloseCodes, SocketMediaCloseCodes, SocketStates, DEFAULT_SHARD_LAUNCH_DELAY, } from '../Iris-Client-Socket/Library/constants';
export { DISCORD_SNOWFLAKE_EPOCH, DISCORD_TOKEN_EPOCH, } from '../Iris-Utils/Library/constants';
export declare const Package: Readonly<{
    URL: string;
    VERSION: string;
}>;
export declare type Snowflake = number | string;
export declare const IS_TS_NODE: boolean;
export declare const DEFAULT_MAX_MEMBERS = 250000;
export declare const DEFAULT_MAX_PRESENCES = 5000;
export declare const DEFAULT_MAX_VIDEO_CHANNEL_USERS = 25;
export declare const LOCAL_GUILD_ID = "@me";
export declare const MAX_ATTACHMENT_SIZE: number;
export declare const MAX_ATTACHMENT_SIZE_PREMIUM: number;
export declare const MAX_BITRATE = 96000;
export declare const MAX_EMOJI_SIZE = 256000;
export declare const MAX_EMOJI_SLOTS = 50;
export declare const MAX_EMOJI_SLOTS_MORE = 200;
export declare const MIN_BITRATE = 8000;
export declare const MEDIA_ATTACHMENT_URL_PREFIX: string;
export declare const MEDIA_SIZES: readonly number[];
export declare const SPOILER_ATTACHMENT_PREFIX = "SPOILER_";
export declare enum ApplicationNewsFlags {
    PATCH_NOTES = 2,
    PROMOTION = 4
}
export declare enum ApplicationTypes {
    GAME = 1,
    MUSIC = 2
}
export declare enum ActivityPartyPrivacy {
    PRIVATE = 0,
    PUBLIC = 1
}
export declare enum ActivityPlatformTypes {
    ANDROID = "android",
    DESKTOP = "desktop",
    EMBEDDED = "embedded",
    IOS = "ios",
    SAMSUNG = "samsung",
    XBOX = "xbox"
}
export declare enum AuditLogActions {
    GUILD_UPDATE = 1,
    CHANNEL_CREATE = 10,
    CHANNEL_UPDATE = 11,
    CHANNEL_DELETE = 12,
    CHANNEL_OVERWRITE_CREATE = 13,
    CHANNEL_OVERWRITE_UPDATE = 14,
    CHANNEL_OVERWRITE_DELETE = 15,
    MEMBER_KICK = 20,
    MEMBER_PRUNE = 21,
    MEMBER_BAN_ADD = 22,
    MEMBER_BAN_REMOVE = 23,
    MEMBER_UPDATE = 24,
    MEMBER_ROLE_UPDATE = 25,
    MEMBER_MOVE = 26,
    MEMBER_DISCONNECT = 27,
    BOT_ADD = 28,
    ROLE_CREATE = 30,
    ROLE_UPDATE = 31,
    ROLE_DELETE = 32,
    INVITE_CREATE = 40,
    INVITE_UPDATE = 41,
    INVITE_DELETE = 42,
    WEBHOOK_CREATE = 50,
    WEBHOOK_UPDATE = 51,
    WEBHOOK_DELETE = 52,
    EMOJI_CREATE = 60,
    EMOJI_UPDATE = 61,
    EMOJI_DELETE = 62,
    MESSAGE_DELETE = 72,
    MESSAGE_BULK_DELETE = 73,
    MESSAGE_PIN = 74,
    MESSAGE_UNPIN = 75,
    INTEGRATION_CREATE = 80,
    INTEGRATION_UPDATE = 81,
    INTEGRATION_DELETE = 82
}
export declare const AuditLogActionTypes: Readonly<{
    [key: string]: any;
}>;
export declare const AuditLogSubtargetTypes: Readonly<{
    USER: string;
    ROLE: string;
}>;
export declare const AuditLogTargetTypes: Readonly<{
    [key: string]: any;
}>;
export declare enum AuditLogChangeKeys {
    AFK_CHANNEL_ID = "afk_channel_id",
    AFK_TIMEOUT = "afk_timeout",
    ALLOW = "allow",
    ALLOW_NEW = "allow_new",
    APPLICATION_ID = "application_id",
    AVATAR_HASH = "avatar_hash",
    BANNER_HASH = "banner_hash",
    BITRATE = "bitrate",
    CHANNEL_ID = "channel_id",
    CODE = "code",
    COLOR = "color",
    DEAF = "deaf",
    DEFAULT_MESSAGE_NOTIFICATIONS = "default_message_notifications",
    DENY = "deny",
    DENY_NEW = "deny_new",
    DESCRIPTION = "description",
    ENABLE_EMOTICONS = "enable_emoticons",
    EXPIRE_BEHAVIOR = "expire_behavior",
    EXPIRE_GRACE_PERIOD = "expire_grace_period",
    EXPLICIT_CONTENT_FILTER = "explicit_content_filter",
    HOIST = "hoist",
    ICON_HASH = "icon_hash",
    ID = "id",
    INVITER_ID = "inviter_id",
    MAX_AGE = "max_age",
    MAX_USES = "max_uses",
    MENTIONABLE = "mentionable",
    MFA_LEVEL = "mfa_level",
    MUTE = "mute",
    NAME = "name",
    NICK = "nick",
    NSFW = "nsfw",
    OWNER_ID = "owner_id",
    PERMISSION_OVERWRITES = "permission_overwrites",
    PERMISSIONS = "permissions",
    PERMISSIONS_DENIED = "deny",
    PERMISSIONS_GRANTED = "allow",
    POSITION = "position",
    PREFERRED_LOCALE = "preferred_locale",
    PRUNE_DELETE_DAYS = "prune_delete_days",
    RATE_LIMIT_PER_USER = "rate_limit_per_user",
    REASON = "reason",
    REGION = "region",
    ROLES_ADD = "$add",
    ROLES_REMOVE = "$remove",
    SPLASH_HASH = "splash_hash",
    SYSTEM_CHANNEL_ID = "system_channel_id",
    WIDGET_CHANNEL_ID = "widget_channel_id",
    WIDGET_ENABLED = "widget_enabled",
    VANITY_URL_CODE = "vanity_url_code",
    VERIFICATION_LEVEL = "verification_level",
    TEMPORARY = "temporary",
    TOPIC = "topic",
    TYPE = "type",
    USES = "uses"
}
export declare enum CarouselMediaTypes {
    IMAGE = 1,
    YOUTUBE_VIDEO = 2,
    VIDEO = 3
}
export declare enum ChannelTypes {
    BASE = -1,
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6
}
export declare enum ClientEvents {
    ACTIVITY_JOIN_INVITE = "activityJoinInvite",
    ACTIVITY_JOIN_REQUEST = "activityJoinRequest",
    ACTIVITY_START = "activityStart",
    BRAINTREE_POPUP_BRIDGE_CALLBACK = "braintreePopupBridgeCallback",
    CALL_CREATE = "callCreate",
    CALL_DELETE = "callDelete",
    CALL_UPDATE = "callUpdate",
    CHANNEL_CREATE = "channelCreate",
    CHANNEL_DELETE = "channelDelete",
    CHANNEL_UPDATE = "channelUpdate",
    CHANNEL_PINS_ACK = "channelPinsAck",
    CHANNEL_PINS_UPDATE = "channelPinsUpdate",
    CHANNEL_RECIPIENT_ADD = "channelRecipientAdd",
    CHANNEL_RECIPIENT_REMOVE = "channelRecipientRemove",
    ENTITLEMENT_CREATE = "entitlementCreate",
    ENTITLEMENT_DELETE = "entitlementDelete",
    ENTITLEMENT_UPDATE = "entitlementUpdate",
    FRIEND_SUGGESTION_CREATE = "friendSuggestionCreate",
    FRIEND_SUGGESTION_DELETE = "friendSuggestionDelete",
    GIFT_CODE_UPDATE = "giftCodeUpdate",
    GUILD_BAN_ADD = "guildBanAdd",
    GUILD_BAN_REMOVE = "guildBanRemove",
    GUILD_CREATE = "guildCreate",
    GUILD_DELETE = "guildDelete",
    GUILD_EMOJIS_UPDATE = "guildEmojisUpdate",
    GUILD_INTEGRATIONS_UPDATE = "guildIntegrationsUpdate",
    GUILD_MEMBER_ADD = "guildMemberAdd",
    GUILD_MEMBER_LIST_UPDATE = "guildMemberListUpdate",
    GUILD_MEMBER_REMOVE = "guildMemberRemove",
    GUILD_MEMBER_UPDATE = "guildMemberUpdate",
    GUILD_MEMBERS_CHUNK = "guildMembersChunk",
    GUILD_READY = "guildReady",
    GUILD_ROLE_CREATE = "guildRoleCreate",
    GUILD_ROLE_DELETE = "guildRoleDelete",
    GUILD_ROLE_UPDATE = "guildRoleUpdate",
    GUILD_UPDATE = "guildUpdate",
    INTERACTION_CREATE = "interactionCreate",
    INVITE_CREATE = "inviteCreate",
    INVITE_DELETE = "inviteDelete",
    LIBRARY_APPLICATION_UPDATE = "libraryApplicationUpdate",
    LOBBY_CREATE = "lobbyCreate",
    LOBBY_DELETE = "lobbyDelete",
    LOBBY_UPDATE = "lobbyUpdate",
    LOBBY_MEMBER_CONNECT = "lobbyMemberConnect",
    LOBBY_MEMBER_DISCONNECT = "lobbyMemberDisconnect",
    LOBBY_MEMBER_UPDATE = "lobbyMemberUpdate",
    LOBBY_MESSAGE = "lobbyMessage",
    LOBBY_VOICE_SERVER_UPDATE = "lobbyVoiceServerUpdate",
    LOBBY_VOICE_STATE_UPDATE = "lobbyVoiceStateUpdate",
    MESSAGE_ACK = "messageAck",
    MESSAGE_CREATE = "messageCreate",
    MESSAGE_DELETE = "messageDelete",
    MESSAGE_DELETE_BULK = "messageDeleteBulk",
    MESSAGE_REACTION_ADD = "messageReactionAdd",
    MESSAGE_REACTION_REMOVE = "messageReactionRemove",
    MESSAGE_REACTION_REMOVE_ALL = "messageReactionRemoveAll",
    MESSAGE_REACTION_REMOVE_EMOJI = "messageReactionRemoveEmoji",
    MESSAGE_UPDATE = "messageUpdate",
    OAUTH2_TOKEN_REMOVE = "oauth2TokenRemove",
    PRESENCES_REPLACE = "presencesReplace",
    PRESENCE_UPDATE = "presenceUpdate",
    RECENT_MENTION_DELETE = "recentMentionDelete",
    RELATIONSHIP_ADD = "relationshipAdd",
    RELATIONSHIP_REMOVE = "relationshipRemove",
    SESSIONS_REPLACE = "sessionsReplace",
    STREAM_CREATE = "streamCreate",
    STREAM_DELETE = "streamDelete",
    STREAM_SERVER_UPDATE = "streamServerUpdate",
    STREAM_UPDATE = "streamUpdate",
    TYPING_START = "typingStart",
    TYPING_STOP = "typingStop",
    USER_ACHIEVEMENT_UPDATE = "userAchievementUpdate",
    USER_CONNECTIONS_UPDATE = "userConnectionsUpdate",
    USER_FEED_SETTINGS_UPDATE = "userFeedSettingsUpdate",
    USER_GUILD_SETTINGS_UPDATE = "userGuildSettingsUpdate",
    USER_NOTE_UPDATE = "userNoteUpdate",
    USER_PAYMENT_SOURCES_UPDATE = "userPaymentSourcesUpdate",
    USER_PAYMENTS_UPDATE = "userPaymentsUpdate",
    USER_REQUIRED_ACTION_UPDATE = "userRequiredActionUpdate",
    USER_SETTINGS_UPDATE = "userSettingsUpdate",
    USER_SUBSCRIPTIONS_UPDATE = "userSubscriptionsUpdate",
    USER_UPDATE = "userUpdate",
    USERS_UPDATE = "usersUpdate",
    VOICE_SERVER_UPDATE = "voiceServerUpdate",
    VOICE_STATE_UPDATE = "voiceStateUpdate",
    WEBHOOKS_UPDATE = "webhooksUpdate",
    CLUSTER_PROCESS = "clusterProcess",
    COMMAND_DELETE = "commandDelete",
    COMMAND_ERROR = "commandError",
    COMMAND_FAIL = "commandFail",
    COMMAND_NONE = "commandNone",
    COMMAND_PERMISSIONS_FAIL = "commandPermissionsFail",
    COMMAND_PERMISSIONS_FAIL_CLIENT = "commandPermissionsFailClient",
    COMMAND_RAN = "commandRan",
    COMMAND_RATELIMIT = "commandRatelimit",
    COMMAND_RESPONSE_DELETE = "commandResponseDelete",
    COMMAND_RUN_ERROR = "commandRunError",
    GATEWAY_READY = "gatewayReady",
    GATEWAY_RESUMED = "gatewayResumed",
    KILLED = "killed",
    RAW = "raw",
    READY = "ready",
    REST_REQUEST = "restRequest",
    REST_RESPONSE = "restResponse",
    SHARD = "shard",
    UNKNOWN = "unknown",
    WARN = "warn"
}
export declare enum ClusterIPCOpCodes {
    READY = 0,
    CLOSE = 1,
    SHARD_STATE = 2,
    RESPAWN_ALL = 3,
    EVAL = 4,
    IDENTIFY_REQUEST = 5
}
export declare enum Colors {
    BLURPLE = 7506394
}
export declare enum CommandArgumentTypes {
    BOOL = "bool",
    FLOAT = "float",
    NUMBER = "number",
    STRING = "string"
}
export declare const CommandErrors: Readonly<{}>;
export declare enum CommandRatelimitTypes {
    CHANNEL = "channel",
    GUILD = "guild",
    USER = "user"
}
export declare enum DiscordOpusFormat {
    CHANNELS = 2,
    SAMPLE_RATE = 48000
}
export declare enum DiscordRegexNames {
    EMOJI = "EMOJI",
    JUMP_CHANNEL = "JUMP_CHANNEL",
    JUMP_CHANNEL_MESSAGE = "JUMP_CHANNEL_MESSAGE",
    MENTION_CHANNEL = "MENTION_CHANNEL",
    MENTION_ROLE = "MENTION_ROLE",
    MENTION_USER = "MENTION_USER",
    TEXT_BOLD = "TEXT_BOLD",
    TEXT_CODEBLOCK = "TEXT_CODEBLOCK",
    TEXT_CODESTRING = "TEXT_CODESTRING",
    TEXT_ITALICS = "TEXT_ITALICS",
    TEXT_SNOWFLAKE = "TEXT_SNOWFLAKE",
    TEXT_SPOILER = "TEXT_SPOILER",
    TEXT_STRIKE = "TEXT_STRIKE",
    TEXT_UNDERLINE = "TEXT_UNDERLINE",
    TEXT_URL = "TEXT_URL"
}
export declare const DiscordRegex: Readonly<{
    EMOJI: RegExp;
    JUMP_CHANNEL: RegExp;
    JUMP_CHANNEL_MESSAGE: RegExp;
    MENTION_CHANNEL: RegExp;
    MENTION_ROLE: RegExp;
    MENTION_USER: RegExp;
    TEXT_BOLD: RegExp;
    TEXT_CODEBLOCK: RegExp;
    TEXT_CODESTRING: RegExp;
    TEXT_ITALICS: RegExp;
    TEXT_SNOWFLAKE: RegExp;
    TEXT_SPOILER: RegExp;
    TEXT_STRIKE: RegExp;
    TEXT_UNDERLINE: RegExp;
    TEXT_URL: RegExp;
}>;
export declare enum Distributors {
    BATTLENET = "battlenet",
    DISCORD = "discord",
    EPIC = "epic",
    GOG = "gog",
    ORIGIN = "origin",
    STEAM = "steam",
    TWITCH = "twitch",
    UPLAY = "uplay"
}
export declare const DistributorNames: {
    [key in Distributors]: string;
};
export declare const DistributorUrls: Tools.URIEncodeWrapped;
export declare enum EntitlementTypes {
    PURCHASE = 1,
    PREMIUM_SUBSCRIPTION = 2,
    DEVELOPER_GIFT = 3,
    TEST_MODE_PURCHASE = 4,
    FREE_PURCHASE = 5,
    USER_GIFT = 6
}
export declare enum ExplicitContentFilterTypes {
    DISABLED = 0,
    NON_FRIENDS = 1,
    FRIENDS_AND_NON_FRIENDS = 2
}
export declare enum GuildExplicitContentFilterTypes {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2
}
export declare const GuildFeatures: Readonly<{
    [key: string]: any;
}>;
export declare enum GuildNotificationSettings {
    ALL = 0,
    MENTIONS = 1
}
export declare enum GuildWidgetStyles {
    BANNER_1 = "banner1",
    BANNER_2 = "banner2",
    BANNER_3 = "banner3",
    BANNER_4 = "banner4",
    SHIELD = "shield"
}
export declare enum ImageFormats {
    GIF = "gif",
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WEBP = "webp"
}
export declare enum InteractionTypes {
    PING = 1,
    APPLICATION_COMMAND = 2
}
export declare enum InviteTargetUserTypes {
    STREAM = 1
}
export declare enum LibraryApplicationFlags {
    HIDDEN = 1,
    PRIVATE = 2,
    OVERLAY_DISABLED = 4,
    ENTITLED = 8,
    PREMIUM = 16
}
export declare enum LobbyErrors {
    NO_ERROR = 0,
    UNKNOWN_ERROR = 1,
    SERVICE_UNAVAILABLE = 2,
    NOT_FOUND = 3,
    INVALID_SECRET = 4,
    FULL = 5,
    LOBBY_LIMIT_REACHED = 6,
    ALREADY_CONNECTING = 7
}
export declare enum LobbyTypes {
    PRIVATE = 1,
    PUBLIC = 2
}
export declare enum Locales {
    BULGARIAN = "bg",
    CHINESE = "zh-CN",
    CHINESE_TAIWAN = "zh-TW",
    CROATIAN = "hr",
    CZECH = "cs",
    DANISH = "da",
    DUTCH = "nl",
    ENGLISH_GB = "en-GB",
    ENGLISH_US = "en-US",
    FINNISH = "fi",
    FRENCH = "fr",
    GERMAN = "de",
    GREEK = "el",
    HUNGARIAN = "hu",
    ITALIAN = "it",
    JAPANESE = "ja",
    KOREAN = "ko",
    LITHUANIAN = "lt",
    NORWEGIAN = "no",
    POLISH = "pl",
    PORTUGUESE_BRAZILIAN = "pt-BR",
    ROMANIAN = "ro",
    RUSSIAN = "ru",
    SPANISH = "es-ES",
    SWEDISH = "sv-SE",
    THAI = "th",
    TURKISH = "tr",
    UKRAINIAN = "uk",
    VIETNAMESE = "vi"
}
export declare const LocalesText: Readonly<{
    bg: string;
    "zh-CN": string;
    "zh-TW": string;
    hr: string;
    cs: string;
    da: string;
    nl: string;
    "en-GB": string;
    "en-US": string;
    fi: string;
    fr: string;
    de: string;
    el: string;
    hu: string;
    it: string;
    ja: string;
    ko: string;
    lt: string;
    no: string;
    pl: string;
    "pt-BR": string;
    ro: string;
    ru: string;
    "es-ES": string;
    "sv-SE": string;
    th: string;
    tr: string;
    uk: string;
    vi: string;
}>;
export declare enum MessageEmbedTypes {
    APPLICATION_NEWS = "application_news",
    ARTICLE = "article",
    GIFV = "gifv",
    IMAGE = "image",
    LINK = "link",
    RICH = "rich",
    TWEET = "tweet",
    VIDEO = "video"
}
export declare enum MessageFlags {
    CROSSPOSTED = 1,
    IS_CROSSPOST = 2,
    SUPPRESS_EMBEDS = 4,
    SOURCE_MESSAGE_DELETED = 8,
    URGENT = 16,
    EPHEMERAL = 64
}
export declare enum MessageTypes {
    BASE = -1,
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    GUILD_PREMIUM_SUBSCRIPTION = 8,
    GUILD_PREMIUM_SUBSCRIPTION_TIER_1 = 9,
    GUILD_PREMIUM_SUBSCRIPTION_TIER_2 = 10,
    GUILD_PREMIUM_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_STREAM = 13,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 17,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 18,
    REPLY = 19,
    APPLICATION_COMMAND = 20
}
export declare const MessageTypesDeletable: Readonly<{
    [-1]: boolean;
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
    7: boolean;
    8: boolean;
    9: boolean;
    10: boolean;
    11: boolean;
    12: boolean;
    13: boolean;
    14: boolean;
    15: boolean;
    17: boolean;
    18: boolean;
    19: boolean;
    20: boolean;
}>;
export declare enum MfaLevels {
    NONE = 0,
    ELEVATED = 1
}
export declare enum Oauth2AssetTypes {
    SMALL = 1,
    LARGE = 2
}
export declare enum Oauth2Scopes {
    ACTIVITIES_READ = "activities.read",
    ACTIVITIES_WRITE = "activities.write",
    APPLICATIONS_BUILDS_UPLOAD = "applications.builds.upload",
    APPLICATIONS_BUILDS_READ = "applications.builds.read",
    APPLICATIONS_ENTITLEMENTS = "applications.entitlements",
    APPLICATIONS_STORE_UPDATE = "applications.store.update",
    BOT = "bot",
    CONNECTIONS = "connections",
    EMAIL = "email",
    GDM_JOIN = "gdm.join",
    GUILDS = "guilds",
    GUILDS_JOIN = "guilds.join",
    IDENTIFY = "identify",
    MESSAGES_READ = "messages.read",
    RELATIONSHIPS_READ = "relationships.read",
    RPC = "rpc",
    RPC_API = "rpc.api",
    RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
    WEBHOOK_INCOMING = "webhook.incoming"
}
export declare enum OverwriteTypes {
    ROLE = 0,
    MEMBER = 1
}
export declare const Permissions: Readonly<{
    NONE: bigint;
    CREATE_INSTANT_INVITE: bigint;
    KICK_MEMBERS: bigint;
    BAN_MEMBERS: bigint;
    ADMINISTRATOR: bigint;
    MANAGE_CHANNELS: bigint;
    MANAGE_GUILD: bigint;
    ADD_REACTIONS: bigint;
    VIEW_AUDIT_LOG: bigint;
    PRIORITY_SPEAKER: bigint;
    STREAM: bigint;
    VIEW_CHANNEL: bigint;
    SEND_MESSAGES: bigint;
    SEND_TTS_MESSAGES: bigint;
    MANAGE_MESSAGES: bigint;
    EMBED_LINKS: bigint;
    ATTACH_FILES: bigint;
    READ_MESSAGE_HISTORY: bigint;
    MENTION_EVERYONE: bigint;
    USE_EXTERNAL_EMOJIS: bigint;
    VIEW_GUILD_ANALYTICS: bigint;
    CONNECT: bigint;
    SPEAK: bigint;
    MUTE_MEMBERS: bigint;
    DEAFEN_MEMBERS: bigint;
    MOVE_MEMBERS: bigint;
    USE_VAD: bigint;
    CHANGE_NICKNAME: bigint;
    CHANGE_NICKNAMES: bigint;
    MANAGE_ROLES: bigint;
    MANAGE_WEBHOOKS: bigint;
    MANAGE_EMOJIS: bigint;
}>;
export declare const PERMISSIONS_ALL: bigint;
export declare const PERMISSIONS_ALL_TEXT: bigint;
export declare const PERMISSIONS_ALL_VOICE: bigint;
export declare const PERMISSIONS_DEFAULT: bigint;
export declare const PERMISSIONS_LURKER: bigint;
export declare enum PlatformTypes {
    BATTLENET = "battlenet",
    CONTACTS = "contacts",
    FACEBOOK = "facebook",
    GITHUB = "github",
    INSTAGRAM = "instagram",
    LEAGUE_OF_LEGENDS = "leagueoflegends",
    REDDIT = "reddit",
    SAMSUNG = "samsung",
    SKYPE = "skype",
    SOUNDCLOUD = "soundcloud",
    SPOTIFY = "spotify",
    STEAM = "steam",
    TWITCH = "twitch",
    TWITTER = "twitter",
    YOUTUBE = "youtube",
    XBOX = "xbox"
}
export declare enum PremiumGuildTiers {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3
}
export declare const PremiumGuildTierNames: Readonly<{
    0: string;
    1: string;
    2: string;
    3: string;
}>;
export declare const PremiumGuildSubscriptionsRequired: Readonly<{
    0: number;
    1: number;
    2: number;
    3: number;
}>;
export declare const PremiumGuildLimits: Readonly<{
    0: Readonly<{
        attachment: number;
        bitrate: number;
        emoji: number;
    }>;
    1: Readonly<{
        attachment: number;
        bitrate: number;
        emoji: number;
    }>;
    2: Readonly<{
        attachment: number;
        bitrate: number;
        emoji: number;
    }>;
    3: Readonly<{
        attachment: number;
        bitrate: number;
        emoji: number;
    }>;
}>;
export declare enum PremiumUserTypes {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2
}
export declare const PremiumUserLimits: Readonly<{
    0: Readonly<{
        attachment: number;
    }>;
    1: Readonly<{
        attachment: number;
    }>;
    2: Readonly<{
        attachment: number;
    }>;
}>;
export declare enum RelationshipTypes {
    NONE = 0,
    FRIEND = 1,
    BLOCKED = 2,
    PENDING_INCOMING = 3,
    PENDING_OUTGOING = 4,
    IMPLICIT = 5
}
export declare enum SkuAccessTypes {
    FULL = 1,
    EARLY_ACCESS = 2,
    VIP_ACCESS = 3
}
export declare enum SkuFlags {
    PREMIUM_PURCHASE = 1,
    HAS_FREE_PREMIUM_CONTENT = 2,
    AVAILABLE = 4,
    PREMIUM_AND_DISTRIBUTION = 8,
    STICKER_PACK = 16
}
export declare enum SkuTypes {
    BASE = 0,
    GAME = 1,
    DLC = 2,
    CONSUMABLE = 3,
    BUNDLE = 4,
    SUBSCRIPTION = 5
}
export declare const SpecialUrls: Tools.URIEncodeWrapped;
export declare enum StickerFormats {
    UNKNOWN = 0,
    PNG = 1,
    APNG = 2,
    LOTTIE = 3
}
export declare enum StickerExtensions {
    PNG = "png",
    APNG = "png",
    LOTTIE = "json"
}
export declare enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS = 1,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 2
}
export declare const SystemMessages: Readonly<{
    ApplicationCommandUsed: string;
    CallMissed: string;
    CallMissedWithDuration: string;
    CallStarted: string;
    CallStartedWithDuration: string;
    ChannelFollowAdd: string;
    ChannelIconChange: string;
    ChannelNameChange: string;
    GuildDiscoveryDisqualified: string;
    GuildDiscoveryGracePeriodFinalWarning: string;
    GuildDiscoveryGracePeriodInitialWarning: string;
    GuildDiscoveryRequalified: string;
    PinnedMessage: string;
    RecipientAdd: string;
    RecipientRemove: string;
    RecipientRemoveSelf: string;
    GuildMemberJoin: string[];
    GuildMemberSubscribed: string;
    GuildMemberSubscribedAchievedTier: string;
}>;
export declare enum TeamMembershipStates {
    BASE = 0,
    INVITED = 1,
    ACCEPTED = 2
}
export declare enum TeamPayoutAccountStatuses {
    UNSUBMITTED = -1,
    PENDING = 2,
    ACTION_REQUIRED = 3,
    ACTIVE = 4,
    BLOCKED = 5,
    SUSPENDED = 6
}
export declare const TYPING_TIMEOUT = 10000;
export declare enum UserFlags {
    STAFF = 1,
    PARTNER = 2,
    HYPESQUAD = 4,
    BUG_HUNTER_LEVEL_1 = 8,
    MFA_SMS = 16,
    PREMIUM_PROMO_DISMISSED = 32,
    HYPESQUAD_ONLINE_HOUSE_1 = 64,
    HYPESQUAD_ONLINE_HOUSE_2 = 128,
    HYPESQUAD_ONLINE_HOUSE_3 = 256,
    PREMIUM_EARLY_SUPPORTER = 512,
    TEAM_USER = 1024,
    SYSTEM = 4096,
    HAS_UNREAD_URGENT_MESSAGES = 8192,
    BUG_HUNTER_LEVEL_2 = 16384,
    VERIFIED_BOT = 65536,
    VERIFIED_DEVELOPER = 131072
}
export declare enum UserPremiumGuildSubscriptionLevels {
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
    LEVEL_4 = 4,
    LEVEL_5 = 5,
    LEVEL_6 = 6,
    LEVEL_7 = 7,
    LEVEL_8 = 8,
    LEVEL_9 = 9
}
export declare const UserPremiumGuildSubscriptionMonths: Readonly<{
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
}>;
export declare const UserRequiredActions: Readonly<{
    [key: string]: any;
}>;
export declare enum VerificationLevels {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4
}
export declare enum WebhookTypes {
    INCOMING = 1,
    NEWS_FOLLOWING = 2
}
export declare const DiscordKeys: Readonly<{
    ACCESS_TYPE: string;
    ACCOUNT: string;
    ACTION_TYPE: string;
    ACTIVE: string;
    ACTIVITIES: string;
    ACTIVITY: string;
    AFK_CHANNEL_ID: string;
    AFK_TIMEOUT: string;
    ALIASES: string;
    ALLOW: string;
    ALLOW_NEW: string;
    ANALYTICS_TOKEN: string;
    ANIMATED: string;
    APPLICATION: string;
    APPLICATION_ID: string;
    APPROXIMATE_MEMBER_COUNT: string;
    APPROXIMATE_PRESENCE_COUNT: string;
    ASSET: string;
    ASSETS: string;
    ATTACHMENTS: string;
    AUTHOR: string;
    AVAILABLE: string;
    AVATAR: string;
    BANNER: string;
    BITRATE: string;
    BOT: string;
    BOT_PUBLIC: string;
    BOT_REQUIRE_CODE_GRANT: string;
    BOX_ART: string;
    BUTTONS: string;
    CALL: string;
    CAROUSEL_ITEMS: string;
    CATEGORY: string;
    CHANGES: string;
    CHANNEL: string;
    CHANNELS: string;
    CHANNEL_ID: string;
    CLIENT: string;
    CLIENT_INFO: string;
    CLIENT_STATUS: string;
    CODE: string;
    COLOR: string;
    CONNECTED_ACCOUNTS: string;
    CONTENT: string;
    CONTENT_RATING: string;
    CONTENT_RATING_AGENCY: string;
    COUNT: string;
    COVER_IMAGE: string;
    CREATED_AT: string;
    CREATOR: string;
    CREATOR_ID: string;
    CURRENCY: string;
    CUSTOM: string;
    DEAF: string;
    DEFAULT_MESSAGE_NOTIFICATIONS: string;
    DELETE_MEMBER_DAYS: string;
    DENY: string;
    DENY_NEW: string;
    DEPENDENT_SKU_ID: string;
    DEPRECATED: string;
    DESCRIPTION: string;
    DESKTOP: string;
    DETAILS: string;
    DEVELOPERS: string;
    DISCOVERY_SPLASH: string;
    DISCRIMINATOR: string;
    DISTRIBUTOR: string;
    EDITED_TIMESTAMP: string;
    EMAIL: string;
    EMBEDS: string;
    EMBED_CHANNEL_ID: string;
    EMBED_ENABLED: string;
    EMOJI: string;
    EMOJIS: string;
    ENABLED: string;
    END: string;
    ENDED: string;
    ENDED_TIMESTAMP: string;
    ENTITLEMENT_BRANCH_ID: string;
    EULA_ID: string;
    EXECUTABLES: string;
    EXPIRES_AT: string;
    EXPIRE_BEHAVIOR: string;
    EXPIRE_GRACE_PERIOD: string;
    EXPLICIT_CONTENT_FILTER: string;
    FEATURES: string;
    FIELDS: string;
    FILENAME: string;
    FLAGS: string;
    FOOTER: string;
    FORMAT_TYPE: string;
    FRIEND_SYNC: string;
    GAME: string;
    GAME_ID: string;
    GENRES: string;
    GUILD: string;
    GUILD_ID: string;
    GUILD_IDS: string;
    HEADER_BACKGROUND: string;
    HEADER_LOGO_DARK_THEME: string;
    HEADER_LOGO_LIGHT_THEME: string;
    HEIGHT: string;
    HERO_BACKGROUND: string;
    HERO_VIDEO: string;
    HOIST: string;
    HOISTED_ROLE: string;
    HOOK: string;
    ICON: string;
    ICON_URL: string;
    ID: string;
    IMAGE: string;
    INLINE: string;
    INSTANCE: string;
    INTEGRATIONS: string;
    INTERVAL: string;
    INTERVAL_COUNT: string;
    INVITER: string;
    IS_DIRTY: string;
    IS_PARTIAL: string;
    IS_PENDING: string;
    JOIN: string;
    JOINED_AT: string;
    KEY: string;
    LARGE: string;
    LARGE_IMAGE: string;
    LARGE_TEXT: string;
    LAST_MESSAGE_ID: string;
    LAST_MODIFIED: string;
    LAST_PIN_TIMESTAMP: string;
    LAZY: string;
    LEGAL_NOTICE: string;
    LOCALE: string;
    LOCALES: string;
    MANAGED: string;
    MANIFEST_LABELS: string;
    MATCH: string;
    MAX_AGE: string;
    MAX_MEMBERS: string;
    MAX_PRESENCES: string;
    MAX_USES: string;
    MAX_VIDEO_CHANNEL_USERS: string;
    ME: string;
    MEMBER: string;
    MEMBERS: string;
    MEMBERSHIP_STATE: string;
    MEMBERS_REMOVED: string;
    MEMBER_COUNT: string;
    MENTIONABLE: string;
    MENTIONS: string;
    MENTION_CHANNELS: string;
    MENTION_EVERYONE: string;
    MENTION_ROLES: string;
    MESSAGE_ID: string;
    MESSAGE_REFERENCE: string;
    METADATA: string;
    MFA_ENABLED: string;
    MFA_LEVEL: string;
    MIME_TYPE: string;
    MOBILE: string;
    MUTE: string;
    MUTUAL_GUILDS: string;
    NAME: string;
    NEW_VALUE: string;
    NICK: string;
    NICKS: string;
    NONCE: string;
    NSFW: string;
    OLD_VALUE: string;
    OPTIMAL: string;
    OPTIONS: string;
    OS: string;
    OVERLAY: string;
    OVERLAY_COMPATIBILITY_HOOK: string;
    OWNER: string;
    OWNER_ID: string;
    OWNER_USER_ID: string;
    PACK_ID: string;
    PARENT_ID: string;
    PARTICIPANTS: string;
    PARTY: string;
    PARTY_ID: string;
    PAYOUT_ACCOUNT_STATUS: string;
    PENDING: string;
    PERMISSIONS: string;
    PERMISSIONS_NEW: string;
    PERMISSION_OVERWRITES: string;
    PHONE: string;
    PINNED: string;
    PLATFORM: string;
    POSITION: string;
    PREFERRED_LOCALE: string;
    PREMIUM: string;
    PREMIUM_GUILD_SINCE: string;
    PREMIUM_SINCE: string;
    PREMIUM_SUBSCRIPTION_COUNT: string;
    PREMIUM_TIER: string;
    PREMIUM_TYPE: string;
    PRESENCES: string;
    PREVIEW_ASSET: string;
    PREVIEW_VIDEO: string;
    PRICE: string;
    PRIMARY_SKU_ID: string;
    PROVIDER: string;
    PROXY_ICON_URL: string;
    PROXY_URL: string;
    PUBLIC_FLAGS: string;
    PUBLIC_UPDATES_CHANNEL_ID: string;
    PUBLISHERS: string;
    RATE_LIMIT_PER_USER: string;
    REACTIONS: string;
    REASON: string;
    RECIPIENTS: string;
    REDEEMED: string;
    REDIRECT_URIS: string;
    REFERENCE_ID: string;
    REFERENCED_MESSAGE: string;
    REGION: string;
    RELEASE_DATE: string;
    REQUIRE_COLONS: string;
    REVOKED: string;
    RINGING: string;
    ROLES: string;
    ROLE_ID: string;
    RPC_APPLICATION_STATE: string;
    RPC_ORIGINS: string;
    RULES_CHANNEL_ID: string;
    SECRET: string;
    SECRETS: string;
    SELF_DEAF: string;
    SELF_MUTE: string;
    SELF_STREAM: string;
    SELF_VIDEO: string;
    SERIALIZED_SOURCE_GUILD: string;
    SESSION_ID: string;
    SHOW_ACTIVITY: string;
    SHOW_AGE_GATE: string;
    SIZE: string;
    SKU: string;
    SKU_ID: string;
    SLUG: string;
    SMALL_IMAGE: string;
    SMALL_TEXT: string;
    SOURCE_GUILD_ID: string;
    SPECTATE: string;
    SPLASH: string;
    START: string;
    STARTED: string;
    STATE: string;
    STATUS: string;
    STICKERS: string;
    STOPPED: string;
    STORE_APPLICATION_STATE: string;
    STORE_LISTING: string;
    SUBSCRIPTION_PLAN: string;
    SUBSCRIPTION_PLAN_ID: string;
    SUBTARGET: string;
    SUMMARY: string;
    SUPPRESS: string;
    SYNCED_AT: string;
    SYNCING: string;
    SYNC_ID: string;
    SYSTEM: string;
    SYSTEM_CHANNEL_FLAGS: string;
    SYSTEM_CHANNEL_ID: string;
    SYSTEM_REQUIREMENTS: string;
    TAGLINE: string;
    TAGS: string;
    TARGET: string;
    TARGET_ID: string;
    TARGET_USER: string;
    TARGET_USER_TYPE: string;
    TAX_INCLUSIVE: string;
    TEAM: string;
    TEAM_ID: string;
    TEMPORARY: string;
    TEXT: string;
    THIRD_PARTY_SKUS: string;
    THUMBNAIL: string;
    TIMESTAMP: string;
    TIMESTAMPS: string;
    TITLE: string;
    TOKEN: string;
    TOPIC: string;
    TTS: string;
    TYPE: string;
    UNAVAILABLE: string;
    UPDATED_AT: string;
    URL: string;
    USAGE_COUNT: string;
    USER: string;
    USERNAME: string;
    USER_ID: string;
    USER_LIMIT: string;
    USES: string;
    VALUE: string;
    VANITY_URL_CODE: string;
    VERIFICATION_LEVEL: string;
    VERIFIED: string;
    VERIFY_KEY: string;
    VERSION: string;
    VIDEO: string;
    VIP: string;
    VISIBILITY: string;
    VOICE_STATES: string;
    WEB: string;
    WEBHOOK_ID: string;
    WIDGET_CHANNEL_ID: string;
    WIDGET_ENABLED: string;
    WIDTH: string;
    YOUTUBE_TRAILER_VIDEO_ID: string;
}>;
export declare const DetritusKeys: Readonly<{
    [x: string]: string;
}>;
export declare const COMMAND_RATELIMIT_TYPES: ReadonlyArray<string>;
export declare const DEFAULT_GROUP_DM_AVATARS: ReadonlyArray<string>;
export declare const IMAGE_FORMATS: ReadonlyArray<string>;

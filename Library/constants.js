"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEvents = exports.ChannelTypes = exports.CarouselMediaTypes = exports.AuditLogChangeKeys = exports.AuditLogTargetTypes = exports.AuditLogSubtargetTypes = exports.AuditLogActionTypes = exports.AuditLogActions = exports.ActivityPlatformTypes = exports.ActivityPartyPrivacy = exports.ApplicationTypes = exports.ApplicationNewsFlags = exports.SPOILER_ATTACHMENT_PREFIX = exports.MEDIA_SIZES = exports.MEDIA_ATTACHMENT_URL_PREFIX = exports.MIN_BITRATE = exports.MAX_EMOJI_SLOTS_MORE = exports.MAX_EMOJI_SLOTS = exports.MAX_EMOJI_SIZE = exports.MAX_BITRATE = exports.MAX_ATTACHMENT_SIZE_PREMIUM = exports.MAX_ATTACHMENT_SIZE = exports.LOCAL_GUILD_ID = exports.DEFAULT_MAX_VIDEO_CHANNEL_USERS = exports.DEFAULT_MAX_PRESENCES = exports.DEFAULT_MAX_MEMBERS = exports.IS_TS_NODE = exports.Package = exports.DISCORD_TOKEN_EPOCH = exports.DISCORD_SNOWFLAKE_EPOCH = exports.DEFAULT_SHARD_LAUNCH_DELAY = exports.SocketStates = exports.SocketMediaCloseCodes = exports.SocketGatewayCloseCodes = exports.SocketCloseCodes = exports.SpeakingFlags = exports.MediaOpCodes = exports.MediaCodecTypes = exports.MediaCodecs = exports.PresenceStatuses = exports.GatewayOpCodes = exports.GatewayDispatchEvents = exports.ActivityTypes = exports.ActivityFlags = exports.ActivityActionTypes = exports.EncodingTypes = exports.CompressTypes = exports.HTTPMethods = exports.DiscordAbortCodes = exports.AuthTypes = void 0;
exports.SkuTypes = exports.SkuFlags = exports.SkuAccessTypes = exports.RelationshipTypes = exports.PremiumUserLimits = exports.PremiumUserTypes = exports.PremiumGuildLimits = exports.PremiumGuildSubscriptionsRequired = exports.PremiumGuildTierNames = exports.PremiumGuildTiers = exports.PlatformTypes = exports.PERMISSIONS_LURKER = exports.PERMISSIONS_DEFAULT = exports.PERMISSIONS_ALL_VOICE = exports.PERMISSIONS_ALL_TEXT = exports.PERMISSIONS_ALL = exports.Permissions = exports.OverwriteTypes = exports.Oauth2Scopes = exports.Oauth2AssetTypes = exports.MfaLevels = exports.MessageTypesDeletable = exports.MessageTypes = exports.MessageFlags = exports.MessageEmbedTypes = exports.LocalesText = exports.Locales = exports.LobbyTypes = exports.LobbyErrors = exports.LibraryApplicationFlags = exports.InviteTargetUserTypes = exports.InteractionTypes = exports.ImageFormats = exports.GuildWidgetStyles = exports.GuildNotificationSettings = exports.GuildFeatures = exports.GuildExplicitContentFilterTypes = exports.ExplicitContentFilterTypes = exports.EntitlementTypes = exports.DistributorUrls = exports.DistributorNames = exports.Distributors = exports.DiscordRegex = exports.DiscordRegexNames = exports.DiscordOpusFormat = exports.CommandRatelimitTypes = exports.CommandErrors = exports.CommandArgumentTypes = exports.Colors = exports.ClusterIPCOpCodes = void 0;
exports.IMAGE_FORMATS = exports.DEFAULT_GROUP_DM_AVATARS = exports.COMMAND_RATELIMIT_TYPES = exports.DetritusKeys = exports.DiscordKeys = exports.WebhookTypes = exports.VerificationLevels = exports.UserRequiredActions = exports.UserPremiumGuildSubscriptionMonths = exports.UserPremiumGuildSubscriptionLevels = exports.UserFlags = exports.TYPING_TIMEOUT = exports.TeamPayoutAccountStatuses = exports.TeamMembershipStates = exports.SystemMessages = exports.SystemChannelFlags = exports.StickerExtensions = exports.StickerFormats = exports.SpecialUrls = void 0;
const iris_client_rest_1 = require("../Iris-Client-Rest");
const iris_utils_1 = require("../Iris-Utils");
var constants_1 = require('../Iris-Client-Rest/Library/constants');
Object.defineProperty(exports, "AuthTypes", { enumerable: true, get: function () { return constants_1.AuthTypes; } });
Object.defineProperty(exports, "DiscordAbortCodes", { enumerable: true, get: function () { return constants_1.DiscordAbortCodes; } });
Object.defineProperty(exports, "HTTPMethods", { enumerable: true, get: function () { return constants_1.HTTPMethods; } });
var constants_2 = require("../Iris-Client-Socket/Library/constants");
Object.defineProperty(exports, "CompressTypes", { enumerable: true, get: function () { return constants_2.CompressTypes; } });
Object.defineProperty(exports, "EncodingTypes", { enumerable: true, get: function () { return constants_2.EncodingTypes; } });
Object.defineProperty(exports, "ActivityActionTypes", { enumerable: true, get: function () { return constants_2.GatewayActivityActionTypes; } });
Object.defineProperty(exports, "ActivityFlags", { enumerable: true, get: function () { return constants_2.GatewayActivityFlags; } });
Object.defineProperty(exports, "ActivityTypes", { enumerable: true, get: function () { return constants_2.GatewayActivityTypes; } });
Object.defineProperty(exports, "GatewayDispatchEvents", { enumerable: true, get: function () { return constants_2.GatewayDispatchEvents; } });
Object.defineProperty(exports, "GatewayOpCodes", { enumerable: true, get: function () { return constants_2.GatewayOpCodes; } });
Object.defineProperty(exports, "PresenceStatuses", { enumerable: true, get: function () { return constants_2.GatewayPresenceStatuses; } });
Object.defineProperty(exports, "MediaCodecs", { enumerable: true, get: function () { return constants_2.MediaCodecs; } });
Object.defineProperty(exports, "MediaCodecTypes", { enumerable: true, get: function () { return constants_2.MediaCodecTypes; } });
Object.defineProperty(exports, "MediaOpCodes", { enumerable: true, get: function () { return constants_2.MediaOpCodes; } });
Object.defineProperty(exports, "SpeakingFlags", { enumerable: true, get: function () { return constants_2.MediaSpeakingFlags; } });
Object.defineProperty(exports, "SocketCloseCodes", { enumerable: true, get: function () { return constants_2.SocketCloseCodes; } });
Object.defineProperty(exports, "SocketGatewayCloseCodes", { enumerable: true, get: function () { return constants_2.SocketGatewayCloseCodes; } });
Object.defineProperty(exports, "SocketMediaCloseCodes", { enumerable: true, get: function () { return constants_2.SocketMediaCloseCodes; } });
Object.defineProperty(exports, "SocketStates", { enumerable: true, get: function () { return constants_2.SocketStates; } });
Object.defineProperty(exports, "DEFAULT_SHARD_LAUNCH_DELAY", { enumerable: true, get: function () { return constants_2.DEFAULT_SHARD_LAUNCH_DELAY; } });
var constants_3 = require("../Iris-Utils/Library/constants");
Object.defineProperty(exports, "DISCORD_SNOWFLAKE_EPOCH", { enumerable: true, get: function () { return constants_3.DISCORD_SNOWFLAKE_EPOCH; } });
Object.defineProperty(exports, "DISCORD_TOKEN_EPOCH", { enumerable: true, get: function () { return constants_3.DISCORD_TOKEN_EPOCH; } });
exports.Package = Object.freeze({
    URL: 'https://github.com/NotMarx/Iris',
    VERSION: '0.13.0',
});
exports.IS_TS_NODE = Symbol.for('ts-node.register.instance') in process;
exports.DEFAULT_MAX_MEMBERS = 250000;
exports.DEFAULT_MAX_PRESENCES = 5000;
exports.DEFAULT_MAX_VIDEO_CHANNEL_USERS = 25;
exports.LOCAL_GUILD_ID = '@me';
exports.MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024;
exports.MAX_ATTACHMENT_SIZE_PREMIUM = 50 * 1024 * 1024;
exports.MAX_BITRATE = 96000;
exports.MAX_EMOJI_SIZE = 256000;
exports.MAX_EMOJI_SLOTS = 50;
exports.MAX_EMOJI_SLOTS_MORE = 200;
exports.MIN_BITRATE = 8000;
exports.MEDIA_ATTACHMENT_URL_PREFIX = iris_client_rest_1.Endpoints.Urls.MEDIA + 'attachments/';
exports.MEDIA_SIZES = Object.freeze([16, 20, 32, 40, 64, 80, 128, 160, 256, 320, 512, 640, 1024, 1280, 1536, 2048, 3072, 4096]);
exports.SPOILER_ATTACHMENT_PREFIX = 'SPOILER_';
var ApplicationNewsFlags;
(function (ApplicationNewsFlags) {
    ApplicationNewsFlags[ApplicationNewsFlags["PATCH_NOTES"] = 2] = "PATCH_NOTES";
    ApplicationNewsFlags[ApplicationNewsFlags["PROMOTION"] = 4] = "PROMOTION";
})(ApplicationNewsFlags = exports.ApplicationNewsFlags || (exports.ApplicationNewsFlags = {}));
;
var ApplicationTypes;
(function (ApplicationTypes) {
    ApplicationTypes[ApplicationTypes["GAME"] = 1] = "GAME";
    ApplicationTypes[ApplicationTypes["MUSIC"] = 2] = "MUSIC";
})(ApplicationTypes = exports.ApplicationTypes || (exports.ApplicationTypes = {}));
var ActivityPartyPrivacy;
(function (ActivityPartyPrivacy) {
    ActivityPartyPrivacy[ActivityPartyPrivacy["PRIVATE"] = 0] = "PRIVATE";
    ActivityPartyPrivacy[ActivityPartyPrivacy["PUBLIC"] = 1] = "PUBLIC";
})(ActivityPartyPrivacy = exports.ActivityPartyPrivacy || (exports.ActivityPartyPrivacy = {}));
var ActivityPlatformTypes;
(function (ActivityPlatformTypes) {
    ActivityPlatformTypes["ANDROID"] = "android";
    ActivityPlatformTypes["DESKTOP"] = "desktop";
    ActivityPlatformTypes["EMBEDDED"] = "embedded";
    ActivityPlatformTypes["IOS"] = "ios";
    ActivityPlatformTypes["SAMSUNG"] = "samsung";
    ActivityPlatformTypes["XBOX"] = "xbox";
})(ActivityPlatformTypes = exports.ActivityPlatformTypes || (exports.ActivityPlatformTypes = {}));
;
var AuditLogActions;
(function (AuditLogActions) {
    AuditLogActions[AuditLogActions["GUILD_UPDATE"] = 1] = "GUILD_UPDATE";
    AuditLogActions[AuditLogActions["CHANNEL_CREATE"] = 10] = "CHANNEL_CREATE";
    AuditLogActions[AuditLogActions["CHANNEL_UPDATE"] = 11] = "CHANNEL_UPDATE";
    AuditLogActions[AuditLogActions["CHANNEL_DELETE"] = 12] = "CHANNEL_DELETE";
    AuditLogActions[AuditLogActions["CHANNEL_OVERWRITE_CREATE"] = 13] = "CHANNEL_OVERWRITE_CREATE";
    AuditLogActions[AuditLogActions["CHANNEL_OVERWRITE_UPDATE"] = 14] = "CHANNEL_OVERWRITE_UPDATE";
    AuditLogActions[AuditLogActions["CHANNEL_OVERWRITE_DELETE"] = 15] = "CHANNEL_OVERWRITE_DELETE";
    AuditLogActions[AuditLogActions["MEMBER_KICK"] = 20] = "MEMBER_KICK";
    AuditLogActions[AuditLogActions["MEMBER_PRUNE"] = 21] = "MEMBER_PRUNE";
    AuditLogActions[AuditLogActions["MEMBER_BAN_ADD"] = 22] = "MEMBER_BAN_ADD";
    AuditLogActions[AuditLogActions["MEMBER_BAN_REMOVE"] = 23] = "MEMBER_BAN_REMOVE";
    AuditLogActions[AuditLogActions["MEMBER_UPDATE"] = 24] = "MEMBER_UPDATE";
    AuditLogActions[AuditLogActions["MEMBER_ROLE_UPDATE"] = 25] = "MEMBER_ROLE_UPDATE";
    AuditLogActions[AuditLogActions["MEMBER_MOVE"] = 26] = "MEMBER_MOVE";
    AuditLogActions[AuditLogActions["MEMBER_DISCONNECT"] = 27] = "MEMBER_DISCONNECT";
    AuditLogActions[AuditLogActions["BOT_ADD"] = 28] = "BOT_ADD";
    AuditLogActions[AuditLogActions["ROLE_CREATE"] = 30] = "ROLE_CREATE";
    AuditLogActions[AuditLogActions["ROLE_UPDATE"] = 31] = "ROLE_UPDATE";
    AuditLogActions[AuditLogActions["ROLE_DELETE"] = 32] = "ROLE_DELETE";
    AuditLogActions[AuditLogActions["INVITE_CREATE"] = 40] = "INVITE_CREATE";
    AuditLogActions[AuditLogActions["INVITE_UPDATE"] = 41] = "INVITE_UPDATE";
    AuditLogActions[AuditLogActions["INVITE_DELETE"] = 42] = "INVITE_DELETE";
    AuditLogActions[AuditLogActions["WEBHOOK_CREATE"] = 50] = "WEBHOOK_CREATE";
    AuditLogActions[AuditLogActions["WEBHOOK_UPDATE"] = 51] = "WEBHOOK_UPDATE";
    AuditLogActions[AuditLogActions["WEBHOOK_DELETE"] = 52] = "WEBHOOK_DELETE";
    AuditLogActions[AuditLogActions["EMOJI_CREATE"] = 60] = "EMOJI_CREATE";
    AuditLogActions[AuditLogActions["EMOJI_UPDATE"] = 61] = "EMOJI_UPDATE";
    AuditLogActions[AuditLogActions["EMOJI_DELETE"] = 62] = "EMOJI_DELETE";
    AuditLogActions[AuditLogActions["MESSAGE_DELETE"] = 72] = "MESSAGE_DELETE";
    AuditLogActions[AuditLogActions["MESSAGE_BULK_DELETE"] = 73] = "MESSAGE_BULK_DELETE";
    AuditLogActions[AuditLogActions["MESSAGE_PIN"] = 74] = "MESSAGE_PIN";
    AuditLogActions[AuditLogActions["MESSAGE_UNPIN"] = 75] = "MESSAGE_UNPIN";
    AuditLogActions[AuditLogActions["INTEGRATION_CREATE"] = 80] = "INTEGRATION_CREATE";
    AuditLogActions[AuditLogActions["INTEGRATION_UPDATE"] = 81] = "INTEGRATION_UPDATE";
    AuditLogActions[AuditLogActions["INTEGRATION_DELETE"] = 82] = "INTEGRATION_DELETE";
})(AuditLogActions = exports.AuditLogActions || (exports.AuditLogActions = {}));
;
exports.AuditLogActionTypes = iris_utils_1.Tools.normalize({
    ALL: null,
    CREATE: null,
    UPDATE: null,
    DELETE: null,
});
exports.AuditLogSubtargetTypes = Object.freeze({
    USER: 'member',
    ROLE: 'role',
});
exports.AuditLogTargetTypes = iris_utils_1.Tools.normalize({
    ALL: null,
    CHANNEL: null,
    CHANNEL_OVERWRITE: null,
    EMOJI: null,
    GUILD: null,
    INTEGRATION: null,
    INVITE: null,
    ROLE: null,
    UNKNOWN: null,
    USER: null,
    WEBHOOK: null,
});
var AuditLogChangeKeys;
(function (AuditLogChangeKeys) {
    AuditLogChangeKeys["AFK_CHANNEL_ID"] = "afk_channel_id";
    AuditLogChangeKeys["AFK_TIMEOUT"] = "afk_timeout";
    AuditLogChangeKeys["ALLOW"] = "allow";
    AuditLogChangeKeys["ALLOW_NEW"] = "allow_new";
    AuditLogChangeKeys["APPLICATION_ID"] = "application_id";
    AuditLogChangeKeys["AVATAR_HASH"] = "avatar_hash";
    AuditLogChangeKeys["BANNER_HASH"] = "banner_hash";
    AuditLogChangeKeys["BITRATE"] = "bitrate";
    AuditLogChangeKeys["CHANNEL_ID"] = "channel_id";
    AuditLogChangeKeys["CODE"] = "code";
    AuditLogChangeKeys["COLOR"] = "color";
    AuditLogChangeKeys["DEAF"] = "deaf";
    AuditLogChangeKeys["DEFAULT_MESSAGE_NOTIFICATIONS"] = "default_message_notifications";
    AuditLogChangeKeys["DENY"] = "deny";
    AuditLogChangeKeys["DENY_NEW"] = "deny_new";
    AuditLogChangeKeys["DESCRIPTION"] = "description";
    AuditLogChangeKeys["ENABLE_EMOTICONS"] = "enable_emoticons";
    AuditLogChangeKeys["EXPIRE_BEHAVIOR"] = "expire_behavior";
    AuditLogChangeKeys["EXPIRE_GRACE_PERIOD"] = "expire_grace_period";
    AuditLogChangeKeys["EXPLICIT_CONTENT_FILTER"] = "explicit_content_filter";
    AuditLogChangeKeys["HOIST"] = "hoist";
    AuditLogChangeKeys["ICON_HASH"] = "icon_hash";
    AuditLogChangeKeys["ID"] = "id";
    AuditLogChangeKeys["INVITER_ID"] = "inviter_id";
    AuditLogChangeKeys["MAX_AGE"] = "max_age";
    AuditLogChangeKeys["MAX_USES"] = "max_uses";
    AuditLogChangeKeys["MENTIONABLE"] = "mentionable";
    AuditLogChangeKeys["MFA_LEVEL"] = "mfa_level";
    AuditLogChangeKeys["MUTE"] = "mute";
    AuditLogChangeKeys["NAME"] = "name";
    AuditLogChangeKeys["NICK"] = "nick";
    AuditLogChangeKeys["NSFW"] = "nsfw";
    AuditLogChangeKeys["OWNER_ID"] = "owner_id";
    AuditLogChangeKeys["PERMISSION_OVERWRITES"] = "permission_overwrites";
    AuditLogChangeKeys["PERMISSIONS"] = "permissions";
    AuditLogChangeKeys["PERMISSIONS_DENIED"] = "deny";
    AuditLogChangeKeys["PERMISSIONS_GRANTED"] = "allow";
    AuditLogChangeKeys["POSITION"] = "position";
    AuditLogChangeKeys["PREFERRED_LOCALE"] = "preferred_locale";
    AuditLogChangeKeys["PRUNE_DELETE_DAYS"] = "prune_delete_days";
    AuditLogChangeKeys["RATE_LIMIT_PER_USER"] = "rate_limit_per_user";
    AuditLogChangeKeys["REASON"] = "reason";
    AuditLogChangeKeys["REGION"] = "region";
    AuditLogChangeKeys["ROLES_ADD"] = "$add";
    AuditLogChangeKeys["ROLES_REMOVE"] = "$remove";
    AuditLogChangeKeys["SPLASH_HASH"] = "splash_hash";
    AuditLogChangeKeys["SYSTEM_CHANNEL_ID"] = "system_channel_id";
    AuditLogChangeKeys["WIDGET_CHANNEL_ID"] = "widget_channel_id";
    AuditLogChangeKeys["WIDGET_ENABLED"] = "widget_enabled";
    AuditLogChangeKeys["VANITY_URL_CODE"] = "vanity_url_code";
    AuditLogChangeKeys["VERIFICATION_LEVEL"] = "verification_level";
    AuditLogChangeKeys["TEMPORARY"] = "temporary";
    AuditLogChangeKeys["TOPIC"] = "topic";
    AuditLogChangeKeys["TYPE"] = "type";
    AuditLogChangeKeys["USES"] = "uses";
})(AuditLogChangeKeys = exports.AuditLogChangeKeys || (exports.AuditLogChangeKeys = {}));
;
var CarouselMediaTypes;
(function (CarouselMediaTypes) {
    CarouselMediaTypes[CarouselMediaTypes["IMAGE"] = 1] = "IMAGE";
    CarouselMediaTypes[CarouselMediaTypes["YOUTUBE_VIDEO"] = 2] = "YOUTUBE_VIDEO";
    CarouselMediaTypes[CarouselMediaTypes["VIDEO"] = 3] = "VIDEO";
})(CarouselMediaTypes = exports.CarouselMediaTypes || (exports.CarouselMediaTypes = {}));
;
var ChannelTypes;
(function (ChannelTypes) {
    ChannelTypes[ChannelTypes["BASE"] = -1] = "BASE";
    ChannelTypes[ChannelTypes["GUILD_TEXT"] = 0] = "GUILD_TEXT";
    ChannelTypes[ChannelTypes["DM"] = 1] = "DM";
    ChannelTypes[ChannelTypes["GUILD_VOICE"] = 2] = "GUILD_VOICE";
    ChannelTypes[ChannelTypes["GROUP_DM"] = 3] = "GROUP_DM";
    ChannelTypes[ChannelTypes["GUILD_CATEGORY"] = 4] = "GUILD_CATEGORY";
    ChannelTypes[ChannelTypes["GUILD_NEWS"] = 5] = "GUILD_NEWS";
    ChannelTypes[ChannelTypes["GUILD_STORE"] = 6] = "GUILD_STORE";
})(ChannelTypes = exports.ChannelTypes || (exports.ChannelTypes = {}));
;
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["ACTIVITY_JOIN_INVITE"] = "activityJoinInvite";
    ClientEvents["ACTIVITY_JOIN_REQUEST"] = "activityJoinRequest";
    ClientEvents["ACTIVITY_START"] = "activityStart";
    ClientEvents["BRAINTREE_POPUP_BRIDGE_CALLBACK"] = "braintreePopupBridgeCallback";
    ClientEvents["CALL_CREATE"] = "callCreate";
    ClientEvents["CALL_DELETE"] = "callDelete";
    ClientEvents["CALL_UPDATE"] = "callUpdate";
    ClientEvents["CHANNEL_CREATE"] = "channelCreate";
    ClientEvents["CHANNEL_DELETE"] = "channelDelete";
    ClientEvents["CHANNEL_UPDATE"] = "channelUpdate";
    ClientEvents["CHANNEL_PINS_ACK"] = "channelPinsAck";
    ClientEvents["CHANNEL_PINS_UPDATE"] = "channelPinsUpdate";
    ClientEvents["CHANNEL_RECIPIENT_ADD"] = "channelRecipientAdd";
    ClientEvents["CHANNEL_RECIPIENT_REMOVE"] = "channelRecipientRemove";
    ClientEvents["ENTITLEMENT_CREATE"] = "entitlementCreate";
    ClientEvents["ENTITLEMENT_DELETE"] = "entitlementDelete";
    ClientEvents["ENTITLEMENT_UPDATE"] = "entitlementUpdate";
    ClientEvents["FRIEND_SUGGESTION_CREATE"] = "friendSuggestionCreate";
    ClientEvents["FRIEND_SUGGESTION_DELETE"] = "friendSuggestionDelete";
    ClientEvents["GIFT_CODE_UPDATE"] = "giftCodeUpdate";
    ClientEvents["GUILD_BAN_ADD"] = "guildBanAdd";
    ClientEvents["GUILD_BAN_REMOVE"] = "guildBanRemove";
    ClientEvents["GUILD_CREATE"] = "guildCreate";
    ClientEvents["GUILD_DELETE"] = "guildDelete";
    ClientEvents["GUILD_EMOJIS_UPDATE"] = "guildEmojisUpdate";
    ClientEvents["GUILD_INTEGRATIONS_UPDATE"] = "guildIntegrationsUpdate";
    ClientEvents["GUILD_MEMBER_ADD"] = "guildMemberAdd";
    ClientEvents["GUILD_MEMBER_LIST_UPDATE"] = "guildMemberListUpdate";
    ClientEvents["GUILD_MEMBER_REMOVE"] = "guildMemberRemove";
    ClientEvents["GUILD_MEMBER_UPDATE"] = "guildMemberUpdate";
    ClientEvents["GUILD_MEMBERS_CHUNK"] = "guildMembersChunk";
    ClientEvents["GUILD_READY"] = "guildReady";
    ClientEvents["GUILD_ROLE_CREATE"] = "guildRoleCreate";
    ClientEvents["GUILD_ROLE_DELETE"] = "guildRoleDelete";
    ClientEvents["GUILD_ROLE_UPDATE"] = "guildRoleUpdate";
    ClientEvents["GUILD_UPDATE"] = "guildUpdate";
    ClientEvents["INTERACTION_CREATE"] = "interactionCreate";
    ClientEvents["INVITE_CREATE"] = "inviteCreate";
    ClientEvents["INVITE_DELETE"] = "inviteDelete";
    ClientEvents["LIBRARY_APPLICATION_UPDATE"] = "libraryApplicationUpdate";
    ClientEvents["LOBBY_CREATE"] = "lobbyCreate";
    ClientEvents["LOBBY_DELETE"] = "lobbyDelete";
    ClientEvents["LOBBY_UPDATE"] = "lobbyUpdate";
    ClientEvents["LOBBY_MEMBER_CONNECT"] = "lobbyMemberConnect";
    ClientEvents["LOBBY_MEMBER_DISCONNECT"] = "lobbyMemberDisconnect";
    ClientEvents["LOBBY_MEMBER_UPDATE"] = "lobbyMemberUpdate";
    ClientEvents["LOBBY_MESSAGE"] = "lobbyMessage";
    ClientEvents["LOBBY_VOICE_SERVER_UPDATE"] = "lobbyVoiceServerUpdate";
    ClientEvents["LOBBY_VOICE_STATE_UPDATE"] = "lobbyVoiceStateUpdate";
    ClientEvents["MESSAGE_ACK"] = "messageAck";
    ClientEvents["MESSAGE_CREATE"] = "messageCreate";
    ClientEvents["MESSAGE_DELETE"] = "messageDelete";
    ClientEvents["MESSAGE_DELETE_BULK"] = "messageDeleteBulk";
    ClientEvents["MESSAGE_REACTION_ADD"] = "messageReactionAdd";
    ClientEvents["MESSAGE_REACTION_REMOVE"] = "messageReactionRemove";
    ClientEvents["MESSAGE_REACTION_REMOVE_ALL"] = "messageReactionRemoveAll";
    ClientEvents["MESSAGE_REACTION_REMOVE_EMOJI"] = "messageReactionRemoveEmoji";
    ClientEvents["MESSAGE_UPDATE"] = "messageUpdate";
    ClientEvents["OAUTH2_TOKEN_REMOVE"] = "oauth2TokenRemove";
    ClientEvents["PRESENCES_REPLACE"] = "presencesReplace";
    ClientEvents["PRESENCE_UPDATE"] = "presenceUpdate";
    ClientEvents["RECENT_MENTION_DELETE"] = "recentMentionDelete";
    ClientEvents["RELATIONSHIP_ADD"] = "relationshipAdd";
    ClientEvents["RELATIONSHIP_REMOVE"] = "relationshipRemove";
    ClientEvents["SESSIONS_REPLACE"] = "sessionsReplace";
    ClientEvents["STREAM_CREATE"] = "streamCreate";
    ClientEvents["STREAM_DELETE"] = "streamDelete";
    ClientEvents["STREAM_SERVER_UPDATE"] = "streamServerUpdate";
    ClientEvents["STREAM_UPDATE"] = "streamUpdate";
    ClientEvents["TYPING_START"] = "typingStart";
    ClientEvents["TYPING_STOP"] = "typingStop";
    ClientEvents["USER_ACHIEVEMENT_UPDATE"] = "userAchievementUpdate";
    ClientEvents["USER_CONNECTIONS_UPDATE"] = "userConnectionsUpdate";
    ClientEvents["USER_FEED_SETTINGS_UPDATE"] = "userFeedSettingsUpdate";
    ClientEvents["USER_GUILD_SETTINGS_UPDATE"] = "userGuildSettingsUpdate";
    ClientEvents["USER_NOTE_UPDATE"] = "userNoteUpdate";
    ClientEvents["USER_PAYMENT_SOURCES_UPDATE"] = "userPaymentSourcesUpdate";
    ClientEvents["USER_PAYMENTS_UPDATE"] = "userPaymentsUpdate";
    ClientEvents["USER_REQUIRED_ACTION_UPDATE"] = "userRequiredActionUpdate";
    ClientEvents["USER_SETTINGS_UPDATE"] = "userSettingsUpdate";
    ClientEvents["USER_SUBSCRIPTIONS_UPDATE"] = "userSubscriptionsUpdate";
    ClientEvents["USER_UPDATE"] = "userUpdate";
    ClientEvents["USERS_UPDATE"] = "usersUpdate";
    ClientEvents["VOICE_SERVER_UPDATE"] = "voiceServerUpdate";
    ClientEvents["VOICE_STATE_UPDATE"] = "voiceStateUpdate";
    ClientEvents["WEBHOOKS_UPDATE"] = "webhooksUpdate";
    ClientEvents["CLUSTER_PROCESS"] = "clusterProcess";
    ClientEvents["COMMAND_DELETE"] = "commandDelete";
    ClientEvents["COMMAND_ERROR"] = "commandError";
    ClientEvents["COMMAND_FAIL"] = "commandFail";
    ClientEvents["COMMAND_NONE"] = "commandNone";
    ClientEvents["COMMAND_PERMISSIONS_FAIL"] = "commandPermissionsFail";
    ClientEvents["COMMAND_PERMISSIONS_FAIL_CLIENT"] = "commandPermissionsFailClient";
    ClientEvents["COMMAND_RAN"] = "commandRan";
    ClientEvents["COMMAND_RATELIMIT"] = "commandRatelimit";
    ClientEvents["COMMAND_RESPONSE_DELETE"] = "commandResponseDelete";
    ClientEvents["COMMAND_RUN_ERROR"] = "commandRunError";
    ClientEvents["GATEWAY_READY"] = "gatewayReady";
    ClientEvents["GATEWAY_RESUMED"] = "gatewayResumed";
    ClientEvents["KILLED"] = "killed";
    ClientEvents["RAW"] = "raw";
    ClientEvents["READY"] = "ready";
    ClientEvents["REST_REQUEST"] = "restRequest";
    ClientEvents["REST_RESPONSE"] = "restResponse";
    ClientEvents["SHARD"] = "shard";
    ClientEvents["UNKNOWN"] = "unknown";
    ClientEvents["WARN"] = "warn";
})(ClientEvents = exports.ClientEvents || (exports.ClientEvents = {}));
;
var ClusterIPCOpCodes;
(function (ClusterIPCOpCodes) {
    ClusterIPCOpCodes[ClusterIPCOpCodes["READY"] = 0] = "READY";
    ClusterIPCOpCodes[ClusterIPCOpCodes["CLOSE"] = 1] = "CLOSE";
    ClusterIPCOpCodes[ClusterIPCOpCodes["SHARD_STATE"] = 2] = "SHARD_STATE";
    ClusterIPCOpCodes[ClusterIPCOpCodes["RESPAWN_ALL"] = 3] = "RESPAWN_ALL";
    ClusterIPCOpCodes[ClusterIPCOpCodes["EVAL"] = 4] = "EVAL";
    ClusterIPCOpCodes[ClusterIPCOpCodes["IDENTIFY_REQUEST"] = 5] = "IDENTIFY_REQUEST";
})(ClusterIPCOpCodes = exports.ClusterIPCOpCodes || (exports.ClusterIPCOpCodes = {}));
;
var Colors;
(function (Colors) {
    Colors[Colors["BLURPLE"] = 7506394] = "BLURPLE";
})(Colors = exports.Colors || (exports.Colors = {}));
;
var CommandArgumentTypes;
(function (CommandArgumentTypes) {
    CommandArgumentTypes["BOOL"] = "bool";
    CommandArgumentTypes["FLOAT"] = "float";
    CommandArgumentTypes["NUMBER"] = "number";
    CommandArgumentTypes["STRING"] = "string";
})(CommandArgumentTypes = exports.CommandArgumentTypes || (exports.CommandArgumentTypes = {}));
;
exports.CommandErrors = Object.freeze({});
var CommandRatelimitTypes;
(function (CommandRatelimitTypes) {
    CommandRatelimitTypes["CHANNEL"] = "channel";
    CommandRatelimitTypes["GUILD"] = "guild";
    CommandRatelimitTypes["USER"] = "user";
})(CommandRatelimitTypes = exports.CommandRatelimitTypes || (exports.CommandRatelimitTypes = {}));
;
var DiscordOpusFormat;
(function (DiscordOpusFormat) {
    DiscordOpusFormat[DiscordOpusFormat["CHANNELS"] = 2] = "CHANNELS";
    DiscordOpusFormat[DiscordOpusFormat["SAMPLE_RATE"] = 48000] = "SAMPLE_RATE";
})(DiscordOpusFormat = exports.DiscordOpusFormat || (exports.DiscordOpusFormat = {}));
;
var DiscordRegexNames;
(function (DiscordRegexNames) {
    DiscordRegexNames["EMOJI"] = "EMOJI";
    DiscordRegexNames["JUMP_CHANNEL"] = "JUMP_CHANNEL";
    DiscordRegexNames["JUMP_CHANNEL_MESSAGE"] = "JUMP_CHANNEL_MESSAGE";
    DiscordRegexNames["MENTION_CHANNEL"] = "MENTION_CHANNEL";
    DiscordRegexNames["MENTION_ROLE"] = "MENTION_ROLE";
    DiscordRegexNames["MENTION_USER"] = "MENTION_USER";
    DiscordRegexNames["TEXT_BOLD"] = "TEXT_BOLD";
    DiscordRegexNames["TEXT_CODEBLOCK"] = "TEXT_CODEBLOCK";
    DiscordRegexNames["TEXT_CODESTRING"] = "TEXT_CODESTRING";
    DiscordRegexNames["TEXT_ITALICS"] = "TEXT_ITALICS";
    DiscordRegexNames["TEXT_SNOWFLAKE"] = "TEXT_SNOWFLAKE";
    DiscordRegexNames["TEXT_SPOILER"] = "TEXT_SPOILER";
    DiscordRegexNames["TEXT_STRIKE"] = "TEXT_STRIKE";
    DiscordRegexNames["TEXT_UNDERLINE"] = "TEXT_UNDERLINE";
    DiscordRegexNames["TEXT_URL"] = "TEXT_URL";
})(DiscordRegexNames = exports.DiscordRegexNames || (exports.DiscordRegexNames = {}));
exports.DiscordRegex = Object.freeze({
    [DiscordRegexNames.EMOJI]: /<a?:(\w+):(\d+)>/g,
    [DiscordRegexNames.JUMP_CHANNEL]: /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)$/g,
    [DiscordRegexNames.JUMP_CHANNEL_MESSAGE]: /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)\/(\d+)$/g,
    [DiscordRegexNames.MENTION_CHANNEL]: /<#(\d+)>/g,
    [DiscordRegexNames.MENTION_ROLE]: /<@&(\d+)>/g,
    [DiscordRegexNames.MENTION_USER]: /<@(!?)(\d+)>/g,
    [DiscordRegexNames.TEXT_BOLD]: /\*\*([\s\S]+?)\*\*/g,
    [DiscordRegexNames.TEXT_CODEBLOCK]: /```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/gi,
    [DiscordRegexNames.TEXT_CODESTRING]: /`([\s\S]+?)`/g,
    [DiscordRegexNames.TEXT_ITALICS]: /_([\s\S]+?)_|\*([\s\S]+?)\*/g,
    [DiscordRegexNames.TEXT_SNOWFLAKE]: /(\d+)/g,
    [DiscordRegexNames.TEXT_SPOILER]: /\|\|([\s\S]+?)\|\|/g,
    [DiscordRegexNames.TEXT_STRIKE]: /~~([\s\S]+?)~~(?!_)/g,
    [DiscordRegexNames.TEXT_UNDERLINE]: /__([\s\S]+?)__/g,
    [DiscordRegexNames.TEXT_URL]: /((?:https?):\/\/[^\s<]+[^<.,:;"'\]\s])/g,
});
var Distributors;
(function (Distributors) {
    Distributors["BATTLENET"] = "battlenet";
    Distributors["DISCORD"] = "discord";
    Distributors["EPIC"] = "epic";
    Distributors["GOG"] = "gog";
    Distributors["ORIGIN"] = "origin";
    Distributors["STEAM"] = "steam";
    Distributors["TWITCH"] = "twitch";
    Distributors["UPLAY"] = "uplay";
})(Distributors = exports.Distributors || (exports.Distributors = {}));
;
exports.DistributorNames = Object.freeze({
    [Distributors.BATTLENET]: 'Battle.net',
    [Distributors.DISCORD]: 'Discord',
    [Distributors.EPIC]: 'Epic',
    [Distributors.GOG]: 'GOG',
    [Distributors.ORIGIN]: 'Origin',
    [Distributors.STEAM]: 'Steam',
    [Distributors.TWITCH]: 'Twitch',
    [Distributors.UPLAY]: 'Uplay',
});
// twitch shut down
exports.DistributorUrls = iris_utils_1.Tools.URIEncodeWrap({
    [Distributors.BATTLENET]: (skuId) => `https://shop.battle.net/family/${skuId}`,
    [Distributors.DISCORD]: (skuId, slug) => iris_client_rest_1.Endpoints.Routes.URL + `/store/skus/${skuId}` + ((slug) ? `/${slug}` : ''),
    [Distributors.EPIC]: (skuId) => `https://epicgames.com/store/product/${skuId}`,
    [Distributors.GOG]: (skuId) => `https://gog.com/game/${skuId}`,
    [Distributors.ORIGIN]: (skuId) => `https://origin.com/search?searchString=${skuId}`,
    [Distributors.STEAM]: (skuId) => `https://store.steampowered.com/app/${skuId}`,
    [Distributors.UPLAY]: (skuId) => `https://store.ubi.com/search/?q=${skuId}`,
});
var EntitlementTypes;
(function (EntitlementTypes) {
    EntitlementTypes[EntitlementTypes["PURCHASE"] = 1] = "PURCHASE";
    EntitlementTypes[EntitlementTypes["PREMIUM_SUBSCRIPTION"] = 2] = "PREMIUM_SUBSCRIPTION";
    EntitlementTypes[EntitlementTypes["DEVELOPER_GIFT"] = 3] = "DEVELOPER_GIFT";
    EntitlementTypes[EntitlementTypes["TEST_MODE_PURCHASE"] = 4] = "TEST_MODE_PURCHASE";
    EntitlementTypes[EntitlementTypes["FREE_PURCHASE"] = 5] = "FREE_PURCHASE";
    EntitlementTypes[EntitlementTypes["USER_GIFT"] = 6] = "USER_GIFT";
})(EntitlementTypes = exports.EntitlementTypes || (exports.EntitlementTypes = {}));
;
var ExplicitContentFilterTypes;
(function (ExplicitContentFilterTypes) {
    ExplicitContentFilterTypes[ExplicitContentFilterTypes["DISABLED"] = 0] = "DISABLED";
    ExplicitContentFilterTypes[ExplicitContentFilterTypes["NON_FRIENDS"] = 1] = "NON_FRIENDS";
    ExplicitContentFilterTypes[ExplicitContentFilterTypes["FRIENDS_AND_NON_FRIENDS"] = 2] = "FRIENDS_AND_NON_FRIENDS";
})(ExplicitContentFilterTypes = exports.ExplicitContentFilterTypes || (exports.ExplicitContentFilterTypes = {}));
;
var GuildExplicitContentFilterTypes;
(function (GuildExplicitContentFilterTypes) {
    GuildExplicitContentFilterTypes[GuildExplicitContentFilterTypes["DISABLED"] = 0] = "DISABLED";
    GuildExplicitContentFilterTypes[GuildExplicitContentFilterTypes["MEMBERS_WITHOUT_ROLES"] = 1] = "MEMBERS_WITHOUT_ROLES";
    GuildExplicitContentFilterTypes[GuildExplicitContentFilterTypes["ALL_MEMBERS"] = 2] = "ALL_MEMBERS";
})(GuildExplicitContentFilterTypes = exports.GuildExplicitContentFilterTypes || (exports.GuildExplicitContentFilterTypes = {}));
;
exports.GuildFeatures = iris_utils_1.Tools.normalize({
    ANIMATED_ICON: null,
    BANNER: null,
    COMMERCE: null,
    DISCOVERABLE: null,
    ENABLED_DISCOVERABLE_BEFORE: null,
    FEATURABLE: null,
    INVITE_SPLASH: null,
    LURKABLE: null,
    MEMBER_LIST_DISABLED: null,
    MORE_EMOJI: null,
    NEWS: null,
    PARTNERED: null,
    PUBLIC: null,
    PUBLIC_DISABLED: null,
    VANITY_URL: null,
    VERIFIED: null,
    VIP_REGIONS: null,
    WELCOME_SCREEN_ENABLED: null,
});
var GuildNotificationSettings;
(function (GuildNotificationSettings) {
    GuildNotificationSettings[GuildNotificationSettings["ALL"] = 0] = "ALL";
    GuildNotificationSettings[GuildNotificationSettings["MENTIONS"] = 1] = "MENTIONS";
})(GuildNotificationSettings = exports.GuildNotificationSettings || (exports.GuildNotificationSettings = {}));
;
var GuildWidgetStyles;
(function (GuildWidgetStyles) {
    GuildWidgetStyles["BANNER_1"] = "banner1";
    GuildWidgetStyles["BANNER_2"] = "banner2";
    GuildWidgetStyles["BANNER_3"] = "banner3";
    GuildWidgetStyles["BANNER_4"] = "banner4";
    GuildWidgetStyles["SHIELD"] = "shield";
})(GuildWidgetStyles = exports.GuildWidgetStyles || (exports.GuildWidgetStyles = {}));
;
var ImageFormats;
(function (ImageFormats) {
    ImageFormats["GIF"] = "gif";
    ImageFormats["JPEG"] = "jpeg";
    ImageFormats["JPG"] = "jpg";
    ImageFormats["PNG"] = "png";
    ImageFormats["WEBP"] = "webp";
})(ImageFormats = exports.ImageFormats || (exports.ImageFormats = {}));
;
var InteractionTypes;
(function (InteractionTypes) {
    InteractionTypes[InteractionTypes["PING"] = 1] = "PING";
    InteractionTypes[InteractionTypes["APPLICATION_COMMAND"] = 2] = "APPLICATION_COMMAND";
})(InteractionTypes = exports.InteractionTypes || (exports.InteractionTypes = {}));
;
var InviteTargetUserTypes;
(function (InviteTargetUserTypes) {
    InviteTargetUserTypes[InviteTargetUserTypes["STREAM"] = 1] = "STREAM";
})(InviteTargetUserTypes = exports.InviteTargetUserTypes || (exports.InviteTargetUserTypes = {}));
;
var LibraryApplicationFlags;
(function (LibraryApplicationFlags) {
    LibraryApplicationFlags[LibraryApplicationFlags["HIDDEN"] = 1] = "HIDDEN";
    LibraryApplicationFlags[LibraryApplicationFlags["PRIVATE"] = 2] = "PRIVATE";
    LibraryApplicationFlags[LibraryApplicationFlags["OVERLAY_DISABLED"] = 4] = "OVERLAY_DISABLED";
    LibraryApplicationFlags[LibraryApplicationFlags["ENTITLED"] = 8] = "ENTITLED";
    LibraryApplicationFlags[LibraryApplicationFlags["PREMIUM"] = 16] = "PREMIUM";
})(LibraryApplicationFlags = exports.LibraryApplicationFlags || (exports.LibraryApplicationFlags = {}));
var LobbyErrors;
(function (LobbyErrors) {
    LobbyErrors[LobbyErrors["NO_ERROR"] = 0] = "NO_ERROR";
    LobbyErrors[LobbyErrors["UNKNOWN_ERROR"] = 1] = "UNKNOWN_ERROR";
    LobbyErrors[LobbyErrors["SERVICE_UNAVAILABLE"] = 2] = "SERVICE_UNAVAILABLE";
    LobbyErrors[LobbyErrors["NOT_FOUND"] = 3] = "NOT_FOUND";
    LobbyErrors[LobbyErrors["INVALID_SECRET"] = 4] = "INVALID_SECRET";
    LobbyErrors[LobbyErrors["FULL"] = 5] = "FULL";
    LobbyErrors[LobbyErrors["LOBBY_LIMIT_REACHED"] = 6] = "LOBBY_LIMIT_REACHED";
    LobbyErrors[LobbyErrors["ALREADY_CONNECTING"] = 7] = "ALREADY_CONNECTING";
})(LobbyErrors = exports.LobbyErrors || (exports.LobbyErrors = {}));
;
var LobbyTypes;
(function (LobbyTypes) {
    LobbyTypes[LobbyTypes["PRIVATE"] = 1] = "PRIVATE";
    LobbyTypes[LobbyTypes["PUBLIC"] = 2] = "PUBLIC";
})(LobbyTypes = exports.LobbyTypes || (exports.LobbyTypes = {}));
;
var Locales;
(function (Locales) {
    Locales["BULGARIAN"] = "bg";
    Locales["CHINESE"] = "zh-CN";
    Locales["CHINESE_TAIWAN"] = "zh-TW";
    Locales["CROATIAN"] = "hr";
    Locales["CZECH"] = "cs";
    Locales["DANISH"] = "da";
    Locales["DUTCH"] = "nl";
    Locales["ENGLISH_GB"] = "en-GB";
    Locales["ENGLISH_US"] = "en-US";
    Locales["FINNISH"] = "fi";
    Locales["FRENCH"] = "fr";
    Locales["GERMAN"] = "de";
    Locales["GREEK"] = "el";
    Locales["HUNGARIAN"] = "hu";
    Locales["ITALIAN"] = "it";
    Locales["JAPANESE"] = "ja";
    Locales["KOREAN"] = "ko";
    Locales["LITHUANIAN"] = "lt";
    Locales["NORWEGIAN"] = "no";
    Locales["POLISH"] = "pl";
    Locales["PORTUGUESE_BRAZILIAN"] = "pt-BR";
    Locales["ROMANIAN"] = "ro";
    Locales["RUSSIAN"] = "ru";
    Locales["SPANISH"] = "es-ES";
    Locales["SWEDISH"] = "sv-SE";
    Locales["THAI"] = "th";
    Locales["TURKISH"] = "tr";
    Locales["UKRAINIAN"] = "uk";
    Locales["VIETNAMESE"] = "vi";
})(Locales = exports.Locales || (exports.Locales = {}));
;
exports.LocalesText = Object.freeze({
    [Locales.BULGARIAN]: 'Bulgarian',
    [Locales.CHINESE]: 'Chinese, China',
    [Locales.CHINESE_TAIWAN]: 'Chinese, Taiwan',
    [Locales.CROATIAN]: 'Croatian',
    [Locales.CZECH]: 'Czech',
    [Locales.DANISH]: 'Danish',
    [Locales.DUTCH]: 'Dutch',
    [Locales.ENGLISH_GB]: 'English, UK',
    [Locales.ENGLISH_US]: 'English, US',
    [Locales.FINNISH]: 'Finnish',
    [Locales.FRENCH]: 'French',
    [Locales.GERMAN]: 'German',
    [Locales.GREEK]: 'Greek',
    [Locales.HUNGARIAN]: 'Hungarian',
    [Locales.ITALIAN]: 'Italian',
    [Locales.JAPANESE]: 'Japanese',
    [Locales.KOREAN]: 'Korean',
    [Locales.LITHUANIAN]: 'Lithuanian',
    [Locales.NORWEGIAN]: 'Norwegian',
    [Locales.POLISH]: 'Polish',
    [Locales.PORTUGUESE_BRAZILIAN]: 'Portuguese, Brazilian',
    [Locales.ROMANIAN]: 'Romanian',
    [Locales.RUSSIAN]: 'Russian',
    [Locales.SPANISH]: 'Spanish',
    [Locales.SWEDISH]: 'Swedish',
    [Locales.THAI]: 'Thai',
    [Locales.TURKISH]: 'Turkish',
    [Locales.UKRAINIAN]: 'Ukrainian',
    [Locales.VIETNAMESE]: 'Vietnamese',
});
var MessageEmbedTypes;
(function (MessageEmbedTypes) {
    MessageEmbedTypes["APPLICATION_NEWS"] = "application_news";
    MessageEmbedTypes["ARTICLE"] = "article";
    MessageEmbedTypes["GIFV"] = "gifv";
    MessageEmbedTypes["IMAGE"] = "image";
    MessageEmbedTypes["LINK"] = "link";
    MessageEmbedTypes["RICH"] = "rich";
    MessageEmbedTypes["TWEET"] = "tweet";
    MessageEmbedTypes["VIDEO"] = "video";
})(MessageEmbedTypes = exports.MessageEmbedTypes || (exports.MessageEmbedTypes = {}));
;
var MessageFlags;
(function (MessageFlags) {
    MessageFlags[MessageFlags["CROSSPOSTED"] = 1] = "CROSSPOSTED";
    MessageFlags[MessageFlags["IS_CROSSPOST"] = 2] = "IS_CROSSPOST";
    MessageFlags[MessageFlags["SUPPRESS_EMBEDS"] = 4] = "SUPPRESS_EMBEDS";
    MessageFlags[MessageFlags["SOURCE_MESSAGE_DELETED"] = 8] = "SOURCE_MESSAGE_DELETED";
    MessageFlags[MessageFlags["URGENT"] = 16] = "URGENT";
    MessageFlags[MessageFlags["EPHEMERAL"] = 64] = "EPHEMERAL";
})(MessageFlags = exports.MessageFlags || (exports.MessageFlags = {}));
;
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["BASE"] = -1] = "BASE";
    MessageTypes[MessageTypes["DEFAULT"] = 0] = "DEFAULT";
    MessageTypes[MessageTypes["RECIPIENT_ADD"] = 1] = "RECIPIENT_ADD";
    MessageTypes[MessageTypes["RECIPIENT_REMOVE"] = 2] = "RECIPIENT_REMOVE";
    MessageTypes[MessageTypes["CALL"] = 3] = "CALL";
    MessageTypes[MessageTypes["CHANNEL_NAME_CHANGE"] = 4] = "CHANNEL_NAME_CHANGE";
    MessageTypes[MessageTypes["CHANNEL_ICON_CHANGE"] = 5] = "CHANNEL_ICON_CHANGE";
    MessageTypes[MessageTypes["CHANNEL_PINNED_MESSAGE"] = 6] = "CHANNEL_PINNED_MESSAGE";
    MessageTypes[MessageTypes["GUILD_MEMBER_JOIN"] = 7] = "GUILD_MEMBER_JOIN";
    MessageTypes[MessageTypes["GUILD_PREMIUM_SUBSCRIPTION"] = 8] = "GUILD_PREMIUM_SUBSCRIPTION";
    MessageTypes[MessageTypes["GUILD_PREMIUM_SUBSCRIPTION_TIER_1"] = 9] = "GUILD_PREMIUM_SUBSCRIPTION_TIER_1";
    MessageTypes[MessageTypes["GUILD_PREMIUM_SUBSCRIPTION_TIER_2"] = 10] = "GUILD_PREMIUM_SUBSCRIPTION_TIER_2";
    MessageTypes[MessageTypes["GUILD_PREMIUM_SUBSCRIPTION_TIER_3"] = 11] = "GUILD_PREMIUM_SUBSCRIPTION_TIER_3";
    MessageTypes[MessageTypes["CHANNEL_FOLLOW_ADD"] = 12] = "CHANNEL_FOLLOW_ADD";
    MessageTypes[MessageTypes["GUILD_STREAM"] = 13] = "GUILD_STREAM";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_DISQUALIFIED"] = 14] = "GUILD_DISCOVERY_DISQUALIFIED";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_REQUALIFIED"] = 15] = "GUILD_DISCOVERY_REQUALIFIED";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING"] = 17] = "GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING"] = 18] = "GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING";
    MessageTypes[MessageTypes["REPLY"] = 19] = "REPLY";
    MessageTypes[MessageTypes["APPLICATION_COMMAND"] = 20] = "APPLICATION_COMMAND";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
;
exports.MessageTypesDeletable = Object.freeze({
    [MessageTypes.BASE]: true,
    [MessageTypes.DEFAULT]: true,
    [MessageTypes.RECIPIENT_ADD]: false,
    [MessageTypes.RECIPIENT_REMOVE]: false,
    [MessageTypes.CALL]: false,
    [MessageTypes.CHANNEL_NAME_CHANGE]: false,
    [MessageTypes.CHANNEL_ICON_CHANGE]: false,
    [MessageTypes.CHANNEL_PINNED_MESSAGE]: true,
    [MessageTypes.GUILD_MEMBER_JOIN]: true,
    [MessageTypes.GUILD_PREMIUM_SUBSCRIPTION]: true,
    [MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_1]: true,
    [MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_2]: true,
    [MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_3]: true,
    [MessageTypes.CHANNEL_FOLLOW_ADD]: true,
    [MessageTypes.GUILD_STREAM]: false,
    [MessageTypes.GUILD_DISCOVERY_DISQUALIFIED]: false,
    [MessageTypes.GUILD_DISCOVERY_REQUALIFIED]: false,
    [MessageTypes.GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING]: false,
    [MessageTypes.GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING]: false,
    [MessageTypes.REPLY]: true,
    [MessageTypes.APPLICATION_COMMAND]: true,
});
var MfaLevels;
(function (MfaLevels) {
    MfaLevels[MfaLevels["NONE"] = 0] = "NONE";
    MfaLevels[MfaLevels["ELEVATED"] = 1] = "ELEVATED";
})(MfaLevels = exports.MfaLevels || (exports.MfaLevels = {}));
;
var Oauth2AssetTypes;
(function (Oauth2AssetTypes) {
    Oauth2AssetTypes[Oauth2AssetTypes["SMALL"] = 1] = "SMALL";
    Oauth2AssetTypes[Oauth2AssetTypes["LARGE"] = 2] = "LARGE";
})(Oauth2AssetTypes = exports.Oauth2AssetTypes || (exports.Oauth2AssetTypes = {}));
;
var Oauth2Scopes;
(function (Oauth2Scopes) {
    Oauth2Scopes["ACTIVITIES_READ"] = "activities.read";
    Oauth2Scopes["ACTIVITIES_WRITE"] = "activities.write";
    Oauth2Scopes["APPLICATIONS_BUILDS_UPLOAD"] = "applications.builds.upload";
    Oauth2Scopes["APPLICATIONS_BUILDS_READ"] = "applications.builds.read";
    Oauth2Scopes["APPLICATIONS_ENTITLEMENTS"] = "applications.entitlements";
    Oauth2Scopes["APPLICATIONS_STORE_UPDATE"] = "applications.store.update";
    Oauth2Scopes["BOT"] = "bot";
    Oauth2Scopes["CONNECTIONS"] = "connections";
    Oauth2Scopes["EMAIL"] = "email";
    Oauth2Scopes["GDM_JOIN"] = "gdm.join";
    Oauth2Scopes["GUILDS"] = "guilds";
    Oauth2Scopes["GUILDS_JOIN"] = "guilds.join";
    Oauth2Scopes["IDENTIFY"] = "identify";
    Oauth2Scopes["MESSAGES_READ"] = "messages.read";
    Oauth2Scopes["RELATIONSHIPS_READ"] = "relationships.read";
    Oauth2Scopes["RPC"] = "rpc";
    Oauth2Scopes["RPC_API"] = "rpc.api";
    Oauth2Scopes["RPC_NOTIFICATIONS_READ"] = "rpc.notifications.read";
    Oauth2Scopes["WEBHOOK_INCOMING"] = "webhook.incoming";
})(Oauth2Scopes = exports.Oauth2Scopes || (exports.Oauth2Scopes = {}));
var OverwriteTypes;
(function (OverwriteTypes) {
    OverwriteTypes[OverwriteTypes["ROLE"] = 0] = "ROLE";
    OverwriteTypes[OverwriteTypes["MEMBER"] = 1] = "MEMBER";
})(OverwriteTypes = exports.OverwriteTypes || (exports.OverwriteTypes = {}));
;
exports.Permissions = Object.freeze({
    NONE: 0n,
    CREATE_INSTANT_INVITE: 1n << 0n,
    KICK_MEMBERS: 1n << 1n,
    BAN_MEMBERS: 1n << 2n,
    ADMINISTRATOR: 1n << 3n,
    MANAGE_CHANNELS: 1n << 4n,
    MANAGE_GUILD: 1n << 5n,
    ADD_REACTIONS: 1n << 6n,
    VIEW_AUDIT_LOG: 1n << 7n,
    PRIORITY_SPEAKER: 1n << 8n,
    STREAM: 1n << 9n,
    VIEW_CHANNEL: 1n << 10n,
    SEND_MESSAGES: 1n << 11n,
    SEND_TTS_MESSAGES: 1n << 12n,
    MANAGE_MESSAGES: 1n << 13n,
    EMBED_LINKS: 1n << 14n,
    ATTACH_FILES: 1n << 15n,
    READ_MESSAGE_HISTORY: 1n << 16n,
    MENTION_EVERYONE: 1n << 17n,
    USE_EXTERNAL_EMOJIS: 1n << 18n,
    VIEW_GUILD_ANALYTICS: 1n << 19n,
    CONNECT: 1n << 20n,
    SPEAK: 1n << 21n,
    MUTE_MEMBERS: 1n << 22n,
    DEAFEN_MEMBERS: 1n << 23n,
    MOVE_MEMBERS: 1n << 24n,
    USE_VAD: 1n << 25n,
    CHANGE_NICKNAME: 1n << 26n,
    CHANGE_NICKNAMES: 1n << 27n,
    MANAGE_ROLES: 1n << 28n,
    MANAGE_WEBHOOKS: 1n << 29n,
    MANAGE_EMOJIS: 1n << 30n,
});
exports.PERMISSIONS_ALL = Object.values(exports.Permissions).reduce((permissions, permission) => permissions | permission, exports.Permissions.NONE);
exports.PERMISSIONS_ALL_TEXT = [
    exports.Permissions.ADD_REACTIONS,
    exports.Permissions.SEND_MESSAGES,
    exports.Permissions.SEND_TTS_MESSAGES,
    exports.Permissions.MANAGE_MESSAGES,
    exports.Permissions.EMBED_LINKS,
    exports.Permissions.ATTACH_FILES,
    exports.Permissions.READ_MESSAGE_HISTORY,
    exports.Permissions.MENTION_EVERYONE,
    exports.Permissions.USE_EXTERNAL_EMOJIS,
].reduce((permissions, permission) => permissions | permission, exports.Permissions.NONE);
exports.PERMISSIONS_ALL_VOICE = [
    exports.Permissions.PRIORITY_SPEAKER,
    exports.Permissions.STREAM,
    exports.Permissions.CONNECT,
    exports.Permissions.SPEAK,
    exports.Permissions.MUTE_MEMBERS,
    exports.Permissions.DEAFEN_MEMBERS,
    exports.Permissions.MOVE_MEMBERS,
    exports.Permissions.USE_VAD,
].reduce((permissions, permission) => permissions | permission, exports.Permissions.NONE);
exports.PERMISSIONS_DEFAULT = [
    exports.Permissions.CREATE_INSTANT_INVITE,
    exports.Permissions.CHANGE_NICKNAME,
    exports.Permissions.VIEW_CHANNEL,
    exports.Permissions.ADD_REACTIONS,
    exports.Permissions.SEND_MESSAGES,
    exports.Permissions.SEND_TTS_MESSAGES,
    exports.Permissions.EMBED_LINKS,
    exports.Permissions.ATTACH_FILES,
    exports.Permissions.READ_MESSAGE_HISTORY,
    exports.Permissions.MENTION_EVERYONE,
    exports.Permissions.USE_EXTERNAL_EMOJIS,
    exports.Permissions.STREAM,
    exports.Permissions.CONNECT,
    exports.Permissions.SPEAK,
    exports.Permissions.USE_VAD,
].reduce((permissions, permission) => permissions | permission, exports.Permissions.NONE);
exports.PERMISSIONS_LURKER = [
    exports.Permissions.VIEW_CHANNEL,
    exports.Permissions.READ_MESSAGE_HISTORY,
].reduce((permissions, permission) => permissions | permission, exports.Permissions.NONE);
var PlatformTypes;
(function (PlatformTypes) {
    PlatformTypes["BATTLENET"] = "battlenet";
    PlatformTypes["CONTACTS"] = "contacts";
    PlatformTypes["FACEBOOK"] = "facebook";
    PlatformTypes["GITHUB"] = "github";
    PlatformTypes["INSTAGRAM"] = "instagram";
    PlatformTypes["LEAGUE_OF_LEGENDS"] = "leagueoflegends";
    PlatformTypes["REDDIT"] = "reddit";
    PlatformTypes["SAMSUNG"] = "samsung";
    PlatformTypes["SKYPE"] = "skype";
    PlatformTypes["SOUNDCLOUD"] = "soundcloud";
    PlatformTypes["SPOTIFY"] = "spotify";
    PlatformTypes["STEAM"] = "steam";
    PlatformTypes["TWITCH"] = "twitch";
    PlatformTypes["TWITTER"] = "twitter";
    PlatformTypes["YOUTUBE"] = "youtube";
    PlatformTypes["XBOX"] = "xbox";
})(PlatformTypes = exports.PlatformTypes || (exports.PlatformTypes = {}));
;
var PremiumGuildTiers;
(function (PremiumGuildTiers) {
    PremiumGuildTiers[PremiumGuildTiers["NONE"] = 0] = "NONE";
    PremiumGuildTiers[PremiumGuildTiers["TIER_1"] = 1] = "TIER_1";
    PremiumGuildTiers[PremiumGuildTiers["TIER_2"] = 2] = "TIER_2";
    PremiumGuildTiers[PremiumGuildTiers["TIER_3"] = 3] = "TIER_3";
})(PremiumGuildTiers = exports.PremiumGuildTiers || (exports.PremiumGuildTiers = {}));
;
exports.PremiumGuildTierNames = Object.freeze({
    [PremiumGuildTiers.NONE]: 'No Level',
    [PremiumGuildTiers.TIER_1]: 'Level 1',
    [PremiumGuildTiers.TIER_2]: 'Level 2',
    [PremiumGuildTiers.TIER_3]: 'Level 3',
});
exports.PremiumGuildSubscriptionsRequired = Object.freeze({
    [PremiumGuildTiers.NONE]: 0,
    [PremiumGuildTiers.TIER_1]: 2,
    [PremiumGuildTiers.TIER_2]: 15,
    [PremiumGuildTiers.TIER_3]: 30,
});
exports.PremiumGuildLimits = Object.freeze({
    [PremiumGuildTiers.NONE]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE,
        bitrate: exports.MAX_BITRATE,
        emoji: exports.MAX_EMOJI_SLOTS,
    }),
    [PremiumGuildTiers.TIER_1]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE,
        bitrate: 128000,
        emoji: 100,
    }),
    [PremiumGuildTiers.TIER_2]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE_PREMIUM,
        bitrate: 256000,
        emoji: 150,
    }),
    [PremiumGuildTiers.TIER_3]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE_PREMIUM * 2,
        bitrate: 384000,
        emoji: 250,
    }),
});
var PremiumUserTypes;
(function (PremiumUserTypes) {
    PremiumUserTypes[PremiumUserTypes["NONE"] = 0] = "NONE";
    PremiumUserTypes[PremiumUserTypes["TIER_1"] = 1] = "TIER_1";
    PremiumUserTypes[PremiumUserTypes["TIER_2"] = 2] = "TIER_2";
})(PremiumUserTypes = exports.PremiumUserTypes || (exports.PremiumUserTypes = {}));
;
exports.PremiumUserLimits = Object.freeze({
    [PremiumUserTypes.NONE]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE,
    }),
    [PremiumUserTypes.TIER_1]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE_PREMIUM,
    }),
    [PremiumUserTypes.TIER_2]: Object.freeze({
        attachment: exports.MAX_ATTACHMENT_SIZE_PREMIUM * 2,
    }),
});
var RelationshipTypes;
(function (RelationshipTypes) {
    RelationshipTypes[RelationshipTypes["NONE"] = 0] = "NONE";
    RelationshipTypes[RelationshipTypes["FRIEND"] = 1] = "FRIEND";
    RelationshipTypes[RelationshipTypes["BLOCKED"] = 2] = "BLOCKED";
    RelationshipTypes[RelationshipTypes["PENDING_INCOMING"] = 3] = "PENDING_INCOMING";
    RelationshipTypes[RelationshipTypes["PENDING_OUTGOING"] = 4] = "PENDING_OUTGOING";
    RelationshipTypes[RelationshipTypes["IMPLICIT"] = 5] = "IMPLICIT";
})(RelationshipTypes = exports.RelationshipTypes || (exports.RelationshipTypes = {}));
;
var SkuAccessTypes;
(function (SkuAccessTypes) {
    SkuAccessTypes[SkuAccessTypes["FULL"] = 1] = "FULL";
    SkuAccessTypes[SkuAccessTypes["EARLY_ACCESS"] = 2] = "EARLY_ACCESS";
    SkuAccessTypes[SkuAccessTypes["VIP_ACCESS"] = 3] = "VIP_ACCESS";
})(SkuAccessTypes = exports.SkuAccessTypes || (exports.SkuAccessTypes = {}));
var SkuFlags;
(function (SkuFlags) {
    SkuFlags[SkuFlags["PREMIUM_PURCHASE"] = 1] = "PREMIUM_PURCHASE";
    SkuFlags[SkuFlags["HAS_FREE_PREMIUM_CONTENT"] = 2] = "HAS_FREE_PREMIUM_CONTENT";
    SkuFlags[SkuFlags["AVAILABLE"] = 4] = "AVAILABLE";
    SkuFlags[SkuFlags["PREMIUM_AND_DISTRIBUTION"] = 8] = "PREMIUM_AND_DISTRIBUTION";
    SkuFlags[SkuFlags["STICKER_PACK"] = 16] = "STICKER_PACK";
})(SkuFlags = exports.SkuFlags || (exports.SkuFlags = {}));
var SkuTypes;
(function (SkuTypes) {
    SkuTypes[SkuTypes["BASE"] = 0] = "BASE";
    SkuTypes[SkuTypes["GAME"] = 1] = "GAME";
    SkuTypes[SkuTypes["DLC"] = 2] = "DLC";
    SkuTypes[SkuTypes["CONSUMABLE"] = 3] = "CONSUMABLE";
    SkuTypes[SkuTypes["BUNDLE"] = 4] = "BUNDLE";
    SkuTypes[SkuTypes["SUBSCRIPTION"] = 5] = "SUBSCRIPTION";
})(SkuTypes = exports.SkuTypes || (exports.SkuTypes = {}));
exports.SpecialUrls = iris_utils_1.Tools.URIEncodeWrap({
    SPOTIFY_TRACK: (trackId) => `https://open.spotify.com/track/${trackId}`,
    YOUTUBE_VIDEO: (videoId) => `https://youtu.be/${videoId}`,
    YOUTUBE_VIDEO_EMBED: (videoId) => `https://www.youtube.com/embed/${videoId}`,
    YOUTUBE_VIDEO_THUMBNAIL: (videoId) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
});
var StickerFormats;
(function (StickerFormats) {
    StickerFormats[StickerFormats["UNKNOWN"] = 0] = "UNKNOWN";
    StickerFormats[StickerFormats["PNG"] = 1] = "PNG";
    StickerFormats[StickerFormats["APNG"] = 2] = "APNG";
    StickerFormats[StickerFormats["LOTTIE"] = 3] = "LOTTIE";
})(StickerFormats = exports.StickerFormats || (exports.StickerFormats = {}));
var StickerExtensions;
(function (StickerExtensions) {
    StickerExtensions["PNG"] = "png";
    StickerExtensions["APNG"] = "png";
    StickerExtensions["LOTTIE"] = "json";
})(StickerExtensions = exports.StickerExtensions || (exports.StickerExtensions = {}));
var SystemChannelFlags;
(function (SystemChannelFlags) {
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_JOIN_NOTIFICATIONS"] = 1] = "SUPPRESS_JOIN_NOTIFICATIONS";
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_PREMIUM_SUBSCRIPTIONS"] = 2] = "SUPPRESS_PREMIUM_SUBSCRIPTIONS";
})(SystemChannelFlags = exports.SystemChannelFlags || (exports.SystemChannelFlags = {}));
;
exports.SystemMessages = Object.freeze({
    ApplicationCommandUsed: ':user: used :command: with :application:.',
    CallMissed: 'You missed a call from :user:.',
    CallMissedWithDuration: 'You missed a call from :user: that lasted :duration:.',
    CallStarted: ':user: started a call.',
    CallStartedWithDuration: ':user: started a call that lasted :duration:.',
    ChannelFollowAdd: ':user: has added **:webhookName:** to this channel.',
    ChannelIconChange: ':user: changed the channel name: **:name:**',
    ChannelNameChange: ':user: changed the channel icon.',
    GuildDiscoveryDisqualified: 'This server has been removed from Server Discovery because it no longer passes all the requirements. Check Server Settings for more details.',
    GuildDiscoveryGracePeriodFinalWarning: 'This server has failed Discovery activity requirements for 3 weeks in a row. If this server fails for 1 more week, it will be removed from Discovery.',
    GuildDiscoveryGracePeriodInitialWarning: 'This server has failed Discovery activity requirements for 1 week. If this server fails for 4 weeks in a row, it will be automatically removed from Discovery.',
    GuildDiscoveryRequalified: 'This server is eligible for Server Discovery again and has been automatically relisted!',
    PinnedMessage: ':user: pinned a message to this channel.',
    RecipientAdd: ':user: added :user2: to the group.',
    RecipientRemove: ':user: removed :user2: from the group.',
    RecipientRemoveSelf: ':user: left the group.',
    GuildMemberJoin: [
        ":user: joined the party.",
        ":user: is here.",
        "Welcome, :user:. We hope you brought pizza.",
        "A wild :user: appeared.",
        ":user: just landed.",
        ":user: just slid into the server.",
        ":user: just showed up!",
        "Welcome :user:. Say hi!",
        ":user: hopped into the server.",
        "Everyone welcome :user:!",
        "Glad you're here, :user:.",
        "Good to see you, :user:.",
        "Yay you made it, :user:!",
    ],
    GuildMemberSubscribed: ':user: just boosted the server!',
    GuildMemberSubscribedAchievedTier: ':user: just boosted the server! :guild: has achieved **:premiumTier:!**',
});
var TeamMembershipStates;
(function (TeamMembershipStates) {
    TeamMembershipStates[TeamMembershipStates["BASE"] = 0] = "BASE";
    TeamMembershipStates[TeamMembershipStates["INVITED"] = 1] = "INVITED";
    TeamMembershipStates[TeamMembershipStates["ACCEPTED"] = 2] = "ACCEPTED";
})(TeamMembershipStates = exports.TeamMembershipStates || (exports.TeamMembershipStates = {}));
;
var TeamPayoutAccountStatuses;
(function (TeamPayoutAccountStatuses) {
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["UNSUBMITTED"] = -1] = "UNSUBMITTED";
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["PENDING"] = 2] = "PENDING";
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["ACTION_REQUIRED"] = 3] = "ACTION_REQUIRED";
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["ACTIVE"] = 4] = "ACTIVE";
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["BLOCKED"] = 5] = "BLOCKED";
    TeamPayoutAccountStatuses[TeamPayoutAccountStatuses["SUSPENDED"] = 6] = "SUSPENDED";
})(TeamPayoutAccountStatuses = exports.TeamPayoutAccountStatuses || (exports.TeamPayoutAccountStatuses = {}));
;
exports.TYPING_TIMEOUT = 10000;
var UserFlags;
(function (UserFlags) {
    UserFlags[UserFlags["STAFF"] = 1] = "STAFF";
    UserFlags[UserFlags["PARTNER"] = 2] = "PARTNER";
    UserFlags[UserFlags["HYPESQUAD"] = 4] = "HYPESQUAD";
    UserFlags[UserFlags["BUG_HUNTER_LEVEL_1"] = 8] = "BUG_HUNTER_LEVEL_1";
    UserFlags[UserFlags["MFA_SMS"] = 16] = "MFA_SMS";
    UserFlags[UserFlags["PREMIUM_PROMO_DISMISSED"] = 32] = "PREMIUM_PROMO_DISMISSED";
    UserFlags[UserFlags["HYPESQUAD_ONLINE_HOUSE_1"] = 64] = "HYPESQUAD_ONLINE_HOUSE_1";
    UserFlags[UserFlags["HYPESQUAD_ONLINE_HOUSE_2"] = 128] = "HYPESQUAD_ONLINE_HOUSE_2";
    UserFlags[UserFlags["HYPESQUAD_ONLINE_HOUSE_3"] = 256] = "HYPESQUAD_ONLINE_HOUSE_3";
    UserFlags[UserFlags["PREMIUM_EARLY_SUPPORTER"] = 512] = "PREMIUM_EARLY_SUPPORTER";
    UserFlags[UserFlags["TEAM_USER"] = 1024] = "TEAM_USER";
    UserFlags[UserFlags["SYSTEM"] = 4096] = "SYSTEM";
    UserFlags[UserFlags["HAS_UNREAD_URGENT_MESSAGES"] = 8192] = "HAS_UNREAD_URGENT_MESSAGES";
    UserFlags[UserFlags["BUG_HUNTER_LEVEL_2"] = 16384] = "BUG_HUNTER_LEVEL_2";
    UserFlags[UserFlags["VERIFIED_BOT"] = 65536] = "VERIFIED_BOT";
    UserFlags[UserFlags["VERIFIED_DEVELOPER"] = 131072] = "VERIFIED_DEVELOPER";
})(UserFlags = exports.UserFlags || (exports.UserFlags = {}));
;
// the level of their boost badge
var UserPremiumGuildSubscriptionLevels;
(function (UserPremiumGuildSubscriptionLevels) {
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_1"] = 1] = "LEVEL_1";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_2"] = 2] = "LEVEL_2";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_3"] = 3] = "LEVEL_3";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_4"] = 4] = "LEVEL_4";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_5"] = 5] = "LEVEL_5";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_6"] = 6] = "LEVEL_6";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_7"] = 7] = "LEVEL_7";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_8"] = 8] = "LEVEL_8";
    UserPremiumGuildSubscriptionLevels[UserPremiumGuildSubscriptionLevels["LEVEL_9"] = 9] = "LEVEL_9";
})(UserPremiumGuildSubscriptionLevels = exports.UserPremiumGuildSubscriptionLevels || (exports.UserPremiumGuildSubscriptionLevels = {}));
;
exports.UserPremiumGuildSubscriptionMonths = Object.freeze({
    [UserPremiumGuildSubscriptionLevels.LEVEL_2]: 2,
    [UserPremiumGuildSubscriptionLevels.LEVEL_3]: 3,
    [UserPremiumGuildSubscriptionLevels.LEVEL_4]: 6,
    [UserPremiumGuildSubscriptionLevels.LEVEL_5]: 9,
    [UserPremiumGuildSubscriptionLevels.LEVEL_6]: 12,
    [UserPremiumGuildSubscriptionLevels.LEVEL_7]: 15,
    [UserPremiumGuildSubscriptionLevels.LEVEL_8]: 18,
    [UserPremiumGuildSubscriptionLevels.LEVEL_9]: 24,
});
exports.UserRequiredActions = iris_utils_1.Tools.normalize({
    AGREEMENTS: null,
    REQUIRE_CAPTCHA: null,
    REQUIRE_VERIFIED_EMAIL: null,
    REQUIRE_VERIFIED_PHONE: null,
});
var VerificationLevels;
(function (VerificationLevels) {
    VerificationLevels[VerificationLevels["NONE"] = 0] = "NONE";
    VerificationLevels[VerificationLevels["LOW"] = 1] = "LOW";
    VerificationLevels[VerificationLevels["MEDIUM"] = 2] = "MEDIUM";
    VerificationLevels[VerificationLevels["HIGH"] = 3] = "HIGH";
    VerificationLevels[VerificationLevels["VERY_HIGH"] = 4] = "VERY_HIGH";
})(VerificationLevels = exports.VerificationLevels || (exports.VerificationLevels = {}));
;
var WebhookTypes;
(function (WebhookTypes) {
    WebhookTypes[WebhookTypes["INCOMING"] = 1] = "INCOMING";
    WebhookTypes[WebhookTypes["NEWS_FOLLOWING"] = 2] = "NEWS_FOLLOWING";
})(WebhookTypes = exports.WebhookTypes || (exports.WebhookTypes = {}));
;
exports.DiscordKeys = Object.freeze({
    ACCESS_TYPE: 'access_type',
    ACCOUNT: 'account',
    ACTION_TYPE: 'action_type',
    ACTIVE: 'active',
    ACTIVITIES: 'activities',
    ACTIVITY: 'activity',
    AFK_CHANNEL_ID: 'afk_channel_id',
    AFK_TIMEOUT: 'afk_timeout',
    ALIASES: 'aliases',
    ALLOW: 'allow',
    ALLOW_NEW: 'allow_new',
    ANALYTICS_TOKEN: 'analytics_token',
    ANIMATED: 'animated',
    APPLICATION: 'application',
    APPLICATION_ID: 'application_id',
    APPROXIMATE_MEMBER_COUNT: 'approximate_member_count',
    APPROXIMATE_PRESENCE_COUNT: 'approximate_presence_count',
    ASSET: 'asset',
    ASSETS: 'assets',
    ATTACHMENTS: 'attachments',
    AUTHOR: 'author',
    AVAILABLE: 'available',
    AVATAR: 'avatar',
    BANNER: 'banner',
    BITRATE: 'bitrate',
    BOT: 'bot',
    BOT_PUBLIC: 'bot_public',
    BOT_REQUIRE_CODE_GRANT: 'bot_require_code_grant',
    BOX_ART: 'box_art',
    BUTTONS: 'buttons',
    CALL: 'call',
    CAROUSEL_ITEMS: 'carousel_items',
    CATEGORY: 'category',
    CHANGES: 'changes',
    CHANNEL: 'channel',
    CHANNELS: 'channels',
    CHANNEL_ID: 'channel_id',
    CLIENT: 'client',
    CLIENT_INFO: 'client_info',
    CLIENT_STATUS: 'client_status',
    CODE: 'code',
    COLOR: 'color',
    CONNECTED_ACCOUNTS: 'connected_accounts',
    CONTENT: 'content',
    CONTENT_RATING: 'content_rating',
    CONTENT_RATING_AGENCY: 'content_rating_agency',
    COUNT: 'count',
    COVER_IMAGE: 'cover_image',
    CREATED_AT: 'created_at',
    CREATOR: 'creator',
    CREATOR_ID: 'creator_id',
    CURRENCY: 'currency',
    CUSTOM: 'custom',
    DEAF: 'deaf',
    DEFAULT_MESSAGE_NOTIFICATIONS: 'default_message_notifications',
    DELETE_MEMBER_DAYS: 'delete_member_days',
    DENY: 'deny',
    DENY_NEW: 'deny_new',
    DEPENDENT_SKU_ID: 'dependent_sku_id',
    DEPRECATED: 'deprecated',
    DESCRIPTION: 'description',
    DESKTOP: 'desktop',
    DETAILS: 'details',
    DEVELOPERS: 'developers',
    DISCOVERY_SPLASH: 'discovery_splash',
    DISCRIMINATOR: 'discriminator',
    DISTRIBUTOR: 'distributor',
    EDITED_TIMESTAMP: 'edited_timestamp',
    EMAIL: 'email',
    EMBEDS: 'embeds',
    EMBED_CHANNEL_ID: 'embed_channel_id',
    EMBED_ENABLED: 'embed_enabled',
    EMOJI: 'emoji',
    EMOJIS: 'emojis',
    ENABLED: 'enabled',
    END: 'end',
    ENDED: 'ended',
    ENDED_TIMESTAMP: 'ended_timestamp',
    ENTITLEMENT_BRANCH_ID: 'entitlement_branch_id',
    EULA_ID: 'eula_id',
    EXECUTABLES: 'executables',
    EXPIRES_AT: 'expires_at',
    EXPIRE_BEHAVIOR: 'expire_behavior',
    EXPIRE_GRACE_PERIOD: 'expire_grace_period',
    EXPLICIT_CONTENT_FILTER: 'explicit_content_filter',
    FEATURES: 'features',
    FIELDS: 'fields',
    FILENAME: 'filename',
    FLAGS: 'flags',
    FOOTER: 'footer',
    FORMAT_TYPE: 'format_type',
    FRIEND_SYNC: 'friend_sync',
    GAME: 'game',
    GAME_ID: 'game_id',
    GENRES: 'genres',
    GUILD: 'guild',
    GUILD_ID: 'guild_id',
    GUILD_IDS: 'guild_ids',
    HEADER_BACKGROUND: 'header_background',
    HEADER_LOGO_DARK_THEME: 'header_logo_dark_theme',
    HEADER_LOGO_LIGHT_THEME: 'header_logo_light_theme',
    HEIGHT: 'height',
    HERO_BACKGROUND: 'hero_background',
    HERO_VIDEO: 'hero_video',
    HOIST: 'hoist',
    HOISTED_ROLE: 'hoisted_role',
    HOOK: 'hook',
    ICON: 'icon',
    ICON_URL: 'icon_url',
    ID: 'id',
    IMAGE: 'image',
    INLINE: 'inline',
    INSTANCE: 'instance',
    INTEGRATIONS: 'integrations',
    INTERVAL: 'interval',
    INTERVAL_COUNT: 'interval_count',
    INVITER: 'inviter',
    IS_DIRTY: 'is_dirty',
    IS_PARTIAL: 'is_partial',
    IS_PENDING: 'is_pending',
    JOIN: 'join',
    JOINED_AT: 'joined_at',
    KEY: 'key',
    LARGE: 'large',
    LARGE_IMAGE: 'large_image',
    LARGE_TEXT: 'large_text',
    LAST_MESSAGE_ID: 'last_message_id',
    LAST_MODIFIED: 'last_modified',
    LAST_PIN_TIMESTAMP: 'last_pin_timestamp',
    LAZY: 'lazy',
    LEGAL_NOTICE: 'legal_notice',
    LOCALE: 'locale',
    LOCALES: 'locales',
    MANAGED: 'managed',
    MANIFEST_LABELS: 'manifest_labels',
    MATCH: 'match',
    MAX_AGE: 'max_age',
    MAX_MEMBERS: 'max_members',
    MAX_PRESENCES: 'max_presences',
    MAX_USES: 'max_uses',
    MAX_VIDEO_CHANNEL_USERS: 'max_video_channel_users',
    ME: 'me',
    MEMBER: 'member',
    MEMBERS: 'members',
    MEMBERSHIP_STATE: 'membership_state',
    MEMBERS_REMOVED: 'members_removed',
    MEMBER_COUNT: 'member_count',
    MENTIONABLE: 'mentionable',
    MENTIONS: 'mentions',
    MENTION_CHANNELS: 'mention_channels',
    MENTION_EVERYONE: 'mention_everyone',
    MENTION_ROLES: 'mention_roles',
    MESSAGE_ID: 'message_id',
    MESSAGE_REFERENCE: 'message_reference',
    METADATA: 'metadata',
    MFA_ENABLED: 'mfa_enabled',
    MFA_LEVEL: 'mfa_level',
    MIME_TYPE: 'mime_type',
    MOBILE: 'mobile',
    MUTE: 'mute',
    MUTUAL_GUILDS: 'mutual_guilds',
    NAME: 'name',
    NEW_VALUE: 'new_value',
    NICK: 'nick',
    NICKS: 'nicks',
    NONCE: 'nonce',
    NSFW: 'nsfw',
    OLD_VALUE: 'old_value',
    OPTIMAL: 'optimal',
    OPTIONS: 'options',
    OS: 'os',
    OVERLAY: 'overlay',
    OVERLAY_COMPATIBILITY_HOOK: 'overlay_compatibility_hook',
    OWNER: 'owner',
    OWNER_ID: 'owner_id',
    OWNER_USER_ID: 'owner_user_id',
    PACK_ID: 'pack_id',
    PARENT_ID: 'parent_id',
    PARTICIPANTS: 'participants',
    PARTY: 'party',
    PARTY_ID: 'party_id',
    PAYOUT_ACCOUNT_STATUS: 'payout_account_status',
    PENDING: 'pending',
    PERMISSIONS: 'permissions',
    PERMISSIONS_NEW: 'permissions_new',
    PERMISSION_OVERWRITES: 'permission_overwrites',
    PHONE: 'phone',
    PINNED: 'pinned',
    PLATFORM: 'platform',
    POSITION: 'position',
    PREFERRED_LOCALE: 'preferred_locale',
    PREMIUM: 'premium',
    PREMIUM_GUILD_SINCE: 'premium_guild_since',
    PREMIUM_SINCE: 'premium_since',
    PREMIUM_SUBSCRIPTION_COUNT: 'premium_subscription_count',
    PREMIUM_TIER: 'premium_tier',
    PREMIUM_TYPE: 'premium_type',
    PRESENCES: 'presences',
    PREVIEW_ASSET: 'preview_asset',
    PREVIEW_VIDEO: 'preview_video',
    PRICE: 'price',
    PRIMARY_SKU_ID: 'primary_sku_id',
    PROVIDER: 'provider',
    PROXY_ICON_URL: 'proxy_icon_url',
    PROXY_URL: 'proxy_url',
    PUBLIC_FLAGS: 'public_flags',
    PUBLIC_UPDATES_CHANNEL_ID: 'public_updates_channel_id',
    PUBLISHERS: 'publishers',
    RATE_LIMIT_PER_USER: 'rate_limit_per_user',
    REACTIONS: 'reactions',
    REASON: 'reason',
    RECIPIENTS: 'recipients',
    REDEEMED: 'redeemed',
    REDIRECT_URIS: 'redirect_uris',
    REFERENCE_ID: 'reference_id',
    REFERENCED_MESSAGE: 'referenced_message',
    REGION: 'region',
    RELEASE_DATE: 'release_date',
    REQUIRE_COLONS: 'require_colons',
    REVOKED: 'revoked',
    RINGING: 'ringing',
    ROLES: 'roles',
    ROLE_ID: 'role_id',
    RPC_APPLICATION_STATE: 'rpc_application_state',
    RPC_ORIGINS: 'rpc_origins',
    RULES_CHANNEL_ID: 'rules_channel_id',
    SECRET: 'secret',
    SECRETS: 'secrets',
    SELF_DEAF: 'self_deaf',
    SELF_MUTE: 'self_mute',
    SELF_STREAM: 'self_stream',
    SELF_VIDEO: 'self_video',
    SERIALIZED_SOURCE_GUILD: 'serialized_source_guild',
    SESSION_ID: 'session_id',
    SHOW_ACTIVITY: 'show_activity',
    SHOW_AGE_GATE: 'show_age_gate',
    SIZE: 'size',
    SKU: 'sku',
    SKU_ID: 'sku_id',
    SLUG: 'slug',
    SMALL_IMAGE: 'small_image',
    SMALL_TEXT: 'small_text',
    SOURCE_GUILD_ID: 'source_guild_id',
    SPECTATE: 'spectate',
    SPLASH: 'splash',
    START: 'start',
    STARTED: 'started',
    STATE: 'state',
    STATUS: 'status',
    STICKERS: 'stickers',
    STOPPED: 'stopped',
    STORE_APPLICATION_STATE: 'store_application_state',
    STORE_LISTING: 'store_listing',
    SUBSCRIPTION_PLAN: 'subscription_plan',
    SUBSCRIPTION_PLAN_ID: 'subscription_plan_id',
    SUBTARGET: 'subtarget',
    SUMMARY: 'summary',
    SUPPRESS: 'suppress',
    SYNCED_AT: 'synced_at',
    SYNCING: 'syncing',
    SYNC_ID: 'sync_id',
    SYSTEM: 'system',
    SYSTEM_CHANNEL_FLAGS: 'system_channel_flags',
    SYSTEM_CHANNEL_ID: 'system_channel_id',
    SYSTEM_REQUIREMENTS: 'system_requirements',
    TAGLINE: 'tagline',
    TAGS: 'tags',
    TARGET: 'target',
    TARGET_ID: 'target_id',
    TARGET_USER: 'target_user',
    TARGET_USER_TYPE: 'target_user_type',
    TAX_INCLUSIVE: 'tax_inclusive',
    TEAM: 'team',
    TEAM_ID: 'team_id',
    TEMPORARY: 'temporary',
    TEXT: 'text',
    THIRD_PARTY_SKUS: 'third_party_skus',
    THUMBNAIL: 'thumbnail',
    TIMESTAMP: 'timestamp',
    TIMESTAMPS: 'timestamps',
    TITLE: 'title',
    TOKEN: 'token',
    TOPIC: 'topic',
    TTS: 'tts',
    TYPE: 'type',
    UNAVAILABLE: 'unavailable',
    UPDATED_AT: 'updated_at',
    URL: 'url',
    USAGE_COUNT: 'usage_count',
    USER: 'user',
    USERNAME: 'username',
    USER_ID: 'user_id',
    USER_LIMIT: 'user_limit',
    USES: 'uses',
    VALUE: 'value',
    VANITY_URL_CODE: 'vanity_url_code',
    VERIFICATION_LEVEL: 'verification_level',
    VERIFIED: 'verified',
    VERIFY_KEY: 'verify_key',
    VERSION: 'version',
    VIDEO: 'video',
    VIP: 'vip',
    VISIBILITY: 'visibility',
    VOICE_STATES: 'voice_states',
    WEB: 'web',
    WEBHOOK_ID: 'webhook_id',
    WIDGET_CHANNEL_ID: 'widget_channel_id',
    WIDGET_ENABLED: 'widget_enabled',
    WIDTH: 'width',
    YOUTUBE_TRAILER_VIDEO_ID: 'youtube_trailer_video_id',
});
exports.DetritusKeys = Object.freeze({
    [exports.DiscordKeys.ACCESS_TYPE]: 'accessType',
    [exports.DiscordKeys.ACCOUNT]: 'account',
    [exports.DiscordKeys.ACTION_TYPE]: 'actionType',
    [exports.DiscordKeys.ACTIVE]: 'active',
    [exports.DiscordKeys.ACTIVITIES]: 'activities',
    [exports.DiscordKeys.ACTIVITY]: 'activity',
    [exports.DiscordKeys.AFK_CHANNEL_ID]: 'afkChannelId',
    [exports.DiscordKeys.AFK_TIMEOUT]: 'afkTimeout',
    [exports.DiscordKeys.ALIASES]: 'aliases',
    [exports.DiscordKeys.ALLOW]: 'allow',
    [exports.DiscordKeys.ALLOW_NEW]: 'allowNew',
    [exports.DiscordKeys.ANALYTICS_TOKEN]: 'analyticsToken',
    [exports.DiscordKeys.ANIMATED]: 'animated',
    [exports.DiscordKeys.APPLICATION]: 'application',
    [exports.DiscordKeys.APPLICATION_ID]: 'applicationId',
    [exports.DiscordKeys.APPROXIMATE_MEMBER_COUNT]: 'approximateMemberCount',
    [exports.DiscordKeys.APPROXIMATE_PRESENCE_COUNT]: 'approximatePresenceCount',
    [exports.DiscordKeys.ASSET]: 'asset',
    [exports.DiscordKeys.ASSETS]: 'assets',
    [exports.DiscordKeys.ATTACHMENTS]: 'attachments',
    [exports.DiscordKeys.AUTHOR]: 'author',
    [exports.DiscordKeys.AVAILABLE]: 'available',
    [exports.DiscordKeys.AVATAR]: 'avatar',
    [exports.DiscordKeys.BANNER]: 'banner',
    [exports.DiscordKeys.BITRATE]: 'bitrate',
    [exports.DiscordKeys.BOT]: 'bot',
    [exports.DiscordKeys.BOT_PUBLIC]: 'botPublic',
    [exports.DiscordKeys.BOT_REQUIRE_CODE_GRANT]: 'botRequireCodeGrant',
    [exports.DiscordKeys.BOX_ART]: 'boxArt',
    [exports.DiscordKeys.BUTTONS]: 'buttons',
    [exports.DiscordKeys.CALL]: 'call',
    [exports.DiscordKeys.CAROUSEL_ITEMS]: 'carouselItems',
    [exports.DiscordKeys.CATEGORY]: 'category',
    [exports.DiscordKeys.CHANGES]: 'changes',
    [exports.DiscordKeys.CHANNEL]: 'channel',
    [exports.DiscordKeys.CHANNELS]: 'channels',
    [exports.DiscordKeys.CHANNEL_ID]: 'channelId',
    [exports.DiscordKeys.CLIENT]: 'client',
    [exports.DiscordKeys.CLIENT_INFO]: 'clientInfo',
    [exports.DiscordKeys.CLIENT_STATUS]: 'clientStatus',
    [exports.DiscordKeys.CODE]: 'code',
    [exports.DiscordKeys.COLOR]: 'color',
    [exports.DiscordKeys.CONNECTED_ACCOUNTS]: 'connectedAccounts',
    [exports.DiscordKeys.CONTENT]: 'content',
    [exports.DiscordKeys.CONTENT_RATING]: 'contentRating',
    [exports.DiscordKeys.CONTENT_RATING_AGENCY]: 'contentRatingAgency',
    [exports.DiscordKeys.COUNT]: 'count',
    [exports.DiscordKeys.COVER_IMAGE]: 'coverImage',
    [exports.DiscordKeys.CREATED_AT]: 'createdAt',
    [exports.DiscordKeys.CREATOR]: 'creator',
    [exports.DiscordKeys.CREATOR_ID]: 'creatorId',
    [exports.DiscordKeys.CURRENCY]: 'currency',
    [exports.DiscordKeys.CUSTOM]: 'custom',
    [exports.DiscordKeys.DEAF]: 'deaf',
    [exports.DiscordKeys.DEFAULT_MESSAGE_NOTIFICATIONS]: 'defaultMessageNotifications',
    [exports.DiscordKeys.DELETE_MEMBER_DAYS]: 'deleteMemberDays',
    [exports.DiscordKeys.DENY]: 'deny',
    [exports.DiscordKeys.DENY_NEW]: 'denyNew',
    [exports.DiscordKeys.DEPENDENT_SKU_ID]: 'dependentSkuId',
    [exports.DiscordKeys.DEPRECATED]: 'deprecated',
    [exports.DiscordKeys.DESCRIPTION]: 'description',
    [exports.DiscordKeys.DESKTOP]: 'desktop',
    [exports.DiscordKeys.DETAILS]: 'details',
    [exports.DiscordKeys.DEVELOPERS]: 'developers',
    [exports.DiscordKeys.DISCOVERY_SPLASH]: 'discoverySplash',
    [exports.DiscordKeys.DISCRIMINATOR]: 'discriminator',
    [exports.DiscordKeys.DISTRIBUTOR]: 'distributor',
    [exports.DiscordKeys.EDITED_TIMESTAMP]: 'editedTimestamp',
    [exports.DiscordKeys.EMAIL]: 'email',
    [exports.DiscordKeys.EMBEDS]: 'embeds',
    [exports.DiscordKeys.EMBED_CHANNEL_ID]: 'embedChannelId',
    [exports.DiscordKeys.EMBED_ENABLED]: 'embedEnabled',
    [exports.DiscordKeys.EMOJI]: 'emoji',
    [exports.DiscordKeys.EMOJIS]: 'emojis',
    [exports.DiscordKeys.ENABLED]: 'enabled',
    [exports.DiscordKeys.END]: 'end',
    [exports.DiscordKeys.ENDED]: 'ended',
    [exports.DiscordKeys.ENDED_TIMESTAMP]: 'endedTimestamp',
    [exports.DiscordKeys.ENTITLEMENT_BRANCH_ID]: 'entitlementBranchId',
    [exports.DiscordKeys.EULA_ID]: 'eulaId',
    [exports.DiscordKeys.EXECUTABLES]: 'executables',
    [exports.DiscordKeys.EXPIRES_AT]: 'expiresAt',
    [exports.DiscordKeys.EXPIRE_BEHAVIOR]: 'expireBehavior',
    [exports.DiscordKeys.EXPIRE_GRACE_PERIOD]: 'expireGracePeriod',
    [exports.DiscordKeys.EXPLICIT_CONTENT_FILTER]: 'explicitContentFilter',
    [exports.DiscordKeys.FEATURES]: 'features',
    [exports.DiscordKeys.FIELDS]: 'fields',
    [exports.DiscordKeys.FILENAME]: 'filename',
    [exports.DiscordKeys.FLAGS]: 'flags',
    [exports.DiscordKeys.FOOTER]: 'footer',
    [exports.DiscordKeys.FORMAT_TYPE]: 'formatType',
    [exports.DiscordKeys.FRIEND_SYNC]: 'friendSync',
    [exports.DiscordKeys.GAME]: 'game',
    [exports.DiscordKeys.GAME_ID]: 'gameId',
    [exports.DiscordKeys.GENRES]: 'genres',
    [exports.DiscordKeys.GUILD]: 'guild',
    [exports.DiscordKeys.GUILD_ID]: 'guildId',
    [exports.DiscordKeys.GUILD_IDS]: 'guildIds',
    [exports.DiscordKeys.HEADER_BACKGROUND]: 'headerBackground',
    [exports.DiscordKeys.HEADER_LOGO_DARK_THEME]: 'headerLogoDarkTheme',
    [exports.DiscordKeys.HEADER_LOGO_LIGHT_THEME]: 'headerLogoLightTheme',
    [exports.DiscordKeys.HEIGHT]: 'height',
    [exports.DiscordKeys.HERO_BACKGROUND]: 'heroBackground',
    [exports.DiscordKeys.HERO_VIDEO]: 'heroVideo',
    [exports.DiscordKeys.HOIST]: 'hoist',
    [exports.DiscordKeys.HOISTED_ROLE]: 'hoistedRole',
    [exports.DiscordKeys.HOOK]: 'hook',
    [exports.DiscordKeys.ICON]: 'icon',
    [exports.DiscordKeys.ICON_URL]: 'iconUrl',
    [exports.DiscordKeys.ID]: 'id',
    [exports.DiscordKeys.IMAGE]: 'image',
    [exports.DiscordKeys.INLINE]: 'inline',
    [exports.DiscordKeys.INSTANCE]: 'instance',
    [exports.DiscordKeys.INTEGRATIONS]: 'integrations',
    [exports.DiscordKeys.INTERVAL]: 'interval',
    [exports.DiscordKeys.INTERVAL_COUNT]: 'intervalCount',
    [exports.DiscordKeys.INVITER]: 'inviter',
    [exports.DiscordKeys.IS_DIRTY]: 'isDirty',
    [exports.DiscordKeys.IS_PARTIAL]: 'isPartial',
    [exports.DiscordKeys.IS_PENDING]: 'isPending',
    [exports.DiscordKeys.JOIN]: 'join',
    [exports.DiscordKeys.JOINED_AT]: 'joinedAt',
    [exports.DiscordKeys.KEY]: 'key',
    [exports.DiscordKeys.LARGE]: 'large',
    [exports.DiscordKeys.LARGE_IMAGE]: 'largeImage',
    [exports.DiscordKeys.LARGE_TEXT]: 'largeText',
    [exports.DiscordKeys.LAST_MESSAGE_ID]: 'lastMessageId',
    [exports.DiscordKeys.LAST_MODIFIED]: 'lastModified',
    [exports.DiscordKeys.LAST_PIN_TIMESTAMP]: 'lastPinTimestamp',
    [exports.DiscordKeys.LAZY]: 'lazy',
    [exports.DiscordKeys.LEGAL_NOTICE]: 'legalNotice',
    [exports.DiscordKeys.LOCALE]: 'locale',
    [exports.DiscordKeys.LOCALES]: 'locales',
    [exports.DiscordKeys.MANAGED]: 'managed',
    [exports.DiscordKeys.MANIFEST_LABELS]: 'manifestLabels',
    [exports.DiscordKeys.MATCH]: 'match',
    [exports.DiscordKeys.MAX_AGE]: 'maxAge',
    [exports.DiscordKeys.MAX_MEMBERS]: 'maxMembers',
    [exports.DiscordKeys.MAX_PRESENCES]: 'maxPresences',
    [exports.DiscordKeys.MAX_USES]: 'maxUses',
    [exports.DiscordKeys.MAX_VIDEO_CHANNEL_USERS]: 'maxVideoChannelUsers',
    [exports.DiscordKeys.ME]: 'me',
    [exports.DiscordKeys.MEMBER]: 'member',
    [exports.DiscordKeys.MEMBERS]: 'members',
    [exports.DiscordKeys.MEMBERSHIP_STATE]: 'membershipState',
    [exports.DiscordKeys.MEMBERS_REMOVED]: 'membersRemoved',
    [exports.DiscordKeys.MEMBER_COUNT]: 'memberCount',
    [exports.DiscordKeys.MENTIONABLE]: 'mentionable',
    [exports.DiscordKeys.MENTIONS]: 'mentions',
    [exports.DiscordKeys.MENTION_CHANNELS]: 'mentionChannels',
    [exports.DiscordKeys.MENTION_EVERYONE]: 'mentionEveryone',
    [exports.DiscordKeys.MENTION_ROLES]: 'mentionRoles',
    [exports.DiscordKeys.MESSAGE_ID]: 'messageId',
    [exports.DiscordKeys.MESSAGE_REFERENCE]: 'messageReference',
    [exports.DiscordKeys.METADATA]: 'metadata',
    [exports.DiscordKeys.MFA_ENABLED]: 'mfaEnabled',
    [exports.DiscordKeys.MFA_LEVEL]: 'mfaLevel',
    [exports.DiscordKeys.MIME_TYPE]: 'mimeType',
    [exports.DiscordKeys.MOBILE]: 'mobile',
    [exports.DiscordKeys.MUTE]: 'mute',
    [exports.DiscordKeys.MUTUAL_GUILDS]: 'mutualGuilds',
    [exports.DiscordKeys.NAME]: 'name',
    [exports.DiscordKeys.NEW_VALUE]: 'newValue',
    [exports.DiscordKeys.NICK]: 'nick',
    [exports.DiscordKeys.NICKS]: 'nicks',
    [exports.DiscordKeys.NONCE]: 'nonce',
    [exports.DiscordKeys.NSFW]: 'nsfw',
    [exports.DiscordKeys.OLD_VALUE]: 'oldValue',
    [exports.DiscordKeys.OPTIMAL]: 'optimal',
    [exports.DiscordKeys.OPTIONS]: 'options',
    [exports.DiscordKeys.OS]: 'os',
    [exports.DiscordKeys.OVERLAY]: 'overlay',
    [exports.DiscordKeys.OVERLAY_COMPATIBILITY_HOOK]: 'overlayCompatibilityHook',
    [exports.DiscordKeys.OWNER]: 'owner',
    [exports.DiscordKeys.OWNER_ID]: 'ownerId',
    [exports.DiscordKeys.OWNER_USER_ID]: 'ownerUserId',
    [exports.DiscordKeys.PACK_ID]: 'packId',
    [exports.DiscordKeys.PARENT_ID]: 'parentId',
    [exports.DiscordKeys.PARTICIPANTS]: 'participants',
    [exports.DiscordKeys.PARTY]: 'party',
    [exports.DiscordKeys.PARTY_ID]: 'partyId',
    [exports.DiscordKeys.PAYOUT_ACCOUNT_STATUS]: 'payoutAccountStatus',
    [exports.DiscordKeys.PENDING]: 'pending',
    [exports.DiscordKeys.PERMISSIONS]: 'permissions',
    [exports.DiscordKeys.PERMISSIONS_NEW]: 'permissionsNew',
    [exports.DiscordKeys.PERMISSION_OVERWRITES]: 'permissionOverwrites',
    [exports.DiscordKeys.PHONE]: 'phone',
    [exports.DiscordKeys.PINNED]: 'pinned',
    [exports.DiscordKeys.PLATFORM]: 'platform',
    [exports.DiscordKeys.POSITION]: 'position',
    [exports.DiscordKeys.PREFERRED_LOCALE]: 'preferredLocale',
    [exports.DiscordKeys.PREMIUM]: 'premium',
    [exports.DiscordKeys.PREMIUM_GUILD_SINCE]: 'premiumGuildSince',
    [exports.DiscordKeys.PREMIUM_SINCE]: 'premiumSince',
    [exports.DiscordKeys.PREMIUM_SUBSCRIPTION_COUNT]: 'premiumSubscriptionCount',
    [exports.DiscordKeys.PREMIUM_TIER]: 'premiumTier',
    [exports.DiscordKeys.PREMIUM_TYPE]: 'premiumType',
    [exports.DiscordKeys.PRESENCES]: 'presences',
    [exports.DiscordKeys.PREVIEW_ASSET]: 'previewAsset',
    [exports.DiscordKeys.PREVIEW_VIDEO]: 'previewVideo',
    [exports.DiscordKeys.PRICE]: 'price',
    [exports.DiscordKeys.PRIMARY_SKU_ID]: 'primarySkuId',
    [exports.DiscordKeys.PROVIDER]: 'provider',
    [exports.DiscordKeys.PROXY_ICON_URL]: 'proxyIconUrl',
    [exports.DiscordKeys.PROXY_URL]: 'proxyUrl',
    [exports.DiscordKeys.PUBLIC_FLAGS]: 'publicFlags',
    [exports.DiscordKeys.PUBLIC_UPDATES_CHANNEL_ID]: 'publicUpdatesChannelId',
    [exports.DiscordKeys.PUBLISHERS]: 'publishers',
    [exports.DiscordKeys.RATE_LIMIT_PER_USER]: 'rateLimitPerUser',
    [exports.DiscordKeys.REACTIONS]: 'reactions',
    [exports.DiscordKeys.REASON]: 'reason',
    [exports.DiscordKeys.RECIPIENTS]: 'recipients',
    [exports.DiscordKeys.REDEEMED]: 'redeemed',
    [exports.DiscordKeys.REDIRECT_URIS]: 'redirectUris',
    [exports.DiscordKeys.REFERENCE_ID]: 'referenceId',
    [exports.DiscordKeys.REFERENCED_MESSAGE]: 'referencedMessage',
    [exports.DiscordKeys.REGION]: 'region',
    [exports.DiscordKeys.RELEASE_DATE]: 'releaseDate',
    [exports.DiscordKeys.REQUIRE_COLONS]: 'requireColons',
    [exports.DiscordKeys.REVOKED]: 'revoked',
    [exports.DiscordKeys.RINGING]: 'ringing',
    [exports.DiscordKeys.ROLES]: 'roles',
    [exports.DiscordKeys.ROLE_ID]: 'roleId',
    [exports.DiscordKeys.RPC_APPLICATION_STATE]: 'rpcApplicationState',
    [exports.DiscordKeys.RPC_ORIGINS]: 'rpcOrigins',
    [exports.DiscordKeys.RULES_CHANNEL_ID]: 'rulesChannelId',
    [exports.DiscordKeys.SECRET]: 'secret',
    [exports.DiscordKeys.SECRETS]: 'secrets',
    [exports.DiscordKeys.SELF_DEAF]: 'selfDeaf',
    [exports.DiscordKeys.SELF_MUTE]: 'selfMute',
    [exports.DiscordKeys.SELF_STREAM]: 'selfStream',
    [exports.DiscordKeys.SELF_VIDEO]: 'selfVideo',
    [exports.DiscordKeys.SERIALIZED_SOURCE_GUILD]: 'serializedSourceGuild',
    [exports.DiscordKeys.SESSION_ID]: 'sessionId',
    [exports.DiscordKeys.SHOW_ACTIVITY]: 'showActivity',
    [exports.DiscordKeys.SHOW_AGE_GATE]: 'showAgeGate',
    [exports.DiscordKeys.SIZE]: 'size',
    [exports.DiscordKeys.SKU]: 'sku',
    [exports.DiscordKeys.SKU_ID]: 'skuId',
    [exports.DiscordKeys.SLUG]: 'slug',
    [exports.DiscordKeys.SMALL_IMAGE]: 'smallImage',
    [exports.DiscordKeys.SMALL_TEXT]: 'smallText',
    [exports.DiscordKeys.SOURCE_GUILD_ID]: 'sourceGuildId',
    [exports.DiscordKeys.SPECTATE]: 'spectate',
    [exports.DiscordKeys.SPLASH]: 'splash',
    [exports.DiscordKeys.START]: 'start',
    [exports.DiscordKeys.STARTED]: 'started',
    [exports.DiscordKeys.STATE]: 'state',
    [exports.DiscordKeys.STATUS]: 'status',
    [exports.DiscordKeys.STICKERS]: 'stickers',
    [exports.DiscordKeys.STOPPED]: 'stopped',
    [exports.DiscordKeys.STORE_APPLICATION_STATE]: 'storeApplicationState',
    [exports.DiscordKeys.STORE_LISTING]: 'storeListing',
    [exports.DiscordKeys.SUBSCRIPTION_PLAN]: 'subscriptionPlan',
    [exports.DiscordKeys.SUBSCRIPTION_PLAN_ID]: 'subscriptionPlanId',
    [exports.DiscordKeys.SUBTARGET]: 'subtarget',
    [exports.DiscordKeys.SUMMARY]: 'summary',
    [exports.DiscordKeys.SUPPRESS]: 'suppress',
    [exports.DiscordKeys.SYNCED_AT]: 'syncedAt',
    [exports.DiscordKeys.SYNCING]: 'syncing',
    [exports.DiscordKeys.SYNC_ID]: 'syncId',
    [exports.DiscordKeys.SYSTEM]: 'system',
    [exports.DiscordKeys.SYSTEM_CHANNEL_FLAGS]: 'systemChannelFlags',
    [exports.DiscordKeys.SYSTEM_CHANNEL_ID]: 'systemChannelId',
    [exports.DiscordKeys.SYSTEM_REQUIREMENTS]: 'systemRequirements',
    [exports.DiscordKeys.TAGLINE]: 'tagline',
    [exports.DiscordKeys.TAGS]: 'tags',
    [exports.DiscordKeys.TARGET]: 'target',
    [exports.DiscordKeys.TARGET_ID]: 'targetId',
    [exports.DiscordKeys.TARGET_USER]: 'targetUser',
    [exports.DiscordKeys.TARGET_USER_TYPE]: 'targetUserType',
    [exports.DiscordKeys.TAX_INCLUSIVE]: 'taxInclusive',
    [exports.DiscordKeys.TEAM]: 'team',
    [exports.DiscordKeys.TEAM_ID]: 'teamId',
    [exports.DiscordKeys.TEMPORARY]: 'temporary',
    [exports.DiscordKeys.TEXT]: 'text',
    [exports.DiscordKeys.THIRD_PARTY_SKUS]: 'thirdPartySkus',
    [exports.DiscordKeys.THUMBNAIL]: 'thumbnail',
    [exports.DiscordKeys.TIMESTAMP]: 'timestamp',
    [exports.DiscordKeys.TIMESTAMPS]: 'timestamps',
    [exports.DiscordKeys.TITLE]: 'title',
    [exports.DiscordKeys.TOKEN]: 'token',
    [exports.DiscordKeys.TOPIC]: 'topic',
    [exports.DiscordKeys.TTS]: 'tts',
    [exports.DiscordKeys.TYPE]: 'type',
    [exports.DiscordKeys.UNAVAILABLE]: 'unavailable',
    [exports.DiscordKeys.UPDATED_AT]: 'updatedAt',
    [exports.DiscordKeys.URL]: 'url',
    [exports.DiscordKeys.USAGE_COUNT]: 'usageCount',
    [exports.DiscordKeys.USER]: 'user',
    [exports.DiscordKeys.USERNAME]: 'username',
    [exports.DiscordKeys.USER_ID]: 'userId',
    [exports.DiscordKeys.USER_LIMIT]: 'userLimit',
    [exports.DiscordKeys.USES]: 'uses',
    [exports.DiscordKeys.VALUE]: 'value',
    [exports.DiscordKeys.VANITY_URL_CODE]: 'vanityUrlCode',
    [exports.DiscordKeys.VERIFICATION_LEVEL]: 'verificationLevel',
    [exports.DiscordKeys.VERIFIED]: 'verified',
    [exports.DiscordKeys.VERIFY_KEY]: 'verifyKey',
    [exports.DiscordKeys.VERSION]: 'version',
    [exports.DiscordKeys.VIDEO]: 'video',
    [exports.DiscordKeys.VIP]: 'vip',
    [exports.DiscordKeys.VISIBILITY]: 'visibility',
    [exports.DiscordKeys.VOICE_STATES]: 'voiceStates',
    [exports.DiscordKeys.WEB]: 'web',
    [exports.DiscordKeys.WEBHOOK_ID]: 'webhookId',
    [exports.DiscordKeys.WIDGET_CHANNEL_ID]: 'widgetChannelId',
    [exports.DiscordKeys.WIDGET_ENABLED]: 'widgetEnabled',
    [exports.DiscordKeys.WIDTH]: 'width',
    [exports.DiscordKeys.YOUTUBE_TRAILER_VIDEO_ID]: 'youtubeTrailerVideoId',
});
exports.COMMAND_RATELIMIT_TYPES = Object.freeze(Object.values(CommandRatelimitTypes));
exports.DEFAULT_GROUP_DM_AVATARS = Object.freeze([
    '861ab526aa1fabb04c6b7da8074e3e21',
    'b8912961ea6ab32f0655d583bbc26b4f',
    '773616c3c8a7e21f8a774eb0d5625436',
    'f810dc5fedb7175c43a3389aa890534f',
    'e1fb24a120bdd003a84e021b16ec3bef',
    'b3150d5cef84b9e82128a1131684f287',
    '485a854d5171c8dc98088041626e6fea',
    '1531b79c2f2927945582023e1edaaa11',
]);
exports.IMAGE_FORMATS = Object.freeze(Object.values(ImageFormats));

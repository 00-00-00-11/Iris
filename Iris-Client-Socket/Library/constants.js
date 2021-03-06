"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTPHeaderExtensionTwoByte = exports.RTPHeaderExtensionOneByte = exports.RTCP_PACKET_TYPES = exports.RTCPPacketTypes = exports.RTCP_HEADER_VERSION = exports.RTP_PAYLOAD_TYPES = exports.RTPPayloadTypes = exports.RTP_HEADER_VERSION = exports.SocketStates = exports.SocketMediaCloseCodes = exports.SocketGatewayCloseCodes = exports.SocketInternalCloseReasons = exports.SocketInternalCloseCodes = exports.SocketCloseCodes = exports.SocketEventsBase = exports.SocketEvents = exports.MediaSSRCTypes = exports.MediaSpeakingFlags = exports.MediaSilencePacket = exports.MediaReceivedVideoQuality = exports.MEDIA_PROTOCOLS = exports.MediaProtocols = exports.MediaOpCodes = exports.MEDIA_ENCRYPTION_MODES = exports.MediaEncryptionModes = exports.MEDIA_CODECS_VIDEO = exports.MEDIA_CODECS_AUDIO = exports.MediaCodecs = exports.MediaCodecTypes = exports.MaxNumbers = exports.GatewayPresenceStatuses = exports.GatewayOpCodes = exports.GATEWAY_INTENTS_ALL_GUILD = exports.GATEWAY_INTENTS_ALL_DIRECT_MESSAGES = exports.GATEWAY_INTENTS_ALL_UNPRIVILEGED = exports.GATEWAY_INTENTS_ALL = exports.GatewayIntents = exports.GatewayDispatchEvents = exports.GatewayActivityTypes = exports.GatewayActivityFlags = exports.GatewayActivityActionTypes = exports.EncodingTypes = exports.DEFAULT_VOICE_TIMEOUT = exports.DEFAULT_SHARD_LAUNCH_DELAY = exports.DEFAULT_SHARD_COUNT = exports.CryptoModules = exports.COMPRESS_TYPES = exports.CompressTypes = exports.ApiVersions = exports.Package = void 0;
exports.ZLIB_SUFFIX = void 0;
exports.Package = Object.freeze({
    URL: 'https://github.com/NotMarx/Iris',
    VERSION: '0.7.2',
});
exports.ApiVersions = Object.freeze({
    GATEWAY: 8,
    MEDIA_GATEWAY: 5,
});
var CompressTypes;
(function (CompressTypes) {
    CompressTypes["NONE"] = "none";
    CompressTypes["PAYLOAD"] = "payload";
    CompressTypes["ZLIB"] = "zlib-stream";
})(CompressTypes = exports.CompressTypes || (exports.CompressTypes = {}));
exports.COMPRESS_TYPES = Object.freeze(Object.values(CompressTypes));
var CryptoModules;
(function (CryptoModules) {
    CryptoModules["LIBSODIUM_WRAPPERS"] = "libsodium-wrappers";
    CryptoModules["SODIUM"] = "sodium";
    CryptoModules["TWEETNACL"] = "tweetnacl";
})(CryptoModules = exports.CryptoModules || (exports.CryptoModules = {}));
exports.DEFAULT_SHARD_COUNT = 1;
exports.DEFAULT_SHARD_LAUNCH_DELAY = 5000;
exports.DEFAULT_VOICE_TIMEOUT = 30000;
var EncodingTypes;
(function (EncodingTypes) {
    EncodingTypes["ETF"] = "etf";
    EncodingTypes["JSON"] = "json";
})(EncodingTypes = exports.EncodingTypes || (exports.EncodingTypes = {}));
var GatewayActivityActionTypes;
(function (GatewayActivityActionTypes) {
    GatewayActivityActionTypes[GatewayActivityActionTypes["JOIN"] = 1] = "JOIN";
    GatewayActivityActionTypes[GatewayActivityActionTypes["SPECTATE"] = 2] = "SPECTATE";
    GatewayActivityActionTypes[GatewayActivityActionTypes["LISTEN"] = 3] = "LISTEN";
    GatewayActivityActionTypes[GatewayActivityActionTypes["WATCH"] = 4] = "WATCH";
    GatewayActivityActionTypes[GatewayActivityActionTypes["JOIN_REQUEST"] = 5] = "JOIN_REQUEST";
})(GatewayActivityActionTypes = exports.GatewayActivityActionTypes || (exports.GatewayActivityActionTypes = {}));
var GatewayActivityFlags;
(function (GatewayActivityFlags) {
    GatewayActivityFlags[GatewayActivityFlags["INSTANCE"] = 1] = "INSTANCE";
    GatewayActivityFlags[GatewayActivityFlags["JOIN"] = 2] = "JOIN";
    GatewayActivityFlags[GatewayActivityFlags["SPECTATE"] = 4] = "SPECTATE";
    GatewayActivityFlags[GatewayActivityFlags["JOIN_REQUEST"] = 8] = "JOIN_REQUEST";
    GatewayActivityFlags[GatewayActivityFlags["SYNC"] = 16] = "SYNC";
    GatewayActivityFlags[GatewayActivityFlags["PLAY"] = 32] = "PLAY";
    GatewayActivityFlags[GatewayActivityFlags["PARTY_PRIVACY_FRIENDS"] = 64] = "PARTY_PRIVACY_FRIENDS";
    GatewayActivityFlags[GatewayActivityFlags["PARTY_PRIVACY_VOICE_CHANNEL"] = 128] = "PARTY_PRIVACY_VOICE_CHANNEL";
    GatewayActivityFlags[GatewayActivityFlags["PARTY_EMBEDDED"] = 256] = "PARTY_EMBEDDED";
})(GatewayActivityFlags = exports.GatewayActivityFlags || (exports.GatewayActivityFlags = {}));
var GatewayActivityTypes;
(function (GatewayActivityTypes) {
    GatewayActivityTypes[GatewayActivityTypes["PLAYING"] = 0] = "PLAYING";
    GatewayActivityTypes[GatewayActivityTypes["STREAMING"] = 1] = "STREAMING";
    GatewayActivityTypes[GatewayActivityTypes["LISTENING"] = 2] = "LISTENING";
    GatewayActivityTypes[GatewayActivityTypes["WATCHING"] = 3] = "WATCHING";
    GatewayActivityTypes[GatewayActivityTypes["CUSTOM_STATUS"] = 4] = "CUSTOM_STATUS";
})(GatewayActivityTypes = exports.GatewayActivityTypes || (exports.GatewayActivityTypes = {}));
var GatewayDispatchEvents;
(function (GatewayDispatchEvents) {
    GatewayDispatchEvents["READY"] = "READY";
    GatewayDispatchEvents["RESUMED"] = "RESUMED";
    GatewayDispatchEvents["ACTIVITY_JOIN_INVITE"] = "ACTIVITY_JOIN_INVITE";
    GatewayDispatchEvents["ACTIVITY_JOIN_REQUEST"] = "ACTIVITY_JOIN_REQUEST";
    GatewayDispatchEvents["ACTIVITY_START"] = "ACTIVITY_START";
    GatewayDispatchEvents["BRAINTREE_POPUP_BRIDGE_CALLBACK"] = "BRAINTREE_POPUP_BRIDGE_CALLBACK";
    GatewayDispatchEvents["CALL_CREATE"] = "CALL_CREATE";
    GatewayDispatchEvents["CALL_DELETE"] = "CALL_DELETE";
    GatewayDispatchEvents["CALL_UPDATE"] = "CALL_UPDATE";
    GatewayDispatchEvents["CHANNEL_CREATE"] = "CHANNEL_CREATE";
    GatewayDispatchEvents["CHANNEL_DELETE"] = "CHANNEL_DELETE";
    GatewayDispatchEvents["CHANNEL_UPDATE"] = "CHANNEL_UPDATE";
    GatewayDispatchEvents["CHANNEL_PINS_ACK"] = "CHANNEL_PINS_ACK";
    GatewayDispatchEvents["CHANNEL_PINS_UPDATE"] = "CHANNEL_PINS_UPDATE";
    GatewayDispatchEvents["CHANNEL_RECIPIENT_ADD"] = "CHANNEL_RECIPIENT_ADD";
    GatewayDispatchEvents["CHANNEL_RECIPIENT_REMOVE"] = "CHANNEL_RECIPIENT_REMOVE";
    GatewayDispatchEvents["ENTITLEMENT_CREATE"] = "ENTITLEMENT_CREATE";
    GatewayDispatchEvents["ENTITLEMENT_DELETE"] = "ENTITLEMENT_DELETE";
    GatewayDispatchEvents["ENTITLEMENT_UPDATE"] = "ENTITLEMENT_UPDATE";
    GatewayDispatchEvents["FRIEND_SUGGESTION_CREATE"] = "FRIEND_SUGGESTION_CREATE";
    GatewayDispatchEvents["FRIEND_SUGGESTION_DELETE"] = "FRIEND_SUGGESTION_DELETE";
    GatewayDispatchEvents["GIFT_CODE_UPDATE"] = "GIFT_CODE_UPDATE";
    GatewayDispatchEvents["GUILD_APPLICATION_COMMANDS_UPDATE"] = "GUILD_APPLICATION_COMMANDS_UPDATE";
    GatewayDispatchEvents["GUILD_BAN_ADD"] = "GUILD_BAN_ADD";
    GatewayDispatchEvents["GUILD_BAN_REMOVE"] = "GUILD_BAN_REMOVE";
    GatewayDispatchEvents["GUILD_CREATE"] = "GUILD_CREATE";
    GatewayDispatchEvents["GUILD_DELETE"] = "GUILD_DELETE";
    GatewayDispatchEvents["GUILD_UPDATE"] = "GUILD_UPDATE";
    GatewayDispatchEvents["GUILD_EMOJIS_UPDATE"] = "GUILD_EMOJIS_UPDATE";
    GatewayDispatchEvents["GUILD_INTEGRATIONS_UPDATE"] = "GUILD_INTEGRATIONS_UPDATE";
    GatewayDispatchEvents["GUILD_MEMBER_ADD"] = "GUILD_MEMBER_ADD";
    GatewayDispatchEvents["GUILD_MEMBER_LIST_UPDATE"] = "GUILD_MEMBER_LIST_UPDATE";
    GatewayDispatchEvents["GUILD_MEMBER_REMOVE"] = "GUILD_MEMBER_REMOVE";
    GatewayDispatchEvents["GUILD_MEMBER_UPDATE"] = "GUILD_MEMBER_UPDATE";
    GatewayDispatchEvents["GUILD_MEMBERS_CHUNK"] = "GUILD_MEMBERS_CHUNK";
    GatewayDispatchEvents["GUILD_ROLE_CREATE"] = "GUILD_ROLE_CREATE";
    GatewayDispatchEvents["GUILD_ROLE_DELETE"] = "GUILD_ROLE_DELETE";
    GatewayDispatchEvents["GUILD_ROLE_UPDATE"] = "GUILD_ROLE_UPDATE";
    GatewayDispatchEvents["INTERACTION_CREATE"] = "INTERACTION_CREATE";
    GatewayDispatchEvents["INVITE_CREATE"] = "INVITE_CREATE";
    GatewayDispatchEvents["INVITE_DELETE"] = "INVITE_DELETE";
    GatewayDispatchEvents["LIBRARY_APPLICATION_UPDATE"] = "LIBRARY_APPLICATION_UPDATE";
    GatewayDispatchEvents["LOBBY_CREATE"] = "LOBBY_CREATE";
    GatewayDispatchEvents["LOBBY_DELETE"] = "LOBBY_DELETE";
    GatewayDispatchEvents["LOBBY_UPDATE"] = "LOBBY_UPDATE";
    GatewayDispatchEvents["LOBBY_MEMBER_CONNECT"] = "LOBBY_MEMBER_CONNECT";
    GatewayDispatchEvents["LOBBY_MEMBER_DISCONNECT"] = "LOBBY_MEMBER_DISCONNECT";
    GatewayDispatchEvents["LOBBY_MEMBER_UPDATE"] = "LOBBY_MEMBER_UPDATE";
    GatewayDispatchEvents["LOBBY_MESSAGE"] = "LOBBY_MESSAGE";
    GatewayDispatchEvents["LOBBY_VOICE_SERVER_UPDATE"] = "LOBBY_VOICE_SERVER_UPDATE";
    GatewayDispatchEvents["LOBBY_VOICE_STATE_UPDATE"] = "LOBBY_VOICE_STATE_UPDATE";
    GatewayDispatchEvents["MESSAGE_ACK"] = "MESSAGE_ACK";
    GatewayDispatchEvents["MESSAGE_CREATE"] = "MESSAGE_CREATE";
    GatewayDispatchEvents["MESSAGE_DELETE"] = "MESSAGE_DELETE";
    GatewayDispatchEvents["MESSAGE_DELETE_BULK"] = "MESSAGE_DELETE_BULK";
    GatewayDispatchEvents["MESSAGE_REACTION_ADD"] = "MESSAGE_REACTION_ADD";
    GatewayDispatchEvents["MESSAGE_REACTION_REMOVE"] = "MESSAGE_REACTION_REMOVE";
    GatewayDispatchEvents["MESSAGE_REACTION_REMOVE_ALL"] = "MESSAGE_REACTION_REMOVE_ALL";
    GatewayDispatchEvents["MESSAGE_REACTION_REMOVE_EMOJI"] = "MESSAGE_REACTION_REMOVE_EMOJI";
    GatewayDispatchEvents["MESSAGE_UPDATE"] = "MESSAGE_UPDATE";
    GatewayDispatchEvents["OAUTH2_TOKEN_REMOVE"] = "OAUTH2_TOKEN_REMOVE";
    GatewayDispatchEvents["PRESENCES_REPLACE"] = "PRESENCES_REPLACE";
    GatewayDispatchEvents["PRESENCE_UPDATE"] = "PRESENCE_UPDATE";
    GatewayDispatchEvents["RECENT_MENTION_DELETE"] = "RECENT_MENTION_DELETE";
    GatewayDispatchEvents["RELATIONSHIP_ADD"] = "RELATIONSHIP_ADD";
    GatewayDispatchEvents["RELATIONSHIP_REMOVE"] = "RELATIONSHIP_REMOVE";
    GatewayDispatchEvents["SESSIONS_REPLACE"] = "SESSIONS_REPLACE";
    GatewayDispatchEvents["STREAM_CREATE"] = "STREAM_CREATE";
    GatewayDispatchEvents["STREAM_DELETE"] = "STREAM_DELETE";
    GatewayDispatchEvents["STREAM_SERVER_UPDATE"] = "STREAM_SERVER_UPDATE";
    GatewayDispatchEvents["STREAM_UPDATE"] = "STREAM_UPDATE";
    GatewayDispatchEvents["TYPING_START"] = "TYPING_START";
    GatewayDispatchEvents["USER_ACHIEVEMENT_UPDATE"] = "USER_ACHIEVEMENT_UPDATE";
    GatewayDispatchEvents["USER_CONNECTIONS_UPDATE"] = "USER_CONNECTIONS_UPDATE";
    GatewayDispatchEvents["USER_FEED_SETTINGS_UPDATE"] = "USER_FEED_SETTINGS_UPDATE";
    GatewayDispatchEvents["USER_GUILD_SETTINGS_UPDATE"] = "USER_GUILD_SETTINGS_UPDATE";
    GatewayDispatchEvents["USER_NOTE_UPDATE"] = "USER_NOTE_UPDATE";
    GatewayDispatchEvents["USER_PAYMENT_SOURCES_UPDATE"] = "USER_PAYMENT_SOURCES_UPDATE";
    GatewayDispatchEvents["USER_PAYMENTS_UPDATE"] = "USER_PAYMENTS_UPDATE";
    GatewayDispatchEvents["USER_PREMIUM_GUILD_SUBSCRIPTION_SLOT_CREATE"] = "USER_PREMIUM_GUILD_SUBSCRIPTION_SLOT_CREATE";
    GatewayDispatchEvents["USER_PREMIUM_GUILD_SUBSCRIPTION_SLOT_UPDATE"] = "USER_PREMIUM_GUILD_SUBSCRIPTION_SLOT_UPDATE";
    GatewayDispatchEvents["USER_REQUIRED_ACTION_UPDATE"] = "USER_REQUIRED_ACTION_UPDATE";
    GatewayDispatchEvents["USER_SETTINGS_UPDATE"] = "USER_SETTINGS_UPDATE";
    GatewayDispatchEvents["USER_SUBSCRIPTIONS_UPDATE"] = "USER_SUBSCRIPTIONS_UPDATE";
    GatewayDispatchEvents["USER_STICKER_PACK_UPDATE"] = "USER_STICKER_PACK_UPDATE";
    GatewayDispatchEvents["USER_UPDATE"] = "USER_UPDATE";
    GatewayDispatchEvents["VOICE_SERVER_UPDATE"] = "VOICE_SERVER_UPDATE";
    GatewayDispatchEvents["VOICE_STATE_UPDATE"] = "VOICE_STATE_UPDATE";
    GatewayDispatchEvents["WEBHOOKS_UPDATE"] = "WEBHOOKS_UPDATE";
})(GatewayDispatchEvents = exports.GatewayDispatchEvents || (exports.GatewayDispatchEvents = {}));
var GatewayIntents;
(function (GatewayIntents) {
    GatewayIntents[GatewayIntents["GUILDS"] = 1] = "GUILDS";
    GatewayIntents[GatewayIntents["GUILD_MEMBERS"] = 2] = "GUILD_MEMBERS";
    GatewayIntents[GatewayIntents["GUILD_BANS"] = 4] = "GUILD_BANS";
    GatewayIntents[GatewayIntents["GUILD_EMOJIS"] = 8] = "GUILD_EMOJIS";
    GatewayIntents[GatewayIntents["GUILD_INTEGRATIONS"] = 16] = "GUILD_INTEGRATIONS";
    GatewayIntents[GatewayIntents["GUILD_WEBHOOKS"] = 32] = "GUILD_WEBHOOKS";
    GatewayIntents[GatewayIntents["GUILD_INVITES"] = 64] = "GUILD_INVITES";
    GatewayIntents[GatewayIntents["GUILD_VOICE_STATES"] = 128] = "GUILD_VOICE_STATES";
    GatewayIntents[GatewayIntents["GUILD_PRESENCES"] = 256] = "GUILD_PRESENCES";
    GatewayIntents[GatewayIntents["GUILD_MESSAGES"] = 512] = "GUILD_MESSAGES";
    GatewayIntents[GatewayIntents["GUILD_MESSAGE_REACTIONS"] = 1024] = "GUILD_MESSAGE_REACTIONS";
    GatewayIntents[GatewayIntents["GUILD_MESSAGE_TYPING"] = 2048] = "GUILD_MESSAGE_TYPING";
    GatewayIntents[GatewayIntents["DIRECT_MESSAGES"] = 4096] = "DIRECT_MESSAGES";
    GatewayIntents[GatewayIntents["DIRECT_MESSAGE_REACTIONS"] = 8192] = "DIRECT_MESSAGE_REACTIONS";
    GatewayIntents[GatewayIntents["DIRECT_MESSAGE_TYPING"] = 16384] = "DIRECT_MESSAGE_TYPING";
})(GatewayIntents = exports.GatewayIntents || (exports.GatewayIntents = {}));
exports.GATEWAY_INTENTS_ALL = [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILD_BANS,
    GatewayIntents.GUILD_EMOJIS,
    GatewayIntents.GUILD_INTEGRATIONS,
    GatewayIntents.GUILD_WEBHOOKS,
    GatewayIntents.GUILD_INVITES,
    GatewayIntents.GUILD_VOICE_STATES,
    GatewayIntents.GUILD_PRESENCES,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_TYPING,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGE_TYPING,
].reduce((x, total) => total | x);
exports.GATEWAY_INTENTS_ALL_UNPRIVILEGED = [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_BANS,
    GatewayIntents.GUILD_EMOJIS,
    GatewayIntents.GUILD_INTEGRATIONS,
    GatewayIntents.GUILD_WEBHOOKS,
    GatewayIntents.GUILD_INVITES,
    GatewayIntents.GUILD_VOICE_STATES,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_TYPING,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGE_TYPING,
].reduce((x, total) => total | x);
exports.GATEWAY_INTENTS_ALL_DIRECT_MESSAGES = [
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGE_TYPING,
].reduce((x, total) => total | x);
exports.GATEWAY_INTENTS_ALL_GUILD = [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILD_BANS,
    GatewayIntents.GUILD_EMOJIS,
    GatewayIntents.GUILD_INTEGRATIONS,
    GatewayIntents.GUILD_WEBHOOKS,
    GatewayIntents.GUILD_INVITES,
    GatewayIntents.GUILD_VOICE_STATES,
    GatewayIntents.GUILD_PRESENCES,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_TYPING,
].reduce((x, total) => total | x);
var GatewayOpCodes;
(function (GatewayOpCodes) {
    GatewayOpCodes[GatewayOpCodes["DISPATCH"] = 0] = "DISPATCH";
    GatewayOpCodes[GatewayOpCodes["HEARTBEAT"] = 1] = "HEARTBEAT";
    GatewayOpCodes[GatewayOpCodes["IDENTIFY"] = 2] = "IDENTIFY";
    GatewayOpCodes[GatewayOpCodes["PRESENCE_UPDATE"] = 3] = "PRESENCE_UPDATE";
    GatewayOpCodes[GatewayOpCodes["VOICE_STATE_UPDATE"] = 4] = "VOICE_STATE_UPDATE";
    GatewayOpCodes[GatewayOpCodes["VOICE_SERVER_PING"] = 5] = "VOICE_SERVER_PING";
    GatewayOpCodes[GatewayOpCodes["RESUME"] = 6] = "RESUME";
    GatewayOpCodes[GatewayOpCodes["RECONNECT"] = 7] = "RECONNECT";
    GatewayOpCodes[GatewayOpCodes["REQUEST_GUILD_MEMBERS"] = 8] = "REQUEST_GUILD_MEMBERS";
    GatewayOpCodes[GatewayOpCodes["INVALID_SESSION"] = 9] = "INVALID_SESSION";
    GatewayOpCodes[GatewayOpCodes["HELLO"] = 10] = "HELLO";
    GatewayOpCodes[GatewayOpCodes["HEARTBEAT_ACK"] = 11] = "HEARTBEAT_ACK";
    GatewayOpCodes[GatewayOpCodes["SYNC_GUILD"] = 12] = "SYNC_GUILD";
    GatewayOpCodes[GatewayOpCodes["CALL_CONNECT"] = 13] = "CALL_CONNECT";
    GatewayOpCodes[GatewayOpCodes["GUILD_SUBSCRIPTIONS"] = 14] = "GUILD_SUBSCRIPTIONS";
    GatewayOpCodes[GatewayOpCodes["LOBBY_CONNECT"] = 15] = "LOBBY_CONNECT";
    GatewayOpCodes[GatewayOpCodes["LOBBY_DISCONNECT"] = 16] = "LOBBY_DISCONNECT";
    GatewayOpCodes[GatewayOpCodes["LOBBY_VOICE_STATES_UPDATE"] = 17] = "LOBBY_VOICE_STATES_UPDATE";
    GatewayOpCodes[GatewayOpCodes["STREAM_CREATE"] = 18] = "STREAM_CREATE";
    GatewayOpCodes[GatewayOpCodes["STREAM_DELETE"] = 19] = "STREAM_DELETE";
    GatewayOpCodes[GatewayOpCodes["STREAM_WATCH"] = 20] = "STREAM_WATCH";
    GatewayOpCodes[GatewayOpCodes["STREAM_PING"] = 21] = "STREAM_PING";
    GatewayOpCodes[GatewayOpCodes["STREAM_SET_PAUSED"] = 22] = "STREAM_SET_PAUSED";
    GatewayOpCodes[GatewayOpCodes["REQUEST_APPLICATION_COMMANDS"] = 24] = "REQUEST_APPLICATION_COMMANDS";
})(GatewayOpCodes = exports.GatewayOpCodes || (exports.GatewayOpCodes = {}));
var GatewayPresenceStatuses;
(function (GatewayPresenceStatuses) {
    GatewayPresenceStatuses["ONLINE"] = "online";
    GatewayPresenceStatuses["DND"] = "dnd";
    GatewayPresenceStatuses["IDLE"] = "idle";
    GatewayPresenceStatuses["INVISIBLE"] = "invisible";
    GatewayPresenceStatuses["OFFLINE"] = "offline";
})(GatewayPresenceStatuses = exports.GatewayPresenceStatuses || (exports.GatewayPresenceStatuses = {}));
exports.MaxNumbers = Object.freeze({
    UINT8: 0xFF,
    UINT16: 0xFFFF,
    UINT32: 0xFFFFFFFF,
});
var MediaCodecTypes;
(function (MediaCodecTypes) {
    MediaCodecTypes["AUDIO"] = "audio";
    MediaCodecTypes["VIDEO"] = "video";
})(MediaCodecTypes = exports.MediaCodecTypes || (exports.MediaCodecTypes = {}));
var MediaCodecs;
(function (MediaCodecs) {
    MediaCodecs["OPUS"] = "opus";
    MediaCodecs["H264"] = "H264";
    MediaCodecs["VP8"] = "VP8";
    MediaCodecs["VP9"] = "VP9";
    MediaCodecs["RTX"] = "rtx";
})(MediaCodecs = exports.MediaCodecs || (exports.MediaCodecs = {}));
exports.MEDIA_CODECS_AUDIO = [
    MediaCodecs.OPUS,
];
exports.MEDIA_CODECS_VIDEO = [
    MediaCodecs.VP8,
    MediaCodecs.VP9,
    MediaCodecs.H264,
];
var MediaEncryptionModes;
(function (MediaEncryptionModes) {
    MediaEncryptionModes["XSALSA20_POLY1305_LITE"] = "xsalsa20_poly1305_lite";
    MediaEncryptionModes["XSALSA20_POLY1305_SUFFIX"] = "xsalsa20_poly1305_suffix";
    MediaEncryptionModes["XSALSA20_POLY1305"] = "xsalsa20_poly1305";
})(MediaEncryptionModes = exports.MediaEncryptionModes || (exports.MediaEncryptionModes = {}));
exports.MEDIA_ENCRYPTION_MODES = Object.freeze(Object.values(MediaEncryptionModes));
var MediaOpCodes;
(function (MediaOpCodes) {
    MediaOpCodes[MediaOpCodes["IDENTIFY"] = 0] = "IDENTIFY";
    MediaOpCodes[MediaOpCodes["SELECT_PROTOCOL"] = 1] = "SELECT_PROTOCOL";
    MediaOpCodes[MediaOpCodes["READY"] = 2] = "READY";
    MediaOpCodes[MediaOpCodes["HEARTBEAT"] = 3] = "HEARTBEAT";
    MediaOpCodes[MediaOpCodes["SELECT_PROTOCOL_ACK"] = 4] = "SELECT_PROTOCOL_ACK";
    MediaOpCodes[MediaOpCodes["SPEAKING"] = 5] = "SPEAKING";
    MediaOpCodes[MediaOpCodes["HEARTBEAT_ACK"] = 6] = "HEARTBEAT_ACK";
    MediaOpCodes[MediaOpCodes["RESUME"] = 7] = "RESUME";
    MediaOpCodes[MediaOpCodes["HELLO"] = 8] = "HELLO";
    MediaOpCodes[MediaOpCodes["RESUMED"] = 9] = "RESUMED";
    MediaOpCodes[MediaOpCodes["SIGNAL"] = 10] = "SIGNAL";
    MediaOpCodes[MediaOpCodes["CLIENT_CONNECT"] = 12] = "CLIENT_CONNECT";
    MediaOpCodes[MediaOpCodes["CLIENT_DISCONNECT"] = 13] = "CLIENT_DISCONNECT";
    MediaOpCodes[MediaOpCodes["SESSION_UPDATE"] = 14] = "SESSION_UPDATE";
    MediaOpCodes[MediaOpCodes["VIDEO_SINK_WANTS"] = 15] = "VIDEO_SINK_WANTS";
})(MediaOpCodes = exports.MediaOpCodes || (exports.MediaOpCodes = {}));
var MediaProtocols;
(function (MediaProtocols) {
    MediaProtocols["UDP"] = "udp";
    MediaProtocols["WEBRTC"] = "webrtc";
})(MediaProtocols = exports.MediaProtocols || (exports.MediaProtocols = {}));
exports.MEDIA_PROTOCOLS = Object.freeze(Object.values(MediaProtocols));
exports.MediaReceivedVideoQuality = Object.freeze({
    OFF: 'off',
    FULL: 'full',
});
exports.MediaSilencePacket = [0xF8, 0xFF, 0xFE];
var MediaSpeakingFlags;
(function (MediaSpeakingFlags) {
    MediaSpeakingFlags[MediaSpeakingFlags["NONE"] = 0] = "NONE";
    MediaSpeakingFlags[MediaSpeakingFlags["VOICE"] = 1] = "VOICE";
    MediaSpeakingFlags[MediaSpeakingFlags["SOUNDSHARE"] = 2] = "SOUNDSHARE";
    MediaSpeakingFlags[MediaSpeakingFlags["PRIORITY"] = 4] = "PRIORITY";
})(MediaSpeakingFlags = exports.MediaSpeakingFlags || (exports.MediaSpeakingFlags = {}));
var MediaSSRCTypes;
(function (MediaSSRCTypes) {
    MediaSSRCTypes["AUDIO"] = "audio";
    MediaSSRCTypes["VIDEO"] = "video";
})(MediaSSRCTypes = exports.MediaSSRCTypes || (exports.MediaSSRCTypes = {}));
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CLOSE"] = "close";
    SocketEvents["KILLED"] = "killed";
    SocketEvents["LOG"] = "log";
    SocketEvents["OPEN"] = "open";
    SocketEvents["PACKET"] = "packet";
    SocketEvents["READY"] = "ready";
    SocketEvents["RECONNECTING"] = "reconnecting";
    SocketEvents["SOCKET"] = "socket";
    SocketEvents["STATE"] = "state";
    SocketEvents["TRANSPORT"] = "transport";
    SocketEvents["TRANSPORT_READY"] = "transportReady";
    SocketEvents["WARN"] = "warn";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
var SocketEventsBase;
(function (SocketEventsBase) {
    SocketEventsBase["CLOSE"] = "close";
    SocketEventsBase["ERROR"] = "error";
    SocketEventsBase["MESSAGE"] = "message";
    SocketEventsBase["OPEN"] = "open";
    SocketEventsBase["PING"] = "ping";
    SocketEventsBase["PONG"] = "pong";
})(SocketEventsBase = exports.SocketEventsBase || (exports.SocketEventsBase = {}));
var SocketCloseCodes;
(function (SocketCloseCodes) {
    SocketCloseCodes[SocketCloseCodes["NORMAL"] = 1000] = "NORMAL";
    SocketCloseCodes[SocketCloseCodes["GOING_AWAY"] = 1001] = "GOING_AWAY";
    SocketCloseCodes[SocketCloseCodes["PROTOCOL_ERROR"] = 1002] = "PROTOCOL_ERROR";
    SocketCloseCodes[SocketCloseCodes["UNSUPPORTED_DATA"] = 1003] = "UNSUPPORTED_DATA";
    SocketCloseCodes[SocketCloseCodes["ABNORMAL_CLOSURE"] = 1006] = "ABNORMAL_CLOSURE";
    SocketCloseCodes[SocketCloseCodes["INVALID_FRAME"] = 1007] = "INVALID_FRAME";
    SocketCloseCodes[SocketCloseCodes["POLICY_VIOLATION"] = 1008] = "POLICY_VIOLATION";
    SocketCloseCodes[SocketCloseCodes["MESSAGE_TOO_BIG"] = 1009] = "MESSAGE_TOO_BIG";
    SocketCloseCodes[SocketCloseCodes["MISSING_EXTENSION"] = 1010] = "MISSING_EXTENSION";
    SocketCloseCodes[SocketCloseCodes["INTERNAL_ERROR"] = 1011] = "INTERNAL_ERROR";
    SocketCloseCodes[SocketCloseCodes["SERVICE_RESTART"] = 1012] = "SERVICE_RESTART";
    SocketCloseCodes[SocketCloseCodes["TRY_AGAIN_LATER"] = 1013] = "TRY_AGAIN_LATER";
    SocketCloseCodes[SocketCloseCodes["BAD_GATEWAY"] = 1014] = "BAD_GATEWAY";
})(SocketCloseCodes = exports.SocketCloseCodes || (exports.SocketCloseCodes = {}));
var SocketInternalCloseCodes;
(function (SocketInternalCloseCodes) {
    SocketInternalCloseCodes[SocketInternalCloseCodes["CONNECTION_ERROR"] = -1] = "CONNECTION_ERROR";
    SocketInternalCloseCodes[SocketInternalCloseCodes["INVALID_DATA"] = 4800] = "INVALID_DATA";
    SocketInternalCloseCodes[SocketInternalCloseCodes["RECONNECTING"] = 4801] = "RECONNECTING";
    SocketInternalCloseCodes[SocketInternalCloseCodes["HEARTBEAT_ACK"] = 4802] = "HEARTBEAT_ACK";
    SocketInternalCloseCodes[SocketInternalCloseCodes["HEARTBEAT_ACK_NONCE"] = 4803] = "HEARTBEAT_ACK_NONCE";
    SocketInternalCloseCodes[SocketInternalCloseCodes["OTHER_SOCKET_MESSAGE"] = 4804] = "OTHER_SOCKET_MESSAGE";
    SocketInternalCloseCodes[SocketInternalCloseCodes["OTHER_SOCKET_OPEN"] = 4805] = "OTHER_SOCKET_OPEN";
})(SocketInternalCloseCodes = exports.SocketInternalCloseCodes || (exports.SocketInternalCloseCodes = {}));
exports.SocketInternalCloseReasons = Object.freeze({
    [SocketInternalCloseCodes.CONNECTION_ERROR]: 'Gateway Error, check `warn` listener',
    [SocketInternalCloseCodes.INVALID_DATA]: 'Invalid data received, reconnecting',
    [SocketInternalCloseCodes.RECONNECTING]: 'Reconnecting',
    [SocketInternalCloseCodes.HEARTBEAT_ACK]: 'Heartbeat ACK never arrived',
    [SocketInternalCloseCodes.HEARTBEAT_ACK_NONCE]: 'Invalid nonce received by Heartbeat ACK',
    [SocketInternalCloseCodes.OTHER_SOCKET_MESSAGE]: 'Received message from not our current socket',
    [SocketInternalCloseCodes.OTHER_SOCKET_OPEN]: 'Received open from not our current socket',
});
var SocketGatewayCloseCodes;
(function (SocketGatewayCloseCodes) {
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["UNKNOWN_ERROR"] = 4000] = "UNKNOWN_ERROR";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["UNKNOWN_OPCODE"] = 4001] = "UNKNOWN_OPCODE";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["DECODE_ERROR"] = 4002] = "DECODE_ERROR";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["NOT_AUTHENTICATED"] = 4003] = "NOT_AUTHENTICATED";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["AUTHENTICATION_FAILED"] = 4004] = "AUTHENTICATION_FAILED";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["ALREADY_AUTHENTICATED"] = 4005] = "ALREADY_AUTHENTICATED";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["INVALID_SEQUENCE"] = 4007] = "INVALID_SEQUENCE";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["RATE_LIMITED"] = 4008] = "RATE_LIMITED";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["SESSION_TIMEOUT"] = 4009] = "SESSION_TIMEOUT";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["INVALID_SHARD"] = 4010] = "INVALID_SHARD";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["SHARDING_REQUIRED"] = 4011] = "SHARDING_REQUIRED";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["INVALID_VERSION"] = 4012] = "INVALID_VERSION";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["INVALID_INTENTS"] = 4013] = "INVALID_INTENTS";
    SocketGatewayCloseCodes[SocketGatewayCloseCodes["DISALLOWED_INTENTS"] = 4014] = "DISALLOWED_INTENTS";
})(SocketGatewayCloseCodes = exports.SocketGatewayCloseCodes || (exports.SocketGatewayCloseCodes = {}));
;
var SocketMediaCloseCodes;
(function (SocketMediaCloseCodes) {
    SocketMediaCloseCodes[SocketMediaCloseCodes["UNKNOWN_ERROR"] = 4000] = "UNKNOWN_ERROR";
    SocketMediaCloseCodes[SocketMediaCloseCodes["UNKNOWN_OPCODE"] = 4001] = "UNKNOWN_OPCODE";
    SocketMediaCloseCodes[SocketMediaCloseCodes["DECODE_ERROR"] = 4002] = "DECODE_ERROR";
    SocketMediaCloseCodes[SocketMediaCloseCodes["NOT_AUTHENTICATED"] = 4003] = "NOT_AUTHENTICATED";
    SocketMediaCloseCodes[SocketMediaCloseCodes["AUTHENTICATION_FAILED"] = 4004] = "AUTHENTICATION_FAILED";
    SocketMediaCloseCodes[SocketMediaCloseCodes["ALREADY_AUTHENTICATED"] = 4005] = "ALREADY_AUTHENTICATED";
    SocketMediaCloseCodes[SocketMediaCloseCodes["SESSION_NO_LONGER_VALID"] = 4006] = "SESSION_NO_LONGER_VALID";
    SocketMediaCloseCodes[SocketMediaCloseCodes["SESSION_TIMEOUT"] = 4009] = "SESSION_TIMEOUT";
    SocketMediaCloseCodes[SocketMediaCloseCodes["SERVER_NOT_FOUND"] = 4011] = "SERVER_NOT_FOUND";
    SocketMediaCloseCodes[SocketMediaCloseCodes["UNKNOWN_PROTOCOL"] = 4012] = "UNKNOWN_PROTOCOL";
    SocketMediaCloseCodes[SocketMediaCloseCodes["DISCONNECTED"] = 4014] = "DISCONNECTED";
    SocketMediaCloseCodes[SocketMediaCloseCodes["VOICE_SERVER_CRASHED"] = 4015] = "VOICE_SERVER_CRASHED";
    SocketMediaCloseCodes[SocketMediaCloseCodes["UNKNOWN_ENCRYPTION_MODE"] = 4016] = "UNKNOWN_ENCRYPTION_MODE";
})(SocketMediaCloseCodes = exports.SocketMediaCloseCodes || (exports.SocketMediaCloseCodes = {}));
;
var SocketStates;
(function (SocketStates) {
    SocketStates["CLOSED"] = "CLOSED";
    SocketStates["CONNECTING"] = "CONNECTING";
    SocketStates["IDENTIFYING"] = "IDENTIFYING";
    SocketStates["OPEN"] = "OPEN";
    SocketStates["READY"] = "READY";
    SocketStates["RESUMING"] = "RESUMING";
})(SocketStates = exports.SocketStates || (exports.SocketStates = {}));
exports.RTP_HEADER_VERSION = 0x80;
var RTPPayloadTypes;
(function (RTPPayloadTypes) {
    RTPPayloadTypes[RTPPayloadTypes["OPUS"] = 120] = "OPUS";
    RTPPayloadTypes[RTPPayloadTypes["VP8"] = 101] = "VP8";
    RTPPayloadTypes[RTPPayloadTypes["VP9"] = 103] = "VP9";
    RTPPayloadTypes[RTPPayloadTypes["H264"] = 105] = "H264";
})(RTPPayloadTypes = exports.RTPPayloadTypes || (exports.RTPPayloadTypes = {}));
exports.RTP_PAYLOAD_TYPES = Object.freeze(Object.values(RTPPayloadTypes));
exports.RTCP_HEADER_VERSION = 0x80;
var RTCPPacketTypes;
(function (RTCPPacketTypes) {
    RTCPPacketTypes[RTCPPacketTypes["SENDER_REPORT"] = 200] = "SENDER_REPORT";
    RTCPPacketTypes[RTCPPacketTypes["RECEIVER_REPORT"] = 201] = "RECEIVER_REPORT";
    RTCPPacketTypes[RTCPPacketTypes["SOURCE_DESCRIPTION"] = 202] = "SOURCE_DESCRIPTION";
    RTCPPacketTypes[RTCPPacketTypes["BYE"] = 203] = "BYE";
    RTCPPacketTypes[RTCPPacketTypes["APP"] = 204] = "APP";
    RTCPPacketTypes[RTCPPacketTypes["RTPFB"] = 205] = "RTPFB";
    RTCPPacketTypes[RTCPPacketTypes["PSFB"] = 206] = "PSFB";
})(RTCPPacketTypes = exports.RTCPPacketTypes || (exports.RTCPPacketTypes = {}));
exports.RTCP_PACKET_TYPES = Object.freeze(Object.values(RTCPPacketTypes));
exports.RTPHeaderExtensionOneByte = Object.freeze({
    HEADER: [0xBE, 0xDE],
    LOCAL_IDENTIFER: 0xF,
});
exports.RTPHeaderExtensionTwoByte = Object.freeze({
    HEADER: [0x10, 0x00],
});
exports.ZLIB_SUFFIX = [0x0, 0x0, 0xff, 0xff];

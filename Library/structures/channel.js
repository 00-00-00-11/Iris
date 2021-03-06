"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelGuildStore = exports.ChannelGuildVoice = exports.ChannelGuildText = exports.ChannelGuildCategory = exports.ChannelGuildBase = exports.ChannelDMGroup = exports.ChannelDM = exports.ChannelBase = exports.createChannelFromData = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const overwrite_1 = require("./overwrite");
const role_1 = require("./role");
const user_1 = require("./user");
function createChannelFromData(client, data) {
    let Class = ChannelBase;
    switch (data.type) {
        case constants_1.ChannelTypes.GUILD_TEXT:
            {
                Class = ChannelGuildText;
            }
            ;
            break;
        case constants_1.ChannelTypes.DM:
            {
                Class = ChannelDM;
            }
            ;
            break;
        case constants_1.ChannelTypes.GUILD_VOICE:
            {
                Class = ChannelGuildVoice;
            }
            ;
            break;
        case constants_1.ChannelTypes.GROUP_DM:
            {
                Class = ChannelDMGroup;
            }
            ;
            break;
        case constants_1.ChannelTypes.GUILD_CATEGORY:
            {
                Class = ChannelGuildCategory;
            }
            ;
            break;
        case constants_1.ChannelTypes.GUILD_NEWS:
            {
                Class = ChannelGuildText;
            }
            ;
            break;
        case constants_1.ChannelTypes.GUILD_STORE:
            {
                Class = ChannelGuildStore;
            }
            ;
            break;
    }
    return new Class(client, data);
}
exports.createChannelFromData = createChannelFromData;
const keysChannelBase = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.IS_PARTIAL,
    constants_1.DiscordKeys.TYPE,
]);
const keysMergeChannelBase = new baseset_1.BaseSet();
/**
 * Basic Channel Structure
 * @category Structure
 */
class ChannelBase extends basestructure_1.BaseStructure {
    constructor(client, data, merge = true) {
        super(client);
        this._keys = keysChannelBase;
        this._keysMerge = keysMergeChannelBase;
        this._name = '';
        this.bitrate = 0;
        this.deleted = false;
        this.guildId = '';
        this.id = '';
        this.isPartial = false;
        this.lastPinTimestampUnix = 0;
        this.nsfw = false;
        this.position = -1;
        this.rateLimitPerUser = 0;
        this.type = constants_1.ChannelTypes.BASE;
        this.userLimit = 0;
        if (merge) {
            this.merge(data);
        }
    }
    get canAddReactions() {
        return this.canMessage;
    }
    get canAttachFiles() {
        return this.canMessage;
    }
    get canDeafenMembers() {
        return this.isGuildVoice;
    }
    get canEdit() {
        return this.isDm;
    }
    get canEmbedLinks() {
        return this.canMessage;
    }
    get canJoin() {
        if (this.isDm) {
            if (this.client.user && this.client.user.bot) {
                return false;
            }
            return true;
        }
        return this.isGuildVoice;
    }
    get canManageMessages() {
        return false;
    }
    get canManageWebhooks() {
        return false;
    }
    get canMentionEveryone() {
        return this.isText;
    }
    get canMessage() {
        return this.isText;
    }
    get canMoveMembers() {
        return this.isGuildVoice;
    }
    get canMuteMembers() {
        return this.isGuildVoice;
    }
    get canPrioritySpeaker() {
        return false;
    }
    get canSendTTSMessage() {
        return this.isText && !this.isDm;
    }
    get canSpeak() {
        if (this.isDm) {
            if (this.client.user && this.client.user.bot) {
                return false;
            }
            return true;
        }
        return this.isGuildVoice;
    }
    get canStream() {
        return this.isGuildVoice;
    }
    get canReadHistory() {
        return this.isText;
    }
    get canUseExternalEmojis() {
        return this.isDm;
    }
    get canUseVAD() {
        return this.isVoice;
    }
    get canView() {
        return this.isText;
    }
    get children() {
        return basecollection_1.emptyBaseCollection;
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get defaultIconUrl() {
        return null;
    }
    get guild() {
        return null;
    }
    get iconUrl() {
        return null;
    }
    get isDm() {
        return this.isDmSingle || this.isDmGroup;
    }
    get isDmGroup() {
        return this.type === constants_1.ChannelTypes.GROUP_DM;
    }
    get isDmSingle() {
        return this.type === constants_1.ChannelTypes.DM;
    }
    get isGuildCategory() {
        return this.type === constants_1.ChannelTypes.GUILD_CATEGORY;
    }
    get isGuildChannel() {
        return (this.isGuildCategory) ||
            (this.isGuildText) ||
            (this.isGuildVoice) ||
            (this.isGuildNews) ||
            (this.isGuildStore);
    }
    get isGuildNews() {
        return this.type === constants_1.ChannelTypes.GUILD_NEWS;
    }
    get isGuildStore() {
        return this.type === constants_1.ChannelTypes.GUILD_STORE;
    }
    get isGuildText() {
        return this.type === constants_1.ChannelTypes.GUILD_TEXT;
    }
    get isGuildVoice() {
        return this.type === constants_1.ChannelTypes.GUILD_VOICE;
    }
    get isManaged() {
        return !!this.applicationId;
    }
    get isSyncedWithParent() {
        return this.isSyncedWith(this.parent);
    }
    get isText() {
        return this.isDm || this.isGuildText || this.isGuildNews;
    }
    get isVoice() {
        return this.isDm || this.isGuildVoice;
    }
    get joined() {
        return false;
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.CHANNEL(null, this.id);
    }
    get lastPinTimestamp() {
        if (this.lastPinTimestampUnix) {
            return new Date(this.lastPinTimestampUnix);
        }
        return null;
    }
    get members() {
        return basecollection_1.emptyBaseCollection;
    }
    get messages() {
        return basecollection_1.emptyBaseCollection;
    }
    get mention() {
        return `<#${this.id}>`;
    }
    get name() {
        return this._name;
    }
    get nicks() {
        if (this._nicks) {
            return this._nicks;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get owner() {
        return null;
    }
    get parent() {
        return null;
    }
    get permissionOverwrites() {
        if (this._permissionOverwrites) {
            return this._permissionOverwrites;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get recipients() {
        if (this._recipients) {
            return this._recipients;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get typing() {
        if (this.client.typings.has(this.id)) {
            return this.client.typings.get(this.id);
        }
        return basecollection_1.emptyBaseCollection;
    }
    get voiceStates() {
        return basecollection_1.emptyBaseCollection;
    }
    can(permissions, memberOrRole) {
        return false;
    }
    iconUrlFormat(format, query) {
        return null;
    }
    isSyncedWith(parent) {
        return false;
    }
    async addPinnedMessage(messageId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async addRecipient(userId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async bulkDelete(messageIds) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async close() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async createInvite(options) {
        return this.client.rest.createChannelInvite(this.id, options);
    }
    async createMessage(options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async createReaction(messageId, emoji) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async createWebhook(options) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async crosspostMessage(messageId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async delete(options = {}) {
        return this.client.rest.deleteChannel(this.id, options);
    }
    async deleteMessage(messageId, options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async deleteOverwrite(overwriteId, options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async deletePin(messageId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async deleteReaction(messageId, emoji, userId = '@me') {
        throw new Error('Channel type doesn\'t support this.');
    }
    async deleteReactions(messageId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    edit(options = {}) {
        return this.client.rest.editChannel(this.id, options);
    }
    async editMessage(messageId, options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async editOverwrite(overwriteId, options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchCallStatus() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchInvites() {
        return this.client.rest.fetchChannelInvites(this.id);
    }
    async fetchMessage(messageId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchMessages(options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchPins() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchReactions(messageId, emoji, options = {}) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchStoreListing() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async fetchWebhooks() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async follow(options) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async grantEntitlement() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async join(...args) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async publish(options) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async removeRecipient(userId) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async search(options, retry) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async startCallRinging(recipients) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async stopCallRinging(recipients) {
        throw new Error('Channel type doesn\'t support this.');
    }
    async triggerTyping() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async turnIntoNewsChannel() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async turnIntoTextChannel() {
        throw new Error('Channel type doesn\'t support this.');
    }
    async unack() {
        throw new Error('Channel type doesn\'t support this.');
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.NAME:
                    {
                        this._name = value;
                    }
                    ;
                    return;
            }
        }
        return super.mergeValue(key, value);
    }
    toString() {
        return `#${this.name}`;
    }
}
exports.ChannelBase = ChannelBase;
const keysChannelDm = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.IS_PARTIAL,
    constants_1.DiscordKeys.LAST_MESSAGE_ID,
    constants_1.DiscordKeys.LAST_PIN_TIMESTAMP,
    constants_1.DiscordKeys.NICKS,
    constants_1.DiscordKeys.RECIPIENTS,
    constants_1.DiscordKeys.TYPE,
]);
/**
 * Single DM Channel
 * @category Structure
 */
class ChannelDM extends ChannelBase {
    constructor(client, data, merge = true) {
        super(client, data, false);
        this._keys = keysChannelDm;
        this.type = constants_1.ChannelTypes.DM;
        if (merge) {
            this.merge(data);
        }
    }
    get iconUrl() {
        return this.iconUrlFormat();
    }
    get joined() {
        return this.client.voiceConnections.has(this.id);
    }
    get messages() {
        const collection = new basecollection_1.BaseCollection();
        for (let [messageId, message] of this.client.messages) {
            if (message.channelId === this.id) {
                collection.set(messageId, message);
            }
        }
        return collection;
    }
    get name() {
        if (!this._name) {
            return this.recipients.join(', ') || 'DM Channel';
        }
        return this._name;
    }
    get voiceStates() {
        if (this.client.voiceStates.has(this.id)) {
            return this.client.voiceStates.get(this.id);
        }
        return basecollection_1.emptyBaseCollection;
    }
    iconUrlFormat(format, query) {
        if (this.recipients.size) {
            const user = this.recipients.first();
            return user.avatarUrlFormat(format, query);
        }
        return null;
    }
    async addPinnedMessage(messageId) {
        return this.client.rest.addPinnedMessage(this.id, messageId);
    }
    async bulkDelete(messageIds) {
        return this.client.rest.bulkDeleteMessages(this.id, messageIds);
    }
    async close() {
        return this.delete();
    }
    async createMessage(options = {}) {
        return this.client.rest.createMessage(this.id, options);
    }
    async createReaction(messageId, emoji) {
        return this.client.rest.createReaction(this.id, messageId, emoji);
    }
    async deleteMessage(messageId, options = {}) {
        return this.client.rest.deleteMessage(this.id, messageId, options);
    }
    async deletePin(messageId) {
        return this.client.rest.deletePinnedMessage(this.id, messageId);
    }
    async deleteReaction(messageId, emoji, userId = '@me') {
        return this.client.rest.deleteReaction(this.id, messageId, userId);
    }
    async deleteReactions(messageId) {
        return this.client.rest.deleteReactions(this.id, messageId);
    }
    async editMessage(messageId, options = {}) {
        return this.client.rest.editMessage(this.id, messageId, options);
    }
    async fetchCallStatus() {
        return this.client.rest.fetchChannelCall(this.id);
    }
    async fetchMessage(messageId) {
        return this.client.rest.fetchMessage(this.id, messageId);
    }
    async fetchMessages(options) {
        return this.client.rest.fetchMessages(this.id, options);
    }
    async fetchPins() {
        return this.client.rest.fetchPinnedMessages(this.id);
    }
    async fetchReactions(messageId, emoji, options = {}) {
        return this.client.rest.fetchReactions(this.id, messageId, emoji, options);
    }
    async join(options) {
        if (options.verify || options.verify === undefined) {
            await this.fetchCallStatus();
        }
        if (options.recipients) {
            await this.startCallRinging(options.recipients);
        }
        return this.client.voiceConnect(undefined, this.id, options);
    }
    async search(options, retry) {
        return this.client.rest.searchChannel(this.id, options, retry);
    }
    async startCallRinging(recipients) {
        return this.client.rest.startChannelCallRinging(this.id, { recipients });
    }
    async stopCallRinging(recipients) {
        return this.client.rest.stopChannelCallRinging(this.id, { recipients });
    }
    async triggerTyping() {
        return this.client.rest.triggerTyping(this.id);
    }
    async unack() {
        return this.client.rest.unAckChannel(this.id);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.LAST_PIN_TIMESTAMP:
                    {
                        this.lastPinTimestampUnix = (value) ? (new Date(value).getTime()) : 0;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.NICKS:
                    {
                        if (Object.keys(value).length) {
                            if (!this._nicks) {
                                this._nicks = new basecollection_1.BaseCollection();
                            }
                            this._nicks.clear();
                            for (let userId in value) {
                                this._nicks.set(userId, value[userId]);
                            }
                        }
                        else {
                            if (this._nicks) {
                                this._nicks.clear();
                                this._nicks = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.RECIPIENTS:
                    {
                        if (value.length) {
                            if (!this._recipients) {
                                this._recipients = new basecollection_1.BaseCollection();
                            }
                            this._recipients.clear();
                            if (this.client.user) {
                                this._recipients.set(this.client.user.id, this.client.user);
                            }
                            for (let raw of value) {
                                let user;
                                if (this.client.users.has(raw.id)) {
                                    user = this.client.users.get(raw.id);
                                    user.merge(raw);
                                }
                                else {
                                    user = new user_1.User(this.client, raw);
                                    this.client.users.insert(user);
                                }
                                this._recipients.set(user.id, user);
                                // unsure of this
                                if (constants_1.DiscordKeys.NICK in raw) {
                                    if (!this._nicks) {
                                        this._nicks = new basecollection_1.BaseCollection();
                                    }
                                    this._nicks.set(user.id, raw.nick);
                                }
                            }
                        }
                        else {
                            if (this._recipients) {
                                this._recipients.clear();
                                this._recipients = undefined;
                            }
                        }
                    }
                    ;
                    return;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.ChannelDM = ChannelDM;
const keysChannelDmGroup = new baseset_1.BaseSet([
    ...keysChannelDm,
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.OWNER_ID,
]);
/**
 * Group DM Channel
 * @category Structure
 */
class ChannelDMGroup extends ChannelDM {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysChannelDmGroup;
        this.type = constants_1.ChannelTypes.GROUP_DM;
        this.icon = null;
        this.ownerId = '';
        this.merge(data);
    }
    get defaultIconUrl() {
        const hash = constants_1.DEFAULT_GROUP_DM_AVATARS[this.createdAtUnix % constants_1.DEFAULT_GROUP_DM_AVATARS.length];
        return iris_client_rest_1.Endpoints.Assets.URL + iris_client_rest_1.Endpoints.Assets.ICON(hash);
    }
    get owner() {
        if (this._recipients && this._recipients.has(this.ownerId)) {
            return this._recipients.get(this.ownerId) || null;
        }
        return this.client.users.get(this.ownerId) || null;
    }
    iconUrlFormat(format, query) {
        if (!this.icon) {
            return this.defaultIconUrl;
        }
        const hash = this.icon;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.DM_ICON(this.id, hash, format), query);
    }
    isOwner(userId) {
        return this.ownerId === userId;
    }
    async addRecipient(userId) {
        return this.client.rest.addRecipient(this.id, userId);
    }
    async removeRecipient(userId) {
        return this.client.rest.removeRecipient(this.id, userId);
    }
}
exports.ChannelDMGroup = ChannelDMGroup;
const keysChannelGuildBase = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.IS_PARTIAL,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.NSFW,
    constants_1.DiscordKeys.PARENT_ID,
    constants_1.DiscordKeys.PERMISSION_OVERWRITES,
    constants_1.DiscordKeys.POSITION,
    constants_1.DiscordKeys.RATE_LIMIT_PER_USER,
    constants_1.DiscordKeys.TYPE,
]);
const keysMergeChannelGuildBase = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
]);
/**
 * Basic Guild Channel
 * @category Structure
 */
class ChannelGuildBase extends ChannelBase {
    constructor(client, data, merge = true) {
        super(client, data, false);
        this._keys = keysChannelGuildBase;
        this._keysMerge = keysMergeChannelGuildBase;
        this.type = constants_1.ChannelTypes.BASE;
        this.guildId = '';
        this.nsfw = false;
        this.position = -1;
        this.rateLimitPerUser = 0;
        if (merge) {
            this.merge(data);
        }
    }
    get canAddReactions() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.ADD_REACTIONS,
        ]);
    }
    get canAttachFiles() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.ATTACH_FILES,
        ]);
    }
    get canDeafenMembers() {
        return this.isVoice && this.can([
            constants_1.Permissions.DEAFEN_MEMBERS,
        ]);
    }
    get canEdit() {
        return this.can([
            constants_1.Permissions.MANAGE_CHANNELS,
        ]);
    }
    get canEmbedLinks() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.EMBED_LINKS,
        ]);
    }
    get canJoin() {
        return this.isVoice && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.CONNECT,
        ]);
    }
    get canManageMessages() {
        return this.isText && this.can([
            constants_1.Permissions.MANAGE_MESSAGES,
        ]);
    }
    get canManageWebhooks() {
        return this.isText && this.can([
            constants_1.Permissions.MANAGE_WEBHOOKS,
        ]);
    }
    get canMentionEveryone() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.MENTION_EVERYONE,
        ]);
    }
    get canMessage() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
        ]);
    }
    get canMoveMembers() {
        return this.isVoice && this.can([
            constants_1.Permissions.MOVE_MEMBERS,
        ]);
    }
    get canMuteMembers() {
        return this.isVoice && this.can([
            constants_1.Permissions.MUTE_MEMBERS,
        ]);
    }
    get canPrioritySpeaker() {
        return this.isVoice && this.can([
            constants_1.Permissions.PRIORITY_SPEAKER,
        ]);
    }
    get canSendTTSMessage() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.SEND_TTS_MESSAGES,
        ]);
    }
    get canSpeak() {
        return this.isVoice && this.can([
            constants_1.Permissions.SPEAK,
        ]);
    }
    get canStream() {
        return this.isVoice && this.can([
            constants_1.Permissions.STREAM,
        ]);
    }
    get canReadHistory() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.READ_MESSAGE_HISTORY,
        ]);
    }
    get canUseExternalEmojis() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
            constants_1.Permissions.SEND_MESSAGES,
            constants_1.Permissions.USE_EXTERNAL_EMOJIS,
        ]);
    }
    get canUseVAD() {
        return this.isVoice && this.can([
            constants_1.Permissions.USE_VAD,
        ]);
    }
    get canView() {
        return this.isText && this.can([
            constants_1.Permissions.VIEW_CHANNEL,
        ]);
    }
    get guild() {
        return this.client.guilds.get(this.guildId) || null;
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.CHANNEL(this.guildId, this.id);
    }
    get parent() {
        if (this.parentId && this.client.channels.has(this.parentId)) {
            return this.client.channels.get(this.parentId);
        }
        return null;
    }
    can(permissions, memberOrRole, { ignoreAdministrator, ignoreOwner } = {}) {
        let total = constants_1.Permissions.NONE;
        if (memberOrRole instanceof role_1.Role) {
            total = memberOrRole.permissions;
            if (!ignoreAdministrator) {
                if (utils_1.PermissionTools.checkPermissions(total, constants_1.Permissions.ADMINISTRATOR)) {
                    return true;
                }
            }
        }
        else {
            if (!memberOrRole) {
                if (!this.client.user) {
                    return false;
                }
                if (!this.client.members.has(this.guildId, this.client.user.id)) {
                    return false;
                }
                memberOrRole = this.client.members.get(this.guildId, this.client.user.id);
            }
            if (!ignoreOwner) {
                const guild = this.guild;
                if (guild && guild.isOwner(memberOrRole.id)) {
                    return true;
                }
            }
            if (!ignoreAdministrator) {
                if (utils_1.PermissionTools.checkPermissions(memberOrRole.permissions, constants_1.Permissions.ADMINISTRATOR)) {
                    return true;
                }
            }
            total = memberOrRole.permissionsIn(this);
        }
        return utils_1.PermissionTools.checkPermissions(total, permissions);
    }
    isSyncedWith(parent) {
        if (parent) {
            const overwrites = this.permissionOverwrites;
            const parentOverwrites = parent.permissionOverwrites;
            if (overwrites.length !== parentOverwrites.length) {
                return false;
            }
            return overwrites.every((overwrite) => {
                if (parentOverwrites.has(overwrite.id)) {
                    const parentOverwrite = parentOverwrites.get(overwrite.id);
                    return overwrite.allow === parentOverwrite.allow && overwrite.deny === parentOverwrite.deny;
                }
                return false;
            });
        }
        return false;
    }
    async deleteOverwrite(overwriteId, options = {}) {
        return this.client.rest.deleteChannelOverwrite(this.id, overwriteId, options);
    }
    async editOverwrite(overwriteId, options = {}) {
        return this.client.rest.editChannelOverwrite(this.id, overwriteId, options);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.PERMISSION_OVERWRITES:
                    {
                        if (value.length) {
                            if (!this._permissionOverwrites) {
                                this._permissionOverwrites = new basecollection_1.BaseCollection();
                            }
                            const overwrites = [];
                            for (let raw of value) {
                                let overwrite;
                                if (this._permissionOverwrites.has(raw.id)) {
                                    overwrite = this._permissionOverwrites.get(raw.id);
                                    overwrite.merge(raw);
                                }
                                else {
                                    overwrite = new overwrite_1.Overwrite(this, raw);
                                }
                                overwrites.push(overwrite);
                            }
                            this._permissionOverwrites.clear();
                            for (let overwrite of overwrites) {
                                this._permissionOverwrites.set(overwrite.id, overwrite);
                            }
                        }
                        else {
                            if (this._permissionOverwrites) {
                                this._permissionOverwrites.clear();
                                this._permissionOverwrites = undefined;
                            }
                        }
                    }
                    ;
                    return;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.ChannelGuildBase = ChannelGuildBase;
const keysChannelGuildCategory = new baseset_1.BaseSet([
    ...keysChannelGuildBase,
    constants_1.DiscordKeys.BITRATE,
    constants_1.DiscordKeys.USER_LIMIT,
]);
/**
 * Guild Category Channel
 * @category Structure
 */
class ChannelGuildCategory extends ChannelGuildBase {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysChannelGuildCategory;
        this.type = constants_1.ChannelTypes.GUILD_CATEGORY;
        this.bitrate = 0;
        this.userLimit = 0;
        this.merge(data);
    }
    get children() {
        const collection = new basecollection_1.BaseCollection();
        for (let [channelId, channel] of this.client.channels) {
            if (channel.isGuildChannel && channel.parentId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
}
exports.ChannelGuildCategory = ChannelGuildCategory;
const keysChannelGuildText = new baseset_1.BaseSet([
    ...keysChannelGuildBase,
    constants_1.DiscordKeys.LAST_MESSAGE_ID,
    constants_1.DiscordKeys.LAST_PIN_TIMESTAMP,
    constants_1.DiscordKeys.TOPIC,
]);
/**
 * Guild Text Channel, it can also be a news channel.
 * @category Structure
 */
class ChannelGuildText extends ChannelGuildBase {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysChannelGuildText;
        this.type = constants_1.ChannelTypes.GUILD_TEXT;
        this.topic = '';
        this.merge(data);
    }
    get members() {
        const collection = new basecollection_1.BaseCollection();
        const guild = this.guild;
        if (guild) {
            for (let [userId, member] of guild.members) {
                if (this.can(constants_1.Permissions.VIEW_CHANNEL, member)) {
                    collection.set(userId, member);
                }
            }
        }
        return collection;
    }
    get messages() {
        const collection = new basecollection_1.BaseCollection();
        for (let [messageId, message] of this.client.messages) {
            if (message.channelId === this.id) {
                collection.set(messageId, message);
            }
        }
        return collection;
    }
    async addPinnedMessage(messageId) {
        return this.client.rest.addPinnedMessage(this.id, messageId);
    }
    async bulkDelete(messageIds) {
        return this.client.rest.bulkDeleteMessages(this.id, messageIds);
    }
    async createMessage(options = {}) {
        return this.client.rest.createMessage(this.id, options);
    }
    async createReaction(messageId, emoji) {
        return this.client.rest.createReaction(this.id, messageId, emoji);
    }
    async createWebhook(options) {
        return this.client.rest.createWebhook(this.id, options);
    }
    async crosspostMessage(messageId) {
        return this.client.rest.crosspostMessage(this.id, messageId);
    }
    async deleteMessage(messageId, options = {}) {
        return this.client.rest.deleteMessage(this.id, messageId, options);
    }
    async deletePin(messageId) {
        return this.client.rest.deletePinnedMessage(this.id, messageId);
    }
    async deleteReaction(messageId, emoji, userId = '@me') {
        return this.client.rest.deleteReaction(this.id, messageId, userId);
    }
    async deleteReactions(messageId) {
        return this.client.rest.deleteReactions(this.id, messageId);
    }
    async editMessage(messageId, options = {}) {
        return this.client.rest.editMessage(this.id, messageId, options);
    }
    async fetchMessage(messageId) {
        return this.client.rest.fetchMessage(this.id, messageId);
    }
    async fetchMessages(options) {
        return this.client.rest.fetchMessages(this.id, options);
    }
    async fetchPins() {
        return this.client.rest.fetchPinnedMessages(this.id);
    }
    async fetchReactions(messageId, emoji, options = {}) {
        return this.client.rest.fetchReactions(this.id, messageId, emoji, options);
    }
    async fetchWebhooks() {
        return this.client.rest.fetchChannelWebhooks(this.id);
    }
    async follow(options) {
        return this.client.rest.followChannel(this.id, options);
    }
    async publish(options) {
        options.channelId = this.id;
        return this.client.rest.createApplicationNews(options);
    }
    async search(options, retry) {
        return this.client.rest.searchChannel(this.id, options, retry);
    }
    async triggerTyping() {
        return this.client.rest.triggerTyping(this.id);
    }
    async turnIntoNewsChannel() {
        return this.edit({
            type: constants_1.ChannelTypes.GUILD_NEWS,
        });
    }
    async turnIntoTextChannel() {
        return this.edit({
            type: constants_1.ChannelTypes.GUILD_TEXT,
        });
    }
    async unack() {
        return this.client.rest.unAckChannel(this.id);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.LAST_PIN_TIMESTAMP:
                    {
                        this.lastPinTimestampUnix = (value) ? (new Date(value).getTime()) : 0;
                    }
                    ;
                    return;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.ChannelGuildText = ChannelGuildText;
const keysChannelGuildVoice = new baseset_1.BaseSet([
    ...keysChannelGuildBase,
    constants_1.DiscordKeys.BITRATE,
    constants_1.DiscordKeys.USER_LIMIT,
]);
/**
 * Guild Voice Channel
 * @category Structure
 */
class ChannelGuildVoice extends ChannelGuildBase {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysChannelGuildVoice;
        this.type = constants_1.ChannelTypes.GUILD_VOICE;
        this.bitrate = 64000;
        this.userLimit = 0;
        this.merge(data);
    }
    get joined() {
        if (this.client.voiceConnections.has(this.guildId)) {
            const voiceConnection = this.client.voiceConnections.get(this.guildId);
            return voiceConnection.guildId === this.id;
        }
        return false;
    }
    get members() {
        const collection = new basecollection_1.BaseCollection();
        const voiceStates = this.voiceStates;
        if (voiceStates) {
            for (let [cacheId, voiceState] of voiceStates) {
                collection.set(voiceState.userId, voiceState.member);
            }
        }
        return collection;
    }
    get voiceStates() {
        const collection = new basecollection_1.BaseCollection();
        const voiceStates = this.client.voiceStates.get(this.guildId);
        if (voiceStates) {
            for (let [userId, voiceState] of voiceStates) {
                if (voiceState.channelId === this.id) {
                    collection.set(userId, voiceState);
                }
            }
        }
        return collection;
    }
    join(options) {
        return this.client.voiceConnect(this.guildId, this.id, options);
    }
}
exports.ChannelGuildVoice = ChannelGuildVoice;
const keysChannelGuildStore = new baseset_1.BaseSet([
    ...keysChannelGuildBase,
    constants_1.DiscordKeys.BITRATE,
    constants_1.DiscordKeys.USER_LIMIT,
]);
/**
 * Guild Store Channel
 * @category Structure
 */
class ChannelGuildStore extends ChannelGuildBase {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysChannelGuildStore;
        this.type = constants_1.ChannelTypes.GUILD_STORE;
        this.bitrate = 0;
        this.userLimit = 0;
        this.merge(data);
    }
    async fetchStoreListing() {
        return this.client.rest.fetchChannelStoreListing(this.id);
    }
    async grantEntitlement() {
        return this.client.rest.createChannelStoreListingGrantEntitlement(this.id);
    }
}
exports.ChannelGuildStore = ChannelGuildStore;

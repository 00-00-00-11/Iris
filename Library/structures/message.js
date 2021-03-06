"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSystemContent = exports.MessageReference = exports.MessageCall = exports.MessageActivity = exports.Message = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const application_1 = require("./application");
const attachment_1 = require("./attachment");
const channel_1 = require("./channel");
const member_1 = require("./member");
const messageembed_1 = require("./messageembed");
const reaction_1 = require("./reaction");
const sticker_1 = require("./sticker");
const user_1 = require("./user");
const keysMessage = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ACTIVITY,
    constants_1.DiscordKeys.APPLICATION,
    constants_1.DiscordKeys.ATTACHMENTS,
    constants_1.DiscordKeys.AUTHOR,
    constants_1.DiscordKeys.CALL,
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.CONTENT,
    constants_1.DiscordKeys.EDITED_TIMESTAMP,
    constants_1.DiscordKeys.EMBEDS,
    constants_1.DiscordKeys.FLAGS,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MEMBER,
    constants_1.DiscordKeys.MENTIONS,
    constants_1.DiscordKeys.MENTION_CHANNELS,
    constants_1.DiscordKeys.MENTION_EVERYONE,
    constants_1.DiscordKeys.MENTION_ROLES,
    constants_1.DiscordKeys.MESSAGE_REFERENCE,
    constants_1.DiscordKeys.NONCE,
    constants_1.DiscordKeys.PINNED,
    constants_1.DiscordKeys.REACTIONS,
    constants_1.DiscordKeys.REFERENCED_MESSAGE,
    constants_1.DiscordKeys.STICKERS,
    constants_1.DiscordKeys.TIMESTAMP,
    constants_1.DiscordKeys.TTS,
    constants_1.DiscordKeys.TYPE,
    constants_1.DiscordKeys.WEBHOOK_ID,
]);
// we need webhook id before merging the user to make sure not to cache it
const keysMergeMessage = new baseset_1.BaseSet([
    constants_1.DiscordKeys.WEBHOOK_ID,
    constants_1.DiscordKeys.AUTHOR,
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MENTIONS,
    constants_1.DiscordKeys.TYPE,
]);
const keysSkipDifferenceMessage = new baseset_1.BaseSet([
    constants_1.DiscordKeys.AUTHOR,
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MEMBER,
]);
/**
 * Channel Message Structure
 * @category Structure
 */
class Message extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysMessage;
        this._keysMerge = keysMergeMessage;
        this._keysSkipDifference = keysSkipDifferenceMessage;
        this._content = '';
        this.channelId = '';
        this.content = '';
        this.deleted = false;
        this.editedTimestampUnix = 0;
        this.flags = 0;
        this.id = '';
        this.mentionEveryone = false;
        this.pinned = false;
        this.referencedMessage = null;
        this.timestampUnix = 0;
        this.tts = false;
        this.type = constants_1.MessageTypes.BASE;
        this.merge(data);
        Object.defineProperties(this, {
            _content: { configurable: true, enumerable: false, writable: false },
            _attachments: { enumerable: false, writable: true },
            _embeds: { enumerable: false, writable: true },
            _mentions: { enumerable: false, writable: true },
            _mentionChannels: { enumerable: false, writable: true },
            _mentionRoles: { enumerable: false, writable: true },
        });
        if (this.guildId && !this.member) {
            this.member = this.client.members.get(this.guildId, this.author.id);
        }
    }
    get attachments() {
        if (this._attachments) {
            return this._attachments;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get canDelete() {
        if (this.fromMe || this.canManage) {
            if (this.type in constants_1.MessageTypesDeletable && constants_1.MessageTypesDeletable[this.type]) {
                return true;
            }
        }
        return false;
    }
    get canManage() {
        const channel = this.channel;
        return !!(channel && channel.canManageMessages);
    }
    get canReact() {
        const channel = this.channel;
        return (channel) ? channel.canAddReactions : this.inDm;
    }
    get canReply() {
        const channel = this.channel;
        return (channel) ? channel.canMessage : this.inDm;
    }
    get channel() {
        return this.client.channels.get(this.channelId) || null;
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get editedAt() {
        return this.editedTimestamp;
    }
    get editedAtUnix() {
        return this.editedTimestampUnix;
    }
    get editedTimestamp() {
        if (this.editedTimestampUnix) {
            return new Date(this.editedTimestampUnix);
        }
        return null;
    }
    get embeds() {
        if (this._embeds) {
            return this._embeds;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get fromBot() {
        return this.author.bot;
    }
    get fromMe() {
        return this.author.isMe;
    }
    get fromSystem() {
        return this.type !== constants_1.MessageTypes.DEFAULT && !this.isReply;
    }
    get fromUser() {
        return !this.fromBot && !this.fromSystem && !this.fromWebhook;
    }
    get fromWebhook() {
        return !!this.webhookId;
    }
    get guild() {
        if (this.guildId) {
            return this.client.guilds.get(this.guildId) || null;
        }
        return null;
    }
    get hasAttachment() {
        return !!(this.attachments.length || this.embeds.some((embed) => embed.hasAttachment));
    }
    get hasFlagCrossposted() {
        return this.hasFlag(constants_1.MessageFlags.CROSSPOSTED);
    }
    get hasFlagIsCrossposted() {
        return this.hasFlag(constants_1.MessageFlags.IS_CROSSPOST);
    }
    get hasFlagSuppressEmbeds() {
        return this.hasFlag(constants_1.MessageFlags.SUPPRESS_EMBEDS);
    }
    get inDm() {
        // messages from rest doesn\'t provide this..
        return !this.guildId;
    }
    get isEdited() {
        return !!this.editedTimestampUnix;
    }
    get isReply() {
        return this.type === constants_1.MessageTypes.REPLY;
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.MESSAGE(this.guildId, this.channelId, this.id);
    }
    get mentionHere() {
        return this.mentionEveryone && !this.content.includes('@everyone');
    }
    get mentions() {
        if (this._mentions) {
            return this._mentions;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get mentionChannels() {
        if (this._mentionChannels) {
            return this._mentionChannels;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get mentionRoles() {
        if (this._mentionRoles) {
            return this._mentionRoles;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get reactions() {
        if (this._reactions) {
            return this._reactions;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get stickers() {
        if (this._stickers) {
            return this._stickers;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get systemContent() {
        switch (this.type) {
            case constants_1.MessageTypes.BASE:
            case constants_1.MessageTypes.DEFAULT:
            case constants_1.MessageTypes.REPLY:
                {
                    return this.content;
                }
                ;
            default:
                {
                    Object.defineProperty(this, '_content', {
                        value: messageSystemContent(this),
                    });
                }
                ;
        }
        return this._content;
    }
    get timestamp() {
        return new Date(this.timestampUnix);
    }
    convertContent(options = {}) {
        const escape = !!(options.escapeMentions || options.escapeMentions === undefined);
        const guildSpecific = !!(options.guildSpecific || options.guildSpecific === undefined);
        const nick = !!(options.nick || options.nick === undefined);
        let content = (options.text !== undefined) ? options.text : this.systemContent;
        content = content.replace(constants_1.DiscordRegex[constants_1.DiscordRegexNames.MENTION_CHANNEL], (match, id) => {
            if (this.mentionChannels.has(id)) {
                const channel = this.mentionChannels.get(id);
                return channel.toString();
            }
            else {
                if (this.client.channels.has(id)) {
                    const channel = this.client.channels.get(id);
                    if (guildSpecific && this.guildId) {
                        if (this.guildId === channel.guildId) {
                            return channel.toString();
                        }
                    }
                    else {
                        return channel.toString();
                    }
                }
            }
            return '#deleted-channel';
        });
        const guild = this.guild;
        content = content.replace(constants_1.DiscordRegex[constants_1.DiscordRegexNames.MENTION_ROLE], (match, id) => {
            if (guild && guild.roles.has(id)) {
                const role = guild.roles.get(id);
                return `@${role}`;
            }
            return '@deleted-role';
        });
        content = content.replace(constants_1.DiscordRegex[constants_1.DiscordRegexNames.MENTION_USER], (match, mentionType, id) => {
            if (this.mentions.has(id)) {
                const memberOrUser = this.mentions.get(id);
                if (nick) {
                    return `@${memberOrUser.name}`;
                }
                return `@${memberOrUser}`;
            }
            else {
                if (guildSpecific && this.guildId) {
                    if (this.client.members.has(this.guildId, id)) {
                        const member = this.client.members.get(this.guildId, id);
                        if (nick) {
                            return `@${member.name}`;
                        }
                        return `@${member}`;
                    }
                }
                else {
                    if (this.client.users.has(id)) {
                        const user = this.client.users.get(id);
                        return `@${user}`;
                    }
                }
            }
            return match;
        });
        if (escape) {
            content = utils_1.Markup.escape.mentions(content);
        }
        return content;
    }
    hasFlag(flag) {
        return (this.flags & flag) === flag;
    }
    async ack(token) {
        return this.client.rest.ackChannelMessage(this.channelId, this.id, token);
    }
    async crosspost() {
        return this.client.rest.crosspostMessage(this.channelId, this.id);
    }
    async delete(options = {}) {
        return this.client.rest.deleteMessage(this.channelId, this.id, options);
    }
    async deleteReaction(emoji, userId = '@me') {
        return this.client.rest.deleteReaction(this.channelId, this.id, emoji, userId);
    }
    async deleteReactions() {
        return this.client.rest.deleteReactions(this.channelId, this.id);
    }
    async edit(options = {}) {
        return this.client.rest.editMessage(this.channelId, this.id, options);
    }
    async fetchReactions(emoji, options = {}) {
        return this.client.rest.fetchReactions(this.channelId, this.id, emoji, options);
    }
    async pin() {
        return this.client.rest.addPinnedMessage(this.channelId, this.id);
    }
    async publish(options) {
        options.channelId = this.channelId;
        options.messageId = this.id;
        return this.client.rest.createApplicationNews(options);
    }
    async react(emoji) {
        return this.client.rest.createReaction(this.channelId, this.id, emoji);
    }
    async removeMention() {
        return this.client.rest.removeMention(this.id);
    }
    async reply(options = {}) {
        return this.client.rest.createMessage(this.channelId, options);
    }
    async suppressEmbeds(suppress = true) {
        return this.client.rest.messageSuppressEmbeds(this.channelId, this.id, { suppress });
    }
    async triggerTyping() {
        return this.client.rest.triggerTyping(this.channelId);
    }
    async unpin() {
        return this.client.rest.deletePinnedMessage(this.channelId, this.id);
    }
    difference(key, value) {
        let differences;
        switch (key) {
            case constants_1.DiscordKeys.ATTACHMENTS:
                {
                    // just check if any of the attachment ids are not in our own cache
                    const hasDifference = (this.attachments.length !== value.length) || value.some((raw) => {
                        return !this.attachments.has(raw.id);
                    });
                    if (hasDifference) {
                        differences = this.attachments.clone();
                    }
                }
                ;
                break;
            case constants_1.DiscordKeys.EMBEDS:
                {
                    // this one might be difficult, i guess we're gonna have to do a deep difference dive
                    const hasDifference = (this.embeds.length !== value.length) || value.some((raw, i) => {
                        const embed = this.embeds.get(i);
                        if (embed) {
                            return !!embed.differences(raw);
                        }
                        return true;
                    });
                    if (hasDifference) {
                        differences = this.embeds.clone();
                    }
                }
                ;
                break;
            case constants_1.DiscordKeys.MENTIONS:
                {
                    // just check the user id
                    const hasDifference = (this.mentions.length !== value.length) || value.some((raw) => {
                        return !this.mentions.has(raw.id);
                    });
                    if (hasDifference) {
                        differences = this.mentions.clone();
                    }
                }
                ;
                break;
            default:
                {
                    return super.difference(key, value);
                }
                ;
        }
        if (differences !== undefined) {
            return [true, differences];
        }
        return [false, null];
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.ACTIVITY:
                    {
                        value = new MessageActivity(this, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.APPLICATION:
                    {
                        let application;
                        if (this.client.applications.has(value.id)) {
                            application = this.client.applications.get(value.id);
                            application.merge(value);
                        }
                        else {
                            application = new application_1.Application(this.client, value);
                        }
                        value = application;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.ATTACHMENTS:
                    {
                        if (value.length) {
                            if (!this._attachments) {
                                this._attachments = new basecollection_1.BaseCollection();
                            }
                            this._attachments.clear();
                            for (let raw of value) {
                                this._attachments.set(raw.id, new attachment_1.Attachment(this, raw));
                            }
                        }
                        else {
                            if (this._attachments) {
                                this._attachments.clear();
                                this._attachments = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.AUTHOR:
                    {
                        let user;
                        if (this.fromWebhook) {
                            user = new user_1.User(this.client, value);
                        }
                        else {
                            if (this.client.users.has(value.id)) {
                                user = this.client.users.get(value.id);
                                user.merge(value);
                            }
                            else {
                                user = new user_1.User(this.client, value);
                                this.client.users.insert(user);
                            }
                        }
                        value = user;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.CALL:
                    {
                        value = new MessageCall(this, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.CONTENT:
                    {
                        if (this._content) {
                            Object.defineProperty(this, '_content', {
                                value: messageSystemContent(this, value),
                            });
                        }
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.EDITED_TIMESTAMP:
                    {
                        this.editedTimestampUnix = (value) ? (new Date(value).getTime()) : 0;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.EMBEDS:
                    {
                        if (value.length) {
                            if (!this._embeds) {
                                this._embeds = new basecollection_1.BaseCollection();
                            }
                            this._embeds.clear();
                            for (let i = 0; i < value.length; i++) {
                                this._embeds.set(i, new messageembed_1.MessageEmbed(this.client, value[i]));
                            }
                        }
                        else {
                            if (this._embeds) {
                                this._embeds.clear();
                                this._embeds = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.MEMBER:
                    {
                        const guildId = this.guildId;
                        let member;
                        if (this.client.members.has(guildId, this.author.id)) {
                            member = this.client.members.get(guildId, this.author.id);
                            // should we merge? this event is so common
                        }
                        else {
                            value.guild_id = guildId;
                            value.user = this.author;
                            member = new member_1.Member(this.client, value);
                        }
                        value = member;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.MENTIONS:
                    {
                        if (value.length) {
                            if (!this._mentions) {
                                this._mentions = new basecollection_1.BaseCollection();
                            }
                            this._mentions.clear();
                            const guildId = this.guildId;
                            for (let raw of value) {
                                if (raw.member) {
                                    let member;
                                    if (this.client.members.has(guildId, raw.id)) {
                                        member = this.client.members.get(guildId, raw.id);
                                        // should we merge?
                                    }
                                    else {
                                        raw.member.guild_id = guildId;
                                        member = new member_1.Member(this.client, raw.member);
                                        member.merge({ user: raw });
                                        this.client.members.insert(member);
                                    }
                                    this._mentions.set(member.id, member);
                                }
                                else {
                                    if (guildId && this.client.members.has(guildId, raw.id)) {
                                        const member = this.client.members.get(guildId, raw.id);
                                        member.merge({ user: raw });
                                        this._mentions.set(member.id, member);
                                    }
                                    else {
                                        let user;
                                        if (this.client.users.has(raw.id)) {
                                            user = this.client.users.get(raw.id);
                                            user.merge(raw);
                                        }
                                        else {
                                            user = new user_1.User(this.client, raw);
                                            this.client.users.insert(user);
                                        }
                                        this._mentions.set(user.id, user);
                                    }
                                }
                            }
                        }
                        else {
                            if (this._mentions) {
                                this._mentions.clear();
                                this._mentions = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.MENTION_CHANNELS:
                    {
                        if (value.length) {
                            if (!this._mentionChannels) {
                                this._mentionChannels = new basecollection_1.BaseCollection();
                            }
                            this._mentionChannels.clear();
                            for (let raw of value) {
                                let channel;
                                if (this.client.channels.has(raw.id)) {
                                    channel = this.client.channels.get(raw.id);
                                    channel.merge(raw);
                                }
                                else {
                                    raw.is_partial = true;
                                    channel = channel_1.createChannelFromData(this.client, raw);
                                }
                                this._mentionChannels.set(channel.id, channel);
                            }
                        }
                        else {
                            if (this._mentionChannels) {
                                this._mentionChannels.clear();
                                this._mentionChannels = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.MENTION_ROLES:
                    {
                        if (value.length) {
                            if (!this._mentionRoles) {
                                this._mentionRoles = new basecollection_1.BaseCollection();
                            }
                            this._mentionRoles.clear();
                            const guild = this.guild;
                            for (let roleId of value) {
                                this._mentionRoles.set(roleId, (guild) ? guild.roles.get(roleId) || null : null);
                            }
                        }
                        else {
                            if (this._mentionRoles) {
                                this._mentionRoles.clear();
                                this._mentionRoles = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.MESSAGE_REFERENCE:
                    {
                        value = new MessageReference(this, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.REACTIONS:
                    {
                        if (value.length) {
                            if (!this._reactions) {
                                this._reactions = new basecollection_1.BaseCollection();
                            }
                            this._reactions.clear();
                            for (let raw of value) {
                                raw.channel_id = this.channelId;
                                raw.guild_id = this.guildId;
                                raw.message_id = this.id;
                                const emojiId = raw.emoji.id || raw.emoji.name;
                                this.reactions.set(emojiId, new reaction_1.Reaction(this.client, raw));
                            }
                        }
                        else {
                            if (this._reactions) {
                                this._reactions.clear();
                                this._reactions = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.REFERENCED_MESSAGE:
                    {
                        if (value) {
                            let message;
                            if (this.client.messages.has(value.id)) {
                                message = this.client.messages.get(value.id);
                                message.merge(value);
                            }
                            else {
                                message = new Message(this.client, value);
                            }
                            value = message;
                        }
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.STICKERS:
                    {
                        if (value.length) {
                            if (!this._stickers) {
                                this._stickers = new basecollection_1.BaseCollection();
                            }
                            this._stickers.clear();
                            for (let raw of value) {
                                const sticker = new sticker_1.Sticker(this.client, raw);
                                this.stickers.set(sticker.id, sticker);
                            }
                        }
                        else {
                            if (this._stickers) {
                                this._stickers.clear();
                                this._stickers = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.TIMESTAMP:
                    {
                        this.timestampUnix = (new Date(value)).getTime();
                    }
                    ;
                    return;
            }
            return super.mergeValue(key, value);
        }
    }
    toString() {
        return this.content;
    }
}
exports.Message = Message;
const keysMessageActivity = new baseset_1.BaseSet([
    constants_1.DiscordKeys.COVER_IMAGE,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PARTY_ID,
    constants_1.DiscordKeys.TYPE,
]);
/**
 * Channel Message Activity Structure, used for inviting people to listen/join
 * @category Structure
 */
class MessageActivity extends basestructure_1.BaseStructure {
    constructor(message, data) {
        super(message.client);
        this._keys = keysMessageActivity;
        this.coverImage = null;
        this.name = null;
        this.partyId = '';
        this.type = 0;
        this.message = message;
        this.merge(data);
        Object.defineProperty(this, 'message', { enumerable: false });
    }
    get activity() {
        const presence = this.message.author.presence;
        if (presence) {
            for (let [activityId, activity] of presence.activities) {
                if (activity.party && activity.party.id === this.partyId) {
                    return activity;
                }
            }
        }
        return null;
    }
    get group() {
        const group = new basecollection_1.BaseCollection();
        if (this.partyId) {
            for (let [userId, presence] of this.client.presences) {
                for (let [activityId, activity] of presence.activities) {
                    if (activity.party && activity.party.id === this.partyId) {
                        group.set(userId, presence.user);
                        break;
                    }
                }
            }
        }
        return group;
    }
}
exports.MessageActivity = MessageActivity;
const keysMessageCall = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ENDED_TIMESTAMP,
    constants_1.DiscordKeys.PARTICIPANTS,
]);
/**
 * Channel Message Call Structure, used to define the call properties in the DM it's from
 * Used to format the content
 * @category Structure
 */
class MessageCall extends basestructure_1.BaseStructure {
    constructor(message, data) {
        super(message.client);
        this._keys = keysMessageCall;
        this.endedTimestamp = null;
        this.participants = [];
        this.message = message;
        this.merge(data);
        Object.defineProperty(this, 'message', { enumerable: false });
    }
    get duration() {
        if (this.endedTimestamp) {
            return Math.max(Date.now() - this.endedTimestamp.getTime(), 0);
        }
        return 0;
    }
    get isEnded() {
        return !!this.endedTimestamp;
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case 'ended_timestamp':
                    {
                        if (value) {
                            value = new Date(value);
                        }
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.MessageCall = MessageCall;
const keysMessageReference = new baseset_1.BaseSet([
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.MESSAGE_ID,
]);
/**
 * Channel Message Reference Structure, used to tell the client that this is from a server webhook or a reply
 * Used for crossposts
 * @category Structure
 */
class MessageReference extends basestructure_1.BaseStructure {
    constructor(message, data) {
        super(message.client);
        this._keys = keysMessageReference;
        this.channelId = '';
        this.guildId = '';
        this.messageId = '';
        this.parent = message;
        this.merge(data);
        Object.defineProperty(this, 'message', { enumerable: false });
    }
    get channel() {
        return this.client.channels.get(this.channelId) || null;
    }
    get guild() {
        if (this.guildId) {
            return this.client.guilds.get(this.guildId) || null;
        }
        return null;
    }
    get message() {
        if (this.messageId) {
            return this.client.messages.get(this.messageId) || null;
        }
        return null;
    }
}
exports.MessageReference = MessageReference;
function messageSystemContent(message, text) {
    let content;
    if (text === undefined) {
        content = message.content;
    }
    else {
        content = text;
    }
    switch (message.type) {
        case constants_1.MessageTypes.RECIPIENT_ADD:
            {
                const otherUser = message.mentions.first();
                content = constants_1.SystemMessages.RecipientAdd.replace(/:user:/g, message.author.mention);
                content = content.replace(/:user2:/, (otherUser) ? otherUser.mention : 'UnknownUser');
            }
            ;
            break;
        case constants_1.MessageTypes.RECIPIENT_REMOVE:
            {
                const user = message.mentions.first();
                if (user && user.id !== message.author.id) {
                    content = constants_1.SystemMessages.RecipientRemove.replace(/:user:/g, message.author.mention);
                    content = content.replace(/:user2:/g, user.mention);
                }
                else {
                    content = constants_1.SystemMessages.RecipientRemoveSelf.replace(/:user:/g, message.author.mention);
                }
            }
            ;
            break;
        case constants_1.MessageTypes.CALL:
            {
                content = constants_1.SystemMessages.CallStarted.replace(/:user:/g, message.author.mention);
                if (message.call) {
                    if (message.call.isEnded) {
                        if (message.call.participants.includes(message.author.id)) {
                            content = constants_1.SystemMessages.CallStartedWithDuration;
                        }
                        else {
                            content = constants_1.SystemMessages.CallMissedWithDuration;
                        }
                        content = content.replace(/:duration:/g, String(message.call.duration));
                    }
                    else {
                        if (!message.call.participants.includes(message.author.id)) {
                            content = constants_1.SystemMessages.CallMissed;
                        }
                    }
                }
                content = content.replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.CHANNEL_NAME_CHANGE:
            {
                content = constants_1.SystemMessages.ChannelNameChange.replace(/:name:/g, content);
                content = content.replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.CHANNEL_ICON_CHANGE:
            {
                content = constants_1.SystemMessages.ChannelIconChange.replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.CHANNEL_PINNED_MESSAGE:
            {
                content = constants_1.SystemMessages.PinnedMessage.replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_MEMBER_JOIN:
            {
                const number = message.createdAtUnix % constants_1.SystemMessages.GuildMemberJoin.length;
                content = constants_1.SystemMessages.GuildMemberJoin[number].replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION:
            {
                content = constants_1.SystemMessages.GuildMemberSubscribed.replace(/:user:/g, message.author.mention);
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_1:
        case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_2:
        case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_3:
            {
                let premiumTier = constants_1.PremiumGuildTiers.NONE;
                switch (message.type) {
                    case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_1:
                        {
                            premiumTier = constants_1.PremiumGuildTiers.TIER_1;
                        }
                        ;
                        break;
                    case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_2:
                        {
                            premiumTier = constants_1.PremiumGuildTiers.TIER_2;
                        }
                        ;
                        break;
                    case constants_1.MessageTypes.GUILD_PREMIUM_SUBSCRIPTION_TIER_3:
                        {
                            premiumTier = constants_1.PremiumGuildTiers.TIER_3;
                        }
                        ;
                        break;
                }
                const channel = message.channel;
                if (!channel) {
                    return constants_1.SystemMessages.GuildMemberSubscribed.replace(/:user:/g, message.author.mention);
                }
                const guild = channel.guild;
                if (!guild) {
                    return constants_1.SystemMessages.GuildMemberSubscribed.replace(/:user:/g, message.author.mention);
                }
                content = constants_1.SystemMessages.GuildMemberSubscribedAchievedTier.replace(/:user:/g, message.author.mention);
                content = content.replace(/:guild:/g, guild.toString());
                content = content.replace(/:premiumTier:/g, constants_1.PremiumGuildTierNames[premiumTier]);
            }
            ;
            break;
        case constants_1.MessageTypes.CHANNEL_FOLLOW_ADD:
            {
                content = constants_1.SystemMessages.ChannelFollowAdd.replace(/:user:/g, message.author.mention);
                content = content.replace(/:webhookName:/g, message.content);
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_DISCOVERY_DISQUALIFIED:
            {
                content = constants_1.SystemMessages.GuildDiscoveryDisqualified;
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_DISCOVERY_REQUALIFIED:
            {
                content = constants_1.SystemMessages.GuildDiscoveryRequalified;
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING:
            {
                content = constants_1.SystemMessages.GuildDiscoveryGracePeriodInitialWarning;
            }
            ;
            break;
        case constants_1.MessageTypes.GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING:
            {
                content = constants_1.SystemMessages.GuildDiscoveryGracePeriodFinalWarning;
            }
            ;
            break;
        case constants_1.MessageTypes.APPLICATION_COMMAND:
            {
                content = constants_1.SystemMessages.ApplicationCommandUsed.replace(/:user:/g, message.author.mention);
                if (message.application) {
                    content = content.replace(/:application:/g, message.application.name);
                }
            }
            ;
            break;
    }
    return content;
}
exports.messageSystemContent = messageSystemContent;

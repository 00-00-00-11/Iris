"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMixin = exports.UserMe = exports.UserExtended = exports.UserWithFlags = exports.UserWithToken = exports.User = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const keysUser = new baseset_1.BaseSet([
    constants_1.DiscordKeys.AVATAR,
    constants_1.DiscordKeys.BOT,
    constants_1.DiscordKeys.DISCRIMINATOR,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.PUBLIC_FLAGS,
    constants_1.DiscordKeys.SYSTEM,
    constants_1.DiscordKeys.USERNAME,
]);
/**
 * Basic User Structure
 * @category Structure
 */
class User extends basestructure_1.BaseStructure {
    constructor(client, data, merge = true) {
        super(client);
        this._keys = keysUser;
        this.avatar = null;
        this.bot = false;
        this.discriminator = '0000';
        this.id = '';
        this.publicFlags = 0;
        this.username = '';
        if (merge) {
            this.merge(data);
        }
    }
    get avatarUrl() {
        return this.avatarUrlFormat();
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get defaultAvatarUrl() {
        return iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.AVATAR_DEFAULT(this.discriminator);
    }
    get dm() {
        return this.client.channels.find((channel) => channel.isDmSingle && channel.recipients.has(this.id)) || null;
    }
    get guilds() {
        const collection = new basecollection_1.BaseCollection();
        for (let [guildId, guild] of this.client.guilds) {
            if (guild.members.has(this.id)) {
                collection.set(guildId, guild);
            }
        }
        return collection;
    }
    get hasStaff() {
        return this.hasFlag(constants_1.UserFlags.STAFF);
    }
    get hasPartner() {
        return this.hasFlag(constants_1.UserFlags.PARTNER);
    }
    get hasHypesquad() {
        return this.hasFlag(constants_1.UserFlags.HYPESQUAD);
    }
    get hasBugHunterLevel1() {
        return this.hasFlag(constants_1.UserFlags.BUG_HUNTER_LEVEL_1);
    }
    get hasBugHunterLevel2() {
        return this.hasFlag(constants_1.UserFlags.BUG_HUNTER_LEVEL_2);
    }
    get hasMfaSms() {
        return this.hasFlag(constants_1.UserFlags.MFA_SMS);
    }
    get hasPremiumPromoDismissed() {
        return this.hasFlag(constants_1.UserFlags.PREMIUM_PROMO_DISMISSED);
    }
    get hasHypesquadHouseBravery() {
        return this.hasFlag(constants_1.UserFlags.HYPESQUAD_ONLINE_HOUSE_1);
    }
    get hasHypesquadHouseBrilliance() {
        return this.hasFlag(constants_1.UserFlags.HYPESQUAD_ONLINE_HOUSE_2);
    }
    get hasHypesquadHouseBalance() {
        return this.hasFlag(constants_1.UserFlags.HYPESQUAD_ONLINE_HOUSE_3);
    }
    get hasEarlySupporter() {
        return this.hasFlag(constants_1.UserFlags.PREMIUM_EARLY_SUPPORTER);
    }
    get hasTeamUser() {
        return this.hasFlag(constants_1.UserFlags.TEAM_USER);
    }
    get hasVerifiedBot() {
        return this.hasFlag(constants_1.UserFlags.VERIFIED_BOT);
    }
    get hasVerifiedDeveloper() {
        return this.hasFlag(constants_1.UserFlags.VERIFIED_DEVELOPER);
    }
    get isClientOwner() {
        return this.client.isOwner(this.id);
    }
    get isMe() {
        if (this.client.user) {
            return this.id === this.client.user.id;
        }
        return false;
    }
    get isSystem() {
        return !!this.system;
    }
    get isWebhook() {
        return this.bot && !this.isSystem && this.discriminator === '0000';
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.USER(this.id);
    }
    get mention() {
        return `<@${this.id}>`;
    }
    get messages() {
        const collection = new basecollection_1.BaseCollection();
        for (let [messageId, message] of this.client.messages) {
            if (message.author.id === this.id) {
                collection.set(messageId, message);
            }
        }
        return collection;
    }
    get name() {
        return this.username;
    }
    get names() {
        return [this.username];
    }
    get note() {
        return this.client.notes.get(this.id) || '';
    }
    get presence() {
        return this.client.presences.get(this.id) || null;
    }
    avatarUrlFormat(format, query) {
        if (!this.avatar) {
            return utils_1.addQuery(this.defaultAvatarUrl, query);
        }
        const hash = this.avatar;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.AVATAR(this.id, hash, format), query);
    }
    hasFlag(flag) {
        return this.hasPublicFlag(flag);
    }
    hasPublicFlag(flag) {
        return (this.publicFlags & flag) === flag;
    }
    add() {
        return this.editRelationship(constants_1.RelationshipTypes.FRIEND);
    }
    block() {
        return this.editRelationship(constants_1.RelationshipTypes.BLOCKED);
    }
    createDm() {
        return this.client.rest.createDm({ recipientId: this.id });
    }
    async createOrGetDm() {
        const channel = this.dm;
        if (channel) {
            return channel;
        }
        return this.createDm();
    }
    async createMessage(options = {}) {
        const channel = await this.createOrGetDm();
        return channel.createMessage(options);
    }
    deleteRelationship() {
        return this.client.rest.deleteRelationship(this.id);
    }
    editNote(note) {
        return this.client.rest.editNote(this.id, note);
    }
    editRelationship(type) {
        return this.client.rest.editRelationship(this.id, type);
    }
    fetchProfile() {
        return this.client.rest.fetchUserProfile(this.id);
    }
    unadd() {
        return this.deleteRelationship();
    }
    unblock() {
        return this.deleteRelationship();
    }
    toString() {
        return `${this.username}#${this.discriminator}`;
    }
}
exports.User = User;
const keysUserWithToken = new baseset_1.BaseSet([
    ...keysUser,
    constants_1.DiscordKeys.TOKEN,
]);
/**
 * User with Token Structure
 * e.g. when you edit your user
 * @category Structure
 */
class UserWithToken extends User {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysUserWithToken;
        this.token = '';
        this.merge(data);
    }
}
exports.UserWithToken = UserWithToken;
const keysUserWithFlags = new baseset_1.BaseSet([
    ...keysUser,
    constants_1.DiscordKeys.FLAGS,
]);
/**
 * User with Flags Structure
 * used to describe someone's badges, you get them from me/profile/team owner
 * @category Structure
 */
class UserWithFlags extends User {
    constructor(client, data, merge = true) {
        super(client, data, false);
        this._keys = keysUserWithFlags;
        this.flags = 0;
        if (merge) {
            this.merge(data);
        }
    }
    hasFlag(flag) {
        return (this.flags & flag) === flag;
    }
}
exports.UserWithFlags = UserWithFlags;
const keysUserExtended = new baseset_1.BaseSet([
    ...keysUserWithFlags,
    constants_1.DiscordKeys.EMAIL,
    constants_1.DiscordKeys.LOCALE,
    constants_1.DiscordKeys.MFA_ENABLED,
    constants_1.DiscordKeys.PREMIUM_TYPE,
    constants_1.DiscordKeys.VERIFIED,
]);
/**
 * User Extended Structure
 * received from /users/@me calls with an oauth2 token with correct permissions
 * @category Structure
 */
class UserExtended extends UserWithFlags {
    constructor(client, data, merge = true) {
        super(client, data, false);
        this._keys = keysUserExtended;
        this.flags = 0;
        this.mfaEnabled = false;
        this.premiumType = 0;
        this.verified = false;
        if (merge) {
            this.merge(data);
        }
    }
    get isClaimed() {
        // isClaimed if bot or has email
        return !!this.bot || !this.email;
    }
    get hasNitroClassic() {
        return this.hasPremiumType(constants_1.PremiumUserTypes.TIER_1);
    }
    get hasNitro() {
        return this.hasPremiumType(constants_1.PremiumUserTypes.TIER_2);
    }
    hasPremiumType(type) {
        return this.premiumType === type;
    }
}
exports.UserExtended = UserExtended;
const keysUserMe = new baseset_1.BaseSet([
    ...keysUserExtended,
    constants_1.DiscordKeys.ANALYTICS_TOKEN,
    constants_1.DiscordKeys.PHONE,
]);
/**
 * User Me Structure
 * the current user, it has all their details
 * @category Structure
 */
class UserMe extends UserExtended {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysUserMe;
        this.merge(data);
    }
}
exports.UserMe = UserMe;
/**
 * User Mixin Structure
 * Used to extend to receive all of [User]'s properties
 * @category Structure
 */
class UserMixin extends basestructure_1.BaseStructure {
    get avatar() {
        return this.user.avatar;
    }
    get avatarUrl() {
        return this.user.avatarUrl;
    }
    get bot() {
        return this.user.bot;
    }
    get createdAt() {
        return this.user.createdAt;
    }
    get createdAtUnix() {
        return this.user.createdAtUnix;
    }
    get defaultAvatarUrl() {
        return this.user.defaultAvatarUrl;
    }
    get discriminator() {
        return this.user.discriminator;
    }
    get dm() {
        return this.user.dm;
    }
    get guilds() {
        return this.user.guilds;
    }
    get hasStaff() {
        return this.user.hasStaff;
    }
    get hasPartner() {
        return this.user.hasPartner;
    }
    get hasHypesquad() {
        return this.user.hasHypesquad;
    }
    get hasBugHunterLevel1() {
        return this.user.hasBugHunterLevel1;
    }
    get hasBugHunterLevel2() {
        return this.user.hasBugHunterLevel2;
    }
    get hasMfaSms() {
        return this.user.hasMfaSms;
    }
    get hasPremiumPromoDismissed() {
        return this.user.hasPremiumPromoDismissed;
    }
    get hasHypesquadHouseBravery() {
        return this.user.hasHypesquadHouseBravery;
    }
    get hasHypesquadHouseBrilliance() {
        return this.user.hasHypesquadHouseBrilliance;
    }
    get hasHypesquadHouseBalance() {
        return this.user.hasHypesquadHouseBalance;
    }
    get hasEarlySupporter() {
        return this.user.hasEarlySupporter;
    }
    get hasTeamUser() {
        return this.user.hasTeamUser;
    }
    get hasVerifiedBot() {
        return this.user.hasVerifiedBot;
    }
    get hasVerifiedDeveloper() {
        return this.user.hasVerifiedDeveloper;
    }
    get id() {
        return this.user.id;
    }
    get isClientOwner() {
        return this.user.isClientOwner;
    }
    get isMe() {
        return this.user.isMe;
    }
    get isSystem() {
        return this.user.isSystem;
    }
    get isWebhook() {
        return this.user.isWebhook;
    }
    get jumpLink() {
        return this.user.jumpLink;
    }
    get mention() {
        return this.user.mention;
    }
    get messages() {
        return this.user.messages;
    }
    get name() {
        return this.user.name;
    }
    get names() {
        return this.user.names;
    }
    get note() {
        return this.user.note;
    }
    get presence() {
        return this.user.presence;
    }
    get publicFlags() {
        return this.user.publicFlags;
    }
    get system() {
        return this.user.system;
    }
    get username() {
        return this.user.username;
    }
    avatarUrlFormat(format, query) {
        return this.user.avatarUrlFormat(format, query);
    }
    hasFlag(flag) {
        return this.user.hasFlag(flag);
    }
    hasPublicFlag(flag) {
        return this.user.hasPublicFlag(flag);
    }
    add() {
        return this.user.add();
    }
    block() {
        return this.user.block();
    }
    createDm() {
        return this.user.createDm();
    }
    createOrGetDm() {
        return this.user.createOrGetDm();
    }
    createMessage(options = {}) {
        return this.user.createMessage(options);
    }
    deleteRelationship() {
        return this.user.deleteRelationship();
    }
    editNote(note) {
        return this.user.editNote(note);
    }
    editRelationship(type) {
        return this.user.editRelationship(type);
    }
    fetchProfile() {
        return this.user.fetchProfile();
    }
    unadd() {
        return this.user.unadd();
    }
    unblock() {
        return this.user.unblock();
    }
    toString() {
        return this.user.toString();
    }
}
exports.UserMixin = UserMixin;

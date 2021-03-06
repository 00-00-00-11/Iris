"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const channel_1 = require("./channel");
const user_1 = require("./user");
const keysMember = new baseset_1.BaseSet([
    constants_1.DiscordKeys.DEAF,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.HOISTED_ROLE,
    constants_1.DiscordKeys.JOINED_AT,
    constants_1.DiscordKeys.MUTE,
    constants_1.DiscordKeys.NICK,
    constants_1.DiscordKeys.PENDING,
    constants_1.DiscordKeys.PREMIUM_SINCE,
    constants_1.DiscordKeys.ROLES,
    constants_1.DiscordKeys.USER,
]);
const keysMergeMember = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
]);
/**
 * Guild Member Structure
 * @category Structure
 */
class Member extends user_1.UserMixin {
    constructor(client, data) {
        super(client);
        this._keys = keysMember;
        this._keysMerge = keysMergeMember;
        this.deaf = false;
        this.guildId = '';
        this.hoistedRoleId = null;
        this.joinedAtUnix = 0;
        this.left = false;
        this.mute = false;
        this.nick = null;
        this.pending = false;
        this.premiumSinceUnix = 0;
        this.merge(data);
        Object.defineProperty(this, '_roles', { enumerable: false, writable: true });
    }
    get canAdministrator() {
        return this.can([constants_1.Permissions.ADMINISTRATOR]);
    }
    get canBanMembers() {
        return this.can([constants_1.Permissions.BAN_MEMBERS]);
    }
    get canChangeNickname() {
        return this.can([constants_1.Permissions.CHANGE_NICKNAME]);
    }
    get canChangeNicknames() {
        return this.can([constants_1.Permissions.CHANGE_NICKNAMES]);
    }
    get canCreateInstantInvite() {
        return this.can([constants_1.Permissions.CREATE_INSTANT_INVITE]);
    }
    get canKickMembers() {
        return this.can([constants_1.Permissions.KICK_MEMBERS]);
    }
    get canManageChannels() {
        return this.can([constants_1.Permissions.MANAGE_CHANNELS]);
    }
    get canManageEmojis() {
        return this.can([constants_1.Permissions.MANAGE_EMOJIS]);
    }
    get canManageGuild() {
        return this.can([constants_1.Permissions.MANAGE_GUILD]);
    }
    get canManageMessages() {
        return this.can([constants_1.Permissions.MANAGE_MESSAGES]);
    }
    get canManageRoles() {
        return this.can([constants_1.Permissions.MANAGE_ROLES]);
    }
    get canManageWebhooks() {
        return this.can([constants_1.Permissions.MANAGE_WEBHOOKS]);
    }
    get canViewAuditLogs() {
        return this.can([constants_1.Permissions.VIEW_AUDIT_LOG]);
    }
    get color() {
        const role = this.colorRole;
        return (role) ? role.color : 0;
    }
    get colorRole() {
        let highestRole = null;
        for (let [roleId, role] of this.roles) {
            if (role && role.color) {
                if (highestRole) {
                    if (highestRole.position < role.position) {
                        highestRole = role;
                    }
                }
                else {
                    highestRole = role;
                }
            }
        }
        return highestRole;
    }
    get guild() {
        return this.client.guilds.get(this.guildId) || null;
    }
    get highestRole() {
        let highestRole = null;
        for (let [roleId, role] of this.roles) {
            if (role) {
                if (highestRole) {
                    if (highestRole.position < role.position) {
                        highestRole = role;
                    }
                }
                else {
                    highestRole = role;
                }
            }
        }
        return highestRole;
    }
    get hoistedRole() {
        if (this.hoistedRoleId) {
            return this.roles.get(this.hoistedRoleId) || null;
        }
        return null;
    }
    get isBoosting() {
        return !!this.premiumSinceUnix;
    }
    get isOffline() {
        const presence = this.presence;
        if (presence) {
            return presence.isOffline;
        }
        return true;
    }
    get isOwner() {
        const guild = this.guild;
        if (guild) {
            return guild.isOwner(this.id);
        }
        return false;
    }
    get isPartial() {
        return !!this.joinedAtUnix;
    }
    get joinedAt() {
        if (this.joinedAtUnix) {
            return new Date(this.joinedAtUnix);
        }
        return null;
    }
    get mention() {
        return (this.nick) ? `<@!${this.id}>` : this.user.mention;
    }
    get name() {
        return this.nick || this.username;
    }
    get names() {
        if (this.nick) {
            return [this.nick, this.username];
        }
        return [this.username];
    }
    get permissions() {
        if (this.isOwner) {
            return constants_1.PERMISSIONS_ALL;
        }
        return this.roles.reduce((total, role) => {
            if (role) {
                return total | role.permissions;
            }
            return total;
        }, constants_1.Permissions.NONE);
    }
    get premiumSince() {
        if (this.premiumSinceUnix) {
            return new Date(this.premiumSinceUnix);
        }
        return null;
    }
    get roles() {
        const collection = new basecollection_1.BaseCollection();
        const guild = this.guild;
        collection.set(this.guildId, (guild) ? guild.defaultRole : null);
        if (this._roles) {
            for (let roleId of this._roles) {
                if (guild) {
                    collection.set(roleId, guild.roles.get(roleId) || null);
                }
                else {
                    collection.set(roleId, null);
                }
            }
        }
        return collection;
    }
    get voiceChannel() {
        const voiceState = this.voiceState;
        if (voiceState) {
            return voiceState.channel;
        }
        return null;
    }
    get voiceState() {
        return this.client.voiceStates.get(this.guildId, this.id) || null;
    }
    can(permissions, options = {}) {
        const guild = this.guild;
        if (guild) {
            return guild.can(permissions, this, options);
        }
        return utils_1.PermissionTools.checkPermissions(this.permissions, permissions);
    }
    /* just checks who has the higher role, doesn't check permissions */
    canEdit(member) {
        if (this.isOwner) {
            return true;
        }
        if (member.isOwner) {
            return false;
        }
        if (this.id === member.id) {
            return true;
        }
        const us = this.highestRole;
        const them = member.highestRole;
        if (us && them) {
            return them.position < us.position;
        }
        return false;
    }
    permissionsIn(channelId) {
        let channel;
        if (channelId instanceof channel_1.ChannelGuildBase) {
            channel = channelId;
        }
        else {
            if (this.client.channels.has(channelId)) {
                channel = this.client.channels.get(channelId);
            }
            else {
                return constants_1.Permissions.NONE;
            }
        }
        let total = this.permissions;
        if (channel.permissionOverwrites.has(channel.guildId)) {
            const overwrite = channel.permissionOverwrites.get(channel.guildId);
            total = (total & ~overwrite.deny) | overwrite.allow;
        }
        let allow = constants_1.Permissions.NONE, deny = constants_1.Permissions.NONE;
        for (let [roleId, role] of this.roles) {
            if (roleId === this.guildId) {
                continue;
            }
            if (channel.permissionOverwrites.has(roleId)) {
                const overwrite = channel.permissionOverwrites.get(roleId);
                allow |= overwrite.allow;
                deny |= overwrite.deny;
            }
        }
        total = (total & ~deny) | allow;
        if (channel.permissionOverwrites.has(this.id)) {
            const overwrite = channel.permissionOverwrites.get(this.id);
            total = (total & ~overwrite.deny) | overwrite.allow;
        }
        return total;
    }
    addRole(roleId, options = {}) {
        return this.client.rest.addGuildMemberRole(this.guildId, this.id, roleId, options);
    }
    ban(options = {}) {
        return this.client.rest.createGuildBan(this.guildId, this.id, options);
    }
    edit(options = {}) {
        return this.client.rest.editGuildMember(this.guildId, this.id, options);
    }
    editNick(nick, options = {}) {
        if (this.isMe) {
            return this.client.rest.editGuildNick(this.guildId, nick, options);
        }
        return this.edit({ ...options, nick });
    }
    move(channelId, options = {}) {
        return this.edit({ ...options, channelId });
    }
    remove(options = {}) {
        return this.client.rest.removeGuildMember(this.guildId, this.id, options);
    }
    removeBan(options = {}) {
        return this.client.rest.removeGuildBan(this.guildId, this.id, options);
    }
    removeRole(roleId, options = {}) {
        return this.client.rest.removeGuildMemberRole(this.guildId, this.id, roleId, options);
    }
    setDeaf(deaf, options = {}) {
        return this.edit({ ...options, deaf });
    }
    setMute(mute, options = {}) {
        return this.edit({ ...options, mute });
    }
    difference(key, value) {
        let differences;
        switch (key) {
            case constants_1.DiscordKeys.HOISTED_ROLE:
                {
                    if (this.hoistedRoleId !== value) {
                        differences = this.hoistedRoleId;
                    }
                }
                ;
                break;
            case constants_1.DiscordKeys.ROLES:
                {
                    if (this._roles) {
                        const hasDifferences = (this._roles.length !== value.length) || this._roles.some((roleId) => {
                            return !value.includes(roleId);
                        });
                        if (hasDifferences) {
                            differences = this._roles;
                        }
                    }
                    else {
                        differences = this._roles;
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
                case constants_1.DiscordKeys.HOISTED_ROLE:
                    {
                        this.hoistedRoleId = value;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.JOINED_AT:
                    {
                        this.joinedAtUnix = (value) ? (new Date(value).getTime()) : 0;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.PREMIUM_SINCE:
                    {
                        this.premiumSinceUnix = (value) ? (new Date(value).getTime()) : 0;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.ROLES:
                    {
                        if (value.length) {
                            this._roles = value;
                        }
                        else {
                            this._roles = undefined;
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.USER:
                    {
                        let user;
                        if (this.client.users.has(value.id)) {
                            user = this.client.users.get(value.id);
                            user.merge(value);
                        }
                        else {
                            user = new user_1.User(this.client, value);
                            this.client.users.insert(user);
                        }
                        value = user;
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
    toJSON(withRoles) {
        const data = super.toJSON();
        if (!withRoles) {
            if (constants_1.DiscordKeys.HOISTED_ROLE in data) {
                data[constants_1.DiscordKeys.HOISTED_ROLE] = this.hoistedRoleId;
            }
            if (constants_1.DiscordKeys.ROLES in data) {
                data[constants_1.DiscordKeys.ROLES] = Array.from(data.roles.keys());
            }
        }
        return data;
    }
}
exports.Member = Member;

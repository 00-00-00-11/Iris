"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const channel_1 = require("./channel");
const keysRole = new baseset_1.BaseSet([
    constants_1.DiscordKeys.COLOR,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.HOIST,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MANAGED,
    constants_1.DiscordKeys.MENTIONABLE,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PERMISSIONS,
    constants_1.DiscordKeys.POSITION,
    constants_1.DiscordKeys.TAGS,
]);
const keysMergeRole = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.TAGS,
]);
/**
 * Guild Role Structure, used in [Guild]
 * @category Structure
 */
class Role extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysRole;
        this._keysMerge = keysMergeRole;
        this.color = 0;
        this.guildId = '';
        this.hoist = false;
        this.id = '';
        this.managed = false;
        this.mentionable = false;
        this.name = '';
        this.permissions = constants_1.Permissions.NONE;
        this.position = 0;
        this.tags = null;
        this.merge(data);
    }
    get botId() {
        if (this.tags && this.tags.bot_id) {
            return this.tags.bot_id;
        }
        return null;
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get guild() {
        return this.client.guilds.get(this.guildId) || null;
    }
    get integrationId() {
        if (this.tags && this.tags.integration_id) {
            return this.tags.integration_id;
        }
        return null;
    }
    get isBoosterRole() {
        if (this.tags) {
            return 'premium_subscriber' in this.tags;
        }
        return false;
    }
    get isDefault() {
        return this.id === this.guildId;
    }
    get members() {
        const guild = this.guild;
        const members = (guild) ? guild.members : null;
        if (members) {
            if (this.isDefault) {
                return members;
            }
            const collection = new basecollection_1.BaseCollection();
            for (let [userId, member] of members) {
                if (member._roles && member._roles.includes(this.id)) {
                    collection.set(userId, member);
                }
            }
            return collection;
        }
        return new basecollection_1.BaseCollection();
    }
    get mention() {
        return `<@&${this.id}>`;
    }
    can(permissions, { ignoreAdministrator } = {}) {
        if (!ignoreAdministrator && utils_1.PermissionTools.checkPermissions(this.permissions, constants_1.Permissions.ADMINISTRATOR)) {
            return true;
        }
        return utils_1.PermissionTools.checkPermissions(this.permissions, permissions);
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
        let allow = constants_1.Permissions.NONE, deny = constants_1.Permissions.NONE;
        if (channel.permissionOverwrites.has(this.id)) {
            const overwrite = channel.permissionOverwrites.get(this.id);
            allow |= overwrite.allow;
            deny |= overwrite.deny;
        }
        return (this.permissions & ~deny) | allow;
    }
    delete(options = {}) {
        return this.client.rest.deleteGuildRole(this.guildId, this.id, options);
    }
    edit(options) {
        return this.client.rest.editGuildRole(this.guildId, this.id, options);
    }
    mergeValue(key, value) {
        switch (key) {
            case constants_1.DiscordKeys.PERMISSIONS:
                {
                    value = BigInt(value);
                }
                ;
                break;
            case constants_1.DiscordKeys.TAGS:
                {
                    value = value || null;
                }
                ;
                break;
        }
        return super.mergeValue(key, value);
    }
    toString() {
        return this.name;
    }
}
exports.Role = Role;

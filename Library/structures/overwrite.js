"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overwrite = void 0;
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const keysOverwrite = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ALLOW,
    constants_1.DiscordKeys.DENY,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.TYPE,
]);
/**
 * Channel Overwrite Structure, used in [ChannelGuildBase] Structures
 * @category Structure
 */
class Overwrite extends basestructure_1.BaseStructure {
    constructor(channel, data) {
        super(channel.client);
        this._keys = keysOverwrite;
        this.allow = constants_1.Permissions.NONE;
        this.deny = constants_1.Permissions.NONE;
        this.id = '';
        this.channel = channel;
        this.merge(data);
        Object.defineProperty(this, 'channel', { enumerable: false });
    }
    get channelId() {
        return this.channel.id;
    }
    get guild() {
        return this.channel.guild;
    }
    get guildId() {
        return this.channel.guildId;
    }
    get isMember() {
        return this.type === constants_1.OverwriteTypes.MEMBER;
    }
    get isRole() {
        return this.type === constants_1.OverwriteTypes.ROLE;
    }
    get member() {
        if (this.isMember) {
            return this.client.members.get(this.guildId, this.id) || null;
        }
        return null;
    }
    get role() {
        if (this.isRole) {
            const guild = this.guild;
            if (guild) {
                return guild.roles.get(this.id) || null;
            }
        }
        return null;
    }
    can(permissions) {
        if (!utils_1.PermissionTools.checkPermissions(this.deny, permissions)) {
            return utils_1.PermissionTools.checkPermissions(this.allow, permissions);
        }
        return false;
    }
    delete() {
        return this.client.rest.deleteChannelOverwrite(this.channelId, this.id);
    }
    edit(options = {}) {
        return this.client.rest.editChannelOverwrite(this.channelId, this.id, {
            allow: options.allow,
            deny: options.deny,
            reason: options.reason,
            type: this.type,
        });
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.ALLOW:
                case constants_1.DiscordKeys.DENY:
                    {
                        value = BigInt(value);
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Overwrite = Overwrite;

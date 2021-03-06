"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invite = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const basestructure_1 = require("./basestructure");
const channel_1 = require("./channel");
const guild_1 = require("./guild");
const user_1 = require("./user");
const keysInvite = new baseset_1.BaseSet([
    constants_1.DiscordKeys.APPROXIMATE_MEMBER_COUNT,
    constants_1.DiscordKeys.APPROXIMATE_PRESENCE_COUNT,
    constants_1.DiscordKeys.CHANNEL,
    constants_1.DiscordKeys.CODE,
    constants_1.DiscordKeys.CREATED_AT,
    constants_1.DiscordKeys.GUILD,
    constants_1.DiscordKeys.INVITER,
    constants_1.DiscordKeys.MAX_AGE,
    constants_1.DiscordKeys.MAX_USES,
    constants_1.DiscordKeys.REVOKED,
    constants_1.DiscordKeys.TARGET_USER,
    constants_1.DiscordKeys.TARGET_USER_TYPE,
    constants_1.DiscordKeys.TEMPORARY,
    constants_1.DiscordKeys.USES,
]);
const keysMergeInvite = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD,
]);
/**
 * Instant Invite Structure
 * @category Structure
 */
class Invite extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysInvite;
        this._keysMerge = keysMergeInvite;
        this.code = '';
        this.merge(data);
    }
    get createdAtUnix() {
        return (this.createdAt) ? this.createdAt.getTime() : 0;
    }
    get expiresAt() {
        const expiresAt = this.expiresAtUnix;
        if (expiresAt !== Infinity) {
            return new Date(expiresAt);
        }
        return null;
    }
    get expiresAtUnix() {
        if (this.createdAt && this.maxAge) {
            return this.createdAtUnix + this.maxAge;
        }
        return Infinity;
    }
    get isVanity() {
        if (this.guild) {
            return this.code === this.guild.vanityUrlCode;
        }
        return false;
    }
    get longUrl() {
        return iris_client_rest_1.Endpoints.Invite.LONG(this.code);
    }
    get url() {
        return iris_client_rest_1.Endpoints.Invite.SHORT(this.code);
    }
    accept() {
        return this.client.rest.acceptInvite(this.code);
    }
    delete(options = {}) {
        return this.client.rest.deleteInvite(this.code, options);
    }
    fetch(options = {}) {
        return this.client.rest.fetchInvite(this.code, options);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.CHANNEL:
                    {
                        let channel;
                        if (this.client.channels.has(value.id)) {
                            channel = this.client.channels.get(value.id);
                            channel.merge(value);
                        }
                        else {
                            if (this.guild) {
                                value.guild_id = this.guild.id;
                            }
                            value.is_partial = true;
                            channel = channel_1.createChannelFromData(this.client, value);
                        }
                        value = channel;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.CREATED_AT:
                    {
                        if (value) {
                            value = new Date(value);
                        }
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.GUILD:
                    {
                        let guild;
                        if (this.client.guilds.has(value.id)) {
                            guild = this.client.guilds.get(value.id);
                            guild.merge(value);
                        }
                        else {
                            value.is_partial = true;
                            guild = new guild_1.Guild(this.client, value);
                        }
                        value = guild;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.INVITER:
                    {
                        let inviter;
                        if (this.client.users.has(value.id)) {
                            inviter = this.client.users.get(value.id);
                            inviter.merge(value);
                        }
                        else {
                            inviter = new user_1.User(this.client, value);
                        }
                        value = inviter;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.TARGET_USER:
                    {
                        let user;
                        if (this.client.users.has(value.id)) {
                            user = this.client.users.get(value.id);
                            user.merge(value);
                        }
                        else {
                            user = new user_1.User(this.client, value);
                        }
                        value = user;
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Invite = Invite;

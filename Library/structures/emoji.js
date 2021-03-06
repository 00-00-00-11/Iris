"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emoji = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const user_1 = require("./user");
const keysEmoji = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ANIMATED,
    constants_1.DiscordKeys.AVAILABLE,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MANAGED,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.REQUIRE_COLONS,
    constants_1.DiscordKeys.ROLES,
    constants_1.DiscordKeys.USER,
]);
const keysMergeEmoji = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ANIMATED,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.GUILD_ID,
]);
/**
 * Emoji Structure
 * @category Structure
 */
class Emoji extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysEmoji;
        this._keysMerge = keysMergeEmoji;
        this.animated = false;
        this.id = null;
        this.name = '';
        this.merge(data);
        Object.defineProperty(this, '_roles', { enumerable: false, writable: true });
    }
    get createdAt() {
        const createdAtUnix = this.createdAtUnix;
        if (createdAtUnix !== null) {
            return new Date(createdAtUnix);
        }
        return null;
    }
    get createdAtUnix() {
        if (this.id) {
            return utils_1.Snowflake.timestamp(this.id);
        }
        return null;
    }
    get endpointFormat() {
        if (this.id) {
            return `${this.name}:${this.id}`;
        }
        return this.name;
    }
    get format() {
        if (this.id) {
            return `<${(this.animated) ? 'a' : ''}:${this.name}:${this.id}>`;
        }
        return this.name;
    }
    get guild() {
        if (this.guildId) {
            return this.client.guilds.get(this.guildId) || null;
        }
        return null;
    }
    get roles() {
        if (this._roles) {
            return this._roles;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get url() {
        return this.urlFormat();
    }
    urlFormat(format, query) {
        if (!this.id) {
            throw new Error('Cannot get a URL of a standard Emoji.');
        }
        if (!format) {
            if (this.animated) {
                format = constants_1.ImageFormats.GIF;
            }
            else {
                format = this.client.imageFormat || constants_1.ImageFormats.PNG;
            }
        }
        const valid = [constants_1.ImageFormats.PNG, constants_1.ImageFormats.GIF];
        if (!valid.includes(format)) {
            throw new Error(`Invalid format: '${format}', valid: ${JSON.stringify(valid)}`);
        }
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.EMOJI(this.id, format), query);
    }
    async edit(options) {
        if (!this.id || !this.guildId) {
            throw new Error('Cannot edit a standard Emoji.');
        }
        return this.client.rest.editGuildEmoji(this.guildId, this.id, options);
    }
    async delete(options = {}) {
        if (!this.id || !this.guildId) {
            throw new Error('Cannot delete a standard Emoji.');
        }
        return this.client.rest.deleteGuildEmoji(this.guildId, this.id, options);
    }
    async fetchData(options = {}) {
        return this.client.rest.request({
            url: this.urlFormat(options.format, options.query),
        });
    }
    mergeValue(key, value) {
        switch (key) {
            case constants_1.DiscordKeys.ANIMATED:
                {
                    this.animated = !!value;
                }
                ;
                return;
            case constants_1.DiscordKeys.ID:
                {
                    // since presences can have emojis now, we want to reuse the emoji object
                    // this can cause someone switching from an emoji with an id to one without (which will make the id stay, this fixes it)
                    this.id = value || null;
                }
                ;
                return;
        }
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.ROLES:
                    {
                        if (value.length) {
                            if (!this._roles) {
                                this._roles = new basecollection_1.BaseCollection();
                            }
                            this._roles.clear();
                            const guild = this.guild;
                            for (let roleId of value) {
                                this._roles.set(roleId, (guild) ? guild.roles.get(roleId) || null : null);
                            }
                        }
                        else {
                            if (this._roles) {
                                this._roles.clear();
                                this._roles = undefined;
                            }
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
            super.mergeValue(key, value);
        }
    }
    toString() {
        return this.format;
    }
    toJSON(withRoles) {
        const data = super.toJSON();
        if (!withRoles) {
            if (constants_1.DiscordKeys.ROLES in data) {
                data[constants_1.DiscordKeys.ROLES] = Array.from(data.roles.keys());
            }
        }
        return data;
    }
}
exports.Emoji = Emoji;

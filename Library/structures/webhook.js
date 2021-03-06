"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const user_1 = require("./user");
const keysWebhook = new baseset_1.BaseSet([
    constants_1.DiscordKeys.AVATAR,
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.DISCRIMINATOR,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.TOKEN,
    constants_1.DiscordKeys.USER,
]);
/**
 * Webhook Structure
 * @category Structure
 */
class Webhook extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysWebhook;
        this.avatar = null;
        this.channelId = '';
        this.discriminator = '0000';
        this.guildId = '';
        this.id = '';
        this.name = '';
        this.type = constants_1.WebhookTypes.INCOMING;
        this.merge(data);
    }
    get avatarUrl() {
        return this.avatarUrlFormat();
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
    get defaultAvatarUrl() {
        return iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.AVATAR_DEFAULT(parseInt(this.discriminator) % 5);
    }
    get guild() {
        return this.client.guilds.get(this.guildId) || null;
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.USER(this.id);
    }
    get mention() {
        return `<@${this.id}>`;
    }
    avatarUrlFormat(format, query) {
        if (!this.avatar) {
            return utils_1.addQuery(this.defaultAvatarUrl, query);
        }
        const hash = this.avatar;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.AVATAR(this.id, hash, format), query);
    }
    async createMessage(options, compatibleType) {
        return this.execute(options, compatibleType);
    }
    async delete(options = {}) {
        if (this.token) {
            return this.client.rest.deleteWebhookToken(this.id, this.token, options);
        }
        return this.client.rest.deleteWebhook(this.id, options);
    }
    async deleteMessage(messageId) {
        if (!this.token) {
            throw new Error('Webhook is missing it\'s token');
        }
        return this.client.rest.deleteWebhookTokenMessage(this.id, this.token, messageId);
    }
    async edit(options = {}) {
        if (this.token) {
            return this.client.rest.editWebhookToken(this.id, this.token, options);
        }
        return this.client.rest.editWebhook(this.id, options);
    }
    async editMessage(messageId, options = {}) {
        if (!this.token) {
            throw new Error('Webhook is missing it\'s token');
        }
        return this.client.rest.editWebhookTokenMessage(this.id, this.token, messageId, options);
    }
    async execute(options, compatibleType) {
        if (!this.token) {
            throw new Error('Webhook is missing it\'s token');
        }
        return this.client.rest.executeWebhook(this.id, this.token, options, compatibleType);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
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
        return `${this.name}#${this.discriminator}`;
    }
}
exports.Webhook = Webhook;

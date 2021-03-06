"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2ApplicationAsset = exports.keysOauth2ApplicationAsset = exports.Oauth2Application = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const team_1 = require("./team");
const user_1 = require("./user");
const keysOauth2Application = new baseset_1.BaseSet([
    constants_1.DiscordKeys.BOT,
    constants_1.DiscordKeys.BOT_PUBLIC,
    constants_1.DiscordKeys.BOT_REQUIRE_CODE_GRANT,
    constants_1.DiscordKeys.COVER_IMAGE,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.FLAGS,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.HOOK,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.OWNER,
    constants_1.DiscordKeys.PRIMARY_SKU_ID,
    constants_1.DiscordKeys.REDIRECT_URIS,
    constants_1.DiscordKeys.RPC_APPLICATION_STATE,
    constants_1.DiscordKeys.RPC_ORIGINS,
    constants_1.DiscordKeys.SECRET,
    constants_1.DiscordKeys.SLUG,
    constants_1.DiscordKeys.STORE_APPLICATION_STATE,
    constants_1.DiscordKeys.SUMMARY,
    constants_1.DiscordKeys.TEAM,
    constants_1.DiscordKeys.VERIFY_KEY,
]);
/**
 * Oauth2 Application Structure
 * @category Structure
 */
class Oauth2Application extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysOauth2Application;
        this.botPublic = false;
        this.botRequireCodeGrant = false;
        this.description = '';
        this.flags = 0;
        this.icon = null;
        this.id = '';
        this.name = '';
        this.summary = '';
        this.verifyKey = '';
        this.merge(data);
    }
    get coverImageUrl() {
        return this.coverImageUrlFormat();
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get jumpLink() {
        return this.platformDiscordUrl;
    }
    get iconUrl() {
        return this.iconUrlFormat();
    }
    get isOnDiscord() {
        return !!this.primarySkuId;
    }
    get oauth2Url() {
        return this.oauth2UrlFormat();
    }
    get platformDiscordUrl() {
        if (this.primarySkuId) {
            return (iris_client_rest_1.Endpoints.Routes.URL +
                iris_client_rest_1.Endpoints.Routes.APPLICATION_STORE_LISTING_SKU(this.primarySkuId, this.slug));
        }
        return null;
    }
    coverImageUrlFormat(format, query) {
        if (this.coverImage) {
            const hash = this.coverImage;
            format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
            return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ICON(this.id, hash, format), query);
        }
        return null;
    }
    iconUrlFormat(format, query) {
        if (this.icon) {
            const hash = this.icon;
            format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
            return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ICON(this.id, hash, format), query);
        }
        return null;
    }
    oauth2UrlFormat(options = {}) {
        const query = {
            channel_id: options.channelId,
            client_id: this.id,
            disable_guild_select: options.disableGuildSelect,
            guild_id: options.guildId,
            permissions: options.permissions,
            prompt: options.prompt,
            redirect_uri: options.redirectUri,
            response_type: options.responseType,
            scope: options.scope,
        };
        if (Array.isArray(options.scope)) {
            query.scope = options.scope.join(' ');
        }
        return utils_1.addQuery(iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.OAUTH2_AUTHORIZE, query);
    }
    async createAsset(options) {
        return this.client.rest.createOauth2ApplicationAsset(this.id, options);
    }
    async createStoreAsset(options) {
        return this.client.rest.createStoreApplicationAsset(this.id, options);
    }
    async deleteAsset(assetId) {
        return this.client.rest.deleteOauth2ApplicationAsset(this.id, assetId);
    }
    async deleteStoreAsset(assetId) {
        return this.client.rest.deleteStoreApplicationAsset(this.id, assetId);
    }
    async fetchAssets() {
        return this.client.rest.fetchOauth2ApplicationAssets(this.id);
    }
    async fetchNews() {
        return this.client.rest.fetchApplicationNews(this.id);
    }
    async fetchStoreAssets() {
        return this.client.rest.fetchStoreApplicationAssets(this.id);
    }
    async joinGuild(options = {}) {
        if (!this.guildId) {
            throw new Error('Application doesn\'t have a guildId to join');
        }
        return this.client.rest.joinGuild(this.guildId, options);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.BOT:
                    {
                        value = new user_1.UserWithToken(this.client, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.OWNER:
                    {
                        if (this.client.users.has(value.id)) {
                            // dont use the cache since this object has flags key, just update the cache
                            this.client.users.get(value.id).merge(value);
                        }
                        value = new user_1.UserWithFlags(this.client, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.TEAM:
                    {
                        let team;
                        if (this.team) {
                            team = this.team;
                            team.merge(value);
                        }
                        else {
                            team = new team_1.Team(this.client, value);
                        }
                        value = team;
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Oauth2Application = Oauth2Application;
exports.keysOauth2ApplicationAsset = new baseset_1.BaseSet([
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.TYPE,
]);
class Oauth2ApplicationAsset extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = exports.keysOauth2ApplicationAsset;
        this.applicationId = '';
        this.id = '';
        this.name = '';
        this.merge(data);
    }
    get isLarge() {
        return this.type === constants_1.Oauth2AssetTypes.LARGE;
    }
    get isSmall() {
        return this.type === constants_1.Oauth2AssetTypes.SMALL;
    }
    get url() {
        return this.urlFormat();
    }
    urlFormat(format, query) {
        const hash = this.id;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ASSET(this.applicationId, hash, format), query);
    }
    async delete() {
        return this.client.rest.deleteOauth2ApplicationAsset(this.applicationId, this.id);
    }
}
exports.Oauth2ApplicationAsset = Oauth2ApplicationAsset;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationThirdPartySku = exports.Application = exports.SpecialThirdPartySkus = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
exports.SpecialThirdPartySkus = Object.freeze({
    'Call of Duty Black Ops 4': 'call-of-duty',
    'Call of Duty Modern Warfare': 'call-of-duty-mw',
    'StarCraft': 'starcraft-remastered',
    'World of Warcraft Classic': 'world-of-warcraft',
    'World of Warcraft Public Test': 'world-of-warcraft',
});
const keysApplication = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ALIASES,
    constants_1.DiscordKeys.BOT_PUBLIC,
    constants_1.DiscordKeys.BOT_REQUIRE_CODE_GRANT,
    constants_1.DiscordKeys.COVER_IMAGE,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.DEVELOPERS,
    constants_1.DiscordKeys.EULA_ID,
    constants_1.DiscordKeys.EXECUTABLES,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.HOOK,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.OVERLAY,
    constants_1.DiscordKeys.OVERLAY_COMPATIBILITY_HOOK,
    constants_1.DiscordKeys.PRIMARY_SKU_ID,
    constants_1.DiscordKeys.PUBLISHERS,
    constants_1.DiscordKeys.RPC_ORIGINS,
    constants_1.DiscordKeys.SLUG,
    constants_1.DiscordKeys.SPLASH,
    constants_1.DiscordKeys.SUMMARY,
    constants_1.DiscordKeys.THIRD_PARTY_SKUS,
    constants_1.DiscordKeys.VERIFY_KEY,
    constants_1.DiscordKeys.YOUTUBE_TRAILER_VIDEO_ID,
]);
/**
 * Application Structure, used for channels, guilds, presences, etc..
 * @category Structure
 */
class Application extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysApplication;
        this.coverImage = null;
        this.description = '';
        this.icon = null;
        this.id = '';
        this.name = '';
        this.slug = null;
        this.splash = null;
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
    get platformDiscordUrl() {
        if (this.primarySkuId) {
            return (iris_client_rest_1.Endpoints.Routes.URL +
                iris_client_rest_1.Endpoints.Routes.APPLICATION_STORE_LISTING_SKU(this.primarySkuId, this.slug));
        }
        return null;
    }
    get splashUrl() {
        return this.splashUrlFormat();
    }
    get youtubeTrailerUrl() {
        if (this.youtubeTrailerVideoId) {
            return constants_1.SpecialUrls.YOUTUBE_VIDEO(this.youtubeTrailerVideoId);
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
    matches(name) {
        if (this.name === name) {
            return true;
        }
        if (this.aliases && this.aliases.some((alias) => alias === name)) {
            return true;
        }
        return false;
    }
    splashUrlFormat(format, query) {
        if (this.splash) {
            const hash = this.splash;
            format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
            return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ICON(this.id, hash, format), query);
        }
        return null;
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
                case constants_1.DiscordKeys.ALIASES:
                    {
                        if (this.aliases) {
                            this.aliases.clear();
                            for (let raw of value) {
                                this.aliases.add(raw);
                            }
                        }
                        else {
                            if (value.length) {
                                this.aliases = new baseset_1.BaseSet(value);
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.RPC_ORIGINS:
                    {
                        if (this.rpcOrigins) {
                            this.rpcOrigins.clear();
                            for (let raw of value) {
                                this.rpcOrigins.add(raw);
                            }
                        }
                        else {
                            if (value.length) {
                                this.rpcOrigins = new baseset_1.BaseSet(value);
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.THIRD_PARTY_SKUS:
                    {
                        if (this.thirdPartySkus) {
                            this.thirdPartySkus.clear();
                        }
                        else {
                            this.thirdPartySkus = new basecollection_1.BaseCollection();
                        }
                        for (let raw of value) {
                            const thirdPartySku = new ApplicationThirdPartySku(this, raw);
                            this.thirdPartySkus.set(thirdPartySku.key, thirdPartySku);
                        }
                    }
                    ;
                    return;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Application = Application;
const keysApplicationThirdPartySku = new baseset_1.BaseSet([
    constants_1.DiscordKeys.DISTRIBUTOR,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.SKU,
]);
class ApplicationThirdPartySku extends basestructure_1.BaseStructure {
    constructor(application, data) {
        super(application.client);
        this._keys = keysApplicationThirdPartySku;
        this.id = null;
        this.sku = null; // deprecated
        this.application = application;
        this.merge(data);
        Object.defineProperty(this, 'application', { enumerable: false, writable: false });
    }
    get key() {
        return `${this.distributor}.${this.id || ''}`;
    }
    get name() {
        if (this.distributor in constants_1.DistributorNames) {
            return constants_1.DistributorNames[this.distributor];
        }
        return this.distributor;
    }
    get url() {
        if (this.distributor in constants_1.DistributorUrls) {
            const url = constants_1.DistributorUrls[this.distributor];
            switch (this.distributor) {
                case constants_1.Distributors.BATTLENET:
                    {
                        // use name
                        let skuId;
                        if (this.application.name in exports.SpecialThirdPartySkus) {
                            skuId = exports.SpecialThirdPartySkus[this.application.name];
                        }
                        else {
                            skuId = this.application.name.replace(/ /g, '-').toLowerCase();
                        }
                        return url(skuId);
                    }
                    ;
                case constants_1.Distributors.DISCORD:
                    {
                        const skuId = this.id;
                        return url(skuId, this.application.slug);
                    }
                    ;
                case constants_1.Distributors.EPIC:
                    {
                        const skuId = this.id.toLowerCase();
                        return url(skuId);
                    }
                    ;
                case constants_1.Distributors.GOG:
                    {
                        const skuId = this.application.name.replace(/ /g, '_').toLowerCase();
                        return url(skuId);
                    }
                    ;
                case constants_1.Distributors.ORIGIN:
                    {
                        let skuId;
                        if (this.application.aliases && this.application.aliases.length) {
                            skuId = this.application.aliases.first();
                        }
                        else {
                            skuId = this.application.name;
                        }
                        return url(skuId);
                    }
                    ;
                case constants_1.Distributors.STEAM:
                    {
                        const skuId = this.id;
                        return url(skuId);
                    }
                    ;
                case constants_1.Distributors.TWITCH:
                    {
                        // they shut down lol
                    }
                    ;
                    break;
                case constants_1.Distributors.UPLAY:
                    {
                        const skuId = this.application.name;
                        return url(skuId);
                    }
                    ;
            }
        }
        return null;
    }
}
exports.ApplicationThirdPartySku = ApplicationThirdPartySku;

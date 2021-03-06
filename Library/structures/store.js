"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreApplicationAsset = exports.keysStoreApplicationAsset = exports.Sku = exports.StoreListingAsset = exports.StoreListing = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const application_1 = require("./application");
const keysStore = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ASSETS,
    constants_1.DiscordKeys.BOX_ART,
    constants_1.DiscordKeys.CAROUSEL_ITEMS,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.ENTITLEMENT_BRANCH_ID,
    constants_1.DiscordKeys.HEADER_BACKGROUND,
    constants_1.DiscordKeys.HEADER_LOGO_DARK_THEME,
    constants_1.DiscordKeys.HEADER_LOGO_LIGHT_THEME,
    constants_1.DiscordKeys.HERO_BACKGROUND,
    constants_1.DiscordKeys.HERO_VIDEO,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.PREVIEW_VIDEO,
    constants_1.DiscordKeys.SKU,
    constants_1.DiscordKeys.SUMMARY,
    constants_1.DiscordKeys.TAGLINE,
    constants_1.DiscordKeys.THUMBNAIL,
]);
/**
 * Store Listing Structure
 * Used for Store Channels ([ChannelGuildStore])
 * @category Structure
 */
class StoreListing extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysStore;
        this.assets = new basecollection_1.BaseCollection();
        this.id = '';
        this.summary = '';
        this.merge(data);
    }
    get url() {
        return this.sku.url;
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.ASSETS:
                    {
                        this.assets.clear();
                        for (let raw of value) {
                            this.assets.set(raw.id, new StoreListingAsset(this, raw));
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.SKU:
                    {
                        value = new Sku(this.client, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.BOX_ART:
                case constants_1.DiscordKeys.HEADER_BACKGROUND:
                case constants_1.DiscordKeys.HEADER_LOGO_DARK_THEME:
                case constants_1.DiscordKeys.HEADER_LOGO_LIGHT_THEME:
                case constants_1.DiscordKeys.HERO_BACKGROUND:
                case constants_1.DiscordKeys.HERO_VIDEO:
                case constants_1.DiscordKeys.PREVIEW_VIDEO:
                case constants_1.DiscordKeys.THUMBNAIL:
                    {
                        value = new StoreListingAsset(this, value);
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.StoreListing = StoreListing;
const keysStoreListingAsset = new baseset_1.BaseSet([
    constants_1.DiscordKeys.HEIGHT,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MIME_TYPE,
    constants_1.DiscordKeys.SIZE,
    constants_1.DiscordKeys.WIDTH,
]);
/**
 * Store Listing Asset Structure, used in [StoreListing]
 * @category Structure
 */
class StoreListingAsset extends basestructure_1.BaseStructure {
    constructor(storeListing, data) {
        super(storeListing.client);
        this._keys = keysStoreListingAsset;
        this.height = 0;
        this.id = '';
        this.mimeType = '';
        this.size = 0;
        this.width = 0;
        this.storeListing = storeListing;
        this.merge(data);
        Object.defineProperty(this, 'storeListing', { enumerable: false, writable: false });
    }
}
exports.StoreListingAsset = StoreListingAsset;
const keysSku = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ACCESS_TYPE,
    constants_1.DiscordKeys.APPLICATION,
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.CONTENT_RATING,
    constants_1.DiscordKeys.CONTENT_RATING_AGENCY,
    constants_1.DiscordKeys.DEPENDENT_SKU_ID,
    constants_1.DiscordKeys.FEATURES,
    constants_1.DiscordKeys.FLAGS,
    constants_1.DiscordKeys.GENRES,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.LEGAL_NOTICE,
    constants_1.DiscordKeys.LOCALES,
    constants_1.DiscordKeys.MANIFEST_LABELS,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PREMIUM,
    constants_1.DiscordKeys.PRICE,
    constants_1.DiscordKeys.RELEASE_DATE,
    constants_1.DiscordKeys.SHOW_AGE_GATE,
    constants_1.DiscordKeys.SLUG,
    constants_1.DiscordKeys.SYSTEM_REQUIREMENTS,
    constants_1.DiscordKeys.TYPE,
]);
/**
 * Sku Structure, used in [Gift] and [StoreListing]
 * @category Structure
 */
class Sku extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysSku;
        this.accessType = 0;
        this.applicationId = '';
        this.contentRatingAgency = 0;
        this.dependentSkuId = null;
        this.flags = 0;
        this.id = '';
        this.legalNotice = '';
        this.name = '';
        this.showAgeGate = false;
        this.slug = '';
        this.type = constants_1.SkuTypes.BASE;
        this.merge(data);
    }
    get url() {
        return iris_client_rest_1.Endpoints.Routes.URL + iris_client_rest_1.Endpoints.Routes.APPLICATION_STORE_LISTING_SKU(this.id, this.slug);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.APPLICATION_ID:
                    {
                        if (!this.application) {
                            if (this.client.applications.has(value)) {
                                this.application = this.client.applications.get(value);
                            }
                        }
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
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Sku = Sku;
exports.keysStoreApplicationAsset = new baseset_1.BaseSet([
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.FILENAME,
    constants_1.DiscordKeys.HEIGHT,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.MIME_TYPE,
    constants_1.DiscordKeys.SIZE,
    constants_1.DiscordKeys.WIDTH,
]);
class StoreApplicationAsset extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = exports.keysStoreApplicationAsset;
        this.applicationId = '';
        this.filename = '';
        this.height = 0;
        this.id = '';
        this.mimeType = '';
        this.size = 0;
        this.width = '';
        this.merge(data);
    }
    get url() {
        return this.urlFormat();
    }
    urlFormat(format, query) {
        format = utils_1.getFormatFromHash(this.id, format, this.client.imageFormat);
        if (this.mimeType.startsWith('video/')) {
            format = 'mp4';
        }
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ASSET_STORE(this.applicationId, this.id, format), query);
    }
    async delete() {
        return this.client.rest.deleteStoreApplicationAsset(this.applicationId, this.id);
    }
}
exports.StoreApplicationAsset = StoreApplicationAsset;

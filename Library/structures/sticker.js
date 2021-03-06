"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sticker = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const keysSticker = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ASSET,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.FORMAT_TYPE,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PACK_ID,
    constants_1.DiscordKeys.PREVIEW_ASSET,
    constants_1.DiscordKeys.TAGS,
]);
/**
 * Sticker Structure
 * @category Structure
 */
class Sticker extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysSticker;
        this.asset = '';
        this.description = '';
        this.formatType = constants_1.StickerFormats.UNKNOWN;
        this.id = '';
        this.name = '';
        this.packId = '';
        this.previewAsset = null;
        this.tags = '';
        this.merge(data);
    }
    get assetUrl() {
        return this.assetUrlFormat();
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get format() {
        switch (this.formatType) {
            case constants_1.StickerFormats.PNG: return constants_1.StickerExtensions.PNG;
            case constants_1.StickerFormats.APNG: return constants_1.StickerExtensions.APNG;
            case constants_1.StickerFormats.LOTTIE: return constants_1.StickerExtensions.LOTTIE;
            default:
                {
                    throw new Error(`Unexpected format type: ${this.formatType}`);
                }
                ;
        }
    }
    assetUrlFormat(format, query) {
        const hash = this.asset;
        if (!format) {
            format = this.format;
        }
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.STICKER(this.id, hash, this.format), query);
    }
    toString() {
        return this.name;
    }
}
exports.Sticker = Sticker;

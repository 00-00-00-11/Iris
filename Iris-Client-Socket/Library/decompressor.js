"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decompressor = void 0;
const iris_utils_1 = require("../../Iris-Utils")
const constants_1 = require("./constants");
const decompressors_1 = require("./decompressors");
class Decompressor extends iris_utils_1.EventSpewer {
    constructor(options) {
        super();
        this.closed = false;
        this.type = options.type;
        switch (this.type) {
            case constants_1.CompressTypes.ZLIB:
                {
                    this.decompressor = new decompressors_1.ZlibDecompressor(Buffer.from(constants_1.ZLIB_SUFFIX));
                    this.decompressor.on('data', (data) => this.emit('data', data));
                    this.decompressor.on('error', (error) => this.emit('error', error));
                }
                ;
                break;
            default:
                {
                    throw new Error(`Invalid Compress Type: ${this.type}`);
                }
                ;
        }
    }
    close() {
        if (!this.closed) {
            this.closed = true;
            this.decompressor.close();
            this.decompressor.removeAllListeners();
            this.removeAllListeners();
        }
    }
    feed(data) {
        this.decompressor.feed(data);
    }
    reset() {
        this.decompressor.reset();
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    static supported() {
        const supported = [constants_1.CompressTypes.ZLIB];
        return supported;
    }
}
exports.Decompressor = Decompressor;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZlibDecompressor = void 0;
const iris_utils_1 = require("../../../Iris-Utils")
const errors_1 = require("../errors");
const DependencyTypes = Object.freeze({
    PAKO: 'pako',
    ZLIB: 'zlib',
});
const ErrorCodes = Object.freeze({
    ERR_ZLIB_BINDING_CLOSED: 'ERR_ZLIB_BINDING_CLOSED',
});
const Inflate = {
    flushCode: 0,
    module: require(DependencyTypes.ZLIB),
    type: DependencyTypes.ZLIB,
};
Inflate.flushCode = Inflate.module.constants.Z_SYNC_FLUSH;
for (let type of [DependencyTypes.PAKO]) {
    try {
        Inflate.module = require(type);
        Inflate.type = type;
    }
    catch (e) { }
}
class ZlibDecompressor extends iris_utils_1.EventSpewer {
    constructor(suffix, chunkSize = 64 * 1024) {
        super();
        this.dataChunks = [];
        this.chunks = [];
        this.closed = false;
        this.flushing = false;
        this.inflate = null;
        this.chunkSize = chunkSize;
        this.suffix = suffix;
        this.initialize();
    }
    close() {
        this.closed = true;
        this.chunks.length = 0;
        this.dataChunks.length = 0;
        this.flushing = false;
        if (this.inflate) {
            switch (Inflate.type) {
                case DependencyTypes.ZLIB:
                    {
                        this.inflate.close();
                        this.inflate.removeAllListeners();
                    }
                    ;
                    break;
            }
        }
        this.inflate = null;
    }
    feed(chunk) {
        if (!this.closed && this.inflate) {
            this.chunks.push(chunk);
            this.write();
        }
    }
    initialize() {
        this.close();
        switch (Inflate.type) {
            case DependencyTypes.PAKO:
                {
                    this.inflate = new Inflate.module.Inflate({
                        chunkSize: this.chunkSize,
                    });
                }
                ;
                break;
            case DependencyTypes.ZLIB:
                {
                    this.inflate = Inflate.module.createInflate({
                        chunkSize: this.chunkSize,
                        flush: Inflate.flushCode,
                    });
                    this.inflate.on('data', this.onData.bind(this));
                    this.inflate.on('error', this.onError.bind(this));
                }
                ;
                break;
            default:
                {
                    throw new Error(`Unable to use any ${JSON.stringify(Object.values(DependencyTypes))}`);
                }
                ;
        }
        this.closed = false;
    }
    reset() {
        this.initialize();
    }
    write() {
        if ((this.closed) ||
            (!this.inflate) ||
            (!this.chunks.length) ||
            (this.flushing)) {
            return;
        }
        const chunk = this.chunks.shift();
        const isEnd = ((this.suffix.length <= chunk.length) &&
            (chunk.slice(-this.suffix.length).equals(this.suffix)));
        switch (Inflate.type) {
            case DependencyTypes.PAKO:
                {
                    this.inflate.push(chunk, isEnd && Inflate.flushCode);
                    if (isEnd) {
                        if (this.inflate.err) {
                            const error = new errors_1.InflateError(this.inflate.msg, this.inflate.err);
                            this.onError(error);
                        }
                        else {
                            this.onData(this.inflate.result);
                        }
                    }
                }
                ;
                break;
            case DependencyTypes.ZLIB:
                {
                    this.inflate.write(chunk);
                    if (isEnd) {
                        this.flushing = true;
                        this.inflate.flush(Inflate.flushCode, this.onFlush.bind(this));
                        return;
                    }
                }
                ;
                break;
        }
        this.write();
    }
    onData(data) {
        switch (Inflate.type) {
            case DependencyTypes.PAKO:
                {
                    this.emit('data', Buffer.from(data));
                }
                ;
                break;
            case DependencyTypes.ZLIB:
                {
                    this.dataChunks.push(data);
                }
                ;
                break;
        }
    }
    onError(error) {
        if (error.code === ErrorCodes.ERR_ZLIB_BINDING_CLOSED) {
            // zlib was flushing when we called .close on it
            return;
        }
        this.emit('error', error);
    }
    onFlush(error) {
        if (error) {
            return;
        }
        if (this.dataChunks.length) {
            const chunk = (this.dataChunks.length === 1) ? this.dataChunks.shift() : Buffer.concat(this.dataChunks);
            this.dataChunks.length = 0;
            this.emit('data', chunk);
        }
        this.flushing = false;
        this.write();
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.ZlibDecompressor = ZlibDecompressor;

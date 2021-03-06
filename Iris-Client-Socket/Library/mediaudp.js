"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const dgram = require("dgram");
const iris_utils_1 = require("../../Iris-Utils")
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const rtp_1 = require("./mediapackets/rtp");
const rtpcrypto_1 = require("./mediapackets/rtpcrypto");
;
class Socket extends iris_utils_1.EventSpewer {
    constructor(mediaGateway) {
        super();
        this.mediaGateway = mediaGateway;
        this.connected = false;
        this.key = null;
        this.mode = null;
        this.socket = null;
        this.ssrc = 0;
        this.transportId = null;
        Object.defineProperty(this, 'mediaGateway', {
            enumerable: false,
            writable: false,
        });
        this.caches = { audio: Buffer.alloc(5 * 1024) };
        this.headers = { audio: new rtp_1.RTPHeader({ randomize: true }) };
        this.nonces = { audio: new rtp_1.RTPNonce({ randomize: true }) };
        if (this.videoEnabled) {
            this.caches.video = Buffer.alloc(5 * 1024);
            this.headers.video = new rtp_1.RTPHeader({ randomize: true });
            this.nonces.video = new rtp_1.RTPNonce({ randomize: true });
        }
        this.codecs = {
            audio: null,
            video: null,
        };
        this.local = {
            ip: null,
            port: null,
        };
        this.remote = {
            ip: null,
            port: null,
        };
    }
    get audioSSRC() {
        return this.mediaGateway.audioSSRC;
    }
    get videoSSRC() {
        return this.mediaGateway.videoSSRC;
    }
    get rtxSSRC() {
        return this.mediaGateway.rtxSSRC;
    }
    get rtpAudioPayloadType() {
        switch (this.codecs.audio) {
            case constants_1.MediaCodecs.OPUS:
                {
                    return constants_1.RTPPayloadTypes.OPUS;
                }
                ;
        }
        return null;
    }
    get rtpVideoPayloadType() {
        switch (this.codecs.video) {
            case constants_1.MediaCodecs.VP8:
                {
                    return constants_1.RTPPayloadTypes.VP8;
                }
                ;
            case constants_1.MediaCodecs.VP9:
                {
                    return constants_1.RTPPayloadTypes.VP9;
                }
                ;
            case constants_1.MediaCodecs.H264:
                {
                    return constants_1.RTPPayloadTypes.H264;
                }
                ;
        }
        return null;
    }
    get rtpRTXPayloadType() {
        const payloadType = this.rtpVideoPayloadType;
        if (payloadType !== null) {
            return payloadType + 1;
        }
        return null;
    }
    get receiveEnabled() {
        return this.mediaGateway.receiveEnabled;
    }
    get videoEnabled() {
        return this.mediaGateway.videoEnabled;
    }
    setAudioCodec(codec) {
        if (!codec) {
            return this;
        }
        if (!constants_1.MEDIA_CODECS_AUDIO.includes(codec)) {
            this.emit(constants_1.SocketEvents.WARN, new Error(`Unsupported audio codec received: ${codec}`));
            this.mediaGateway.kill();
            return this;
        }
        this.codecs.audio = codec;
        this.headers.audio.setPayloadType(this.rtpAudioPayloadType);
        return this;
    }
    setVideoCodec(codec) {
        if (!codec) {
            return this;
        }
        if (!constants_1.MEDIA_CODECS_VIDEO.includes(codec)) {
            this.emit(constants_1.SocketEvents.WARN, new Error(`Unsupported video codec received: ${codec}`));
            this.mediaGateway.kill();
            return this;
        }
        this.codecs.video = codec;
        if (this.headers.video) {
            this.headers.video.setPayloadType(this.rtpVideoPayloadType);
        }
        return this;
    }
    setKey(value) {
        Object.defineProperty(this, 'key', {
            value: Uint8Array.from(value),
        });
        return this;
    }
    setMode(value) {
        if (!constants_1.MEDIA_ENCRYPTION_MODES.includes(value)) {
            throw new Error(`Encryption mode '${value}' is not supported.`);
        }
        Object.defineProperty(this, 'mode', { value });
        return this;
    }
    setSSRC(value) {
        Object.defineProperty(this, 'ssrc', { value });
        this.headers.audio.setSSRC(this.audioSSRC);
        if (this.headers.video) {
            this.headers.video.setSSRC(this.videoSSRC);
        }
        return this;
    }
    setTransportId(value) {
        Object.defineProperty(this, 'transportId', { value });
        return this;
    }
    connect(ip = null, port = null) {
        this.remote.ip = ip || this.remote.ip;
        this.remote.port = port || this.remote.port;
        if (this.connected) {
            this.disconnect();
        }
        const onPacket = this.onPacket.bind(this);
        const socket = this.socket = dgram.createSocket('udp4');
        this.emit(constants_1.SocketEvents.SOCKET, socket);
        socket.once('message', (packet) => {
            if (this.ssrc !== packet.readUInt32LE(0)) {
                this.emit(constants_1.SocketEvents.WARN, new Error('SSRC mismatch in ip discovery packet'));
                return;
            }
            this.local.ip = packet.slice(4, packet.indexOf(0, 4)).toString();
            this.local.port = packet.readUIntLE(packet.length - 2, 2);
            const codecs = [];
            constants_1.MEDIA_CODECS_AUDIO.forEach((codec, i) => {
                let rtpPayloadType = 0;
                switch (codec) {
                    case constants_1.MediaCodecs.OPUS:
                        {
                            rtpPayloadType = constants_1.RTPPayloadTypes.OPUS;
                        }
                        ;
                        break;
                }
                codecs.push({
                    name: codec,
                    payload_type: rtpPayloadType,
                    priority: (i + 1) * 1000,
                    type: constants_1.MediaCodecTypes.AUDIO,
                });
            });
            if (this.videoEnabled) {
                constants_1.MEDIA_CODECS_VIDEO.forEach((codec, i) => {
                    let rtpPayloadType = 0;
                    switch (codec) {
                        case constants_1.MediaCodecs.VP8:
                            {
                                rtpPayloadType = constants_1.RTPPayloadTypes.VP8;
                            }
                            ;
                            break;
                        case constants_1.MediaCodecs.VP9:
                            {
                                rtpPayloadType = constants_1.RTPPayloadTypes.VP9;
                            }
                            ;
                            break;
                        case constants_1.MediaCodecs.H264:
                            {
                                rtpPayloadType = constants_1.RTPPayloadTypes.H264;
                            }
                            ;
                            break;
                    }
                    codecs.push({
                        name: codec,
                        payload_type: rtpPayloadType,
                        priority: (i + 1) * 1000,
                        rtx_payload_type: rtpPayloadType + 1,
                        type: constants_1.MediaCodecTypes.VIDEO,
                    });
                });
            }
            this.mediaGateway.sendSelectProtocol({
                codecs,
                data: {
                    address: this.local.ip,
                    mode: this.mode,
                    port: this.local.port,
                },
                protocol: constants_1.MediaProtocols.UDP,
            });
            this.mediaGateway.sendClientConnect();
            socket.on('message', onPacket);
            this.emit(constants_1.SocketEvents.READY);
        });
        socket.on('close', () => {
            this.connected = false;
            socket.removeListener('message', onPacket);
            this.emit(constants_1.SocketEvents.CLOSE);
        });
        socket.on('error', (error) => {
            this.emit(constants_1.SocketEvents.WARN, error);
        });
        this.connected = true;
        const ipDiscovery = Buffer.alloc(70);
        ipDiscovery.writeUIntBE(this.ssrc, 0, 4);
        this.send(ipDiscovery);
        return this;
    }
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.headers.audio.reset();
        if (this.headers.video) {
            this.headers.video.reset();
        }
        this.connected = false;
    }
    onPacket(packet, from) {
        if (!this.receiveEnabled) {
            return;
        }
        if (from.address !== this.remote.ip || from.port !== this.remote.port) {
            const error = new errors_1.MediaPacketError('Received a packet from an unknown IP/Port', from, packet);
            this.emit(constants_1.SocketEvents.WARN, error);
            return;
        }
        if (!this.key) {
            const error = new errors_1.MediaPacketError('Received a packet before the Session Description', from, packet);
            this.emit(constants_1.SocketEvents.WARN, error);
            return;
        }
        if (packet.length <= 12) {
            const error = new errors_1.MediaPacketError('Received an rtp packet that\'s way too small to be valid', from, packet);
            this.emit(constants_1.SocketEvents.WARN, error);
            return;
        }
        if (!rtp_1.isValidRTPHeader(packet)) {
            const error = new errors_1.MediaPacketError('Invalid RTP Packet', from, packet);
            this.emit(constants_1.SocketEvents.WARN, error);
            return;
        }
        const packetType = packet.readUIntBE(1, 1);
        if (constants_1.RTCP_PACKET_TYPES.includes(packetType)) {
        }
        else {
            const rtp = {
                header: new rtp_1.RTPHeader({ buffer: packet.slice(0, 12) }),
            };
            let payloadType = rtp.header.payloadType;
            /*
            // unknown if this is how it is now
            let isRTX = false;
            if (payloadType === this.rtxPayloadType) {
              payloadType -= 1;
              isRTX = true;
            }
            */
            if (!constants_1.RTP_PAYLOAD_TYPES.includes(payloadType)) {
                const error = new errors_1.MediaRTPError('Unknown RTP Packet Payload Type', from, packet, rtp);
                this.emit(constants_1.SocketEvents.WARN, error);
                return;
            }
            let codec = null;
            let format = null;
            switch (payloadType) {
                case constants_1.RTPPayloadTypes.OPUS:
                    {
                        codec = constants_1.MediaCodecs.OPUS;
                        format = constants_1.MediaCodecTypes.AUDIO;
                    }
                    ;
                    break;
                case constants_1.RTPPayloadTypes.VP8:
                    {
                        codec = constants_1.MediaCodecs.VP8;
                        format = constants_1.MediaCodecTypes.VIDEO;
                    }
                    ;
                    break;
                case constants_1.RTPPayloadTypes.VP9:
                    {
                        codec = constants_1.MediaCodecs.VP9;
                        format = constants_1.MediaCodecTypes.VIDEO;
                    }
                    ;
                    break;
                case constants_1.RTPPayloadTypes.H264:
                    {
                        codec = constants_1.MediaCodecs.H264;
                        format = constants_1.MediaCodecTypes.VIDEO;
                    }
                    ;
                    break;
            }
            if (format === constants_1.MediaCodecTypes.VIDEO && !this.videoEnabled) {
                const error = new errors_1.MediaRTPError('Dropping video packet due to video not being enabled', from, packet, rtp);
                this.emit(constants_1.SocketEvents.LOG, error);
                return;
            }
            rtp.nonce = Buffer.alloc(24);
            switch (this.mode) {
                case constants_1.MediaEncryptionModes.XSALSA20_POLY1305_LITE:
                    {
                        // last 4 bytes
                        packet.copy(rtp.nonce, 0, packet.length - 4);
                        rtp.payload = packet.slice(12, -4);
                    }
                    ;
                    break;
                case constants_1.MediaEncryptionModes.XSALSA20_POLY1305_SUFFIX:
                    {
                        // last 24 bytes
                        packet.copy(rtp.nonce, 0, packet.length - 24);
                        rtp.payload = packet.slice(12, -24);
                    }
                    ;
                    break;
                case constants_1.MediaEncryptionModes.XSALSA20_POLY1305:
                    {
                        // first 12 bytes, the rtp header
                        // currently broken for some reason
                        packet.copy(rtp.nonce, 0, 0, 12);
                        rtp.payload = packet.slice(12);
                    }
                    ;
                    break;
                default:
                    {
                        const error = new errors_1.MediaRTPError(`${this.mode} is not supported for decoding.`, from, packet, rtp);
                        this.emit(constants_1.SocketEvents.WARN, error);
                        return;
                    }
                    ;
            }
            let data = rtpcrypto_1.default.decrypt(this.key, rtp.payload, rtp.nonce);
            if (!data) {
                const error = new errors_1.MediaRTPError('Packet failed to decrypt', from, packet, rtp);
                this.emit(constants_1.SocketEvents.WARN, error);
                return;
            }
            if (rtp.header.padding) {
                // RFC3550 Section 5.1
                // last byte contains amount of padding, including itself, slice that stuff off
                data = data.slice(0, data.length - data.readUIntBE(data.length - 1, 1));
            }
            if (rtp.header.extension) {
                if (constants_1.RTPHeaderExtensionOneByte.HEADER.every((header, i) => header === data[i])) {
                    // RFC5285 Section 4.2: One-Byte Header
                    const fieldAmount = data.readUIntBE(2, 2);
                    // const fields: Array<Buffer> = [];
                    // Unknown as to what each field is
                    let offset = 4;
                    for (let i = 0; i < fieldAmount; i++) {
                        const byte = data.readUIntBE(offset++, 1);
                        const identifer = byte & constants_1.RTPHeaderExtensionOneByte.LOCAL_IDENTIFER;
                        const len = ((byte >> 4) & constants_1.RTPHeaderExtensionOneByte.LOCAL_IDENTIFER) + 1;
                        // ignore rest if identifier === 15 (local identifer)
                        if (identifer === constants_1.RTPHeaderExtensionOneByte.LOCAL_IDENTIFER) {
                            break;
                        }
                        // skip the field data since we don't know what to do with it
                        offset += len;
                        // fields.push(data.slice(offset, offset += len));
                        /*
                        // apparently discord's padding isn't actually padding from the RFC..
                        // is just padding
                        while (data[offset] === 0) {
                          offset++;
                        }
                        */
                    }
                    // https://github.com/discordjs/discord.js/pull/3555
                    offset++;
                    data = data.slice(offset);
                    // do something here with the fields, then clear it
                    // fields.length = 0;
                }
                else if (constants_1.RTPHeaderExtensionTwoByte.HEADER.every((header, i) => header === data[i])) {
                    // RFC5285 Section 4.3: Two-Byte Header not received yet, appbits unknown anyways
                    // using two bytes, 0x10 and 0x00 instead
                    // if appbits is all 0s, ignore, so rn ignore this packet
                    const error = new errors_1.MediaRTPError('Received Two Byte header with appbits being 0, ignoring', from, packet, rtp);
                    this.emit(constants_1.SocketEvents.LOG, error);
                    return;
                    /*
                    // handle the two byte
                    const fields = [];
                    const fieldAmount = data.readUIntBE(2, 2);
                    let offset = 4;
                    for (let i = 0; i < fieldAmount; i++) {
                      const identifier = data.readUIntBE(offset++, 1);
                      const len = data.readUIntBE(offset++, 1);
                      if (!len) {continue;}
                      fields.push(data.slice(offset, offset + len));
                      offset += len;
                      while (data[offset] === 0) {offset++;}
                    }
                    if (offset !== data.length) {
                      fields.push(data.slice(offset));
                      //just making sure, dunno tho
                    }
                    
                    data = (fields.length <= 1) ? fields.shift() : Buffer.concat(fields);
                    fields.length = 0;
                    */
                }
            }
            let userId = null;
            if (format !== null) {
                switch (format) {
                    case constants_1.MediaCodecTypes.AUDIO:
                        {
                            userId = this.mediaGateway.ssrcToUserId(rtp.header.ssrc, constants_1.MediaSSRCTypes.AUDIO);
                        }
                        ;
                        break;
                    case constants_1.MediaCodecTypes.VIDEO:
                        {
                            userId = this.mediaGateway.ssrcToUserId(rtp.header.ssrc, constants_1.MediaSSRCTypes.VIDEO);
                        }
                        ;
                        break;
                }
            }
            this.emit(constants_1.SocketEvents.PACKET, {
                codec,
                data,
                format,
                from,
                rtp,
                userId,
            });
        }
    }
    send(packet) {
        if (!this.connected || !this.socket) {
            throw new Error('UDP is not connected yet!');
        }
        this.socket.send(packet, 0, packet.length, this.remote.port, this.remote.ip, (error, bytes) => {
            if (error) {
                this.emit(constants_1.SocketEvents.WARN, error);
            }
        });
    }
    sendAudioFrame(packet, options) {
        this.sendFrame(packet, Object.assign({}, options, { type: constants_1.MediaCodecTypes.AUDIO }));
    }
    sendVideoFrame(packet, options) {
        this.sendFrame(packet, Object.assign({}, options, { type: constants_1.MediaCodecTypes.VIDEO }));
    }
    sendFrame(packet, options = {}) {
        if (!this.connected) {
            return;
        }
        if (!this.key) {
            throw new Error('Haven\'t received the session description yet');
        }
        const type = options.type;
        if (type !== constants_1.MediaCodecTypes.AUDIO && type !== constants_1.MediaCodecTypes.VIDEO) {
            throw new Error('Invalid frame type');
        }
        let useCache = options.useCache || options.useCache === undefined;
        if (type === constants_1.MediaCodecTypes.VIDEO && !this.videoEnabled) {
            throw new Error('Cannot send in video frames when video is disabled!');
        }
        const cache = {};
        switch (type) {
            case constants_1.MediaCodecTypes.AUDIO:
                {
                    cache.header = this.headers.audio;
                    cache.nonce = this.nonces.audio;
                    cache.payload = this.caches.audio;
                }
                ;
                break;
            case constants_1.MediaCodecTypes.VIDEO:
                {
                    cache.header = this.headers.video;
                    cache.nonce = this.nonces.video;
                    cache.payload = this.caches.video;
                }
                ;
                break;
            default:
                {
                    throw new Error(`Invalid type ${type}`);
                }
                ;
        }
        cache.header = cache.header;
        cache.nonce = cache.nonce;
        cache.payload = cache.payload;
        const rtp = {};
        if (useCache) {
            rtp.header = cache.header;
            rtp.nonce = cache.nonce;
        }
        else {
            let payloadType, ssrc;
            switch (type) {
                case constants_1.MediaCodecTypes.AUDIO:
                    {
                        payloadType = this.rtpAudioPayloadType;
                        ssrc = this.audioSSRC;
                    }
                    ;
                    break;
                case constants_1.MediaCodecTypes.VIDEO:
                    {
                        payloadType = this.rtpVideoPayloadType;
                        ssrc = this.videoSSRC;
                    }
                    ;
                    break;
                default:
                    {
                        throw new Error(`Invalid type ${type}`);
                    }
                    ;
            }
            rtp.header = new rtp_1.RTPHeader({ payloadType, ssrc });
            rtp.nonce = new rtp_1.RTPNonce({ randomize: true });
        }
        rtp.header = rtp.header;
        rtp.nonce = rtp.nonce;
        if (!useCache && cache.header) {
            if (options.sequence === undefined) {
                options.sequence = cache.header.sequence;
                options.incrementSequence = false;
            }
            if (options.timestamp === undefined) {
                options.timestamp = cache.header.timestamp;
                options.incrementTimestamp = false;
            }
        }
        rtp.header.setSequence(options.sequence, options.incrementSequence);
        rtp.header.setTimestamp(options.timestamp, options.incrementTimestamp);
        const data = [];
        const payloadDataCache = (useCache) ? cache.payload.slice(12) : null;
        let nonce;
        switch (this.mode) {
            case constants_1.MediaEncryptionModes.XSALSA20_POLY1305_LITE:
                {
                    nonce = rtp.nonce.set(options.nonce, options.incrementNonce);
                    data.push(nonce.slice(0, 4));
                }
                ;
                break;
            case constants_1.MediaEncryptionModes.XSALSA20_POLY1305_SUFFIX:
                {
                    nonce = rtp.nonce.generate();
                    data.push(nonce);
                }
                ;
                break;
            case constants_1.MediaEncryptionModes.XSALSA20_POLY1305:
                {
                    rtp.header.copy(rtp.nonce.buffer);
                    nonce = rtp.nonce.buffer;
                }
                ;
                break;
            default:
                {
                    throw new Error(`${this.mode} is not supported for encoding.`);
                }
                ;
        }
        data.unshift(rtpcrypto_1.default.encrypt(this.key, packet, nonce, payloadDataCache));
        let buffer;
        if (useCache) {
            let total = rtp.header.length;
            rtp.header.copy(cache.payload);
            data.forEach((buf) => {
                const start = total;
                total += buf.length;
                if (buf instanceof Buffer) {
                    buf.copy(cache.payload, start);
                }
            });
            buffer = cache.payload.slice(0, total);
        }
        else {
            const buffers = [rtp.header.buffer, ...data].map((buffer) => {
                if (buffer instanceof Buffer) {
                    return buffer;
                }
                return buffer.packet;
            });
            buffer = Buffer.concat(buffers);
        }
        this.send(buffer);
    }
    sendAudioSilenceFrame() {
        this.sendFrame(Buffer.from(constants_1.MediaSilencePacket), {
            incrementTimestamp: true,
            timestamp: 960,
            type: constants_1.MediaCodecTypes.AUDIO,
        });
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
}
exports.Socket = Socket;

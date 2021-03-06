"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocket = exports.WebsocketDependency = exports.DependencyTypes = void 0;
const iris_utils_1 = require("../../Iris-Utils")
const constants_1 = require("./constants");
var DependencyTypes;
(function (DependencyTypes) {
    DependencyTypes["UWS"] = "uws";
    DependencyTypes["WS"] = "ws";
})(DependencyTypes = exports.DependencyTypes || (exports.DependencyTypes = {}));
exports.WebsocketDependency = {
    module: null,
    type: null,
};
[
    DependencyTypes.WS,
    DependencyTypes.UWS,
].forEach((dependency) => {
    try {
        exports.WebsocketDependency.module = require(dependency);
        exports.WebsocketDependency.type = dependency;
    }
    catch (e) { }
});
if (exports.WebsocketDependency.module === null) {
    throw new Error(`Missing a WebSocket Dependency, pick one: ${JSON.stringify(Object.values(DependencyTypes))}`);
}
class BaseSocket extends iris_utils_1 .EventSpewer {
    constructor(url) {
        super();
        this.pings = new iris_utils_1 .BaseCollection();
        this.socket = new exports.WebsocketDependency.module(url);
        this.socket.on(constants_1.SocketEventsBase.CLOSE, this.onClose.bind(this));
        this.socket.on(constants_1.SocketEventsBase.PONG, this.onPong.bind(this));
        this.socket.on(constants_1.SocketEventsBase.ERROR, this.emit.bind(this, constants_1.SocketEventsBase.ERROR));
        this.socket.on(constants_1.SocketEventsBase.MESSAGE, this.emit.bind(this, constants_1.SocketEventsBase.MESSAGE));
        this.socket.on(constants_1.SocketEventsBase.OPEN, this.emit.bind(this, constants_1.SocketEventsBase.OPEN));
        this.socket.on(constants_1.SocketEventsBase.PING, this.emit.bind(this, constants_1.SocketEventsBase.PING));
    }
    get closed() {
        return this.socket.readyState === this.socket.CLOSED;
    }
    get closing() {
        return this.socket.readyState === this.socket.CLOSING;
    }
    get connected() {
        return this.socket.readyState === this.socket.OPEN;
    }
    get connecting() {
        return this.socket.readyState === this.socket.CONNECTING;
    }
    get using() {
        if (!exports.WebsocketDependency.type) {
            throw new Error(`Missing a WebSocket Dependency, pick one: ${JSON.stringify(Object.values(DependencyTypes))}`);
        }
        return exports.WebsocketDependency.type;
    }
    send(data, callback) {
        if (this.connected) {
            this.socket.send(data, {}, callback);
        }
    }
    close(code = constants_1.SocketCloseCodes.NORMAL, reason = '') {
        if (this.connected) {
            this.socket.close(code, reason);
        }
    }
    onClose(code, message) {
        for (const [nonce, { reject }] of this.pings) {
            reject(new Error('Socket has closed.'));
            this.pings.delete(nonce);
        }
        this.pings.clear();
        this.socket.removeAllListeners();
        this.emit(constants_1.SocketEventsBase.CLOSE, code, message);
        this.removeAllListeners();
    }
    onPong(data) {
        try {
            const { nonce } = JSON.parse(String(data));
            const ping = this.pings.get(nonce);
            if (ping) {
                ping.resolve();
                this.pings.delete(nonce);
            }
        }
        catch (e) {
            // malformed ping?
        }
        this.emit(constants_1.SocketEventsBase.PONG, data);
    }
    async ping(timeout = 1000) {
        if (!this.connected) {
            throw new Error('Socket isn\'t connected.');
        }
        const nonce = `${Date.now()}.${Math.random().toString(36)}`;
        return new Promise((resolve, reject) => {
            const expire = new iris_utils_1 .Timers.Timeout();
            if (timeout) {
                expire.start(timeout, () => {
                    this.pings.delete(nonce);
                    reject(new Error(`Pong took longer than ${timeout}ms.`));
                });
            }
            const now = Date.now();
            new Promise((res, rej) => {
                this.pings.set(nonce, { resolve: res, reject: rej });
                this.socket.ping(JSON.stringify({ nonce }));
            }).then(() => {
                expire.stop();
                resolve(Math.round(Date.now() - now));
            });
        });
    }
    terminate() {
        return this.socket.terminate();
    }
}
exports.BaseSocket = BaseSocket;

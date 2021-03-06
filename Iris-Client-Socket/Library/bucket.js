"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bucket = void 0;
const iris_utils_1 = require("../../Iris-Utils")
class Bucket {
    constructor(limit = 0, delay = 0) {
        this.timeout = new iris_utils_1.Timers.Timeout();
        this.delay = delay;
        this.limit = limit;
        this.locked = false;
        this.queue = [];
        this.sent = {
            amount: 0,
            reset: 0,
        };
        Object.defineProperties(this, {
            timeout: { enumerable: false },
        });
    }
    add(throttled, unshift = false) {
        if (unshift) {
            this.queue.unshift(throttled);
        }
        else {
            this.queue.push(throttled);
        }
        this.shift();
    }
    clear() {
        this.queue.length = 0;
    }
    lock(unlockIn = 0) {
        this.timeout.stop();
        this.locked = true;
        if (unlockIn) {
            this.timeout.start(unlockIn, () => {
                this.unlock();
            });
        }
    }
    shift() {
        if (this.locked) {
            return;
        }
        if (!this.queue.length) {
            return;
        }
        if (this.limit) {
            const now = Date.now();
            if (this.sent.reset + this.delay <= now) {
                this.sent.reset = now;
                this.sent.amount = 0;
            }
            if (this.limit <= ++this.sent.amount) {
                const diff = Math.max(this.delay - (now - this.sent.reset), 0);
                if (diff) {
                    this.lock(diff);
                }
            }
        }
        const throttled = this.queue.shift();
        if (throttled) {
            throttled();
            this.shift();
        }
    }
    unlock() {
        this.locked = false;
        this.shift();
    }
}
exports.Bucket = Bucket;

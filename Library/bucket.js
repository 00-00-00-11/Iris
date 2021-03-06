"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bucket = void 0;
const iris_utils_1 = require("../Iris-Utils");
class Bucket {
    constructor(limit = 0, delay = 0, wait = false) {
        this.queue = [];
        this.timeout = new iris_utils_1.Timers.Timeout();
        this.executing = false;
        this.locked = false;
        this.sent = {
            amount: 0,
            last: 0,
        };
        this.delay = delay;
        this.limit = limit;
        this.wait = wait;
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
        if (this.executing || this.locked) {
            return;
        }
        if (!this.queue.length) {
            return;
        }
        const throttled = this.queue.shift();
        if (throttled) {
            if (this.wait) {
                this.executing = true;
                Promise.resolve(throttled())
                    .catch(() => { })
                    .then(() => {
                    this.executing = false;
                    this.tryLock();
                    this.shift();
                });
            }
            else {
                this.tryLock();
                throttled();
                this.shift();
            }
        }
    }
    tryLock() {
        if (this.limit) {
            const now = Date.now();
            if (this.sent.last + this.delay <= now) {
                this.sent.amount = 0;
                this.sent.last = now;
            }
            if (this.limit <= ++this.sent.amount) {
                const diff = Math.max(this.delay - (now - this.sent.last), 0);
                if (diff) {
                    this.lock(diff);
                }
            }
        }
    }
    unlock() {
        this.locked = false;
        this.shift();
    }
}
exports.Bucket = Bucket;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.deconstruct = exports.generate = void 0;
const constants_1 = require("./constants");
const bits = Object.freeze({
    timestamp: 42n,
    workerId: 5n,
    processId: 5n,
    sequence: 12n,
});
const shift = Object.freeze({
    timestamp: bits.processId + bits.workerId + bits.sequence,
    workerId: bits.workerId + bits.sequence,
    processId: bits.sequence,
    sequence: 0n,
});
const max = Object.freeze({
    timestamp: 0x40000000000n,
    processId: -1n ^ (-1n << bits.processId),
    sequence: -1n ^ (-1n << bits.sequence),
    workerId: -1n ^ (-1n << bits.workerId),
});
const cache = {
    sequence: 0n,
};
function generate(options = {}) {
    options = Object.assign({
        epoch: constants_1.DISCORD_SNOWFLAKE_EPOCH,
        processId: 0,
        timestamp: Date.now(),
        workerId: 0,
    }, options);
    const epoch = BigInt(options.epoch);
    const processId = BigInt(options.processId) & max.processId;
    const timestamp = (BigInt(options.timestamp) - epoch) % max.timestamp;
    const workerId = BigInt(options.workerId) & max.workerId;
    let sequence;
    if (options.sequence === undefined) {
        sequence = cache.sequence = ++cache.sequence & max.sequence;
    }
    else {
        sequence = BigInt(options.sequence) & max.sequence;
    }
    const snowflake = {
        id: '',
        processId: Number(processId),
        sequence: Number(sequence),
        timestamp: Number(timestamp),
        workerId: Number(workerId),
    };
    snowflake.id = String((timestamp << shift.timestamp) |
        (workerId << shift.workerId) |
        (processId << shift.processId) |
        (sequence << shift.sequence));
    return snowflake;
}
exports.generate = generate;
function deconstruct(id, options = {}) {
    options = Object.assign({
        epoch: constants_1.DISCORD_SNOWFLAKE_EPOCH,
    }, options);
    const epoch = BigInt(options.epoch);
    const snowflake = BigInt(id);
    return {
        id,
        processId: Number((snowflake & 0x1f000n) >> shift.processId),
        sequence: Number(snowflake & 0xfffn),
        timestamp: Number((snowflake >> shift.timestamp) + epoch),
        workerId: Number((snowflake & 0x3e0000n) >> shift.workerId),
    };
}
exports.deconstruct = deconstruct;
function timestamp(id, options = {}) {
    options = Object.assign({
        epoch: constants_1.DISCORD_SNOWFLAKE_EPOCH,
    }, options);
    const epoch = BigInt(options.epoch);
    if (id) {
        return Number((BigInt(id) >> shift.timestamp) + epoch);
    }
    return 0;
}
exports.timestamp = timestamp;

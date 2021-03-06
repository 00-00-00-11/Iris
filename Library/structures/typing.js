"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typing = void 0;
const iris_utils_1 = require("../../Iris-Utils");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const basestructure_1 = require("./basestructure");
const member_1 = require("./member");
const keysTyping = new baseset_1.BaseSet([
    constants_1.DiscordKeys.CHANNEL_ID,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.MEMBER,
    constants_1.DiscordKeys.STARTED,
    constants_1.DiscordKeys.STOPPED,
    constants_1.DiscordKeys.TIMESTAMP,
    constants_1.DiscordKeys.USER,
    constants_1.DiscordKeys.USER_ID,
]);
const keysMergeTyping = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
]);
/**
 * Channel Typing Structure
 * used to tell you when someone starts typing in a channel
 * @category Structure
 */
class Typing extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysTyping;
        this._keysMerge = keysMergeTyping;
        this.timeout = new iris_utils_1.Timers.Timeout();
        this.channelId = '';
        this.started = 0;
        this.stopped = 0;
        this.timestamp = 0;
        this.userId = '';
        this.merge(data);
        Object.defineProperty(this, 'timeout', { enumerable: false });
    }
    get channel() {
        return this.client.channels.get(this.channelId) || null;
    }
    get guild() {
        if (this.guildId) {
            return this.client.guilds.get(this.guildId) || null;
        }
        return null;
    }
    get shouldStopAt() {
        return this.timestamp + constants_1.TYPING_TIMEOUT;
    }
    get user() {
        return this.client.users.get(this.userId) || null;
    }
    _stop(emit = true) {
        if (!this.stopped) {
            this.stopped = Date.now();
            this.timeout.stop();
            const cache = this.client.typings.get(this.channelId);
            if (cache) {
                cache.delete(this.userId);
                if (!cache.length) {
                    this.client.typings.delete(this.channelId);
                }
            }
            if (emit) {
                const payload = { typing: this };
                this.client.emit(constants_1.ClientEvents.TYPING_STOP, payload);
            }
        }
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.MEMBER:
                    {
                        const guildId = this.guildId;
                        let member;
                        if (this.client.members.has(guildId, value.user.id)) {
                            member = this.client.members.get(guildId, value.user.id);
                            member.merge(value);
                        }
                        else {
                            value.guild_id = guildId;
                            member = new member_1.Member(this.client, value);
                            this.client.members.insert(member);
                        }
                        value = member;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.TIMESTAMP:
                    {
                        value *= 1000;
                        if (!this.started) {
                            this.started = value;
                        }
                        this.timeout.start(constants_1.TYPING_TIMEOUT, () => this._stop());
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Typing = Typing;

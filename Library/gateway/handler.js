"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayDispatchHandler = exports.GatewayHandler = void 0;
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const structures_1 = require("../structures");
/**
 * Gateway Handler
 * @category Handler
 */
class GatewayHandler {
    constructor(client, options = {}) {
        this._chunksWaiting = new basecollection_1.BaseCollection();
        this.loadAllMembers = false;
        // I've witnessed some duplicate events happening with almost a second in between
        // Some member add/remove events might not even happen due to "State Repair"
        this.duplicateMemberEventsCache = new basecollection_1.BaseCollection({ expire: 2000 });
        this.client = client;
        this.client.gateway.on('killed', this.onKilled.bind(this));
        this.client.gateway.on('packet', this.onPacket.bind(this));
        this.dispatchHandler = new GatewayDispatchHandler(this);
        this.disabledEvents = new baseset_1.BaseSet((options.disabledEvents || []).map((v) => {
            return v.toUpperCase();
        }));
        this.loadAllMembers = !!options.loadAllMembers;
        if (options.whitelistedEvents) {
            this.disabledEvents.clear();
            for (let event of Object.values(constants_1.GatewayDispatchEvents)) {
                this.disabledEvents.add(event);
            }
            for (let event of options.whitelistedEvents) {
                this.disabledEvents.delete(event.toUpperCase());
            }
        }
        this.disabledEvents.delete(constants_1.GatewayDispatchEvents.READY);
    }
    get shouldLoadAllMembers() {
        return this.loadAllMembers && this.client.gateway.guildSubscriptions;
    }
    onKilled(payload) {
        this.client.kill(payload.error);
    }
    onPacket(packet) {
        if (packet.op !== constants_1.GatewayOpCodes.DISPATCH) {
            return;
        }
        const { d: data, t: name } = packet;
        if (this.client.hasEventListener(constants_1.ClientEvents.RAW)) {
            this.client.emit(constants_1.ClientEvents.RAW, packet);
        }
        if (!this.disabledEvents.has(name)) {
            if (name in this.dispatchHandler) {
                this.dispatchHandler[name](data);
            }
            else {
                this.client.emit(constants_1.ClientEvents.UNKNOWN, packet);
            }
        }
    }
}
exports.GatewayHandler = GatewayHandler;
/**
 * Gateway Dispatch Handler
 * @category Handlers
 */
class GatewayDispatchHandler {
    constructor(handler) {
        this.handler = handler;
    }
    get client() {
        return this.handler.client;
    }
    /* Dispatch Events */
    async [constants_1.GatewayDispatchEvents.READY](data) {
        this.client.reset();
        for (let [nonce, cache] of this.handler._chunksWaiting) {
            cache.promise.reject(new Error('Gateway re-identified before a result came.'));
        }
        this.handler._chunksWaiting.clear();
        let me;
        if (this.client.user) {
            me = this.client.user;
            me.merge(data['user']);
        }
        else {
            me = new structures_1.UserMe(this.client, data['user']);
            this.client.user = me;
        }
        this.client.users.insert(me); // since we reset the cache
        Object.defineProperty(this.client, '_isBot', { value: me.bot });
        const authType = (this.client.isBot) ? constants_1.AuthTypes.BOT : constants_1.AuthTypes.USER;
        this.client.rest.setAuthType(authType);
        // data['analytics_token']
        if (this.client.connectedAccounts.enabled && data['connected_accounts']) {
            for (let raw of data['connected_accounts']) {
                const account = new structures_1.ConnectedAccount(this.client, raw);
                this.client.connectedAccounts.insert(account);
            }
        }
        if (this.client.guilds.enabled) {
            for (let raw of data['guilds']) {
                let guild;
                if (this.client.guilds.has(raw.id)) {
                    guild = this.client.guilds.get(raw.id);
                    guild.merge(raw);
                }
                else {
                    guild = new structures_1.Guild(this.client, raw);
                    this.client.guilds.insert(guild);
                }
                guild.isReady = guild.memberCount === guild.members.length;
                if (guild.isReady) {
                    // emit guild ready
                }
                else {
                    if (this.handler.shouldLoadAllMembers) {
                        this.client.gateway.requestGuildMembers(guild.id, {
                            limit: 0,
                            presences: true,
                            query: '',
                        });
                    }
                }
            }
        }
        if (this.client.notes.enabled && data['notes']) {
            for (let userId in data['notes']) {
                this.client.notes.insert(userId, data['notes'][userId]);
            }
        }
        if (this.client.presences.enabled && data['presences']) {
            for (let raw of data['presences']) {
                this.client.presences.insert(raw);
            }
        }
        if (this.client.channels.enabled && data['private_channels']) {
            for (let raw of data['private_channels']) {
                if (this.client.channels.has(raw.id)) {
                    this.client.channels.get(raw.id).merge(raw);
                }
                else {
                    this.client.channels.insert(structures_1.createChannelFromData(this.client, raw));
                }
            }
        }
        if (this.client.relationships.enabled && data['relationships']) {
            for (let raw of data['relationships']) {
                if (this.client.relationships.has(raw.id)) {
                    this.client.relationships.get(raw.id).merge(raw);
                }
                else {
                    this.client.relationships.insert(new structures_1.Relationship(this.client, raw));
                }
            }
        }
        if (this.client.sessions.enabled && data['sessions']) {
            for (let raw of data['sessions']) {
                this.client.sessions.insert(new structures_1.Session(this.client, raw));
            }
        }
        if (data['user_settings']) {
        }
        if (this.client.isBot) {
            try {
                if (this.client.cluster) {
                    await this.client.cluster.fillOauth2Application();
                }
                else {
                    await this.client.rest.fetchOauth2Application();
                }
            }
            catch (error) {
                const payload = { error: new errors_1.GatewayHTTPError('Failed to fetch OAuth2 Application Information', error) };
                this.client.emit(constants_1.ClientEvents.WARN, payload);
            }
        }
        else {
            this.client.owners.set(me.id, me);
            this.client.requiredAction = data['required_action'];
        }
        try {
            if (this.client.cluster) {
                await this.client.cluster.fillApplications();
            }
            else {
                await this.client.applications.fill();
            }
        }
        catch (error) {
            const payload = { error: new errors_1.GatewayHTTPError('Failed to fetch Applications', error) };
            this.client.emit(constants_1.ClientEvents.WARN, payload);
        }
        const payload = { raw: data };
        this.client.emit(constants_1.ClientEvents.GATEWAY_READY, payload);
    }
    [constants_1.GatewayDispatchEvents.RESUMED](data) {
        this.client.gateway.discordTrace = data['_trace'];
        const payload = { raw: data };
        this.client.emit(constants_1.ClientEvents.GATEWAY_RESUMED, payload);
    }
    [constants_1.GatewayDispatchEvents.ACTIVITY_JOIN_INVITE](data) {
    }
    [constants_1.GatewayDispatchEvents.ACTIVITY_JOIN_REQUEST](data) {
    }
    [constants_1.GatewayDispatchEvents.ACTIVITY_START](data) {
    }
    [constants_1.GatewayDispatchEvents.BRAINTREE_POPUP_BRIDGE_CALLBACK](data) {
    }
    [constants_1.GatewayDispatchEvents.CALL_CREATE](data) {
        let call;
        if (this.client.voiceCalls.has(data['channel_id'])) {
            call = this.client.voiceCalls.get(data['channel_id']);
            call.merge(data);
        }
        else {
            call = new structures_1.VoiceCall(this.client, data);
            this.client.voiceCalls.insert(call);
        }
        const payload = { call };
        this.client.emit(constants_1.ClientEvents.CALL_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.CALL_DELETE](data) {
        let channelId = data['channel_id'];
        if (this.client.voiceCalls.has(channelId)) {
            const call = this.client.voiceCalls.get(channelId);
            call.kill();
        }
        const payload = { channelId };
        this.client.emit(constants_1.ClientEvents.CALL_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.CALL_UPDATE](data) {
        let call;
        let channelId = data['channel_id'];
        let differences = null;
        if (this.client.voiceCalls.has(data['channel_id'])) {
            call = this.client.voiceCalls.get(data['channel_id']);
            if (this.client.hasEventListener(constants_1.ClientEvents.CALL_UPDATE)) {
                differences = call.differences(data);
            }
            call.merge(data);
        }
        else {
            call = new structures_1.VoiceCall(this.client, data);
            this.client.voiceCalls.insert(call);
        }
        const payload = { call, channelId, differences };
        this.client.emit(constants_1.ClientEvents.CALL_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_CREATE](data) {
        let channel;
        if (this.client.channels.has(data['id'])) {
            channel = this.client.channels.get(data['id']);
            channel.merge(data);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
            this.client.channels.insert(channel);
        }
        const payload = { channel };
        this.client.emit(constants_1.ClientEvents.CHANNEL_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_DELETE](data) {
        let channel;
        if (this.client.channels.has(data['id'])) {
            channel = this.client.channels.get(data['id']);
            this.client.channels.delete(data['id']);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
        }
        channel.deleted = true;
        if (channel.isText) {
            for (let [messageId, message] of this.client.messages) {
                if (message.channelId === channel.id) {
                    this.client.messages.delete(messageId);
                }
            }
        }
        const payload = { channel };
        this.client.emit(constants_1.ClientEvents.CHANNEL_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_PINS_ACK](data) {
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_PINS_UPDATE](data) {
        let channel = null;
        if (this.client.channels.has(data['channel_id'])) {
            channel = this.client.channels.get(data['channel_id']);
            channel.merge({
                last_pin_timestamp: data['last_pin_timestamp'],
            });
        }
        const payload = {
            channel,
            channelId: data['channel_id'],
            guildId: data['guild_id'],
            lastPinTimestamp: data['last_pin_timestamp'],
        };
        this.client.emit(constants_1.ClientEvents.CHANNEL_PINS_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_UPDATE](data) {
        let channel;
        let differences = null;
        if (this.client.channels.has(data['id'])) {
            channel = this.client.channels.get(data['id']);
            if (this.client.hasEventListener(constants_1.ClientEvents.CHANNEL_UPDATE)) {
                differences = channel.differences(data);
            }
            channel.merge(data);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
            this.client.channels.insert(channel);
        }
        const payload = { channel, differences };
        this.client.emit(constants_1.ClientEvents.CHANNEL_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_RECIPIENT_ADD](data) {
        let channel = null;
        const channelId = data['channel_id'];
        const nick = data['nick'] || null;
        let user;
        if (this.client.users.has(data['user']['id'])) {
            user = this.client.users.get(data['user']['id']);
            user.merge(data);
        }
        else {
            user = new structures_1.User(this.client, data);
            this.client.users.insert(user);
        }
        if (this.client.channels.has(channelId)) {
            channel = this.client.channels.get(channelId);
            channel.recipients.set(user.id, user);
            if (nick) {
                channel.nicks.set(user.id, nick);
            }
            else {
                channel.nicks.delete(user.id);
            }
        }
        const payload = {
            channel,
            channelId,
            nick,
            user,
        };
        this.client.emit(constants_1.ClientEvents.CHANNEL_RECIPIENT_ADD, payload);
    }
    [constants_1.GatewayDispatchEvents.CHANNEL_RECIPIENT_REMOVE](data) {
        let channel = null;
        const channelId = data['channel_id'];
        const nick = data['nick'] || null;
        let user;
        if (this.client.users.has(data['user']['id'])) {
            user = this.client.users.get(data['user']['id']);
            user.merge(data);
        }
        else {
            user = new structures_1.User(this.client, data);
            this.client.users.insert(user);
        }
        if (this.client.channels.has(channelId)) {
            channel = this.client.channels.get(channelId);
            channel.recipients.delete(user.id);
            channel.nicks.delete(user.id);
        }
        const payload = {
            channel,
            channelId,
            nick,
            user,
        };
        this.client.emit(constants_1.ClientEvents.CHANNEL_RECIPIENT_REMOVE, payload);
    }
    [constants_1.GatewayDispatchEvents.ENTITLEMENT_CREATE](data) {
    }
    [constants_1.GatewayDispatchEvents.ENTITLEMENT_DELETE](data) {
    }
    [constants_1.GatewayDispatchEvents.ENTITLEMENT_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.FRIEND_SUGGESTION_CREATE](data) {
        this.client.emit(constants_1.ClientEvents.FRIEND_SUGGESTION_CREATE, {
            reasons: data.reasons.map((reason) => {
                return { name: reason['name'], platformType: reason['platform_type'] };
            }),
            user: new structures_1.User(this.client, data['suggested_user']),
        });
    }
    [constants_1.GatewayDispatchEvents.FRIEND_SUGGESTION_DELETE](data) {
        this.client.emit(constants_1.ClientEvents.FRIEND_SUGGESTION_DELETE, {
            suggestedUserId: data['suggested_user_id'],
        });
    }
    [constants_1.GatewayDispatchEvents.GIFT_CODE_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.GIFT_CODE_UPDATE, {
            code: data['code'],
            uses: data['uses'],
        });
    }
    [constants_1.GatewayDispatchEvents.GUILD_BAN_ADD](data) {
        const guild = this.client.guilds.get(data['guild_id']);
        const guildId = data['guild_id'];
        let user;
        if (this.client.users.has(data['user']['id'])) {
            user = this.client.users.get(data['user']['id']);
            user.merge(data['user']);
        }
        else {
            user = new structures_1.User(this.client, data['user']);
        }
        this.client.emit(constants_1.ClientEvents.GUILD_BAN_ADD, {
            guild,
            guildId,
            user,
        });
    }
    [constants_1.GatewayDispatchEvents.GUILD_BAN_REMOVE](data) {
        const guild = this.client.guilds.get(data['guild_id']);
        const guildId = data['guild_id'];
        let user;
        if (this.client.users.has(data['user']['id'])) {
            user = this.client.users.get(data['user']['id']);
            user.merge(data['user']);
        }
        else {
            user = new structures_1.User(this.client, data['user']);
        }
        this.client.emit(constants_1.ClientEvents.GUILD_BAN_REMOVE, {
            guild,
            guildId,
            user,
        });
    }
    [constants_1.GatewayDispatchEvents.GUILD_CREATE](data) {
        let fromUnavailable = false;
        let guild;
        if (this.client.guilds.has(data['id'])) {
            guild = this.client.guilds.get(data['id']);
            fromUnavailable = guild.unavailable;
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data);
            this.client.guilds.insert(guild);
        }
        guild.isReady = guild.memberCount === guild.members.length;
        if (guild.isReady) {
            // emit GUILD_READY
        }
        else {
            if (this.handler.shouldLoadAllMembers) {
                this.client.gateway.requestGuildMembers(guild.id, {
                    limit: 0,
                    presences: true,
                    query: '',
                });
            }
        }
        const payload = { fromUnavailable, guild };
        this.client.emit(constants_1.ClientEvents.GUILD_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_DELETE](data) {
        let channels = null;
        let guild = null;
        const guildId = data['id'];
        const isUnavailable = !!data['unavailable'];
        let isNew;
        if (this.client.guilds.has(data['id'])) {
            guild = this.client.guilds.get(data['id']);
            guild.merge(data);
            isNew = false;
        }
        else {
            guild = new structures_1.Guild(this.client, data);
            this.client.guilds.insert(guild);
            isNew = true;
        }
        if (!isUnavailable) {
            guild.left = true;
        }
        if (!isNew || !this.client.guilds.enabled) {
            if (this.client.hasEventListener(constants_1.ClientEvents.GUILD_DELETE)) {
                channels = new basecollection_1.BaseCollection();
            }
            for (let [channelId, channel] of this.client.channels) {
                if (channel.guildId === guildId) {
                    if (channels) {
                        channels.set(channel.id, channel);
                    }
                    this.client.channels.delete(channelId);
                    if (channel.isText) {
                        if (this.client.typings.get(channelId)) {
                            const typings = this.client.typings.get(channelId);
                            for (let [userId, typing] of typings) {
                                typing.timeout.stop();
                                typings.delete(userId);
                            }
                            typings.clear();
                        }
                    }
                }
            }
            for (let [messageId, message] of this.client.messages) {
                if (message.guildId === guildId) {
                    this.client.messages.delete(messageId);
                }
            }
            this.client.presences.clearGuildId(guildId);
            this.client.voiceStates.delete(guildId);
            guild.emojis.clear();
            guild.members.clear(); // should we check each member and see if we should clear the user obj from cache too?
            guild.roles.clear();
            guild.isReady = false;
        }
        if (!isUnavailable) {
            this.client.guilds.delete(guildId);
        }
        const payload = { channels, guild, guildId, isUnavailable };
        this.client.emit(constants_1.ClientEvents.GUILD_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_EMOJIS_UPDATE](data) {
        let emojis;
        let emojisOld = null;
        let guild = null;
        const guildId = data['guild_id'];
        if (this.client.guilds.has(guildId)) {
            guild = this.client.guilds.get(guildId);
            if (this.client.hasEventListener(constants_1.ClientEvents.GUILD_EMOJIS_UPDATE)) {
                emojisOld = guild.emojis.clone();
            }
            guild.merge({ emojis: data['emojis'] });
            emojis = guild.emojis;
        }
        else {
            emojisOld = new basecollection_1.BaseCollection();
            emojis = new basecollection_1.BaseCollection();
            for (let raw of data['emojis']) {
                const emojiId = raw.id;
                let emoji;
                if (this.client.emojis.has(guildId, emojiId)) {
                    emoji = this.client.emojis.get(guildId, emojiId);
                    emoji.merge(raw);
                }
                else {
                    Object.assign(raw, { guild_id: guildId });
                    emoji = new structures_1.Emoji(this.client, raw);
                }
                emojis.set(emojiId, emoji);
            }
        }
        const payload = { emojis, emojisOld, guild, guildId };
        this.client.emit(constants_1.ClientEvents.GUILD_EMOJIS_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_INTEGRATIONS_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.GUILD_INTEGRATIONS_UPDATE, {
            guildId: data['guild_id'],
        });
    }
    [constants_1.GatewayDispatchEvents.GUILD_MEMBER_ADD](data) {
        const guildId = data['guild_id'];
        let isDuplicate = false;
        let member;
        const userId = data['user']['id'];
        if (this.client.members.has(guildId, userId)) {
            member = this.client.members.get(guildId, userId);
            member.merge(data);
        }
        else {
            member = new structures_1.Member(this.client, data);
            this.client.members.insert(member);
        }
        // Discord can send us a duplicate `GUILD_MEMBER_ADD` event sometimes, like during a guild raid
        const isListening = this.client.hasEventListener(constants_1.ClientEvents.GUILD_MEMBER_ADD);
        if (isListening || this.client.guilds.has(guildId)) {
            const key = `${guildId}.${userId}`;
            const event = this.handler.duplicateMemberEventsCache.get(key);
            if (event === constants_1.GatewayDispatchEvents.GUILD_MEMBER_ADD) {
                isDuplicate = true;
            }
            else {
                if (this.client.guilds.has(guildId)) {
                    const guild = this.client.guilds.get(guildId);
                    guild.memberCount++;
                }
            }
            this.handler.duplicateMemberEventsCache.set(key, constants_1.GatewayDispatchEvents.GUILD_MEMBER_ADD);
        }
        const payload = { guildId, isDuplicate, member, userId };
        this.client.emit(constants_1.ClientEvents.GUILD_MEMBER_ADD, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_MEMBER_LIST_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.GUILD_MEMBER_LIST_UPDATE, {
            raw: data,
        });
    }
    [constants_1.GatewayDispatchEvents.GUILD_MEMBER_REMOVE](data) {
        const guildId = data['guild_id'];
        let isDuplicate = false;
        let member = null;
        let user;
        const userId = data['user']['id'];
        if (this.client.users.has(userId)) {
            user = this.client.users.get(userId);
            user.merge(data['user']);
        }
        else {
            user = new structures_1.User(this.client, data['user']);
        }
        if (this.client.members.has(guildId, userId)) {
            member = this.client.members.get(guildId, userId);
            member.left = true;
        }
        this.client.members.delete(guildId, userId);
        // Discord can send us a duplicate `GUILD_MEMBER_ADD` event sometimes, just in case check _REMOVE too
        const isListening = this.client.hasEventListener(constants_1.ClientEvents.GUILD_MEMBER_REMOVE);
        if (isListening || this.client.guilds.has(guildId)) {
            const key = `${guildId}.${userId}`;
            const event = this.handler.duplicateMemberEventsCache.get(key);
            if (event === constants_1.GatewayDispatchEvents.GUILD_MEMBER_REMOVE) {
                isDuplicate = true;
            }
            else {
                if (this.client.guilds.has(guildId)) {
                    const guild = this.client.guilds.get(guildId);
                    guild.memberCount--;
                }
            }
            this.handler.duplicateMemberEventsCache.set(key, constants_1.GatewayDispatchEvents.GUILD_MEMBER_REMOVE);
        }
        if (this.client.presences.has(userId)) {
            const presence = this.client.presences.get(userId);
            presence._deleteGuildId(guildId);
            if (!presence.guildIds.length) {
                this.client.presences.delete(userId);
            }
        }
        for (let [cacheId, cache] of this.client.typings.caches) {
            if (cache.has(userId)) {
                const typing = cache.get(userId);
                typing._stop(false);
            }
        }
        this.client.voiceStates.delete(guildId, userId);
        // do a guild sweep for mutual guilds
        const sharesGuilds = this.client.guilds.some((guild) => guild.members.has(userId));
        if (!sharesGuilds) {
            // do a channel sweep for mutual dms
            const sharesDms = this.client.channels.some((channel) => channel.recipients.has(userId));
            if (!sharesDms) {
                // relationship check
                if (!this.client.relationships.has(userId)) {
                    this.client.users.delete(userId);
                }
            }
        }
        const payload = { guildId, isDuplicate, member, user, userId };
        this.client.emit(constants_1.ClientEvents.GUILD_MEMBER_REMOVE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_MEMBER_UPDATE](data) {
        let differences = null;
        const guildId = data['guild_id'];
        let member;
        const userId = data['user']['id'];
        if (this.client.hasEventListener(constants_1.ClientEvents.USERS_UPDATE)) {
            if (this.client.users.has(userId)) {
                const user = this.client.users.get(userId);
                const userDifferences = user.differences(data['user']);
                if (userDifferences) {
                    differences = { user: userDifferences };
                }
            }
        }
        const isListening = this.client.hasEventListener(constants_1.ClientEvents.GUILD_MEMBER_UPDATE);
        if (this.client.members.has(guildId, userId)) {
            member = this.client.members.get(guildId, userId);
            if (isListening) {
                if (differences) {
                    Object.assign(differences, member.differences(data));
                }
                else {
                    differences = member.differences(data);
                }
            }
            member.merge(data);
        }
        else {
            member = new structures_1.Member(this.client, data);
            this.client.members.insert(member);
        }
        if (differences && differences.user) {
            const payload = {
                differences: differences.user,
                from: constants_1.ClientEvents.GUILD_MEMBER_UPDATE,
                user: member.user,
            };
            this.client.emit(constants_1.ClientEvents.USERS_UPDATE, payload);
        }
        const payload = { differences, guildId, member, userId };
        this.client.emit(constants_1.ClientEvents.GUILD_MEMBER_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_MEMBERS_CHUNK](data) {
        const chunkCount = data['chunk_count'];
        const chunkIndex = data['chunk_index'];
        const guildId = data['guild_id'];
        const nonce = data['nonce'] || null;
        let guild = this.client.guilds.get(guildId) || null;
        let members = null;
        let notFound = null;
        let presences = null;
        const isListening = (this.client.hasEventListener(constants_1.ClientEvents.GUILD_MEMBERS_CHUNK) ||
            !!(nonce && this.handler._chunksWaiting.has(nonce)));
        let cache = nonce && this.handler._chunksWaiting.get(nonce);
        // do presences first since the members cache might depend on it (storeOffline = false)
        if (data['presences']) {
            presences = new basecollection_1.BaseCollection();
            if (this.client.presences.enabled || isListening) {
                for (let value of data['presences']) {
                    value.guild_id = guildId;
                    const presence = this.client.presences.insert(value);
                    if (isListening) {
                        presences.set(presence.user.id, presence);
                    }
                    if (cache) {
                        cache.presences.set(presence.user.id, presence);
                    }
                }
            }
        }
        if (data['members']) {
            // we (the bot user) won't be in the chunk anyways, right?
            if (this.client.members.enabled || isListening) {
                members = new basecollection_1.BaseCollection();
                for (let value of data['members']) {
                    let rawUser = value.user;
                    let member;
                    if (this.client.members.has(guildId, rawUser.id)) {
                        member = this.client.members.get(guildId, rawUser.id);
                        member.merge(value);
                    }
                    else {
                        member = new structures_1.Member(this.client, Object.assign(value, { guild_id: guildId }));
                        this.client.members.insert(member);
                    }
                    if (isListening) {
                        members.set(member.id, member);
                    }
                    if (cache) {
                        cache.members.set(member.id, member);
                    }
                }
            }
            else if (this.client.presences.enabled || this.client.users.enabled) {
                for (let value of data['members']) {
                    let raw = value.user;
                    let user;
                    if (this.client.users.has(raw.id)) {
                        user = this.client.users.get(raw.id);
                        user.merge(raw);
                    }
                    else {
                        user = new structures_1.User(this.client, raw);
                        this.client.users.insert(user);
                    }
                }
            }
        }
        if (data['not_found']) {
            // user ids
            // if the userId is not a big int, it'll be an integer..
            notFound = data['not_found'].map((userId) => String(userId));
            if (cache) {
                for (let userId of notFound) {
                    cache.notFound.add(userId);
                }
            }
        }
        if (guild && !guild.isReady && guild.memberCount === guild.members.length) {
            guild.isReady = true;
            const payload = { guild };
            this.client.emit(constants_1.ClientEvents.GUILD_READY, payload);
        }
        if (cache && chunkIndex + 1 === chunkCount) {
            cache.promise.resolve();
        }
        const payload = {
            chunkCount,
            chunkIndex,
            guild,
            guildId,
            members,
            nonce,
            notFound,
            presences,
        };
        this.client.emit(constants_1.ClientEvents.GUILD_MEMBERS_CHUNK, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_ROLE_CREATE](data) {
        let guild = null;
        const guildId = data['guild_id'];
        let role;
        if (this.client.guilds.has(guildId)) {
            guild = this.client.guilds.get(guildId);
            if (guild.roles.has(data['role']['id'])) {
                role = guild.roles.get(data['role']['id']);
                role.merge(data['role']);
            }
            else {
                data['role']['guild_id'] = guildId;
                role = new structures_1.Role(this.client, data['role']);
                guild.roles.set(role.id, role);
            }
        }
        else {
            data['role']['guild_id'] = guildId;
            role = new structures_1.Role(this.client, data['role']);
        }
        const payload = { guild, guildId, role };
        this.client.emit(constants_1.ClientEvents.GUILD_ROLE_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_ROLE_DELETE](data) {
        let guild = null;
        const guildId = data['guild_id'];
        let role = null;
        const roleId = data['role_id'];
        if (this.client.guilds.has(guildId)) {
            guild = this.client.guilds.get(guildId);
            if (guild.roles.has(roleId)) {
                role = guild.roles.get(roleId);
                guild.roles.delete(roleId);
            }
            for (let [userId, member] of guild.members) {
                if (member._roles) {
                    const index = member._roles.indexOf(roleId);
                    if (index !== -1) {
                        member._roles.splice(index, 1);
                    }
                }
            }
        }
        const payload = { guild, guildId, role, roleId };
        this.client.emit(constants_1.ClientEvents.GUILD_ROLE_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_ROLE_UPDATE](data) {
        let differences = null;
        let guild = null;
        const guildId = data['guild_id'];
        let role;
        if (this.client.guilds.has(guildId)) {
            guild = this.client.guilds.get(guildId);
            if (guild.roles.has(data['role']['id'])) {
                role = guild.roles.get(data['role']['id']);
                if (this.client.hasEventListener(constants_1.ClientEvents.GUILD_ROLE_UPDATE)) {
                    differences = role.differences(data['role']);
                }
                role.merge(data['role']);
            }
            else {
                data['role']['guild_id'] = guildId;
                role = new structures_1.Role(this.client, data['role']);
                guild.roles.set(role.id, role);
            }
        }
        else {
            data['role']['guild_id'] = guildId;
            role = new structures_1.Role(this.client, data['role']);
        }
        const payload = { differences, guild, guildId, role };
        this.client.emit(constants_1.ClientEvents.GUILD_ROLE_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.GUILD_UPDATE](data) {
        let differences = null;
        let guild;
        if (this.client.guilds.has(data['id'])) {
            guild = this.client.guilds.get(data['id']);
            if (this.client.hasEventListener(constants_1.ClientEvents.GUILD_UPDATE)) {
                differences = guild.differences(data);
            }
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data);
            this.client.guilds.insert(guild);
        }
        guild.hasMetadata = true;
        const payload = { differences, guild };
        this.client.emit(constants_1.ClientEvents.GUILD_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.INTERACTION_CREATE](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        const userId = data['member']['user']['id'];
        let member;
        if (this.client.members.has(guildId, userId)) {
            member = this.client.members.get(guildId, userId);
            member.merge(data['member']);
        }
        else {
            member = new structures_1.Member(this.client, data['member']);
            this.client.members.insert(member);
        }
        const payload = {
            data: data['data'],
            channelId,
            guildId,
            id: data['id'],
            member,
            token: data['token'],
            type: data['type'],
            userId,
            version: data['version'],
        };
        this.client.emit(constants_1.ClientEvents.INTERACTION_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.INVITE_CREATE](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        const invite = new structures_1.Invite(this.client, data);
        const payload = { channelId, guildId, invite };
        this.client.emit(constants_1.ClientEvents.INVITE_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.INVITE_DELETE](data) {
        const channelId = data['channel_id'];
        const code = data['code'];
        const guildId = data['guild_id'];
        const payload = { channelId, code, guildId };
        this.client.emit(constants_1.ClientEvents.INVITE_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.LIBRARY_APPLICATION_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_CREATE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_DELETE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_MEMBER_CONNECT](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_MEMBER_DISCONNECT](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_MEMBER_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_MESSAGE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_VOICE_SERVER_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.LOBBY_VOICE_STATE_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_ACK](data) {
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_CREATE](data) {
        let message;
        let typing = null;
        if (this.client.messages.has(data['id'])) {
            message = this.client.messages.get(data['id']);
            message.merge(data);
        }
        else {
            message = new structures_1.Message(this.client, data);
            this.client.messages.insert(message);
        }
        if (this.client.channels.has(message.channelId)) {
            const channel = this.client.channels.get(message.channelId);
            channel.merge({ last_message_id: message.id });
        }
        if (this.client.typings.has(message.channelId)) {
            const typings = this.client.typings.get(message.channelId);
            if (typings.has(message.author.id)) {
                typing = typings.get(message.author.id);
                typing._stop();
            }
        }
        const payload = { message, typing };
        this.client.emit(constants_1.ClientEvents.MESSAGE_CREATE, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_DELETE](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let message = null;
        const messageId = data['id'];
        if (this.client.messages.has(messageId)) {
            message = this.client.messages.get(messageId);
            message.deleted = true;
            this.client.messages.delete(messageId);
        }
        const payload = { channelId, guildId, message, messageId, raw: data };
        this.client.emit(constants_1.ClientEvents.MESSAGE_DELETE, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_DELETE_BULK](data) {
        const amount = data['ids'].length;
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        const messages = new basecollection_1.BaseCollection();
        for (let messageId of data['ids']) {
            if (this.client.messages.has(messageId)) {
                const message = this.client.messages.get(messageId);
                message.deleted = true;
                messages.set(messageId, message);
                this.client.messages.delete(messageId);
            }
            else {
                messages.set(messageId, null);
            }
        }
        const payload = { amount, channelId, guildId, messages, raw: data };
        this.client.emit(constants_1.ClientEvents.MESSAGE_DELETE_BULK, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_REACTION_ADD](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let member = null;
        let message = null;
        const messageId = data['message_id'];
        let reaction = null;
        let user = null;
        const userId = data['user_id'];
        if (this.client.users.has(userId)) {
            user = this.client.users.get(userId);
        }
        if (data.member) {
            if (this.client.members.has(guildId, userId)) {
                member = this.client.members.get(guildId, userId);
                member.merge(data.member);
            }
            else {
                member = new structures_1.Member(this.client, data.member);
                this.client.members.insert(member);
            }
        }
        const emojiId = data.emoji.id || data.emoji.name;
        if (this.client.messages.has(messageId)) {
            message = this.client.messages.get(messageId);
            if (message._reactions && message._reactions.has(emojiId)) {
                reaction = message._reactions.get(emojiId);
            }
        }
        if (!reaction) {
            // https://github.com/discordapp/discord-api-docs/issues/812
            Object.assign(data, { is_partial: true });
            reaction = new structures_1.Reaction(this.client, data);
            if (message) {
                if (!message._reactions) {
                    message._reactions = new basecollection_1.BaseCollection();
                }
                message._reactions.set(emojiId, reaction);
                reaction.isPartial = false;
            }
        }
        reaction.count += 1;
        reaction.me = (userId === this.client.userId) || reaction.me;
        const payload = {
            channelId,
            guildId,
            member,
            message,
            messageId,
            reaction,
            user,
            userId,
            raw: data,
        };
        this.client.emit(constants_1.ClientEvents.MESSAGE_REACTION_ADD, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_REACTION_REMOVE](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let message = null;
        const messageId = data['message_id'];
        let reaction = null;
        let user = null;
        const userId = data['user_id'];
        if (this.client.users.has(userId)) {
            user = this.client.users.get(userId);
        }
        const emojiId = data.emoji.id || data.emoji.name;
        if (this.client.messages.has(messageId)) {
            message = this.client.messages.get(messageId);
            if (message._reactions && message._reactions.has(emojiId)) {
                reaction = message._reactions.get(emojiId);
                reaction.count = Math.min(reaction.count - 1, 0);
                reaction.me = reaction.me && userId !== this.client.userId;
                if (reaction.count <= 0) {
                    message._reactions.delete(emojiId);
                    if (!message._reactions.length) {
                        message._reactions = undefined;
                    }
                }
            }
        }
        if (!reaction) {
            // https://github.com/discordapp/discord-api-docs/issues/812
            Object.assign(data, { is_partial: true });
            reaction = new structures_1.Reaction(this.client, data);
        }
        const payload = {
            channelId,
            guildId,
            message,
            messageId,
            reaction,
            user,
            userId,
            raw: data,
        };
        this.client.emit(constants_1.ClientEvents.MESSAGE_REACTION_REMOVE, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_REACTION_REMOVE_ALL](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let message = null;
        const messageId = data['message_id'];
        if (this.client.messages.has(messageId)) {
            message = this.client.messages.get(messageId);
            if (message._reactions) {
                message._reactions.clear();
                message._reactions = undefined;
            }
        }
        const payload = {
            channelId,
            guildId,
            message,
            messageId,
        };
        this.client.emit(constants_1.ClientEvents.MESSAGE_REACTION_REMOVE_ALL, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_REACTION_REMOVE_EMOJI](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let message = null;
        const messageId = data['message_id'];
        let reaction = null;
        const emojiId = data.emoji.id || data.emoji.name;
        if (this.client.messages.has(messageId)) {
            message = this.client.messages.get(messageId);
            if (message._reactions && message._reactions.has(emojiId)) {
                reaction = message._reactions.get(emojiId);
                message._reactions.delete(emojiId);
                if (!message._reactions.length) {
                    message._reactions = undefined;
                }
            }
        }
        if (!reaction) {
            // https://github.com/discordapp/discord-api-docs/issues/812
            Object.assign(data, { is_partial: true });
            reaction = new structures_1.Reaction(this.client, data);
        }
        const payload = {
            channelId,
            guildId,
            message,
            messageId,
            reaction,
            raw: data,
        };
        this.client.emit(constants_1.ClientEvents.MESSAGE_REACTION_REMOVE_EMOJI, payload);
    }
    [constants_1.GatewayDispatchEvents.MESSAGE_UPDATE](data) {
        let channelId = data['channel_id'];
        let differences = null;
        let guildId = data['guild_id'];
        let isEmbedUpdate = false;
        let message = null;
        let messageId = data['id'];
        if (!data['author']) {
            isEmbedUpdate = true;
        }
        if (this.client.messages.has(data['id'])) {
            message = this.client.messages.get(data['id']);
            if (this.client.hasEventListener(constants_1.ClientEvents.MESSAGE_UPDATE)) {
                differences = message.differences(data);
            }
            message.merge(data);
        }
        else {
            if (data['author']) {
                // else it's an embed update and we dont have it in cache
                // only embed updates we cannot create a message object
                message = new structures_1.Message(this.client, data);
                this.client.messages.insert(message);
            }
        }
        const payload = {
            channelId,
            differences,
            guildId,
            isEmbedUpdate,
            message,
            messageId,
            raw: data,
        };
        this.client.emit(constants_1.ClientEvents.MESSAGE_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.OAUTH2_TOKEN_REMOVE](data) {
    }
    [constants_1.GatewayDispatchEvents.PRESENCE_UPDATE](data) {
        let differences = null;
        const guildId = data['guild_id'] || null;
        let isGuildPresence = !!guildId;
        let member = null;
        let presence;
        let userId = data['user']['id'];
        let wentOffline = data['status'] === constants_1.PresenceStatuses.OFFLINE;
        if (this.client.hasEventListener(constants_1.ClientEvents.USERS_UPDATE)) {
            if (this.client.users.has(userId)) {
                const user = this.client.users.get(userId);
                const userDifferences = user.differences(data['user']);
                if (userDifferences) {
                    differences = { user: userDifferences };
                }
            }
        }
        if (this.client.hasEventListener(constants_1.ClientEvents.PRESENCE_UPDATE)) {
            if (this.client.presences.has(userId)) {
                let presenceDifferences = this.client.presences.get(userId).differences(data);
                if (differences) {
                    Object.assign(differences, presenceDifferences);
                }
                else {
                    differences = presenceDifferences;
                }
            }
        }
        presence = this.client.presences.insert(data);
        if (guildId) {
            if (this.client.members.has(guildId, userId)) {
                member = this.client.members.get(guildId, userId);
                member.merge(data);
            }
            else {
                member = new structures_1.Member(this.client, data);
                this.client.members.insert(member);
            }
        }
        if (differences && differences.user) {
            const payload = {
                differences: differences.user,
                from: constants_1.ClientEvents.PRESENCE_UPDATE,
                user: presence.user,
            };
            this.client.emit(constants_1.ClientEvents.USERS_UPDATE, payload);
        }
        const payload = { differences, guildId, isGuildPresence, member, presence, userId, wentOffline };
        this.client.emit(constants_1.ClientEvents.PRESENCE_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.PRESENCES_REPLACE](data) {
        const presences = new basecollection_1.BaseCollection();
        if (data['presences']) {
            for (let raw of data['presences']) {
                // guildId is empty, use default presence cache id
                const presence = this.client.presences.insert(raw);
                presences.set(presence.user.id, presence);
            }
        }
        const payload = { presences };
        this.client.emit(constants_1.ClientEvents.PRESENCES_REPLACE, payload);
    }
    [constants_1.GatewayDispatchEvents.RECENT_MENTION_DELETE](data) {
    }
    [constants_1.GatewayDispatchEvents.RELATIONSHIP_ADD](data) {
        let differences = null;
        let relationship;
        const userId = data['id'];
        if (this.client.relationships.has(userId)) {
            relationship = this.client.relationships.get(userId);
            if (this.client.hasEventListener(constants_1.ClientEvents.RELATIONSHIP_ADD)) {
                differences = relationship.differences(data);
            }
            relationship.merge(data);
        }
        else {
            relationship = new structures_1.Relationship(this.client, data);
            this.client.relationships.insert(relationship);
        }
        const payload = { differences, relationship, userId };
        this.client.emit(constants_1.ClientEvents.RELATIONSHIP_ADD, payload);
    }
    [constants_1.GatewayDispatchEvents.RELATIONSHIP_REMOVE](data) {
        let relationship;
        const userId = data['id'];
        if (this.client.relationships.has(data['id'])) {
            relationship = this.client.relationships.get(data['id']);
            this.client.relationships.delete(data['id']);
        }
        else {
            relationship = new structures_1.Relationship(this.client, data);
        }
        const payload = { relationship, userId };
        this.client.emit(constants_1.ClientEvents.RELATIONSHIP_REMOVE, payload);
    }
    [constants_1.GatewayDispatchEvents.SESSIONS_REPLACE](data) {
        const old = this.client.sessions.clone();
        // maybe return an array of differences instead?
        if (this.client.sessions.enabled) {
            this.client.sessions.clear();
            for (let raw of data) {
                this.client.sessions.insert(new structures_1.Session(this.client, raw));
            }
        }
        const payload = { old, raw: data };
        this.client.emit(constants_1.ClientEvents.SESSIONS_REPLACE, payload);
    }
    [constants_1.GatewayDispatchEvents.STREAM_CREATE](data) {
        this.client.emit(constants_1.ClientEvents.STREAM_CREATE, {
            paused: data['paused'],
            region: data['region'],
            rtcServerId: data['rtc_server_id'],
            streamKey: data['stream_key'],
            viewerIds: data['viewer_ids'],
        });
    }
    [constants_1.GatewayDispatchEvents.STREAM_DELETE](data) {
        this.client.emit(constants_1.ClientEvents.STREAM_DELETE, {
            reason: data['reason'],
            streamKey: data['stream_key'],
            unavailable: data['unavailable'],
        });
    }
    [constants_1.GatewayDispatchEvents.STREAM_SERVER_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.STREAM_SERVER_UPDATE, {
            endpoint: data['endpoint'],
            streamKey: data['stream_key'],
            token: data['token'],
        });
    }
    [constants_1.GatewayDispatchEvents.STREAM_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.STREAM_UPDATE, {
            paused: data['paused'],
            region: data['region'],
            streamKey: data['stream_key'],
            viewerIds: data['viewer_ids'],
        });
    }
    [constants_1.GatewayDispatchEvents.TYPING_START](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        let typing;
        const userId = data['user_id'];
        if (this.client.typings.has(channelId, userId)) {
            typing = this.client.typings.get(channelId, userId);
            typing.merge(data);
        }
        else {
            typing = new structures_1.Typing(this.client, data);
            this.client.typings.insert(typing);
        }
        const payload = { channelId, guildId, typing, userId };
        this.client.emit(constants_1.ClientEvents.TYPING_START, payload);
    }
    [constants_1.GatewayDispatchEvents.USER_ACHIEVEMENT_UPDATE](data) {
    }
    async [constants_1.GatewayDispatchEvents.USER_CONNECTIONS_UPDATE](data) {
        // maybe fetch from rest api when this happens to keep cache up to date?
        try {
            await this.client.connectedAccounts.fill();
        }
        catch (error) {
            const payload = { error: new errors_1.GatewayHTTPError('Failed to fetch Connected Accounts', error) };
            this.client.emit(constants_1.ClientEvents.WARN, payload);
        }
        const payload = {};
        this.client.emit(constants_1.ClientEvents.USER_CONNECTIONS_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.USER_FEED_SETTINGS_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.USER_GUILD_SETTINGS_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.USER_NOTE_UPDATE](data) {
        const note = data['note'];
        let user = null;
        const userId = data['id'];
        if (this.client.users.has(userId)) {
            user = this.client.users.get(userId);
        }
        this.client.notes.insert(userId, note);
        const payload = { note, user, userId };
        this.client.emit(constants_1.ClientEvents.USER_NOTE_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.USER_PAYMENT_SOURCES_UPDATE](data) {
        // maybe fetch from rest api when this happens to keep cache up to date?
    }
    [constants_1.GatewayDispatchEvents.USER_PAYMENTS_UPDATE](data) {
        // maybe fetch from rest api when this happens to keep cache up to date?
    }
    [constants_1.GatewayDispatchEvents.USER_REQUIRED_ACTION_UPDATE](data) {
        const requiredAction = this.client.requiredAction;
        this.client.requiredAction = data['required_action'];
        const payload = {
            differences: { requiredAction },
            requiredAction: this.client.requiredAction,
        };
        this.client.emit(constants_1.ClientEvents.USER_REQUIRED_ACTION_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.USER_SETTINGS_UPDATE](data) {
    }
    [constants_1.GatewayDispatchEvents.USER_UPDATE](data) {
        // this updates this.client.user, us
        let differences = null;
        let user;
        if (this.client.user) {
            user = this.client.user;
            if (this.client.hasEventListener(constants_1.ClientEvents.USER_UPDATE)) {
                differences = user.differences(data);
            }
            user.merge(data);
        }
        else {
            user = new structures_1.UserMe(this.client, data);
            this.client.user = user;
            this.client.users.insert(user);
        }
        const payload = { differences, user };
        this.client.emit(constants_1.ClientEvents.USER_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.VOICE_SERVER_UPDATE](data) {
        this.client.emit(constants_1.ClientEvents.VOICE_SERVER_UPDATE, {
            channelId: data['channel_id'],
            endpoint: data['endpoint'],
            guildId: data['guild_id'],
            token: data['token'],
        });
    }
    [constants_1.GatewayDispatchEvents.VOICE_STATE_UPDATE](data) {
        let differences = null;
        let leftChannel = false;
        let voiceState;
        const serverId = data['guild_id'] || data['channel_id'];
        if (this.client.voiceStates.has(serverId, data['user_id'])) {
            voiceState = this.client.voiceStates.get(serverId, data['user_id']);
            if (this.client.hasEventListener(constants_1.ClientEvents.VOICE_STATE_UPDATE)) {
                differences = voiceState.differences(data);
            }
            voiceState.merge(data);
            if (!data['channel_id']) {
                this.client.voiceStates.delete(serverId, data['user_id']);
                leftChannel = true;
            }
        }
        else {
            voiceState = new structures_1.VoiceState(this.client, data);
            this.client.voiceStates.insert(voiceState);
        }
        const payload = { differences, leftChannel, voiceState };
        this.client.emit(constants_1.ClientEvents.VOICE_STATE_UPDATE, payload);
    }
    [constants_1.GatewayDispatchEvents.WEBHOOKS_UPDATE](data) {
        const channelId = data['channel_id'];
        const guildId = data['guild_id'];
        const payload = { channelId, guildId };
        this.client.emit(constants_1.ClientEvents.WEBHOOKS_UPDATE, payload);
    }
}
exports.GatewayDispatchHandler = GatewayDispatchHandler;

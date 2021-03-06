"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceActivityTimestamps = exports.PresenceActivityAssets = exports.PresenceActivity = exports.Presence = exports.ImageSizes = exports.SpecialPrefixes = exports.SpecialApplications = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const emoji_1 = require("./emoji");
const user_1 = require("./user");
exports.SpecialApplications = Object.freeze({
    XBOX: '438122941302046720',
});
exports.SpecialPrefixes = Object.freeze({
    SPOTIFY: 'spotify:',
});
exports.ImageSizes = Object.freeze({
    SMALL: 64,
    LARGE: 160,
});
const keysPresence = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ACTIVITIES,
    constants_1.DiscordKeys.CLIENT_STATUS,
    constants_1.DiscordKeys.GAME,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.GUILD_IDS,
    constants_1.DiscordKeys.LAST_MODIFIED,
    constants_1.DiscordKeys.STATUS,
    constants_1.DiscordKeys.USER,
]);
const keysMergePresence = new baseset_1.BaseSet([
    constants_1.DiscordKeys.USER,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.ACTIVITIES,
]);
const keysSkipDifferencePresence = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.GUILD_IDS,
]);
/**
 * Presence Structure, used to detail a user's presence in a guild (or general if you have them added (non-bots only))
 * @category Structure
 */
class Presence extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysPresence;
        this._keysMerge = keysMergePresence;
        this._keysSkipDifference = keysSkipDifferencePresence;
        this._guildIds = '';
        this.lastGuildId = constants_1.LOCAL_GUILD_ID;
        this.status = constants_1.PresenceStatuses.OFFLINE;
        this.merge(data);
    }
    get activity() {
        return this.game;
    }
    get activities() {
        if (this._activities) {
            return this._activities;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get game() {
        if (this._activities) {
            for (let [activityId, activity] of this._activities) {
                if (activity.position === 0) {
                    return activity;
                }
            }
            return this._activities.first() || null;
        }
        return null;
    }
    get guildIds() {
        if (typeof (this._guildIds) === 'string') {
            const guildIds = new baseset_1.BaseSet();
            if (this._guildIds) {
                guildIds.add(this._guildIds);
            }
            return guildIds;
        }
        return this._guildIds;
    }
    get isDnd() {
        return this.status === constants_1.PresenceStatuses.DND;
    }
    get isIdle() {
        return this.status === constants_1.PresenceStatuses.IDLE;
    }
    get isOffline() {
        return this.status === constants_1.PresenceStatuses.OFFLINE || this.status === constants_1.PresenceStatuses.INVISIBLE;
    }
    get isOnline() {
        return this.status === constants_1.PresenceStatuses.ONLINE;
    }
    get showMobileIcon() {
        if (this.clientStatus) {
            return this.clientStatus.mobile === constants_1.PresenceStatuses.ONLINE;
        }
        return false;
    }
    activityFor(guildId) {
        if (this._activities) {
            const activities = this.activitiesFor(guildId);
            for (let [activityId, activity] of activities) {
                if (activity.position === 0) {
                    return activity;
                }
            }
            return activities.first() || null;
        }
        return null;
    }
    activitiesFor(guildId) {
        if (this._activities) {
            const collection = new basecollection_1.BaseCollection();
            for (let [activityId, activity] of this._activities) {
                if (activity._hasGuildId(guildId)) {
                    collection.set(activity.id, activity);
                }
            }
            return collection;
        }
        return basecollection_1.emptyBaseCollection;
    }
    get _shouldDelete() {
        return !this._guildIds;
    }
    _deleteGuildId(guildId) {
        if (typeof (this._guildIds) === 'string') {
            if (this._guildIds === guildId) {
                this._guildIds = '';
                if (this._activities) {
                    this._activities.clear();
                    this._activities = undefined;
                }
            }
        }
        else {
            this._guildIds.delete(guildId);
            if (this._guildIds.length) {
                if (this._activities) {
                    for (let [activityId, activity] of this._activities) {
                        activity._deleteGuildId(guildId);
                        if (activity._shouldDelete) {
                            this._activities.delete(activityId);
                        }
                    }
                    if (!this._activities.length) {
                        this._activities = undefined;
                    }
                }
                if (this._guildIds.length === 1) {
                    this._guildIds = this._guildIds.first() || '';
                }
            }
            else {
                this._guildIds = '';
            }
        }
    }
    _hasGuildId(guildId) {
        if (typeof (this._guildIds) === 'string') {
            return this._guildIds === guildId;
        }
        else {
            return this._guildIds.has(guildId);
        }
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.ACTIVITIES:
                    {
                        const guildId = this.lastGuildId;
                        if (this._activities) {
                            for (let [activityId, activity] of this._activities) {
                                activity._deleteGuildId(guildId);
                            }
                        }
                        let isNew = false;
                        if (value.length) {
                            if (!this._activities) {
                                this._activities = new basecollection_1.BaseCollection();
                                isNew = true;
                            }
                            for (let position = 0; position < value.length; position++) {
                                const raw = value[position];
                                raw.position = position;
                                if (this._activities.has(raw.id)) {
                                    const activity = this._activities.get(raw.id);
                                    activity.merge(raw);
                                }
                                else {
                                    const activity = new PresenceActivity(this.user, raw);
                                    this._activities.set(activity.id, activity);
                                }
                            }
                        }
                        if (this._activities && !isNew) {
                            for (let [activityId, activity] of this._activities) {
                                if (activity._shouldDelete) {
                                    this._activities.delete(activityId);
                                }
                            }
                            if (!this._activities.length) {
                                this._activities = undefined;
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.GAME:
                    {
                        // itll always be in the activities array
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.GUILD_ID:
                    {
                        value = value || constants_1.LOCAL_GUILD_ID;
                        this.lastGuildId = value;
                        // _guildIds will be a string (if its a single guild) or a set (if the presence is for multiple guilds)
                        if (typeof (this._guildIds) === 'string') {
                            if (this._guildIds) {
                                this._guildIds = new baseset_1.BaseSet([this._guildIds, value]);
                            }
                            else {
                                this._guildIds = value;
                            }
                        }
                        else {
                            this._guildIds.add(value);
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.LAST_MODIFIED:
                    {
                        if (value) {
                            value = parseInt(value);
                        }
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.USER:
                    {
                        let user;
                        if (this.client.users.has(value.id)) {
                            user = this.client.users.get(value.id);
                            user.merge(value);
                        }
                        else {
                            if (this.user) {
                                user = this.user;
                                user.merge(value);
                            }
                            else {
                                user = new user_1.User(this.client, value);
                                this.client.users.insert(user);
                            }
                        }
                        value = user;
                    }
                    ;
                    break;
            }
            super.mergeValue(key, value);
        }
    }
    toString() {
        return `${this.user} is ${this.status}` + ((this.game) ? ` while ${this.game}` : '');
    }
}
exports.Presence = Presence;
const keysPresenceActivity = new baseset_1.BaseSet([
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.ASSETS,
    constants_1.DiscordKeys.BUTTONS,
    constants_1.DiscordKeys.CREATED_AT,
    constants_1.DiscordKeys.DETAILS,
    constants_1.DiscordKeys.EMOJI,
    constants_1.DiscordKeys.FLAGS,
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.GUILD_IDS,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.INSTANCE,
    constants_1.DiscordKeys.METADATA,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PARTY,
    constants_1.DiscordKeys.PLATFORM,
    constants_1.DiscordKeys.POSITION,
    constants_1.DiscordKeys.SECRETS,
    constants_1.DiscordKeys.SESSION_ID,
    constants_1.DiscordKeys.STATE,
    constants_1.DiscordKeys.SYNC_ID,
    constants_1.DiscordKeys.TIMESTAMPS,
    constants_1.DiscordKeys.TYPE,
    constants_1.DiscordKeys.URL,
]);
const keysMergePresenceActivity = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
]);
const keysSkipDifferencePresenceActivity = new baseset_1.BaseSet([
    constants_1.DiscordKeys.GUILD_ID,
    constants_1.DiscordKeys.GUILD_IDS,
]);
/**
 * Presence Activity Structure, used in [Presence]
 * @category Structure
 */
class PresenceActivity extends basestructure_1.BaseStructure {
    constructor(user, data) {
        super(user.client);
        this._keys = keysPresenceActivity;
        this._keysMerge = keysMergePresenceActivity;
        this._keysSkipDifference = keysSkipDifferencePresenceActivity;
        this._guildIds = '';
        this.flags = 0;
        this.id = '';
        this.name = '';
        this.position = 0;
        this.type = 0;
        this.user = user;
        this.merge(data);
    }
    get application() {
        if (this.applicationId && this.client.applications.has(this.applicationId)) {
            return this.client.applications.get(this.applicationId);
        }
        if (!this.user.bot && this.name && this.isPlaying) {
            for (let [applicationId, application] of this.client.applications) {
                if (application.matches(this.name)) {
                    return application;
                }
            }
        }
        return null;
    }
    get applicationIsXbox() {
        return this.applicationId === exports.SpecialApplications.XBOX;
    }
    get canInstance() {
        return this.hasFlag(constants_1.ActivityFlags.INSTANCE);
    }
    get canJoin() {
        return this.hasFlag(constants_1.ActivityFlags.JOIN);
    }
    get canJoinRequest() {
        return this.hasFlag(constants_1.ActivityFlags.JOIN_REQUEST);
    }
    get canPlay() {
        return this.hasFlag(constants_1.ActivityFlags.PLAY);
    }
    get canSpectate() {
        return this.hasFlag(constants_1.ActivityFlags.SPECTATE);
    }
    get canSync() {
        return this.hasFlag(constants_1.ActivityFlags.SYNC);
    }
    get group() {
        const group = new basecollection_1.BaseCollection();
        if (this.party && this.party.id) {
            const me = this.user;
            group.set(me.id, me);
            for (let [userId, presence] of this.client.presences) {
                if (group.has(userId)) {
                    continue;
                }
                for (let [activityId, activity] of presence.activities) {
                    if (activity.party && activity.party.id === this.id) {
                        group.set(userId, presence.user);
                        break;
                    }
                }
            }
        }
        return group;
    }
    get guildIds() {
        if (typeof (this._guildIds) === 'string') {
            const guildIds = new baseset_1.BaseSet();
            if (this._guildIds) {
                guildIds.add(this._guildIds);
            }
            return guildIds;
        }
        return this._guildIds;
    }
    get imageUrl() {
        return this.imageUrlFormat();
    }
    get isCustomStatus() {
        return this.type === constants_1.ActivityTypes.CUSTOM_STATUS;
    }
    get isListening() {
        return this.type === constants_1.ActivityTypes.LISTENING;
    }
    get isPlaying() {
        return this.type === constants_1.ActivityTypes.PLAYING;
    }
    get isStreaming() {
        return this.type === constants_1.ActivityTypes.STREAMING;
    }
    get isWatching() {
        return this.type === constants_1.ActivityTypes.WATCHING;
    }
    get isOnAndroid() {
        return this.platformType === constants_1.ActivityPlatformTypes.ANDROID;
    }
    get isOnIOS() {
        return this.platformType === constants_1.ActivityPlatformTypes.IOS;
    }
    get isOnSpotify() {
        return (this.isListening &&
            !!(this.id && this.id.startsWith(exports.SpecialPrefixes.SPOTIFY)) &&
            !!(this.partyIsSpotify));
    }
    get isOnSamsung() {
        return this.platformType === constants_1.ActivityPlatformTypes.SAMSUNG;
    }
    get isOnXbox() {
        return this.platformType === constants_1.ActivityPlatformTypes.XBOX;
    }
    get partyIsFull() {
        if (this.party && this.party.size) {
            return this.partySize === this.partyMaxSize;
        }
        return false;
    }
    get partyIsSpotify() {
        if (this.party && this.party.id) {
            return this.party.id.startsWith(exports.SpecialPrefixes.SPOTIFY);
        }
        return false;
    }
    get partyMaxSize() {
        if (this.party && this.party.size) {
            return this.party.size[1];
        }
        return null;
    }
    get partySize() {
        if (this.party && this.party.size) {
            return this.party.size[0];
        }
        return null;
    }
    get platformType() {
        // should we check `isPlaying`? the client returns null if they aren't
        if (this.applicationIsXbox) {
            return constants_1.ActivityPlatformTypes.XBOX;
        }
        if (this.platform) {
            return this.platform;
        }
        return constants_1.ActivityPlatformTypes.DESKTOP;
    }
    get platformDiscordUrl() {
        if (this.applicationId) {
            // now this might not be on discord
            // you need to check if the application exists on discord (by fetching it)
            return (iris_client_rest_1.Endpoints.Routes.URL +
                iris_client_rest_1.Endpoints.Routes.APPLICATION_STORE_LISTING_SKU(this.applicationId));
        }
        return null;
    }
    get spotifyTrackUrl() {
        if (this.isOnSpotify && this.syncId) {
            return constants_1.SpecialUrls.SPOTIFY_TRACK(this.syncId);
        }
        return null;
    }
    get typeText() {
        switch (this.type) {
            case constants_1.ActivityTypes.PLAYING: return 'Playing';
            case constants_1.ActivityTypes.STREAMING: return 'Streaming';
            case constants_1.ActivityTypes.LISTENING: return 'Listening to';
            case constants_1.ActivityTypes.WATCHING: return 'Watching';
            case constants_1.ActivityTypes.CUSTOM_STATUS: return '';
        }
        return 'Unknown';
    }
    hasFlag(flag) {
        return (this.flags & flag) === flag;
    }
    imageUrlFormat(format, query) {
        if (this.assets) {
            return this.assets.imageUrlFormat(format, query);
        }
        const application = this.application;
        if (application) {
            return application.iconUrlFormat(format, query);
        }
        return null;
    }
    async fetchApplication() {
        if (this.applicationId) {
            return this.client.rest.fetchApplication(this.applicationId);
        }
        return null;
    }
    async fetchButtonUrls() {
        if (!this.sessionId) {
            throw new Error('Activity has no Session Id');
        }
        if (!this.applicationId) {
            throw new Error('Activity has no Application Id');
        }
        if (!this.buttons) {
            throw new Error('Activity has no buttons');
        }
        return this.client.rest.fetchUserActivityMetadata(this.user.id, this.sessionId, String(this.applicationId));
    }
    async fetchMetadata() {
        if (!this.sessionId) {
            throw new Error('Activity has no Session Id');
        }
        return this.client.rest.fetchUserActivityMetadata(this.user.id, this.sessionId, String(this.position));
    }
    get _shouldDelete() {
        return !this._guildIds;
    }
    _deleteGuildId(guildId) {
        if (typeof (this._guildIds) === 'string') {
            if (this._guildIds === guildId) {
                this._guildIds = '';
            }
        }
        else {
            this._guildIds.delete(guildId);
            if (this._guildIds.length) {
                if (this._guildIds.length === 1) {
                    this._guildIds = this._guildIds.first() || '';
                }
            }
            else {
                this._guildIds = '';
            }
        }
    }
    _hasGuildId(guildId) {
        if (typeof (this._guildIds) === 'string') {
            return this._guildIds === guildId;
        }
        else {
            return this._guildIds.has(guildId);
        }
    }
    mergeValue(key, value) {
        switch (key) {
            case constants_1.DiscordKeys.GUILD_ID:
                {
                    value = value || constants_1.LOCAL_GUILD_ID;
                    if (typeof (this._guildIds) === 'string') {
                        if (this._guildIds) {
                            this._guildIds = new baseset_1.BaseSet([this._guildIds, value]);
                        }
                        else {
                            this._guildIds = value;
                        }
                    }
                    else {
                        this._guildIds.add(value);
                    }
                }
                ;
                return;
        }
        if (value !== undefined && value !== null) {
            // just replace our objects since they're of new values
            if (typeof (value) === 'object') {
                if (Object.keys(value).length) {
                    switch (key) {
                        case constants_1.DiscordKeys.ASSETS:
                            {
                                if (this.assets) {
                                    this.assets.merge(value);
                                }
                                else {
                                    this.assets = new PresenceActivityAssets(this, value);
                                }
                            }
                            ;
                            return;
                        case constants_1.DiscordKeys.EMOJI:
                            {
                                // reason is that `name` can be spoofed here
                                if (this.emoji) {
                                    this.emoji.merge(value);
                                }
                                else {
                                    this.emoji = new emoji_1.Emoji(this.client, value);
                                }
                            }
                            ;
                            return;
                        case constants_1.DiscordKeys.TIMESTAMPS:
                            {
                                if (this.timestamps) {
                                    this.timestamps.merge(value);
                                }
                                else {
                                    this.timestamps = new PresenceActivityTimestamps(this, value);
                                }
                            }
                            ;
                            return;
                    }
                }
                else {
                    value = undefined;
                }
                return this._setFromSnake(key, value);
            }
        }
        return super.mergeValue(key, value);
    }
    toString() {
        return `${this.typeText} ${this.name}`;
    }
}
exports.PresenceActivity = PresenceActivity;
const keysPresenceActivityAssets = new baseset_1.BaseSet([
    constants_1.DiscordKeys.LARGE_IMAGE,
    constants_1.DiscordKeys.LARGE_TEXT,
    constants_1.DiscordKeys.SMALL_IMAGE,
    constants_1.DiscordKeys.SMALL_TEXT,
]);
const keysMergePresenceActivityAssets = keysPresenceActivityAssets;
/**
 * Presence Activity Assets Structure, used in [PresenceActivity]
 * @category Structure
 */
class PresenceActivityAssets extends basestructure_1.BaseStructure {
    constructor(activity, data) {
        super(activity.client);
        this._keys = keysPresenceActivityAssets;
        this._keysMerge = keysMergePresenceActivityAssets;
        this.activity = activity;
        this.merge(data);
    }
    get imageUrl() {
        return this.imageUrlFormat();
    }
    get largeImageUrl() {
        return this.largeImageUrlFormat();
    }
    get smallImageUrl() {
        return this.smallImageUrlFormat();
    }
    imageUrlFormat(format, query, hash) {
        if (hash === undefined) {
            hash = this.largeImage || this.smallImage;
        }
        if (!hash) {
            return null;
        }
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        if (hash.includes(':')) {
            const [platform, id] = hash.split(':');
            switch (platform) {
                case constants_1.PlatformTypes.SPOTIFY:
                    {
                        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.CUSTOM_SPOTIFY(id), query);
                    }
                    ;
                case constants_1.PlatformTypes.TWITCH:
                    {
                        let height = exports.ImageSizes.LARGE;
                        let width = exports.ImageSizes.LARGE;
                        if (query) {
                            if (query.size !== undefined) {
                                height = query.size;
                                width = query.size;
                            }
                        }
                        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.CUSTOM_TWITCH(id, height, width), query);
                    }
                    ;
            }
        }
        else {
            // treat it as a normal hash
            return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.APP_ASSET(this.activity.applicationId, hash, format), query);
        }
        return null;
    }
    largeImageUrlFormat(format, query) {
        return this.imageUrlFormat(format, query, this.largeImage || null);
    }
    smallImageUrlFormat(format, query) {
        return this.imageUrlFormat(format, query, this.smallImage || null);
    }
    mergeValue(key, value) {
        return this._setFromSnake(key, value);
    }
}
exports.PresenceActivityAssets = PresenceActivityAssets;
const keysPresenceActivityTimestamps = new baseset_1.BaseSet([
    constants_1.DiscordKeys.END,
    constants_1.DiscordKeys.START,
]);
const keysMergePresenceActivityTimestamps = keysPresenceActivityTimestamps;
/**
 * Presence Activity Timestamp Structure
 * used to describe when they started doing an activity and if they ended it or not
 * @category Structure
 */
class PresenceActivityTimestamps extends basestructure_1.BaseStructure {
    constructor(activity, data) {
        super(activity.client);
        this._keys = keysPresenceActivityTimestamps;
        this._keysMerge = keysMergePresenceActivityTimestamps;
        this.end = 0;
        this.start = 0;
        this.activity = activity;
        this.merge(data);
    }
    get elapsedTime() {
        let elapsed;
        if (this.start) {
            elapsed = Math.max(Date.now() - this.start, 0);
        }
        else {
            elapsed = Date.now();
        }
        const total = this.totalTime;
        if (total) {
            return Math.min(elapsed, total);
        }
        return elapsed;
    }
    get totalTime() {
        if (this.end) {
            if (this.start) {
                return this.end - this.start;
            }
            return this.end;
        }
        return 0;
    }
    mergeValue(key, value) {
        return this._setFromSnake(key, value);
    }
}
exports.PresenceActivityTimestamps = PresenceActivityTimestamps;

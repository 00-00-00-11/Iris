"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMe = exports.Guild = exports.BaseGuild = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const basecollection_1 = require("../collections/basecollection");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const basestructure_1 = require("./basestructure");
const channel_1 = require("./channel");
const emoji_1 = require("./emoji");
const member_1 = require("./member");
const role_1 = require("./role");
const user_1 = require("./user");
const voicestate_1 = require("./voicestate");
const keysBaseGuild = new baseset_1.BaseSet([
    constants_1.DiscordKeys.FEATURES,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
]);
/**
 * Base Guild Structure
 * @category Structure
 */
class BaseGuild extends basestructure_1.BaseStructure {
    constructor(client, data, merge = true) {
        super(client);
        this._keys = keysBaseGuild;
        this.features = new baseset_1.BaseSet();
        this.icon = null;
        this.id = '';
        this.name = '';
        if (merge) {
            this.merge(data);
        }
    }
    get acronym() {
        return utils_1.getAcronym(this.name);
    }
    get canHaveBanner() {
        return this.isVerified || this.hasFeature(constants_1.GuildFeatures.BANNER);
    }
    get canHaveDiscoveryFeatures() {
        return this.isDiscoverable || this.isPublic;
    }
    get canHaveNews() {
        return this.hasFeature(constants_1.GuildFeatures.NEWS);
    }
    get canHavePublic() {
        return !this.hasFeature(constants_1.GuildFeatures.PUBLIC_DISABLED);
    }
    get canHaveSplash() {
        return this.hasFeature(constants_1.GuildFeatures.INVITE_SPLASH);
    }
    get canHaveStore() {
        return this.hasFeature(constants_1.GuildFeatures.COMMERCE);
    }
    get canHaveVanityUrl() {
        return this.hasFeature(constants_1.GuildFeatures.VANITY_URL);
    }
    get canHaveVipRegions() {
        return this.hasFeature(constants_1.GuildFeatures.VIP_REGIONS);
    }
    get createdAt() {
        return new Date(this.createdAtUnix);
    }
    get createdAtUnix() {
        return utils_1.Snowflake.timestamp(this.id);
    }
    get iconUrl() {
        return this.iconUrlFormat();
    }
    get isDiscoverable() {
        return this.hasFeature(constants_1.GuildFeatures.DISCOVERABLE);
    }
    get isPartnered() {
        return this.hasFeature(constants_1.GuildFeatures.PARTNERED);
    }
    get isPublic() {
        return this.hasFeature(constants_1.GuildFeatures.PUBLIC) && !this.hasFeature(constants_1.GuildFeatures.PUBLIC_DISABLED);
    }
    get isVerified() {
        return this.hasFeature(constants_1.GuildFeatures.VERIFIED);
    }
    get jumpLink() {
        return iris_client_rest_1.Endpoints.Routes.URL + irisiris_client_rest_1ts.Routes.GUILD(this.id);
    }
    get widgetImageUrl() {
        return iris_client_rest_1.Endpoints.Api.URL_STABLE + irisiris_client_rest_1ts.Api.PATH + iris_cliiris_client_rest_1ormatRoute(iris_client_iris_client_rest_1UILD_WIDGET_PNG, {
            guildId: this.id,
        });
    }
    get widgetUrl() {
        return iris_client_rest_1.Endpoints.Api.URL_STABLE + irisiris_client_rest_1ts.RoutesQuery.WIDGET(this.id, { theme: 'dark' });
    }
    hasFeature(feature) {
        return this.features.has(feature);
    }
    iconUrlFormat(format, query) {
        if (!this.icon) {
            return null;
        }
        const hash = this.icon;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + irisiris_client_rest_1ts.CDN.GUILD_ICON(this.id, hash, format), query);
    }
    widgetImageUrlFormat(query) {
        return utils_1.addQuery(this.widgetImageUrl, query);
    }
    widgetUrlFormat(options = {}) {
        return iris_client_rest_1.Endpoints.Api.URL_STABLE + irisiris_client_rest_1ts.RoutesQuery.WIDGET(this.id, options);
    }
    async ack() {
        return this.client.rest.ackGuild(this.id);
    }
    async addMember(userId, options) {
        return this.client.rest.addGuildMember(this.id, userId, options);
    }
    async addMemberRole(userId, roleId) {
        return this.client.rest.addGuildMemberRole(this.id, userId, roleId);
    }
    async beginPrune(options = {}) {
        return this.client.rest.beginGuildPrune(this.id, options);
    }
    async createBan(userId, options) {
        return this.client.rest.createGuildBan(this.id, userId, options);
    }
    async createChannel(options) {
        return this.client.rest.createGuildChannel(this.id, options);
    }
    async createEmoji(options) {
        return this.client.rest.createGuildEmoji(this.id, options);
    }
    async createIntegration(options) {
        return this.client.rest.createGuildIntegration(this.id, options);
    }
    async createRole(options) {
        return this.client.rest.createGuildRole(this.id, options);
    }
    async createTemplate(options) {
        return this.client.rest.createGuildTemplate(this.id, options);
    }
    async delete() {
        return this.client.rest.deleteGuild(this.id);
    }
    async deleteChannel(channelId, options = {}) {
        return this.client.rest.deleteChannel(channelId, options);
    }
    async deleteEmoji(emojiId, options = {}) {
        return this.client.rest.deleteGuildEmoji(this.id, emojiId, options);
    }
    async deleteIntegration(integrationId, options = {}) {
        return this.client.rest.deleteGuildIntegration(this.id, integrationId, options);
    }
    async deletePremiumSubscription(subscriptionId) {
        return this.client.rest.deleteGuildPremiumSubscription(this.id, subscriptionId);
    }
    async deleteRole(roleId, options = {}) {
        return this.client.rest.deleteGuildRole(this.id, roleId, options);
    }
    async deleteTemplate(templateId) {
        return this.client.rest.deleteGuildTemplate(this.id, templateId);
    }
    async edit(options) {
        return this.client.rest.editGuild(this.id, options);
    }
    async editChannel(channelId, options) {
        return this.client.rest.editChannel(channelId, options);
    }
    async editChannelPositions(channels, options = {}) {
        return this.client.rest.editGuildChannels(this.id, channels, options);
    }
    async editEmbed(options) {
        return this.client.rest.editGuildEmbed(this.id, options);
    }
    async editEmoji(emojiId, options) {
        return this.client.rest.editGuildEmoji(this.id, emojiId, options);
    }
    async editIntegration(integrationId, options) {
        return this.client.rest.editGuildIntegration(this.id, integrationId, options);
    }
    async editMember(userId, options) {
        return this.client.rest.editGuildMember(this.id, userId, options);
    }
    async editMfaLevel(options) {
        return this.client.rest.editGuildMfaLevel(this.id, options);
    }
    async editNick(nick, options = {}) {
        return this.client.rest.editGuildNick(this.id, nick, options);
    }
    async editRole(roleId, options) {
        return this.client.rest.editGuildRole(this.id, roleId, options);
    }
    async editRolePositions(roles, options = {}) {
        return this.client.rest.editGuildRolePositions(this.id, roles, options);
    }
    async editVanityUrl(code, options = {}) {
        return this.client.rest.editGuildVanity(this.id, code, options);
    }
    async fetchApplications(channelId) {
        return this.client.rest.fetchGuildApplications(this.id, channelId);
    }
    async fetchAuditLogs(options) {
        return this.client.rest.fetchGuildAuditLogs(this.id, options);
    }
    async fetchBans() {
        return this.client.rest.fetchGuildBans(this.id);
    }
    async fetchChannels() {
        return this.client.rest.fetchGuildChannels(this.id);
    }
    async fetchEmbed() {
        return this.client.rest.fetchGuildEmbed(this.id);
    }
    async fetchEmoji(emojiId) {
        return this.client.rest.fetchGuildEmoji(this.id, emojiId);
    }
    async fetchEmojis() {
        return this.client.rest.fetchGuildEmojis(this.id);
    }
    async fetchInvites() {
        return this.client.rest.fetchGuildInvites(this.id);
    }
    async fetchIntegrations() {
        return this.client.rest.fetchGuildIntegrations(this.id);
    }
    async fetchMember(userId) {
        return this.client.rest.fetchGuildMember(this.id, userId);
    }
    async fetchMembers(options) {
        return this.client.rest.fetchGuildMembers(this.id, options);
    }
    async fetchMembersSearch(options) {
        return this.client.rest.fetchGuildMembersSearch(this.id, options);
    }
    async fetchPremiumSubscriptions() {
        return this.client.rest.fetchGuildPremiumSubscriptions(this.id);
    }
    async fetchPruneCount() {
        return this.client.rest.fetchGuildPruneCount(this.id);
    }
    async fetchRoles() {
        return this.client.rest.fetchGuildRoles(this.id);
    }
    async fetchTemplates() {
        return this.client.rest.fetchGuildTemplates(this.id);
    }
    async fetchVanityUrl() {
        return this.client.rest.fetchGuildVanityUrl(this.id);
    }
    async fetchVoiceRegions() {
        return this.client.rest.fetchVoiceRegions(this.id);
    }
    async fetchWebhooks() {
        return this.client.rest.fetchGuildWebhooks(this.id);
    }
    async fetchWidget() {
        return this.client.rest.fetchGuildWidget(this.id);
    }
    async fetchWidgetJson() {
        return this.client.rest.fetchGuildWidgetJson(this.id);
    }
    async fetchWidgetPng(options = {}) {
        return this.client.rest.fetchGuildWidgetPng(this.id, options);
    }
    async join(options) {
        return this.client.rest.joinGuild(this.id, options);
    }
    async leave() {
        return this.client.rest.leaveGuild(this.id);
    }
    async removeBan(userId, options = {}) {
        return this.client.rest.removeGuildBan(this.id, userId, options);
    }
    async removeMember(userId, options = {}) {
        return this.client.rest.removeGuildMember(this.id, userId, options);
    }
    async removeMemberRole(userId, roleId, options = {}) {
        return this.client.rest.removeGuildMemberRole(this.id, userId, roleId, options);
    }
    async requestMembers(options) {
        return this.client.requestGuildMembers(this.id, options);
    }
    async search(options, retry) {
        return this.client.rest.searchGuild(this.id, options, retry);
    }
    async syncIntegration(integrationId) {
        return this.client.rest.syncGuildIntegration(this.id, integrationId);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.FEATURES:
                    {
                        if (this.features) {
                            this.features.clear();
                            for (let raw of value) {
                                this.features.add(raw);
                            }
                        }
                        else {
                            this.features = new baseset_1.BaseSet(value);
                        }
                    }
                    ;
                    return;
            }
            super.mergeValue(key, value);
        }
    }
    toString() {
        return this.name;
    }
}
exports.BaseGuild = BaseGuild;
const keysGuild = new baseset_1.BaseSet([
    constants_1.DiscordKeys.AFK_CHANNEL_ID,
    constants_1.DiscordKeys.AFK_TIMEOUT,
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.BANNER,
    constants_1.DiscordKeys.CHANNELS,
    constants_1.DiscordKeys.DEFAULT_MESSAGE_NOTIFICATIONS,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.DISCOVERY_SPLASH,
    constants_1.DiscordKeys.EMBED_CHANNEL_ID,
    constants_1.DiscordKeys.EMBED_ENABLED,
    constants_1.DiscordKeys.EMOJIS,
    constants_1.DiscordKeys.EXPLICIT_CONTENT_FILTER,
    constants_1.DiscordKeys.FEATURES,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.IS_PARTIAL,
    constants_1.DiscordKeys.JOINED_AT,
    constants_1.DiscordKeys.LARGE,
    constants_1.DiscordKeys.LAZY,
    constants_1.DiscordKeys.MAX_MEMBERS,
    constants_1.DiscordKeys.MAX_PRESENCES,
    constants_1.DiscordKeys.MAX_VIDEO_CHANNEL_USERS,
    constants_1.DiscordKeys.MEMBER_COUNT,
    constants_1.DiscordKeys.MEMBERS,
    constants_1.DiscordKeys.MFA_LEVEL,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.OWNER_ID,
    constants_1.DiscordKeys.PREFERRED_LOCALE,
    constants_1.DiscordKeys.PREMIUM_SUBSCRIPTION_COUNT,
    constants_1.DiscordKeys.PREMIUM_TIER,
    constants_1.DiscordKeys.PRESENCES,
    constants_1.DiscordKeys.PUBLIC_UPDATES_CHANNEL_ID,
    constants_1.DiscordKeys.REGION,
    constants_1.DiscordKeys.ROLES,
    constants_1.DiscordKeys.RULES_CHANNEL_ID,
    constants_1.DiscordKeys.SPLASH,
    constants_1.DiscordKeys.SYSTEM_CHANNEL_FLAGS,
    constants_1.DiscordKeys.SYSTEM_CHANNEL_ID,
    constants_1.DiscordKeys.UNAVAILABLE,
    constants_1.DiscordKeys.VANITY_URL_CODE,
    constants_1.DiscordKeys.VERIFICATION_LEVEL,
    constants_1.DiscordKeys.VOICE_STATES,
    constants_1.DiscordKeys.WIDGET_CHANNEL_ID,
    constants_1.DiscordKeys.WIDGET_ENABLED,
]);
const keysMergeGuild = new baseset_1.BaseSet([
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.JOINED_AT,
    constants_1.DiscordKeys.ROLES,
    constants_1.DiscordKeys.MEMBERS,
    constants_1.DiscordKeys.PRESENCES,
]);
const keysSkipDifferenceGuild = new baseset_1.BaseSet([
    constants_1.DiscordKeys.EMOJIS,
    constants_1.DiscordKeys.MEMBERS,
    constants_1.DiscordKeys.PRESENCES,
    constants_1.DiscordKeys.ROLES,
]);
/**
 * Guild Structure
 * @category Structure
 */
class Guild extends BaseGuild {
    constructor(client, data, cache = {}) {
        super(client, data, false);
        this._keys = keysGuild;
        this._keysMerge = keysMergeGuild;
        this._keysSkipDifference = keysSkipDifferenceGuild;
        this._fromRest = false;
        this.afkChannelId = null;
        this.afkTimeout = 0;
        this.banner = null;
        this.defaultMessageNotifications = 0;
        this.description = null;
        this.embedChannelId = null;
        this.embedEnabled = false;
        this.explicitContentFilter = constants_1.GuildExplicitContentFilterTypes.DISABLED;
        this.features = new baseset_1.BaseSet();
        this.discoverySplash = null;
        this.hasMetadata = false;
        this.icon = null;
        this.id = '';
        this.isPartial = false;
        this.isReady = false;
        this.joinedAtUnix = 0;
        this.large = false;
        this.lazy = false;
        this.left = false;
        this.maxMembers = constants_1.DEFAULT_MAX_MEMBERS;
        this.maxPresences = constants_1.DEFAULT_MAX_PRESENCES;
        this.maxVideoChannelUsers = constants_1.DEFAULT_MAX_VIDEO_CHANNEL_USERS;
        this.memberCount = 0;
        this.mfaLevel = constants_1.MfaLevels.NONE;
        this.name = '';
        this.ownerId = '';
        this.preferredLocale = constants_1.Locales.ENGLISH_US;
        this.premiumSubscriptionCount = 0;
        this.premiumTier = constants_1.PremiumGuildTiers.NONE;
        this.publicUpdatesChannelId = null;
        this.region = '';
        this.rulesChannelId = null;
        this.splash = null;
        this.systemChannelFlags = 0;
        this.systemChannelId = null;
        this.unavailable = false;
        this.vanityUrlCode = null;
        this.verificationLevel = 0;
        this.widgetChannelId = null;
        this.widgetEnabled = false;
        this.emojis = new basecollection_1.BaseCollection(cache.emojis || this.client.emojis.options);
        this.members = new basecollection_1.BaseCollection(cache.members || this.client.members.options);
        this.roles = new basecollection_1.BaseCollection(cache.roles || this.client.roles.options);
        this._fromRest = !!cache.fromRest;
        this.merge(data);
    }
    get afkChannel() {
        if (this.afkChannelId) {
            return this.client.channels.get(this.afkChannelId) || null;
        }
        return null;
    }
    get bannerUrl() {
        return this.bannerUrlFormat();
    }
    get categoryChannels() {
        const collection = new basecollection_1.BaseCollection();
        for (const [channelId, channel] of this.client.channels) {
            if (channel.isGuildCategory && channel.guildId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
    get channels() {
        const collection = new basecollection_1.BaseCollection();
        for (const [channelId, channel] of this.client.channels) {
            if (channel.guildId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
    get defaultRole() {
        return this.roles.get(this.id) || null;
    }
    get discoverySplashUrl() {
        return this.discoverySplashUrlFormat();
    }
    get hasSystemChannelSuppressJoinNotifications() {
        return this.hasSystemChannelFlag(constants_1.SystemChannelFlags.SUPPRESS_JOIN_NOTIFICATIONS);
    }
    get hasSystemChannelSuppressPremiumSubscriptions() {
        return this.hasSystemChannelFlag(constants_1.SystemChannelFlags.SUPPRESS_PREMIUM_SUBSCRIPTIONS);
    }
    get joinedAt() {
        if (this.joinedAtUnix) {
            return new Date(this.joinedAtUnix);
        }
        return null;
    }
    get maxAttachmentSize() {
        const max = constants_1.MAX_ATTACHMENT_SIZE;
        return Math.max(max, constants_1.PremiumGuildLimits[this.premiumTier].attachment);
    }
    get maxBitrate() {
        let max = constants_1.MAX_BITRATE;
        if (this.canHaveVipRegions) {
            max = constants_1.PremiumGuildLimits[constants_1.PremiumGuildTiers.TIER_3].bitrate;
        }
        return Math.max(max, constants_1.PremiumGuildLimits[this.premiumTier].bitrate);
    }
    get maxEmojis() {
        const max = (this.hasFeature(constants_1.GuildFeatures.MORE_EMOJI) ? constants_1.MAX_EMOJI_SLOTS_MORE : constants_1.MAX_EMOJI_SLOTS);
        return Math.max(max, constants_1.PremiumGuildLimits[this.premiumTier].emoji);
    }
    get me() {
        if (this.client.user) {
            return this.members.get(this.client.user.id) || null;
        }
        return null;
    }
    get messages() {
        const collection = new basecollection_1.BaseCollection();
        for (let [messageId, message] of this.client.messages) {
            if (message.guildId === this.id) {
                collection.set(messageId, message);
            }
        }
        return collection;
    }
    get owner() {
        return this.client.users.get(this.ownerId) || null;
    }
    get preferredLocaleText() {
        if (this.preferredLocale in constants_1.LocalesText) {
            return constants_1.LocalesText[this.preferredLocale];
        }
        return '';
    }
    get presences() {
        const collection = new basecollection_1.BaseCollection();
        for (let [userId, presence] of this.client.presences) {
            if (presence._hasGuildId(this.id)) {
                collection.set(userId, presence);
            }
        }
        return collection;
    }
    get publicUpdatesChannel() {
        if (this.publicUpdatesChannelId) {
            return this.client.channels.get(this.publicUpdatesChannelId) || null;
        }
        return null;
    }
    get rulesChannel() {
        if (this.rulesChannelId) {
            return this.client.channels.get(this.rulesChannelId) || null;
        }
        return null;
    }
    get splashUrl() {
        return this.splashUrlFormat();
    }
    get storeChannels() {
        const collection = new basecollection_1.BaseCollection();
        for (const [channelId, channel] of this.client.channels) {
            if (channel.isGuildStore && channel.guildId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
    get systemChannel() {
        if (this.systemChannelId) {
            return this.client.channels.get(this.systemChannelId) || null;
        }
        return null;
    }
    get textChannels() {
        const collection = new basecollection_1.BaseCollection();
        for (const [channelId, channel] of this.client.channels) {
            if (channel.isGuildText && channel.guildId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
    get voiceChannels() {
        const collection = new basecollection_1.BaseCollection();
        for (const [channelId, channel] of this.client.channels) {
            if (channel.isGuildVoice && channel.guildId === this.id) {
                collection.set(channelId, channel);
            }
        }
        return collection;
    }
    get voiceStates() {
        if (this.client.voiceStates.has(this.id)) {
            return this.client.voiceStates.get(this.id);
        }
        return basecollection_1.emptyBaseCollection;
    }
    bannerUrlFormat(format, query) {
        if (!this.banner) {
            return null;
        }
        const hash = this.banner;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.GUILD_BANNER(this.id, hash, format), query);
    }
    can(permissions, member, options = {}) {
        const ignoreAdministrator = !!options.ignoreAdministrator;
        const ignoreOwner = !!options.ignoreOwner;
        if (!ignoreOwner) {
            let memberId;
            if (member) {
                memberId = member.id;
            }
            else {
                if (!this.client.user) {
                    throw new Error('Provide a member object please');
                }
                memberId = this.client.user.id;
            }
            if (this.isOwner(memberId)) {
                return true;
            }
        }
        if (!member) {
            member = this.me;
        }
        if (member) {
            const total = member.permissions;
            if (!ignoreAdministrator && utils_1.PermissionTools.checkPermissions(total, constants_1.Permissions.ADMINISTRATOR)) {
                return true;
            }
            return utils_1.PermissionTools.checkPermissions(total, permissions);
        }
        return false;
    }
    discoverySplashUrlFormat(format, query) {
        if (!this.discoverySplash) {
            return null;
        }
        const hash = this.discoverySplash;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + irisiris_client_rest_1ts.CDN.GUILD_SPLASH(this.id, hash, format), query);
    }
    hasSystemChannelFlag(flag) {
        return (this.systemChannelFlags & flag) === flag;
    }
    isOwner(userId) {
        return this.ownerId === userId;
    }
    splashUrlFormat(format, query) {
        if (!this.splash) {
            return null;
        }
        const hash = this.splash;
        format = utils_1.getFormatFromHash(hash, format, this.client.imageFormat);
        return utils_1.addQuery(iris_client_rest_1.Endpoints.CDN.URL + iris_client_rest_1.Endpoints.CDN.GUILD_SPLASH(this.id, hash, format), query);
    }
    async fetchVoiceRegion() {
        const regions = await this.fetchVoiceRegions();
        const region = regions.find((reg) => reg.id === this.region);
        if (!region) {
            throw new Error('Couldn\'t find this server\'s region from discord.');
        }
        return region;
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.CHANNELS:
                    {
                        if (this.client.channels.enabled && !this._fromRest) {
                            for (let raw of value) {
                                let channel;
                                if (this.client.channels.has(raw.id)) {
                                    channel = this.client.channels.get(raw.id);
                                    channel.merge(raw);
                                }
                                else {
                                    raw.guild_id = this.id;
                                    channel = channel_1.createChannelFromData(this.client, raw);
                                    this.client.channels.insert(channel);
                                }
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.EMOJIS:
                    {
                        if (this.client.emojis.enabled) {
                            const emojis = [];
                            for (let raw of value) {
                                let emoji;
                                if (this.emojis.has(raw.id)) {
                                    emoji = this.emojis.get(raw.id);
                                    emoji.merge(raw);
                                }
                                else {
                                    raw.guild_id = this.id;
                                    emoji = new emoji_1.Emoji(this.client, raw);
                                }
                                emojis.push(emoji);
                            }
                            this.emojis.clear();
                            for (let emoji of emojis) {
                                this.emojis.set(emoji.id || emoji.name, emoji);
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.JOINED_AT:
                    {
                        this.joinedAtUnix = (value) ? (new Date(value)).getTime() : 0;
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.MAX_PRESENCES:
                    {
                        if (value === null) {
                            value = constants_1.DEFAULT_MAX_PRESENCES;
                        }
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.MEMBERS:
                    {
                        this.members.clear();
                        for (let raw of value) {
                            if (this.client.user && this.client.user.id === raw.user.id) {
                                raw.guild_id = this.id;
                                const member = new member_1.Member(this.client, raw);
                                this.members.set(member.id, member);
                                continue;
                            }
                            if (this.client.members.enabled) {
                                let member;
                                if (this.members.has(raw.user.id)) {
                                    member = this.members.get(raw.user.id);
                                    member.merge(raw);
                                }
                                else {
                                    raw.guild_id = this.id;
                                    member = new member_1.Member(this.client, raw);
                                    this.members.set(member.id, member);
                                }
                            }
                            else if (this.client.presences.enabled || this.client.users.enabled) {
                                let user;
                                if (this.client.users.has(raw.user.id)) {
                                    user = this.client.users.get(raw.user.id);
                                    user.merge(raw.user);
                                }
                                else {
                                    user = new user_1.User(this.client, raw.user);
                                    this.client.users.insert(user);
                                }
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.ROLES:
                    {
                        if (this.client.roles.enabled) {
                            const roles = [];
                            for (let raw of value) {
                                let role;
                                if (this.roles.has(raw.id)) {
                                    role = this.roles.get(raw.id);
                                    role.merge(raw);
                                }
                                else {
                                    raw.guild_id = this.id;
                                    role = new role_1.Role(this.client, raw);
                                }
                                roles.push(role);
                            }
                            this.roles.clear();
                            for (let role of roles) {
                                this.roles.set(role.id, role);
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.PREMIUM_SUBSCRIPTION_COUNT:
                    {
                        value = value || 0;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.PRESENCES:
                    {
                        this.client.presences.clearGuildId(this.id);
                        if (this.client.presences.enabled) {
                            for (let raw of value) {
                                raw.guild_id = this.id;
                                this.client.presences.insert(raw);
                            }
                        }
                    }
                    ;
                    return;
                case constants_1.DiscordKeys.VOICE_STATES:
                    {
                        if (this.client.voiceStates.enabled) {
                            const cache = this.client.voiceStates.insertCache(this.id);
                            cache.clear();
                            for (let raw of value) {
                                if (cache.has(raw.user_id)) {
                                    const voiceState = cache.get(raw.user_id);
                                    voiceState.merge(raw);
                                }
                                else {
                                    raw.guild_id = this.id;
                                    const voiceState = new voicestate_1.VoiceState(this.client, raw);
                                    if (!voiceState.member && this.members.has(voiceState.userId)) {
                                        voiceState.member = this.members.get(voiceState.userId);
                                    }
                                    cache.set(voiceState.userId, voiceState);
                                }
                            }
                        }
                    }
                    ;
                    return;
            }
            super.mergeValue(key, value);
        }
    }
}
exports.Guild = Guild;
const keysGuildMe = new baseset_1.BaseSet([
    constants_1.DiscordKeys.FEATURES,
    constants_1.DiscordKeys.ICON,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.OWNER,
    constants_1.DiscordKeys.PERMISSIONS,
]);
/**
 * Guild Me Structure
 * @category Structure
 */
class GuildMe extends BaseGuild {
    constructor(client, data) {
        super(client, data, false);
        this._keys = keysGuildMe;
        this.owner = false;
        this.permissions = constants_1.Permissions.NONE;
        this.merge(data);
    }
    can(permissions, options = {}) {
        const ignoreAdministrator = !!options.ignoreAdministrator;
        const ignoreOwner = !!options.ignoreOwner;
        if (!ignoreOwner) {
            if (this.owner) {
                return true;
            }
        }
        const total = this.permissions;
        if (!ignoreAdministrator && utils_1.PermissionTools.checkPermissions(total, constants_1.Permissions.ADMINISTRATOR)) {
            return true;
        }
        return utils_1.PermissionTools.checkPermissions(total, permissions);
    }
    mergeValue(key, value) {
        switch (key) {
            case constants_1.DiscordKeys.PERMISSIONS:
                {
                    value = BigInt(value);
                }
                ;
                break;
        }
        return super.mergeValue(key, value);
    }
}
exports.GuildMe = GuildMe;

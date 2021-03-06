"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const constants_1 = require("../../Iris-Client-Rest/Library/constants");
const basecollection_1 = require("../collections/basecollection");
const constants_2 = require("../constants");
const structures_1 = require("../structures");
class RestClient {
    constructor(token, options, client) {
        this.raw = new iris_client_rest_1.Client(token, options);
        this.client = client;
        Object.defineProperty(this, 'client', { enumerable: false, writable: false });
        this.raw.on(constants_1.RestEvents.REQUEST, (payload) => this.client.emit(constants_2.ClientEvents.REST_REQUEST, payload));
        this.raw.on(constants_1.RestEvents.RESPONSE, (payload) => this.client.emit(constants_2.ClientEvents.REST_RESPONSE, payload));
    }
    get isBot() {
        return this.raw.isBot;
    }
    get isUser() {
        return this.raw.isUser;
    }
    setAuthType(type) {
        return this.raw.setAuthType(type);
    }
    async request(info, init) {
        return this.raw.request(info, init);
    }
    async delete(info, init) {
        return this.raw.delete(info, init);
    }
    async get(info, init) {
        return this.raw.get(info, init);
    }
    async head(info, init) {
        return this.raw.head(info, init);
    }
    async options(info, init) {
        return this.raw.options(info, init);
    }
    async patch(info, init) {
        return this.raw.patch(info, init);
    }
    async put(info, init) {
        return this.raw.put(info, init);
    }
    /* -- Rest Requests Start -- */
    acceptAgreements(privacy = true, terms = true) {
        return this.raw.acceptAgreements(privacy, terms);
    }
    acceptInvite(code) {
        return this.raw.acceptInvite(code);
    }
    acceptTeamInvite(token) {
        return this.raw.acceptTeamInvite(token);
    }
    ackChannelMessage(channelId, messageId, token) {
        return this.raw.ackChannelMessage(channelId, messageId, token);
    }
    ackChannelPins(channelId) {
        return this.raw.ackChannelPins(channelId);
    }
    ackGuild(guildId) {
        return this.raw.ackGuild(guildId);
    }
    async acceptTemplate(templateId, options) {
        const data = await this.raw.acceptTemplate(templateId, options);
        let guild;
        if (this.client.guilds.has(data.id)) {
            guild = this.client.guilds.get(data.id);
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data);
            this.client.guilds.insert(guild);
        }
        return guild;
    }
    activateOauth2ApplicationLicense(applicationId, options) {
        return this.raw.activateOauth2ApplicationLicense(applicationId, options);
    }
    addConnection(platform, accountId, options) {
        return this.raw.addConnection(platform, accountId, options);
    }
    addGuildMember(guildId, userId, options) {
        return this.raw.addGuildMember(guildId, userId, options);
    }
    addGuildMemberRole(guildId, userId, roleId, options = {}) {
        return this.raw.addGuildMemberRole(guildId, userId, roleId, options);
    }
    addPinnedMessage(channelId, messageId) {
        return this.raw.addPinnedMessage(channelId, messageId);
    }
    addRecipient(channelId, userId) {
        return this.raw.addRecipient(channelId, userId);
    }
    addOauth2ApplicationWhitelistUser(applicationId, options) {
        return this.raw.addOauth2ApplicationWhitelistUser(applicationId, options);
    }
    addTeamMember(teamId, options) {
        return this.raw.addTeamMember(teamId, options);
    }
    authorizeIpAddress(options) {
        return this.raw.authorizeIpAddress(options);
    }
    beginGuildPrune(guildId, options = {}) {
        return this.raw.beginGuildPrune(guildId, options);
    }
    bulkDeleteMessages(channelId, messageIds) {
        return this.raw.bulkDeleteMessages(channelId, messageIds);
    }
    connectionCallback(platform, options) {
        return this.raw.connectionCallback(platform, options);
    }
    async createApplicationNews(options) {
        const data = await this.raw.createApplicationNews(options);
        return new structures_1.ApplicationNews(this.client, data);
    }
    async createChannelInvite(channelId, options = {}) {
        const data = await this.raw.createChannelInvite(channelId, options);
        return new structures_1.Invite(this.client, data);
    }
    createChannelStoreListingGrantEntitlement(channelId) {
        return this.raw.createChannelStoreListingGrantEntitlement(channelId);
    }
    async createDm(options = {}) {
        const data = await this.raw.createDm(options);
        let channel;
        if (this.client.channels.has(data.id)) {
            channel = this.client.channels.get(data.id);
            channel.merge(data);
            // this should never happen lmao
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
            this.client.channels.insert(channel);
        }
        return channel;
    }
    async createGuild(options) {
        const data = await this.raw.createGuild(options);
        let guild;
        if (this.client.guilds.has(data.id)) {
            guild = this.client.guilds.get(data.id);
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data);
            this.client.guilds.insert(guild);
        }
        return guild;
    }
    createGuildBan(guildId, userId, options = {}) {
        // make into object?
        return this.raw.createGuildBan(guildId, userId, options);
    }
    async createGuildChannel(guildId, options, updateCache = true) {
        const data = await this.raw.createGuildChannel(guildId, options);
        let channel;
        if (updateCache && this.client.channels.has(data.id)) {
            channel = this.client.channels.get(data.id);
            channel.merge(data);
            // this should never happen lmao
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
            this.client.channels.insert(channel);
        }
        return channel;
    }
    async createGuildEmoji(guildId, options, updateCache = true) {
        const data = await this.raw.createGuildEmoji(guildId, options);
        let emoji;
        if (updateCache && this.client.emojis.has(guildId, data.id)) {
            emoji = this.client.emojis.get(guildId, data.id);
            emoji.merge(data);
        }
        else {
            data.guild_id = guildId;
            emoji = new structures_1.Emoji(this.client, data);
            this.client.emojis.insert(emoji);
        }
        return emoji;
    }
    createGuildIntegration(guildId, options) {
        // make this into object?
        return this.raw.createGuildIntegration(guildId, options);
    }
    async createGuildRole(guildId, options = {}) {
        const data = await this.raw.createGuildRole(guildId, options);
        data.guild_id = guildId;
        const role = new structures_1.Role(this.client, data);
        if (this.client.guilds.has(guildId)) {
            this.client.guilds.get(guildId).roles.set(role.id, role);
        }
        return role;
    }
    async createGuildTemplate(guildId, options) {
        const data = await this.raw.createGuildTemplate(guildId, options);
        return new structures_1.Template(this.client, data);
    }
    createLobby(applicationId, options = {}) {
        return this.raw.createLobby(applicationId, options);
    }
    createMeBillingPaymentSource(options) {
        return this.raw.createMeBillingPaymentSource(options);
    }
    createMeBillingSubscription(options) {
        return this.raw.createMeBillingSubscription(options);
    }
    async createMessage(channelId, options = {}) {
        const data = await this.raw.createMessage(channelId, options);
        if (this.client.channels.has(data.channel_id)) {
            const channel = this.client.channels.get(data.channel_id);
            if (channel.guildId) {
                data.guild_id = channel.guildId;
            }
        }
        const message = new structures_1.Message(this.client, data);
        this.client.messages.insert(message);
        return message;
    }
    createOauth2Application(options) {
        return this.raw.createOauth2Application(options);
    }
    async createOauth2ApplicationAsset(applicationId, options) {
        const data = await this.raw.createOauth2ApplicationAsset(applicationId, options);
        data.application_id = applicationId;
        return new structures_1.Oauth2ApplicationAsset(this.client, data);
    }
    createOauth2ApplicationBot(applicationId) {
        return this.raw.createOauth2ApplicationBot(applicationId);
    }
    createReaction(channelId, messageId, emoji) {
        return this.raw.createReaction(channelId, messageId, emoji);
    }
    async createStoreApplicationAsset(applicationId, options) {
        const data = await this.raw.createStoreApplicationAsset(applicationId, options);
        data.application_id = applicationId;
        return new structures_1.StoreApplicationAsset(this.client, data);
    }
    createTeam(options = {}) {
        // make this an object?
        return this.raw.createTeam(options);
    }
    async createWebhook(channelId, options) {
        const data = await this.raw.createWebhook(channelId, options);
        return new structures_1.Webhook(this.client, data);
    }
    async crosspostMessage(channelId, messageId) {
        const data = await this.raw.crosspostMessage(channelId, messageId);
        if (this.client.channels.has(data.channel_id)) {
            const channel = this.client.channels.get(data.channel_id);
            if (channel.guildId) {
                data.guild_id = channel.guildId;
            }
        }
        const message = new structures_1.Message(this.client, data);
        this.client.messages.insert(message);
        return message;
    }
    deleteAccount(options) {
        return this.raw.deleteAccount(options);
    }
    async deleteChannel(channelId, options = {}) {
        const data = await this.raw.deleteChannel(channelId, options);
        let channel;
        if (this.client.channels.has(data.id)) {
            channel = this.client.channels.get(data.id);
            this.client.channels.delete(data.id);
            channel.merge(data);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
        }
        return channel;
    }
    deleteChannelOverwrite(channelId, overwriteId, options = {}) {
        return this.raw.deleteChannelOverwrite(channelId, overwriteId, options);
    }
    deleteConnection(platform, accountId) {
        return this.raw.deleteConnection(platform, accountId);
    }
    deleteGuild(guildId, options = {}) {
        return this.raw.deleteGuild(guildId, options);
    }
    deleteGuildEmoji(guildId, emojiId, options = {}) {
        return this.raw.deleteGuildEmoji(guildId, emojiId, options);
    }
    deleteGuildIntegration(guildId, integrationId, options = {}) {
        return this.raw.deleteGuildIntegration(guildId, integrationId, options);
    }
    deleteGuildPremiumSubscription(guildId, subscriptionId) {
        return this.raw.deleteGuildPremiumSubscription(guildId, subscriptionId);
    }
    deleteGuildRole(guildId, roleId, options = {}) {
        return this.raw.deleteGuildRole(guildId, roleId, options);
    }
    deleteGuildTemplate(guildId, templateId) {
        return this.raw.deleteGuildTemplate(guildId, templateId);
    }
    async deleteInvite(code, options = {}) {
        const data = await this.raw.deleteInvite(code, options);
        return new structures_1.Invite(this.client, data);
    }
    deleteLobby(lobbyId) {
        return this.raw.deleteLobby(lobbyId);
    }
    deleteMeBillingPaymentSource(paymentSourceId) {
        return this.raw.deleteMeBillingPaymentSource(paymentSourceId);
    }
    deleteMeBillingSubscription(subscriptionId) {
        return this.raw.deleteMeBillingSubscription(subscriptionId);
    }
    async deleteMessage(channelId, messageId, options = {}) {
        const data = await this.raw.deleteMessage(channelId, messageId, options);
        if (this.client.messages.has(messageId)) {
            const message = this.client.messages.get(messageId);
            message.deleted = true;
        }
        return data;
    }
    deleteOauth2Application(applicationId, options = {}) {
        return this.raw.deleteOauth2Application(applicationId, options);
    }
    deleteOauth2ApplicationAsset(applicationId, assetId) {
        return this.raw.deleteOauth2ApplicationAsset(applicationId, assetId);
    }
    deletePinnedMessage(channelId, messageId) {
        return this.raw.deletePinnedMessage(channelId, messageId);
    }
    deleteReactions(channelId, messageId) {
        return this.raw.deleteReactions(channelId, messageId);
    }
    deleteReactionsEmoji(channelId, messageId, emoji) {
        return this.raw.deleteReactionsEmoji(channelId, messageId, emoji);
    }
    deleteReaction(channelId, messageId, emoji, userId = '@me') {
        return this.raw.deleteReaction(channelId, messageId, emoji, userId);
    }
    deleteRelationship(userId) {
        return this.raw.deleteRelationship(userId);
    }
    deleteStoreApplicationAsset(applicationId, assetId) {
        return this.raw.deleteStoreApplicationAsset(applicationId, assetId);
    }
    deleteTeam(teamId, options = {}) {
        return this.raw.deleteTeam(teamId, options);
    }
    deleteWebhook(webhookId, options = {}) {
        return this.raw.deleteWebhook(webhookId, options);
    }
    deleteWebhookToken(webhookId, token, options = {}) {
        return this.raw.deleteWebhookToken(webhookId, token, options);
    }
    async deleteWebhookTokenMessage(webhookId, token, messageId) {
        const data = await this.raw.deleteWebhookTokenMessage(webhookId, token, messageId);
        if (this.client.messages.has(messageId)) {
            const message = this.client.messages.get(messageId);
            message.deleted = true;
        }
        return data;
    }
    disableAccount(options) {
        return this.raw.disableAccount(options);
    }
    editApplicationNews(newsId, options = {}) {
        return this.raw.editApplicationNews(newsId, options);
    }
    /* Issue with merging data with these edited objects is that the gateway event wont have differences then */
    async editChannel(channelId, options = {}, updateCache = true) {
        const data = await this.raw.editChannel(channelId, options);
        let channel;
        if (updateCache && this.client.channels.has(data.id)) {
            channel = this.client.channels.get(data.id);
            channel.merge(data);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
            // insert? nah
        }
        return channel;
    }
    editChannelOverwrite(channelId, overwriteId, options = {}) {
        return this.raw.editChannelOverwrite(channelId, overwriteId, options);
    }
    editConnection(platform, accountId, options = {}) {
        return this.raw.editConnection(platform, accountId, options);
    }
    async editGuild(guildId, options = {}, updateCache = true) {
        const data = await this.raw.editGuild(guildId, options);
        let guild;
        if (updateCache && this.client.guilds.has(data.id)) {
            guild = this.client.guilds.get(data.id);
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data);
        }
        return guild;
    }
    editGuildChannels(guildId, channels, options = {}) {
        return this.raw.editGuildChannels(guildId, channels, options);
    }
    editGuildEmbed(guildId, options) {
        return this.raw.editGuildEmbed(guildId, options);
    }
    async editGuildEmoji(guildId, emojiId, options = {}, updateCache = true) {
        const data = await this.raw.editGuildEmoji(guildId, emojiId, options);
        let emoji;
        if (updateCache && this.client.emojis.has(guildId, data.id)) {
            emoji = this.client.emojis.get(guildId, data.id);
            emoji.merge(data);
        }
        else {
            data.guild_id = guildId;
            emoji = new structures_1.Emoji(this.client, data);
        }
        return emoji;
    }
    editGuildIntegration(guildId, integrationId, options = {}) {
        return this.raw.editGuildIntegration(guildId, integrationId, options);
    }
    editGuildMember(guildId, userId, options = {}) {
        return this.raw.editGuildMember(guildId, userId, options);
    }
    editGuildMemberVerification(guildId, options = {}) {
        return this.raw.editGuildMemberVerification(guildId, options);
    }
    editGuildMfaLevel(guildId, options) {
        return this.raw.editGuildMfaLevel(guildId, options);
    }
    editGuildNick(guildId, nick, options = {}) {
        return this.raw.editGuildNick(guildId, nick, options);
    }
    async editGuildRole(guildId, roleId, options = {}, updateCache = true) {
        const data = await this.raw.editGuildRole(guildId, roleId, options);
        let role;
        if (updateCache && this.client.guilds.has(guildId)) {
            const guild = this.client.guilds.get(guildId);
            if (guild.roles.has(data.id)) {
                role = guild.roles.get(data.id);
                role.merge(data);
            }
            else {
                data.guild_id = guildId;
                role = new structures_1.Role(this.client, data);
                guild.roles.set(role.id, role);
            }
        }
        else {
            data.guild_id = guildId;
            role = new structures_1.Role(this.client, data);
        }
        return role;
    }
    async editGuildRolePositions(guildId, roles, options = {}, updateCache = true) {
        const data = await this.raw.editGuildRolePositions(guildId, roles, options);
        const collection = new basecollection_1.BaseCollection();
        if (updateCache && this.client.guilds.has(guildId)) {
            const guild = this.client.guilds.get(guildId);
            guild.roles.clear();
            for (let raw of data) {
                raw.guild_id = guildId;
                const role = new structures_1.Role(this.client, raw);
                guild.roles.set(role.id, role);
                collection.set(role.id, role);
            }
        }
        else {
            for (let raw of data) {
                raw.guild_id = guildId;
                const role = new structures_1.Role(this.client, raw);
                collection.set(role.id, role);
            }
        }
        return collection;
    }
    editGuildVanity(guildId, code, options = {}) {
        return this.raw.editGuildVanity(guildId, code, options);
    }
    editLobby(lobbyId, options = {}) {
        return this.raw.editLobby(lobbyId, options);
    }
    editLobbyMember(lobbyId, userId, options = {}) {
        return this.raw.editLobbyMember(lobbyId, userId, options);
    }
    async editMe(options = {}, updateCache = true) {
        const data = await this.raw.editMe(options);
        let user;
        if (updateCache && this.client.user !== null) {
            user = this.client.user;
            user.merge(data);
        }
        else {
            user = new structures_1.UserMe(this.client, data);
        }
        return user;
    }
    editMeBillingPaymentSource(paymentSourceId, options = {}) {
        return this.raw.editMeBillingPaymentSource(paymentSourceId, options);
    }
    editMeBillingSubscription(subscriptionId, options = {}) {
        return this.raw.editMeBillingSubscription(subscriptionId, options);
    }
    async editMessage(channelId, messageId, options = {}, updateCache = true) {
        const data = await this.raw.editMessage(channelId, messageId, options);
        let message;
        if (updateCache && this.client.messages.has(data.id)) {
            message = this.client.messages.get(data.id);
            message.merge(data);
            // should we really merge? the message_update event wont have differences then
        }
        else {
            message = new structures_1.Message(this.client, data);
            this.client.messages.insert(message);
        }
        return message;
    }
    editNote(userId, note) {
        return this.raw.editNote(userId, note);
    }
    editOauth2Application(applicationId, options = {}) {
        return this.raw.editOauth2Application(applicationId, options);
    }
    editRelationship(userId, type) {
        return this.raw.editRelationship(userId, type);
    }
    editSettings(options = {}) {
        return this.raw.editSettings(options);
    }
    async editTeam(teamId, options = {}) {
        return this.raw.editTeam(teamId, options);
    }
    async editUser(options = {}) {
        return this.editMe(options);
    }
    async editWebhook(webhookId, options = {}) {
        const data = await this.raw.editWebhook(webhookId, options);
        return new structures_1.Webhook(this.client, data);
    }
    async editWebhookToken(webhookId, token, options = {}) {
        const data = await this.raw.editWebhookToken(webhookId, token, options);
        return new structures_1.Webhook(this.client, data);
    }
    async editWebhookTokenMessage(webhookId, token, messageId, options = {}, updateCache = true) {
        const data = await this.raw.editWebhookTokenMessage(webhookId, token, messageId, options);
        let message;
        if (updateCache && this.client.messages.has(data.id)) {
            message = this.client.messages.get(data.id);
            message.merge(data);
        }
        else {
            message = new structures_1.Message(this.client, data);
            this.client.messages.insert(message);
        }
        return message;
    }
    enableOauth2ApplicationAssets(applicationId) {
        return this.raw.enableOauth2ApplicationAssets(applicationId);
    }
    enableOauth2ApplicationRpc(applicationId) {
        return this.raw.enableOauth2ApplicationRpc(applicationId);
    }
    async executeWebhook(webhookId, token, options = {}, compatibleType) {
        const data = await this.raw.executeWebhook(webhookId, token, options, compatibleType);
        if (typeof (options) !== 'string' && options.wait) {
            const message = new structures_1.Message(this.client, data);
            this.client.messages.insert(message);
            return message;
        }
        return data;
    }
    fetchActivities() {
        return this.raw.fetchActivities();
    }
    async fetchApplicationNews(applicationIds) {
        const data = await this.raw.fetchApplicationNews(applicationIds);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const applicationNews = new structures_1.ApplicationNews(this.client, raw);
            collection.set(applicationNews.id, applicationNews);
        }
        return collection;
    }
    async fetchApplicationNewsId(newsId) {
        const data = await this.raw.fetchApplicationNewsId(newsId);
        return new structures_1.ApplicationNews(this.client, data);
    }
    fetchApplications() {
        return this.raw.fetchApplications();
    }
    async fetchApplication(applicationId) {
        const data = await this.raw.fetchApplication(applicationId);
        return new structures_1.Application(this.client, data);
    }
    async fetchApplicationsDetectable() {
        const data = await this.raw.fetchApplicationsDetectable.call(this);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const application = new structures_1.Application(this.client, raw);
            collection.set(application.id, application);
        }
        return collection;
    }
    fetchApplicationsPublic(applicationIds) {
        return this.raw.fetchApplicationsPublic(applicationIds);
    }
    fetchApplicationsTrendingGlobal() {
        return this.raw.fetchApplicationsTrendingGlobal();
    }
    fetchAuthConsentRequired() {
        return this.raw.fetchAuthConsentRequired();
    }
    async fetchChannel(channelId, updateCache = true) {
        const data = await this.raw.fetchChannel(channelId);
        let channel;
        if (updateCache && this.client.channels.has(data.id)) {
            channel = this.client.channels.get(data.id);
            channel.merge(data);
        }
        else {
            channel = structures_1.createChannelFromData(this.client, data);
        }
        return channel;
    }
    fetchChannelCall(channelId) {
        return this.raw.fetchChannelCall(channelId);
    }
    async fetchChannelInvites(channelId) {
        const data = await this.raw.fetchChannelInvites(channelId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const invite = new structures_1.Invite(this.client, raw);
            collection.set(invite.code, invite);
        }
        return collection;
    }
    async fetchChannelStoreListing(channelId) {
        const data = await this.raw.fetchChannelStoreListing(channelId);
        return new structures_1.StoreListing(this.client, data);
    }
    async fetchChannelWebhooks(channelId) {
        const data = await this.raw.fetchChannelWebhooks(channelId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const webhook = new structures_1.Webhook(this.client, raw);
            collection.set(webhook.id, webhook);
        }
        return collection;
    }
    fetchConsentRequired() {
        return this.raw.fetchConsentRequired();
    }
    fetchConnectionAuthorizeUrl(platform) {
        return this.raw.fetchConnectionAuthorizeUrl(platform);
    }
    fetchDiscoverableGuilds() {
        return this.raw.fetchDiscoverableGuilds();
    }
    async fetchDms(userId = '@me', updateCache = true) {
        const data = await this.raw.fetchDms(userId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let channel;
            if (updateCache && this.client.channels.has(raw.id)) {
                channel = this.client.channels.get(raw.id);
                channel.merge(raw);
            }
            else {
                channel = structures_1.createChannelFromData(this.client, raw);
            }
            collection.set(channel.id, channel);
        }
        return collection;
    }
    fetchExperiments(fingerprint) {
        return this.raw.fetchExperiments(fingerprint);
    }
    fetchGateway() {
        return this.raw.fetchGateway();
    }
    fetchGatewayBot() {
        return this.raw.fetchGatewayBot();
    }
    async fetchGiftCode(code, options = {}) {
        const data = await this.raw.fetchGiftCode(code, options);
        return new structures_1.Gift(this.client, data);
    }
    async fetchGuild(guildId, updateCache = true) {
        const data = await this.raw.fetchGuild(guildId);
        let guild;
        if (updateCache && this.client.guilds.has(data.id)) {
            guild = this.client.guilds.get(data.id);
            guild.merge(data);
        }
        else {
            guild = new structures_1.Guild(this.client, data, {
                emojis: {},
                fromRest: true,
                members: {},
                roles: {},
            });
        }
        guild.hasMetadata = true;
        return guild;
    }
    fetchGuildApplications(guildId, channelId) {
        return this.raw.fetchGuildApplications(guildId, channelId);
    }
    async fetchGuildAuditLogs(guildId, options = {}) {
        const data = await this.raw.fetchGuildAuditLogs(guildId, options);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data.audit_log_entries) {
            let target = null;
            if (this.client.users.has(raw.target_id)) {
                target = this.client.users.get(raw.target_id);
                // target.merge(data.users.find((user) => user.id === raw.target_id));
            }
            else {
                let rawTarget = data.users.find((user) => user.id === raw.target_id);
                if (rawTarget !== undefined) {
                    target = new structures_1.User(this.client, rawTarget);
                }
                else {
                    rawTarget = data.webhooks.find((webhook) => webhook.id === raw.target_id);
                    if (rawTarget !== undefined) {
                        target = new structures_1.Webhook(this.client, rawTarget);
                    }
                }
            }
            let user = null;
            if (this.client.users.has(raw.user_id)) {
                user = this.client.users.get(raw.user_id);
            }
            else {
                const rawUser = data.users.find((u) => u.id === raw.user_id);
                if (rawUser !== undefined) {
                    user = new structures_1.User(this.client, rawUser);
                }
            }
            raw.guild_id = guildId;
            raw.target = target;
            raw.user = user;
            const auditLog = new structures_1.AuditLog(this.client, raw);
            collection.set(auditLog.id, auditLog);
        }
        return collection;
    }
    async fetchGuildBans(guildId) {
        const data = await this.raw.fetchGuildBans(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let user;
            if (this.client.users.has(raw.user.id)) {
                user = this.client.users.get(raw.user.id);
                user.merge(raw.user);
            }
            else {
                user = new structures_1.User(this.client, raw.user);
            }
            collection.set(user.id, {
                reason: raw.reason,
                user,
            });
        }
        return collection;
    }
    async fetchGuildChannels(guildId) {
        const data = await this.raw.fetchGuildChannels(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let channel;
            if (this.client.channels.has(raw.id)) {
                channel = this.client.channels.get(raw.id);
                channel.merge(raw);
            }
            else {
                channel = structures_1.createChannelFromData(this.client, raw);
            }
            collection.set(channel.id, channel);
        }
        return collection;
    }
    fetchGuildEmbed(guildId) {
        return this.raw.fetchGuildEmbed(guildId);
    }
    async fetchGuildEmojis(guildId) {
        const data = await this.raw.fetchGuildEmojis(guildId);
        if (this.client.guilds.has(guildId)) {
            const guild = this.client.guilds.get(guildId);
            guild.merge({ emojis: data });
            return guild.emojis;
        }
        else {
            const collection = new basecollection_1.BaseCollection();
            for (let raw of data) {
                let emoji;
                if (this.client.emojis.has(guildId, raw.id)) {
                    emoji = this.client.emojis.get(guildId, raw.id);
                    emoji.merge(raw);
                }
                else {
                    raw.guild_id = guildId;
                    emoji = new structures_1.Emoji(this.client, raw);
                }
                collection.set(emoji.id || emoji.name, emoji);
            }
            return collection;
        }
    }
    async fetchGuildEmoji(guildId, emojiId) {
        const data = await this.raw.fetchGuildEmoji(guildId, emojiId);
        let emoji;
        if (this.client.emojis.has(guildId, data.id)) {
            emoji = this.client.emojis.get(guildId, data.id);
            emoji.merge(data);
        }
        else {
            data.guild_id = guildId;
            emoji = new structures_1.Emoji(this.client, data);
        }
        return emoji;
    }
    async fetchGuildIntegrations(guildId) {
        const data = await this.raw.fetchGuildIntegrations(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            raw.guild_id = guildId;
            const integration = new structures_1.Integration(this.client, raw);
            collection.set(integration.id, integration);
        }
        return collection;
    }
    async fetchGuildInvites(guildId) {
        const data = await this.raw.fetchGuildInvites(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const invite = new structures_1.Invite(this.client, raw);
            collection.set(invite.code, invite);
        }
        return collection;
    }
    async fetchGuildMember(guildId, userId) {
        const data = await this.raw.fetchGuildMember(guildId, userId);
        let member;
        if (this.client.members.has(guildId, userId)) {
            member = this.client.members.get(guildId, userId);
            member.merge(data);
        }
        else {
            data.guild_id = guildId;
            member = new structures_1.Member(this.client, data);
            this.client.members.insert(member);
        }
        return member;
    }
    async fetchGuildMembers(guildId, options = {}) {
        const data = await this.raw.fetchGuildMembers(guildId, options);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let member;
            if (this.client.members.has(guildId, raw.user.id)) {
                member = this.client.members.get(guildId, raw.user.id);
                member.merge(raw);
            }
            else {
                raw.guild_id = guildId;
                member = new structures_1.Member(this.client, raw);
                this.client.members.insert(member);
            }
            collection.set(member.id, member);
        }
        return collection;
    }
    async fetchGuildMembersSearch(guildId, options) {
        const data = await this.raw.fetchGuildMembersSearch(guildId, options);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let member;
            if (this.client.members.has(guildId, raw.user.id)) {
                member = this.client.members.get(guildId, raw.user.id);
                member.merge(raw);
            }
            else {
                raw.guild_id = guildId;
                member = new structures_1.Member(this.client, raw);
                this.client.members.insert(member);
            }
            collection.set(member.id, member);
        }
        return collection;
    }
    fetchGuildMemberVerification(guildId) {
        return this.raw.fetchGuildMemberVerification(guildId);
    }
    async fetchGuildPremiumSubscriptions(guildId) {
        const data = await this.raw.fetchGuildPremiumSubscriptions(guildId);
        const subscriptions = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const subscription = new structures_1.PremiumSubscription(this.client, raw);
            subscriptions.set(subscription.id, subscription);
        }
        return subscriptions;
    }
    fetchGuildPreview(guildId) {
        return this.raw.fetchGuildPreview(guildId);
    }
    fetchGuildPruneCount(guildId, options = {}) {
        return this.raw.fetchGuildPruneCount(guildId, options);
    }
    async fetchGuildRoles(guildId) {
        const data = await this.raw.fetchGuildRoles(guildId);
        const collection = new basecollection_1.BaseCollection();
        if (this.client.guilds.has(guildId)) {
            const guild = this.client.guilds.get(guildId);
            for (let [roleId, role] of guild.roles) {
                if (!data.some((r) => r.id === roleId)) {
                    guild.roles.delete(roleId);
                }
            }
            for (let raw of data) {
                let role;
                if (guild.roles.has(raw.id)) {
                    role = guild.roles.get(raw.id);
                    role.merge(raw);
                }
                else {
                    raw.guild_id = guildId;
                    role = new structures_1.Role(this.client, raw);
                    guild.roles.set(role.id, role);
                }
                collection.set(role.id, role);
            }
        }
        else {
            for (let raw of data) {
                raw.guild_id = guildId;
                const role = new structures_1.Role(this.client, raw);
                collection.set(role.id, role);
            }
        }
        return collection;
    }
    async fetchGuildTemplates(guildId) {
        const data = await this.raw.fetchGuildTemplates(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const template = new structures_1.Template(this.client, raw);
            collection.set(template.code, template);
        }
        return collection;
    }
    fetchGuildVanityUrl(guildId) {
        return this.raw.fetchGuildVanityUrl(guildId);
    }
    async fetchGuildWebhooks(guildId) {
        const data = await this.raw.fetchGuildWebhooks(guildId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const webhook = new structures_1.Webhook(this.client, raw);
            collection.set(webhook.id, webhook);
        }
        return collection;
    }
    fetchGuildWidget(guildId) {
        return this.raw.fetchGuildWidget(guildId);
    }
    fetchGuildWidgetJson(guildId) {
        return this.raw.fetchGuildWidgetJson(guildId);
    }
    fetchGuildWidgetPng(guildId, options = {}) {
        return this.raw.fetchGuildWidgetPng(guildId, options);
    }
    async fetchInvite(code, options = {}) {
        const data = await this.raw.fetchInvite(code, options);
        return new structures_1.Invite(this.client, data);
    }
    async fetchMe(options = {}) {
        const data = await this.raw.fetchMe.call(this, options);
        return new structures_1.UserMe(this.client, data);
    }
    fetchMeBillingPaymentSources() {
        return this.raw.fetchMeBillingPaymentSources();
    }
    fetchMeBillingPayments(options = {}) {
        return this.raw.fetchMeBillingPayments(options);
    }
    fetchMeBillingSubscriptions() {
        return this.raw.fetchMeBillingSubscriptions();
    }
    async fetchMeChannels() {
        const data = await this.raw.fetchMeChannels();
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let channel;
            if (this.client.channels.has(raw.id)) {
                channel = this.client.channels.get(raw.id);
                channel.merge(raw);
            }
            else {
                channel = structures_1.createChannelFromData(this.client, raw);
            }
            collection.set(channel.id, channel);
        }
        return collection;
    }
    async fetchMeConnections() {
        const data = await this.raw.fetchMeConnections.call(this);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const account = new structures_1.ConnectedAccount(this.client, raw);
            collection.set(account.key, account);
        }
        return collection;
    }
    fetchMeConnectionAccessToken(platform, accountId) {
        return this.raw.fetchMeConnectionAccessToken(platform, accountId);
    }
    fetchMeConnectionSubreddits(accountId) {
        return this.raw.fetchMeConnectionSubreddits(accountId);
    }
    fetchMeFeedSettings(options = {}) {
        return this.raw.fetchMeFeedSettings(options);
    }
    async fetchMeGuilds(options = {}) {
        const data = await this.raw.fetchMeGuilds(options);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const guild = new structures_1.GuildMe(this.client, raw);
            collection.set(guild.id, guild);
        }
        return collection;
    }
    async fetchMentions(options = {}) {
        const data = await this.raw.fetchMentions(options);
        let guildId;
        if (data.length) {
            const raw = data[0];
            if (this.client.channels.has(raw.channel_id)) {
                const channel = this.client.channels.get(raw.channel_id);
                if (channel.guildId) {
                    guildId = channel.guildId;
                }
            }
        }
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let message;
            if (this.client.messages.has(raw.id)) {
                message = this.client.messages.get(raw.id);
                message.merge(raw);
            }
            else {
                raw.guild_id = guildId;
                message = new structures_1.Message(this.client, raw);
            }
            collection.set(message.id, message);
        }
        return collection;
    }
    async fetchMessage(channelId, messageId) {
        const data = await this.raw.fetchMessage(channelId, messageId);
        let guildId;
        if (this.client.channels.has(data.channel_id)) {
            const channel = this.client.channels.get(data.channel_id);
            if (channel.guildId) {
                guildId = channel.guildId;
            }
        }
        let message;
        if (this.client.messages.has(data.id)) {
            message = this.client.messages.get(data.id);
            message.merge(data);
        }
        else {
            data.guild_id = guildId;
            message = new structures_1.Message(this.client, data);
        }
        return message;
    }
    async fetchMessages(channelId, options = {}) {
        const data = await this.raw.fetchMessages(channelId, options);
        let guildId;
        if (data.length) {
            const raw = data[0];
            if (this.client.channels.has(raw.channel_id)) {
                const channel = this.client.channels.get(raw.channel_id);
                if (channel.guildId) {
                    guildId = channel.guildId;
                }
            }
        }
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let message;
            if (this.client.messages.has(raw.id)) {
                message = this.client.messages.get(raw.id);
                message.merge(raw);
            }
            else {
                raw.guild_id = guildId;
                message = new structures_1.Message(this.client, raw);
            }
            collection.set(message.id, message);
        }
        return collection;
    }
    async fetchOauth2Applications() {
        const data = await this.raw.fetchOauth2Applications.call(this);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const oauth2Application = new structures_1.Oauth2Application(this.client, raw);
            collection.set(oauth2Application.id, oauth2Application);
        }
        return collection;
    }
    async fetchOauth2Application(userId = '@me') {
        const data = await this.raw.fetchOauth2Application(userId);
        let oauth2Application;
        if (userId === '@me') {
            oauth2Application = this.client._mergeOauth2Application(data);
        }
        else {
            oauth2Application = new structures_1.Oauth2Application(this.client, data);
        }
        return oauth2Application;
    }
    async fetchOauth2ApplicationAssets(applicationId) {
        const data = await this.raw.fetchOauth2ApplicationAssets(applicationId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            raw.application_id = applicationId;
            const asset = new structures_1.Oauth2ApplicationAsset(this.client, raw);
            collection.set(asset.id, asset);
        }
        return collection;
    }
    fetchOauth2ApplicationWhitelist(applicationId) {
        return this.raw.fetchOauth2ApplicationWhitelist(applicationId);
    }
    fetchOauth2Authorize(options = {}) {
        return this.raw.fetchOauth2Authorize(options);
    }
    fetchOauth2AuthorizeWebhookChannels(guildId) {
        return this.raw.fetchOauth2AuthorizeWebhookChannels(guildId);
    }
    fetchOauth2Tokens() {
        return this.raw.fetchOauth2Tokens();
    }
    fetchOauth2Token(tokenId) {
        return this.raw.fetchOauth2Token(tokenId);
    }
    async fetchPinnedMessages(channelId) {
        const data = await this.raw.fetchPinnedMessages(channelId);
        let guildId = null;
        if (data.length) {
            const raw = data[0];
            if (this.client.channels.has(raw.channel_id)) {
                const channel = this.client.channels.get(raw.channel_id);
                guildId = channel.guildId;
            }
        }
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let message;
            if (this.client.messages.has(raw.id)) {
                message = this.client.messages.get(raw.id);
                message.merge(raw);
            }
            else {
                raw.guild_id = guildId;
                message = new structures_1.Message(this.client, raw);
            }
            collection.set(message.id, message);
        }
        return collection;
    }
    async fetchReactions(channelId, messageId, emoji, options = {}) {
        const data = await this.raw.fetchReactions(channelId, messageId, emoji, options);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let user;
            if (this.client.users.has(raw.id)) {
                user = this.client.users.get(raw.id);
                user.merge(raw);
            }
            else {
                user = new structures_1.User(this.client, raw);
            }
            collection.set(user.id, user);
        }
        return collection;
    }
    async fetchStoreApplicationAssets(applicationId) {
        const data = await this.raw.fetchStoreApplicationAssets(applicationId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            raw.application_id = applicationId;
            const asset = new structures_1.StoreApplicationAsset(this.client, raw);
            collection.set(asset.id, asset);
        }
        return collection;
    }
    fetchStorePublishedListingsSkus(applicationId) {
        return this.raw.fetchStorePublishedListingsSkus(applicationId);
    }
    fetchStorePublishedListingsSku(skuId) {
        return this.raw.fetchStorePublishedListingsSku(skuId);
    }
    fetchStorePublishedListingsSkuSubscriptionPlans(skuId) {
        return this.raw.fetchStorePublishedListingsSkuSubscriptionPlans(skuId);
    }
    fetchStreamPreview(streamKey) {
        return this.raw.fetchStreamPreview(streamKey);
    }
    async fetchTeams() {
        const data = await this.raw.fetchTeams();
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const team = new structures_1.Team(this.client, data);
            collection.set(team.id, team);
        }
        return collection;
    }
    async fetchTeam(teamId) {
        const data = await this.raw.fetchTeam(teamId);
        return new structures_1.Team(this.client, data);
    }
    fetchTeamApplications(teamId) {
        return this.raw.fetchTeamApplications(teamId);
    }
    async fetchTeamMembers(teamId) {
        const data = await this.raw.fetchTeamMembers(teamId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            collection.set(raw.user.id, new structures_1.TeamMember(this.client, raw));
        }
        return collection;
    }
    async fetchTeamMember(teamId, userId) {
        const data = await this.raw.fetchTeamMember(teamId, userId);
        return new structures_1.TeamMember(this.client, data);
    }
    fetchTeamPayouts(teamId, options = {}) {
        return this.raw.fetchTeamPayouts(teamId, options);
    }
    async fetchTemplate(templateId) {
        const data = await this.raw.fetchTemplate(templateId);
        return new structures_1.Template(this.client, data);
    }
    async fetchUser(userId) {
        const data = await this.raw.fetchUser(userId);
        let user;
        if (this.client.users.has(data.id)) {
            user = this.client.users.get(data.id);
            user.merge(data);
        }
        else {
            user = new structures_1.User(this.client, data);
        }
        return user;
    }
    fetchUserActivityMetadata(userId, sessionId, activityId) {
        return this.raw.fetchUserActivityMetadata(userId, sessionId, activityId);
    }
    async fetchUserChannels(userId) {
        const data = await this.raw.fetchUserChannels(userId);
        const collection = new basecollection_1.BaseCollection();
        for (let raw of data) {
            let channel;
            if (this.client.channels.has(raw.id)) {
                channel = this.client.channels.get(raw.id);
                channel.merge(raw);
            }
            else {
                channel = structures_1.createChannelFromData(this.client, raw);
            }
            collection.set(channel.id, channel);
        }
        return collection;
    }
    async fetchUserProfile(userId) {
        const data = await this.raw.fetchUserProfile(userId);
        return new structures_1.Profile(this.client, data);
    }
    fetchVoiceIce() {
        return this.raw.fetchVoiceIce();
    }
    async fetchVoiceRegions(guildId) {
        const data = await this.raw.fetchVoiceRegions(guildId);
        const regions = new basecollection_1.BaseCollection();
        for (let raw of data) {
            const region = new structures_1.VoiceRegion(this.client, raw);
            regions.set(region.id, region);
        }
        return regions;
    }
    async fetchWebhook(webhookId) {
        const data = await this.raw.fetchWebhook(webhookId);
        return new structures_1.Webhook(this.client, data);
    }
    async fetchWebhookToken(webhookId, token) {
        const data = await this.raw.fetchWebhookToken(webhookId, token);
        return new structures_1.Webhook(this.client, data);
    }
    async followChannel(channelId, options) {
        const data = await this.raw.followChannel(channelId, options);
        return { channelId: data['channel_id'], webhookId: data['webhook_id'] };
    }
    forgotPassword(options) {
        return this.raw.forgotPassword(options);
    }
    integrationJoin(integrationId) {
        return this.raw.integrationJoin(integrationId);
    }
    joinGuild(guildId, options = {}) {
        return this.raw.joinGuild(guildId, options);
    }
    leaveGuild(guildId) {
        return this.raw.leaveGuild(guildId);
    }
    login(options) {
        return this.raw.login(options);
    }
    loginMfaSms(options) {
        return this.raw.loginMfaSms(options);
    }
    loginMfaSmsSend(options) {
        return this.raw.loginMfaSmsSend(options);
    }
    loginMfaTotp(options) {
        return this.raw.loginMfaTotp(options);
    }
    logout(options = {}) {
        return this.raw.logout(options);
    }
    messageSuppressEmbeds(channelId, messageId, options = {}) {
        return this.raw.messageSuppressEmbeds(channelId, messageId, options);
    }
    oauth2Authorize(options = {}) {
        return this.raw.oauth2Authorize(options);
    }
    redeemGiftCode(code, options = {}) {
        return this.raw.redeemGiftCode(code, options);
    }
    register(options) {
        return this.raw.register(options);
    }
    removeGuildBan(guildId, userId, options = {}) {
        return this.raw.removeGuildBan(guildId, userId, options);
    }
    removeGuildMember(guildId, userId, options = {}) {
        return this.raw.removeGuildMember(guildId, userId, options);
    }
    removeGuildMemberRole(guildId, userId, roleId, options = {}) {
        return this.raw.removeGuildMemberRole(guildId, userId, roleId, options);
    }
    removeMention(messageId) {
        return this.raw.removeMention(messageId);
    }
    removeOauth2ApplicationWhitelistUser(applicationId, userId) {
        return this.raw.removeOauth2ApplicationWhitelistUser(applicationId, userId);
    }
    removeRecipient(channelId, userId) {
        return this.raw.removeRecipient(channelId, userId);
    }
    removeTeamMember(teamId, userId) {
        return this.raw.removeTeamMember(teamId, userId);
    }
    resetOauth2Application(applicationId) {
        return this.raw.resetOauth2Application(applicationId);
    }
    resetOauth2ApplicationBot(applicationId) {
        return this.raw.resetOauth2ApplicationBot(applicationId);
    }
    resetPassword(options) {
        return this.raw.resetPassword(options);
    }
    resetPasswordMfa(options) {
        return this.raw.resetPasswordMfa(options);
    }
    search(searchType, searchId, options = {}, retry = true, retryNumber = 0) {
        return this.raw.search(searchType, searchId, options, retry, retryNumber);
    }
    searchChannel(channelId, options = {}, retry = true, retryNumber = 0) {
        return this.raw.searchChannel(channelId, options, retry, retryNumber);
    }
    searchGuild(guildId, options = {}, retry = true, retryNumber = 0) {
        return this.raw.searchGuild(guildId, options, retry, retryNumber);
    }
    searchLobbies(applicationId, options = {}) {
        return this.raw.searchLobbies(applicationId, options);
    }
    sendDownloadText(number) {
        return this.raw.sendDownloadText(number);
    }
    sendFriendRequest(options) {
        return this.raw.sendFriendRequest(options);
    }
    sendLobbyData(lobbyId, data) {
        return this.raw.sendLobbyData(lobbyId, data);
    }
    startChannelCallRinging(channelId, options = {}) {
        return this.raw.startChannelCallRinging(channelId, options);
    }
    stopChannelCallRinging(channelId, options = {}) {
        return this.raw.stopChannelCallRinging(channelId, options);
    }
    submitConnectionPinCode(platform, pin) {
        return this.raw.submitConnectionPinCode(platform, pin);
    }
    submitOauth2ApplicationApproval(applicationId) {
        return this.raw.submitOauth2ApplicationApproval(applicationId);
    }
    syncGuildIntegration(guildId, integrationId) {
        return this.raw.syncGuildIntegration(guildId, integrationId);
    }
    transferOauth2Application(applicationId, options) {
        return this.raw.transferOauth2Application(applicationId, options);
    }
    triggerTyping(channelId) {
        return this.raw.triggerTyping(channelId);
    }
    unAckChannel(channelId) {
        return this.raw.unAckChannel(channelId);
    }
    verify(options) {
        return this.raw.verify(options);
    }
    verifyCaptcha(options) {
        return this.raw.verifyCaptcha(options);
    }
    verifyResend() {
        return this.raw.verifyResend();
    }
}
exports.RestClient = RestClient;

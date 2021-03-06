"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const os = require("os");
const url_1 = require("url");
const iris_rest_1 = require("../../Iris-Rest");
const constants_1 = require("../../Iris-Rest/Library/constants");
const iris_utils_1 = require("../../Iris-Utils")
const bucket_1 = require("./bucket");
const bucketcollection_1 = require("./bucketcollection");
const clientsidechecks_1 = require("./clientsidechecks");
const constants_2 = require("./constants");
const endpoints_1 = require("./endpoints");
const request_1 = require("./request");
const defaultHeaders = {
    [constants_1.HTTPHeaders.USER_AGENT]: [
        'DiscordBot',
        `(${constants_2.Package.URL}, v${constants_2.Package.VERSION})`,
        `(${os.type()} ${os.release()}; ${os.arch()})`,
        process.version.replace(/^v/, (process.release.name || 'node') + '/'),
    ].join(' '),
};
defaultHeaders[constants_2.DiscordHeaders.SUPER_PROPERTIES] = Buffer.from(JSON.stringify({
    browser: process.release.name || 'node',
    browser_user_agent: defaultHeaders[constants_1.HTTPHeaders.USER_AGENT],
    browser_version: process.version,
    device: 'Detritus',
    os: os.type(),
    os_arch: os.arch(),
    os_version: os.release(),
})).toString('base64');
const requestDefaults = {
    dataOnly: true,
    skipRatelimitCheck: false,
};
class Client extends iris_utils_1.EventSpewer {
    constructor(token, options) {
        super();
        this.authType = constants_2.AuthTypes.BOT;
        this.clientsideChecks = true;
        this.errorOnRatelimit = false;
        options = Object.assign({
            baseUrl: endpoints_1.Api.URL_STABLE + endpoints_1.Api.PATH,
            bucketsExpireIn: (60 * 60) * 1000,
            errorOnRatelimit: false,
        }, options);
        options.headers = iris_rest_1.createHeaders(options.headers);
        if (!options.headers.has(constants_1.HTTPHeaders.USER_AGENT)) {
            options.headers.set(constants_1.HTTPHeaders.USER_AGENT, defaultHeaders[constants_1.HTTPHeaders.USER_AGENT]);
        }
        this.restClient = new iris_rest_1.Client(options);
        this.buckets = new bucketcollection_1.BucketCollection({ expire: options.bucketsExpireIn });
        this.clientsideChecks = !!(options.clientsideChecks || options.clientsideChecks === undefined);
        this.errorOnRatelimit = !!options.errorOnRatelimit;
        this.fingerprint = options.fingerprint,
            this.globalBucket = options.globalBucket || new bucket_1.Bucket('global');
        this.routes = options.routesCollection || new iris_utils_1.BaseCollection();
        this.token = token;
        Object.defineProperties(this, {
            restClient: { enumerable: false, writable: false },
            token: { enumerable: false, writable: false },
        });
        if (options.authType !== undefined) {
            this.setAuthType(options.authType);
        }
    }
    get authTypeText() {
        switch (this.authType) {
            case constants_2.AuthTypes.BEARER: return 'Bearer';
            case constants_2.AuthTypes.BOT: return 'Bot';
        }
        return '';
    }
    get isBearer() {
        return this.authType === constants_2.AuthTypes.BEARER;
    }
    get isBot() {
        return this.authType === constants_2.AuthTypes.BOT;
    }
    get isUser() {
        return this.authType === constants_2.AuthTypes.USER;
    }
    get tokenFormatted() {
        if (this.token) {
            const prepend = this.authTypeText;
            if (prepend) {
                return `${prepend} ${this.token}`;
            }
            return this.token;
        }
        return '';
    }
    setAuthType(type) {
        if (typeof (type) === 'string') {
            type = type.toUpperCase();
        }
        for (let key in constants_2.AuthTypes) {
            if (key === type) {
                this.authType = key;
                break;
            }
        }
    }
    async request(info, init) {
        if (typeof (info) !== 'string' && !(info instanceof url_1.URL)) {
            init = Object.assign({
                errorOnRatelimit: this.errorOnRatelimit,
            }, requestDefaults, info, init);
        }
        else {
            init = Object.assign({
                errorOnRatelimit: this.errorOnRatelimit,
            }, requestDefaults, init);
        }
        const request = await this.restClient.createRequest(info, init);
        if ((this.restClient.baseUrl instanceof url_1.URL) &&
            (this.restClient.baseUrl.host === request.parsedUrl.host)) {
            if (!request.headers.has(constants_2.DiscordHeaders.SUPER_PROPERTIES)) {
                request.headers.set(constants_2.DiscordHeaders.SUPER_PROPERTIES, defaultHeaders[constants_2.DiscordHeaders.SUPER_PROPERTIES]);
            }
            if (init.useAuth || init.useAuth === undefined) {
                if (this.token) {
                    request.headers.set('authorization', this.tokenFormatted);
                }
                else if (this.fingerprint) {
                    request.headers.set(constants_2.DiscordHeaders.FINGERPRINT, this.fingerprint);
                }
            }
        }
        if (init.fingerprint) {
            request.headers.set(constants_2.DiscordHeaders.FINGERPRINT, init.fingerprint);
        }
        if (init.token) {
            request.headers.set('authorization', init.token);
        }
        let response;
        const restRequest = new request_1.RestRequest(this, request, init);
        this.emit(constants_2.RestEvents.REQUEST, { request, restRequest: restRequest });
        if (restRequest.shouldRatelimitCheck && !init.errorOnRatelimit) {
            response = await new Promise((resolve, reject) => {
                const delayed = { request: restRequest, resolve, reject };
                if (this.globalBucket.locked) {
                    this.globalBucket.add(delayed);
                }
                else {
                    const bucket = restRequest.bucket;
                    if (bucket) {
                        bucket.add(delayed);
                        this.buckets.resetExpire(bucket);
                    }
                    else {
                        resolve(restRequest.send());
                    }
                }
            });
        }
        else {
            response = await restRequest.send();
        }
        if (init.dataOnly) {
            switch (response.headers.get(constants_1.HTTPHeaders.CONTENT_TYPE)) {
                case constants_1.ContentTypes.APPLICATION_JSON:
                    {
                        return response.json();
                    }
                    ;
                case constants_1.ContentTypes.TEXT_PLAIN:
                    {
                        return response.text();
                    }
                    ;
            }
            return response.buffer();
        }
        else {
            return response;
        }
    }
    async delete(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.DELETE });
        return this.request(info, init);
    }
    async get(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.GET });
        return this.request(info, init);
    }
    async head(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.HEAD });
        return this.request(info, init);
    }
    async options(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.OPTIONS });
        return this.request(info, init);
    }
    async patch(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.PATCH });
        return this.request(info, init);
    }
    async post(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.POST });
        return this.request(info, init);
    }
    async put(info, init) {
        init = Object.assign({}, init, { method: constants_2.HTTPMethods.PUT });
        return this.request(info, init);
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    /* -- Rest Requests Start -- */
    async acceptAgreements(privacy = true, terms = true) {
        return this.request({
            body: { privacy, terms },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME_AGREEMENTS,
            },
        });
    }
    async acceptInvite(code) {
        const params = { code };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                code: { required: true, type: clientsidechecks_1.Types.STRING },
            });
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.INVITE,
                params,
            },
        });
    }
    async acceptTeamInvite(token) {
        const body = { token };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.TEAMS_INVITE_ACCEPT,
            },
        });
    }
    async acceptTemplate(templateId, options) {
        const body = {
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
        };
        const params = { templateId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILDS_TEMPLATE,
                params,
            },
        });
    }
    async ackChannelMessage(channelId, messageId, token) {
        const body = { token };
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(body, {
                token: { required: true, type: clientsidechecks_1.Types.STRING },
            });
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
                messageId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_MESSAGE_ACK,
                params,
            },
        });
    }
    async ackChannelPins(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_PINS_ACK,
                params,
            },
        });
    }
    async ackGuild(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                guildId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_ACK,
                params,
            },
        });
    }
    async activateOauth2ApplicationLicense(applicationId, options) {
        const body = {
            code: options.code,
            guild_id: options.guildId,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_ACTIVATE_LICENSE,
                params,
            },
        });
    }
    async addConnection(platform, accountId, options) {
        const body = {
            name: options.name,
            friend_sync: !!options.friendSync,
        };
        const params = { platform, accountId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.ME_CONNECTION,
                params,
            },
        });
    }
    async addGuildMember(guildId, userId, options) {
        const body = {
            access_token: options.accessToken,
            deaf: options.deaf,
            mute: options.mute,
            nick: options.nick,
            roles: options.roles,
        };
        const params = { guildId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.GUILD_MEMBER,
                params,
            },
        });
    }
    async addGuildMemberRole(guildId, userId, roleId, options = {}) {
        const params = { guildId, userId, roleId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.GUILD_MEMBER_ROLE,
                params,
            },
        });
    }
    async addPinnedMessage(channelId, messageId) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.CHANNEL_PIN,
                params,
            },
        });
    }
    async addRecipient(channelId, userId) {
        const params = { channelId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.CHANNEL_RECIPIENT,
                params,
            },
        });
    }
    async addOauth2ApplicationWhitelistUser(applicationId, options) {
        const body = {
            branch_ids: options.branchIds,
            discriminator: options.discriminator,
            username: options.username,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_WHITELIST,
                params,
            },
        });
    }
    async addTeamMember(teamId, options) {
        const body = {
            discriminator: options.discriminator,
            username: options.username,
        };
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.TEAM_MEMBERS,
                params,
            },
        });
    }
    async authorizeIpAddress(options) {
        const body = {
            token: options.token,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_AUTHORIZE_IP,
            },
        });
    }
    async beginGuildPrune(guildId, options = {}) {
        const params = { guildId };
        const query = {
            compute_prune_count: options.computePruneCount,
            days: options.days,
            include_roles: options.includeRoles,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            query,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_PRUNE,
                params,
            },
        });
    }
    async bulkDeleteMessages(channelId, messageIds) {
        const body = { messages: messageIds };
        const params = { channelId };
        if (this.clientsideChecks) {
            if (body.messages.length < 2 || 100 < body.messages.length) {
                throw new Error('Message Ids amount needs to be between 2 and 100');
            }
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_MESSAGES_BULK_DELETE,
                params,
            },
        });
    }
    async connectionCallback(platform, options) {
        const body = {
            code: options.code,
            friend_sync: !!options.friendSync,
            from_continuation: !!options.fromContinuation,
            insecure: !!options.insecure,
            openid_params: options.openIdParams,
            state: options.state,
        };
        const params = { platform };
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CONNECTION_CALLBACK,
                params,
            },
        });
    }
    async createApplicationNews(options) {
        const body = {
            application_id: options.applicationId,
            channel_id: options.channelId,
            description: options.description,
            message_id: options.messageId,
            thumbnail_override: clientsidechecks_1.bufferToBase64(options.thumbnailOverride),
            title: options.title,
            url: options.url,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.APPLICATION_NEWS,
            },
        });
    }
    async createChannelInvite(channelId, options = {}) {
        const body = {
            max_age: options.maxAge,
            max_uses: options.maxUses,
            target_user: options.targetUser,
            target_user_type: options.targetUserType,
            temporary: options.temporary,
            unique: options.unique,
        };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_INVITES,
                params,
            },
        });
    }
    async createChannelStoreListingGrantEntitlement(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_STORE_LISTING_ENTITLEMENT_GRANT,
                params,
            },
        });
    }
    async createDm(options = {}) {
        const body = {
            recipient_id: options.recipientId,
            recipients: options.recipients,
        };
        if (this.clientsideChecks) {
            // both cannot be empty
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_CHANNELS,
            },
        });
    }
    async createGuild(options) {
        const body = {
            channels: options.channels,
            default_message_notifications: options.defaultMessageNotifications,
            explicit_content_filter: options.explicitContentFilter,
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
            region: options.region,
            roles: options.roles,
            verification_level: options.verificationLevel,
        };
        if (this.clientsideChecks) {
            // verify channel and roles
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILDS,
            },
        });
    }
    async createGuildBan(guildId, userId, options = {}) {
        const params = { guildId, userId };
        const query = {
            delete_message_days: options.deleteMessageDays,
            reason: options.reason,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.GUILD_BAN,
                params,
            },
        });
    }
    async createGuildChannel(guildId, options) {
        const body = {
            branch_id: options.branchId,
            bitrate: options.bitrate,
            name: options.name,
            nsfw: options.nsfw,
            parent_id: options.parentId,
            permission_overwrites: options.permissionOverwrites,
            sku_id: options.skuId,
            topic: options.topic,
            type: options.type,
            user_limit: options.userLimit,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_CHANNELS,
                params,
            },
        });
    }
    async createGuildEmoji(guildId, options) {
        const body = {
            name: options.name,
            image: clientsidechecks_1.bufferToBase64(options.image),
            roles: options.roles,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
            // 256kb limit
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_EMOJIS,
                params,
            },
        });
    }
    async createGuildIntegration(guildId, options) {
        const body = {
            id: options.id,
            type: options.type,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_INTEGRATIONS,
                params,
            },
        });
    }
    async createGuildRole(guildId, options = {}) {
        const body = {
            color: options.color,
            hoist: options.hoist,
            mentionable: options.mentionable,
            name: options.name,
            permissions: options.permissions,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_ROLES,
                params,
            },
        });
    }
    async createGuildTemplate(guildId, options) {
        const body = {
            description: options.description,
            name: options.name,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_TEMPLATES,
                params,
            },
        });
    }
    async createLobby(applicationId, options = {}) {
        const body = {
            application_id: applicationId,
            capacity: options.capacity,
            locked: options.locked,
            metadata: options.metadata,
            owner_id: options.ownerId,
            type: options.type,
        };
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.LOBBIES,
            },
        });
    }
    async createMeBillingPaymentSource(options) {
        const body = {
            billing_address: {
                city: options.billingAddress.city,
                country: options.billingAddress.country,
                line_1: options.billingAddress.line1,
                line_2: options.billingAddress.line2,
                name: options.billingAddress.name,
                postal_code: options.billingAddress.postalCode,
                state: options.billingAddress.state,
            },
            payment_gateway: options.paymentGateway,
            token: options.token,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_BILLING_PAYMENT_SOURCES,
            },
        });
    }
    async createMeBillingSubscription(options) {
        const body = {
            payment_gateway_plan_id: options.paymentGatewayPlanId,
            payment_source_id: options.paymentSourceId,
            trial_id: options.trialId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_BILLING_SUBSCRIPTIONS,
            },
        });
    }
    async createMessage(channelId, options = {}) {
        if (typeof (options) === 'string') {
            options = { content: options };
        }
        const body = {
            application_id: options.applicationId,
            content: options.content,
            nonce: options.nonce,
            sticker_ids: options.stickerIds,
            tts: options.tts,
        };
        if (options.activity && typeof (options.activity) === 'object') {
            body.activity = {
                party_id: options.activity.partyId,
                session_id: options.activity.sessionId,
                type: options.activity.type,
            };
        }
        if (options.allowedMentions && typeof (options.allowedMentions) === 'object') {
            body.allowed_mentions = {
                parse: options.allowedMentions.parse,
                replied_user: options.allowedMentions.repliedUser,
                roles: options.allowedMentions.roles,
                users: options.allowedMentions.users,
            };
        }
        if (options.embed && typeof (options.embed) === 'object') {
            if ('toJSON' in options.embed) {
                body.embed = options.embed;
            }
            else {
                body.embed = Object.assign({}, options.embed);
                if (typeof (options.embed.author) === 'object') {
                    body.embed.author = {
                        name: options.embed.author.name,
                        url: options.embed.author.url,
                        icon_url: options.embed.author.iconUrl,
                    };
                }
                if (typeof (options.embed.footer) === 'object') {
                    body.embed.footer = {
                        text: options.embed.footer.text,
                        icon_url: options.embed.footer.iconUrl,
                    };
                }
            }
        }
        if (options.messageReference && typeof (options.messageReference) === 'object') {
            body.message_reference = {
                channel_id: options.messageReference.channelId,
                guild_id: options.messageReference.guildId,
                message_id: options.messageReference.messageId,
            };
        }
        const files = [];
        if (options.file) {
            files.push(options.file);
        }
        if (options.files && options.files.length) {
            for (let file of options.files) {
                files.push(file);
            }
        }
        const params = { channelId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
            clientsidechecks_1.verifyData(body, {
                activity: { type: clientsidechecks_1.Types.OBJECT },
                allowed_mentions: { type: clientsidechecks_1.Types.OBJECT },
                application_id: { type: clientsidechecks_1.Types.SNOWFLAKE },
                content: { type: clientsidechecks_1.Types.STRING },
                embed: { type: clientsidechecks_1.Types.OBJECT },
                message_reference: { type: clientsidechecks_1.Types.OBJECT },
                nonce: { type: clientsidechecks_1.Types.STRING },
                sticker_ids: { type: clientsidechecks_1.Types.ARRAY },
                tts: { type: clientsidechecks_1.Types.BOOLEAN },
            });
            if ('activity' in body) {
                clientsidechecks_1.verifyData(body.activity, {
                    party_id: { type: clientsidechecks_1.Types.STRING },
                    session_id: { type: clientsidechecks_1.Types.STRING },
                    type: { type: clientsidechecks_1.Types.NUMBER },
                });
            }
            if ('message_reference' in body) {
                clientsidechecks_1.verifyData(body.message_reference, {
                    channel_id: { type: clientsidechecks_1.Types.STRING },
                    guild_id: { type: clientsidechecks_1.Types.STRING },
                    message_id: { type: clientsidechecks_1.Types.STRING },
                });
            }
        }
        if (!('activity' in body) &&
            !('content' in body) &&
            !('embed' in body) &&
            !('sticker_ids' in body) &&
            !files.length) {
            throw new Error('Cannot send an empty message.');
        }
        if (options.hasSpoiler) {
            for (let file of files) {
                if (file.filename && !file.filename.startsWith(constants_2.SPOILER_ATTACHMENT_PREFIX)) {
                    file.filename = `${constants_2.SPOILER_ATTACHMENT_PREFIX}${file.filename}`;
                }
            }
        }
        return this.request({
            body,
            files,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_MESSAGES,
                params,
            },
        });
    }
    async createOauth2Application(options) {
        const body = {
            name: options.name,
            team_id: options.teamId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION,
            },
        });
    }
    async createOauth2ApplicationAsset(applicationId, options) {
        const body = {
            image: clientsidechecks_1.bufferToBase64(options.image),
            name: options.name,
            type: options.type,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_ASSETS,
                params,
            },
        });
    }
    async createOauth2ApplicationBot(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body: {},
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_BOT,
                params,
            },
        });
    }
    async createReaction(channelId, messageId, emoji) {
        const params = { channelId, messageId, emoji, userId: '@me' };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.CHANNEL_MESSAGE_REACTION_USER,
                params,
            },
        });
    }
    async createStoreApplicationAsset(applicationId, options = {}) {
        const files = [];
        const params = { applicationId };
        if (options.file) {
            files.push(options.file);
        }
        if (options.files && options.files.length) {
            for (let file of options.files) {
                files.push(file);
            }
        }
        if (this.clientsideChecks) {
        }
        return this.request({
            files,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.STORE_APPLICATION_ASSETS,
                params,
            },
        });
    }
    async createTeam(options = {}) {
        const body = {
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.TEAMS,
            },
        });
    }
    async createWebhook(channelId, options) {
        const body = {
            avatar: options.avatar,
            name: options.name,
        };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_WEBHOOKS,
                params,
            },
        });
    }
    async crosspostMessage(channelId, messageId) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_MESSAGE_CROSSPOST,
                params,
            },
        });
    }
    async deleteAccount(options) {
        const body = {
            code: options.code,
            password: options.password,
        };
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_DELETE_ACCOUNT,
            },
        });
    }
    async deleteChannel(channelId, options = {}) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL,
                params,
            },
        });
    }
    async deleteChannelOverwrite(channelId, overwriteId, options = {}) {
        const params = { channelId, overwriteId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_PERMISSION,
                params,
            },
        });
    }
    async deleteConnection(platform, accountId) {
        const params = { platform, accountId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_CONNECTION,
                params,
            },
        });
    }
    async deleteGuild(guildId, options = {}) {
        const body = { code: options.code };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_DELETE,
                params,
            },
        });
    }
    async deleteGuildEmoji(guildId, emojiId, options = {}) {
        const params = { guildId, emojiId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_EMOJI,
                params,
            },
        });
    }
    async deleteGuildIntegration(guildId, integrationId, options = {}) {
        const params = { guildId, integrationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_INTEGRATION,
                params,
            },
        });
    }
    async deleteGuildPremiumSubscription(guildId, subscriptionId) {
        const params = { guildId, subscriptionId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_PREMIUM_SUBSCRIPTION,
                params,
            },
        });
    }
    async deleteGuildRole(guildId, roleId, options = {}) {
        const params = { guildId, roleId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_ROLE,
                params,
            },
        });
    }
    async deleteGuildTemplate(guildId, templateId) {
        const params = { guildId, templateId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_TEMPLATE,
                params,
            },
        });
    }
    async deleteInvite(code, options = {}) {
        const params = { code };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.INVITE,
                params,
            },
        });
    }
    async deleteLobby(lobbyId) {
        const params = { lobbyId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.LOBBY,
                params,
            },
        });
    }
    async deleteMeBillingPaymentSource(paymentSourceId) {
        const params = { paymentSourceId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_BILLING_PAYMENT_SOURCE,
                params,
            },
        });
    }
    async deleteMeBillingSubscription(subscriptionId) {
        const params = { subscriptionId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_BILLING_SUBSCRIPTION,
                params,
            },
        });
    }
    async deleteMessage(channelId, messageId, options = {}) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
                messageId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_MESSAGE,
                params,
            },
        });
    }
    async deleteOauth2Application(applicationId, options = {}) {
        const body = {
            code: options.code,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_DELETE,
                params,
            },
        });
    }
    async deleteOauth2ApplicationAsset(applicationId, assetId) {
        const params = { applicationId, assetId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.OAUTH2_APPLICATION_ASSET,
                params,
            },
        });
    }
    async deletePinnedMessage(channelId, messageId) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_PIN,
                params,
            },
        });
    }
    async deleteReactions(channelId, messageId) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_MESSAGE_REACTIONS,
                params,
            },
        });
    }
    async deleteReactionsEmoji(channelId, messageId, emoji) {
        const params = { channelId, messageId, emoji };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_MESSAGE_REACTION,
                params,
            },
        });
    }
    async deleteReaction(channelId, messageId, emoji, userId = '@me') {
        const params = { channelId, messageId, emoji, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_MESSAGE_REACTION_USER,
                params,
            },
        });
    }
    async deleteRelationship(userId) {
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_RELATIONSHIP,
                params,
            },
        });
    }
    async deleteStoreApplicationAsset(applicationId, assetId) {
        const params = { applicationId, assetId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.STORE_APPLICATION_ASSET,
                params,
            },
        });
    }
    async deleteTeam(teamId, options = {}) {
        const body = { code: options.code };
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.TEAM_DELETE,
                params,
            },
        });
    }
    async deleteWebhook(webhookId, options = {}) {
        const params = { webhookId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.WEBHOOK,
                params,
            },
        });
    }
    async deleteWebhookToken(webhookId, token, options = {}) {
        const params = { webhookId, token };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.WEBHOOK_TOKEN,
                params,
            },
            useAuth: false,
        });
    }
    async deleteWebhookTokenMessage(webhookId, token, messageId) {
        const params = { webhookId, token, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.WEBHOOK_TOKEN_MESSAGE,
                params,
            },
            useAuth: false,
        });
    }
    async disableAccount(options) {
        const body = {
            code: options.code,
            password: options.password,
        };
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_DISABLE_ACCOUNT,
            },
        });
    }
    async editApplicationNews(newsId, options = {}) {
        const body = {
            channel_id: options.channelId,
            description: options.description,
            message_id: options.messageId,
            thumbnail: clientsidechecks_1.bufferToBase64(options.thumbnail),
            title: options.title,
        };
        const params = { newsId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.APPLICATION_NEWS_ID,
                params,
            },
        });
    }
    async editChannel(channelId, options = {}) {
        const body = {
            bitrate: options.bitrate,
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
            nsfw: options.nsfw,
            parent_id: options.parentId,
            permission_overwrites: options.permissionOverwrites,
            position: options.position,
            rate_limit_per_user: options.rateLimitPerUser,
            topic: options.topic,
            type: options.type,
            user_limit: options.userLimit,
        };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.CHANNEL,
                params,
            },
        });
    }
    async editChannelOverwrite(channelId, overwriteId, options = {}) {
        const body = {
            allow: options.allow,
            deny: options.deny,
            type: options.type,
        };
        const params = { channelId, overwriteId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.CHANNEL_PERMISSION,
                params,
            },
        });
    }
    async editConnection(platform, accountId, options = {}) {
        return this.request({
            body: {
                friend_sync: options.friendSync,
                visibility: options.visibility,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME_CONNECTION,
                params: { platform, accountId },
            },
        });
    }
    async editGuild(guildId, options = {}) {
        const body = {
            afk_channel_id: options.afkChannelId,
            afk_timeout: options.afkTimeout,
            banner: clientsidechecks_1.bufferToBase64(options.banner),
            code: options.code,
            default_message_notifications: options.defaultMessageNotifications,
            description: options.description,
            discovery_splash: clientsidechecks_1.bufferToBase64(options.discoverySplash),
            explicit_content_filter: options.explicitContentFilter,
            features: options.features,
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
            owner_id: options.ownerId,
            preferred_locale: options.preferredLocale,
            region: options.region,
            rules_channel_id: options.rulesChannelId,
            splash: clientsidechecks_1.bufferToBase64(options.splash),
            system_channel_flags: options.systemChannelFlags,
            system_channel_id: options.systemChannelId,
            verification_level: options.verificationLevel,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
            // one check is if owner_id, check if code is also in
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD,
                params,
            },
        });
    }
    async editGuildChannels(guildId, channels, options = {}) {
        const body = [];
        const params = { guildId };
        for (let oldChannel of channels) {
            const channel = {
                id: oldChannel.id,
                lock_permissions: oldChannel.lockPermissions,
                parent_id: oldChannel.parentId,
                position: oldChannel.position,
            };
            if (this.clientsideChecks) {
            }
            body.push(channel);
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_CHANNELS,
                params,
            },
        });
    }
    async editGuildEmbed(guildId, options) {
        const body = {
            channel_id: options.channelId,
            enabled: options.enabled,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_EMBED,
                params,
            },
        });
    }
    async editGuildEmoji(guildId, emojiId, options = {}) {
        const body = {
            name: options.name,
            roles: options.roles,
        };
        const params = { guildId, emojiId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_EMOJI,
                params,
            },
        });
    }
    async editGuildIntegration(guildId, integrationId, options = {}) {
        const body = {
            enable_emoticons: options.enableEmoticons,
            expire_behavior: options.expireBehavior,
            expire_grace_period: options.expireGracePeriod,
        };
        const params = { guildId, integrationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_INTEGRATION,
                params,
            },
        });
    }
    async editGuildMember(guildId, userId, options = {}) {
        const body = {
            channel_id: options.channelId,
            deaf: options.deaf,
            mute: options.mute,
            nick: options.nick,
            roles: options.roles,
        };
        const params = { guildId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_MEMBER,
                params,
            },
        });
    }
    async editGuildMemberVerification(guildId, options = {}) {
        const body = {
            description: options.description,
            enabled: options.enabled,
            form_fields: options.formFields,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_MEMBER_VERIFICATION,
                params,
            },
        });
    }
    async editGuildMfaLevel(guildId, options) {
        const body = {
            code: options.code,
            level: options.level,
        };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_MFA,
                params,
            },
        });
    }
    async editGuildNick(guildId, nick, options = {}) {
        const body = { nick };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_MEMBER_NICK,
                params,
            },
        });
    }
    async editGuildRole(guildId, roleId, options = {}) {
        const body = {
            color: options.color,
            hoist: options.hoist,
            mentionable: options.mentionable,
            name: options.name,
            permissions: options.permissions,
        };
        const params = { guildId, roleId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_ROLE,
                params,
            },
        });
    }
    async editGuildRolePositions(guildId, roles, options = {}) {
        const body = [];
        const params = { guildId };
        for (let oldRole of roles) {
            const role = {
                id: oldRole.id,
                position: oldRole.position,
            };
            if (this.clientsideChecks) {
            }
            body.push(role);
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_ROLES,
                params,
            },
        });
    }
    async editGuildVanity(guildId, code, options = {}) {
        const body = { code };
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.GUILD_VANITY_URL,
                params,
            },
        });
    }
    async editLobby(lobbyId, options = {}) {
        const body = {
            capacity: options.capacity,
            locked: options.locked,
            metadata: options.metadata,
            owner_id: options.ownerId,
            type: options.type,
        };
        const params = { lobbyId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.LOBBY,
                params,
            },
        });
    }
    async editLobbyMember(lobbyId, userId, options = {}) {
        const body = {
            metadata: options.metadata,
        };
        const params = { lobbyId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.LOBBY_MEMBER,
                params,
            },
        });
    }
    async editMe(options = {}) {
        const body = {
            avatar: clientsidechecks_1.bufferToBase64(options.avatar),
            code: options.code,
            custom_status: undefined,
            discriminator: options.discriminator,
            email: options.email,
            flags: options.flags,
            new_password: options.newPassword,
            password: options.password,
            username: options.username,
        };
        if (options.customStatus) {
            body.custom_status = {
                emoji_id: options.customStatus.emojiId,
                emoji_name: options.customStatus.emojiName,
                expires_at: options.customStatus.expiresAt,
                text: options.customStatus.text,
            };
        }
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME,
            },
        });
    }
    async editMeBillingPaymentSource(paymentSourceId, options = {}) {
        const body = {
            billing_address: (options.billingAddress) && {
                city: options.billingAddress.city,
                country: options.billingAddress.country,
                line_1: options.billingAddress.line1,
                line_2: options.billingAddress.line2,
                name: options.billingAddress.name,
                postal_code: options.billingAddress.postalCode,
                state: options.billingAddress.state,
            },
            default: options.default,
        };
        const params = { paymentSourceId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME_BILLING_PAYMENT_SOURCE,
                params,
            },
        });
    }
    async editMeBillingSubscription(subscriptionId, options = {}) {
        const body = {
            payment_gateway_plan_id: options.paymentGatewayPlanId,
            payment_source_id: options.paymentSourceId,
            status: options.status,
        };
        const params = { subscriptionId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME_BILLING_SUBSCRIPTION,
                params,
            },
        });
    }
    async editMessage(channelId, messageId, options = {}) {
        if (typeof (options) === 'string') {
            options = { content: options };
        }
        const body = {
            content: options.content,
            embed: options.embed,
            flags: options.flags,
        };
        const params = { channelId, messageId };
        if (options.allowedMentions && typeof (options.allowedMentions) === 'object') {
            body.allowed_mentions = {
                parse: options.allowedMentions.parse,
                roles: options.allowedMentions.roles,
                users: options.allowedMentions.users,
            };
        }
        if (options.embed && typeof (options.embed) === 'object') {
            if ('toJSON' in options.embed) {
                body.embed = options.embed;
            }
            else {
                body.embed = Object.assign({}, options.embed);
                if (typeof (options.embed.author) === 'object') {
                    body.embed.author = {
                        name: options.embed.author.name,
                        url: options.embed.author.url,
                        icon_url: options.embed.author.iconUrl,
                    };
                }
                if (typeof (options.embed.footer) === 'object') {
                    body.embed.footer = {
                        text: options.embed.footer.text,
                        icon_url: options.embed.footer.iconUrl,
                    };
                }
            }
        }
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.CHANNEL_MESSAGE,
                params,
            },
        });
    }
    async editNote(userId, note) {
        const body = { note };
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.ME_NOTE,
                params,
            },
        });
    }
    async editOauth2Application(applicationId, options = {}) {
        const body = {
            description: options.description,
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
            redirect_uris: options.redirectUris,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.OAUTH2_APPLICATION,
                params,
            },
        });
    }
    async editRelationship(userId, type) {
        const body = { type };
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.ME_RELATIONSHIP,
                params,
            },
        });
    }
    async editSettings(options = {}) {
        const body = Object.assign({}, options);
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.ME_SETTINGS,
            },
        });
    }
    async editTeam(teamId, options = {}) {
        const body = {
            code: options.code,
            icon: clientsidechecks_1.bufferToBase64(options.icon),
            name: options.name,
            owner_user_id: options.ownerUserId,
        };
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.TEAM,
                params,
            },
        });
    }
    async editUser(options = {}) {
        return this.editMe(options);
    }
    async editWebhook(webhookId, options = {}) {
        const body = {
            avatar: clientsidechecks_1.bufferToBase64(options.avatar),
            channel_id: options.channelId,
            name: options.name,
        };
        const params = { webhookId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.WEBHOOK,
                params,
            },
        });
    }
    async editWebhookToken(webhookId, token, options = {}) {
        const body = {
            avatar: clientsidechecks_1.bufferToBase64(options.avatar),
            channel_id: options.channelId,
            name: options.name,
        };
        const params = { webhookId, token };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.WEBHOOK_TOKEN,
                params,
            },
        });
    }
    async editWebhookTokenMessage(webhookId, token, messageId, options = {}) {
        if (typeof (options) === 'string') {
            options = { content: options };
        }
        const body = {
            content: options.content,
        };
        const params = { webhookId, token, messageId };
        if (options.allowedMentions && typeof (options.allowedMentions) === 'object') {
            body.allowed_mentions = {
                parse: options.allowedMentions.parse,
                roles: options.allowedMentions.roles,
                users: options.allowedMentions.users,
            };
        }
        if (options.embed) {
            if (options.embeds) {
                options.embeds = [options.embed, ...options.embeds];
            }
            else {
                options.embeds = [options.embed];
            }
        }
        if (options.embeds && options.embeds.length) {
            if (!body.embeds) {
                body.embeds = [];
            }
            for (let embed of options.embeds) {
                if ('toJSON' in embed) {
                    body.embeds.push(embed);
                    continue;
                }
                const raw = Object.assign({}, embed);
                if (typeof (embed.author) === 'object') {
                    raw.author = {
                        name: embed.author.name,
                        url: embed.author.url,
                        icon_url: embed.author.iconUrl,
                    };
                }
                if (typeof (embed.footer) === 'object') {
                    raw.footer = {
                        text: embed.footer.text,
                        icon_url: embed.footer.iconUrl,
                    };
                }
                body.embeds.push(raw);
            }
        }
        if (this.clientsideChecks) {
            // verify body
            // verify files?
            clientsidechecks_1.verifyData(params, {
                messageId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
                token: { required: true, type: clientsidechecks_1.Types.STRING },
                webhookId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
            if (!('content' in body) &&
                !('embeds' in body)) {
                throw new Error('Cannot send an empty message.');
            }
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.PATCH,
                path: endpoints_1.Api.WEBHOOK_TOKEN_MESSAGE,
                params,
            },
            useAuth: false,
        });
    }
    async enableOauth2ApplicationAssets(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body: {},
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_ASSETS_ENABLE,
                params,
            },
        });
    }
    async enableOauth2ApplicationRpc(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body: {},
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_RPC_ENABLE,
                params,
            },
        });
    }
    async executeWebhook(webhookId, token, options = {}, compatibleType) {
        if (typeof (options) === 'string') {
            options = { content: options };
        }
        const body = {
            avatar_url: options.avatarUrl,
            content: options.content,
            tts: options.tts,
            username: options.username,
        };
        const files = [];
        const params = { webhookId, token };
        const query = {};
        const route = {
            method: constants_2.HTTPMethods.POST,
            path: endpoints_1.Api.WEBHOOK_TOKEN,
            params,
        };
        if (compatibleType) {
            switch (compatibleType) {
                case 'github':
                    {
                        route.path = endpoints_1.Api.WEBHOOK_TOKEN_GITHUB;
                    }
                    ;
                    break;
                case 'slack':
                    {
                        route.path = endpoints_1.Api.WEBHOOK_TOKEN_SLACK;
                    }
                    ;
                    break;
                default:
                    {
                        throw new Error('Invalid Webhook Compatibility Type');
                    }
                    ;
            }
        }
        if (options.file) {
            files.push(options.file);
        }
        if (options.files && options.files.length) {
            for (let file of options.files) {
                files.push(file);
            }
        }
        if (options.allowedMentions && typeof (options.allowedMentions) === 'object') {
            body.allowed_mentions = {
                parse: options.allowedMentions.parse,
                roles: options.allowedMentions.roles,
                users: options.allowedMentions.users,
            };
        }
        if (options.embed) {
            if (options.embeds) {
                options.embeds = [options.embed, ...options.embeds];
            }
            else {
                options.embeds = [options.embed];
            }
        }
        if (options.embeds && options.embeds.length) {
            if (!body.embeds) {
                body.embeds = [];
            }
            for (let embed of options.embeds) {
                if ('toJSON' in embed) {
                    body.embeds.push(embed);
                    continue;
                }
                const raw = Object.assign({}, embed);
                if (typeof (embed.author) === 'object') {
                    raw.author = {
                        name: embed.author.name,
                        url: embed.author.url,
                        icon_url: embed.author.iconUrl,
                    };
                }
                if (typeof (embed.footer) === 'object') {
                    raw.footer = {
                        text: embed.footer.text,
                        icon_url: embed.footer.iconUrl,
                    };
                }
                body.embeds.push(raw);
            }
        }
        if (options.wait) {
            query.wait = options.wait;
        }
        if (this.clientsideChecks) {
            // verify body
            // verify files?
            clientsidechecks_1.verifyData(params, {
                token: { required: true, type: clientsidechecks_1.Types.STRING },
                webhookId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
            if (!('content' in body) &&
                !('embeds' in body) &&
                !(files.length)) {
                throw new Error('Cannot send an empty message.');
            }
        }
        return this.request({
            body,
            files,
            query,
            route,
            useAuth: false,
        });
    }
    async fetchActivities() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ACTIVITIES,
            },
        });
    }
    async fetchApplicationNews(applicationIds) {
        // this one requires the array to be urlencoded in one param
        const query = {
            application_ids: String(applicationIds),
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATION_NEWS,
            },
        });
    }
    async fetchApplicationNewsId(newsId) {
        const params = { newsId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATION_NEWS_ID,
                params,
            },
        });
    }
    fetchApplications() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATIONS,
            },
        });
    }
    async fetchApplication(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATION,
                params,
            },
        });
    }
    async fetchApplicationsDetectable() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATIONS_DETECTABLE,
            },
        });
    }
    async fetchApplicationsPublic(applicationIds) {
        const query = { application_ids: applicationIds };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATIONS_PUBLIC,
            },
        });
    }
    async fetchApplicationsTrendingGlobal() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.APPLICATIONS_TRENDING_GLOBAL,
            },
        });
    }
    fetchAuthConsentRequired() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.AUTH_CONSENT_REQUIRED,
            },
        });
    }
    async fetchChannel(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL,
                params,
            },
        });
    }
    async fetchChannelCall(channelId) {
        // checks if the channel is callable
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_CALL,
                params,
            },
        });
    }
    async fetchChannelInvites(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_INVITES,
                params,
            },
        });
    }
    async fetchChannelStoreListing(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_STORE_LISTING,
                params,
            },
        });
    }
    async fetchChannelWebhooks(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_WEBHOOKS,
                params,
            },
        });
    }
    fetchConsentRequired() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.AUTH_CONSENT_REQUIRED,
            },
        });
    }
    async fetchConnectionAuthorizeUrl(platform) {
        const params = { platform };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CONNECTION_AUTHORIZE,
                params,
            },
        });
    }
    fetchDiscoverableGuilds() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.DISCOVERABLE_GUILDS,
            },
        });
    }
    async fetchDms(userId = '@me') {
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.USER_CHANNELS,
                params,
            },
        });
    }
    fetchEmojiGuild(emojiId) {
        const params = { emojiId };
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.EMOJI_GUILD,
                params,
            },
        });
    }
    fetchExperiments(fingerprint) {
        const headers = {};
        if (fingerprint) {
            headers['x-fingerprint'] = fingerprint;
        }
        return this.request({
            headers,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.EXPERIMENTS,
            },
        });
    }
    fetchGateway() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GATEWAY,
            },
        });
    }
    fetchGatewayBot() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GATEWAY_BOT,
            },
        });
    }
    async fetchGiftCode(code, options = {}) {
        const params = { code };
        const query = {
            country_code: options.countryCode,
            with_application: options.withApplication,
            with_subscription_plan: options.withSubscriptionPlan,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ENTITLEMENTS_GIFT_CODE,
                params,
            },
        });
    }
    async fetchGuild(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD,
                params,
            },
        });
    }
    async fetchGuildApplications(guildId, channelId) {
        const params = { guildId };
        const query = { channel_id: channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_APPLICATIONS,
                params,
            },
        });
    }
    async fetchGuildAuditLogs(guildId, options) {
        const params = { guildId };
        const query = {
            action_type: options.actionType,
            before: options.before,
            limit: options.limit,
            user_id: options.userId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_AUDIT_LOGS,
                params,
            },
        });
    }
    async fetchGuildBans(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_BANS,
                params,
            },
        });
    }
    async fetchGuildChannels(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_CHANNELS,
                params,
            },
        });
    }
    async fetchGuildEmbed(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_EMBED,
                params,
            },
        });
    }
    async fetchGuildEmojis(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_EMOJIS,
                params,
            },
        });
    }
    async fetchGuildEmoji(guildId, emojiId) {
        const params = { guildId, emojiId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_EMOJI,
                params,
            },
        });
    }
    async fetchGuildIntegrations(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_INTEGRATIONS,
                params,
            },
        });
    }
    async fetchGuildInvites(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_INVITES,
                params,
            },
        });
    }
    async fetchGuildMembers(guildId, options = {}) {
        const params = { guildId };
        const query = {
            after: options.after,
            limit: options.limit,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_MEMBERS,
                params,
            },
        });
    }
    async fetchGuildMembersSearch(guildId, options) {
        const params = { guildId };
        const query = {
            limit: options.limit,
            query: options.query,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_MEMBERS_SEARCH,
                params,
            },
        });
    }
    async fetchGuildMember(guildId, userId) {
        const params = { guildId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_MEMBER,
                params,
            },
        });
    }
    async fetchGuildMemberVerification(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_MEMBER_VERIFICATION,
                params,
            },
        });
    }
    async fetchGuildPremiumSubscriptions(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_PREMIUM_SUBSCRIPTIONS,
                params,
            },
        });
    }
    async fetchGuildPreview(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_PREVIEW,
                params,
            },
        });
    }
    async fetchGuildPruneCount(guildId, options = {}) {
        const params = { guildId };
        const query = {
            days: options.days,
            include_roles: options.includeRoles,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_PRUNE,
                params,
            },
        });
    }
    async fetchGuildRoles(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_ROLES,
                params,
            },
        });
    }
    async fetchGuildTemplates(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_TEMPLATES,
                params,
            },
        });
    }
    async fetchGuildVanityUrl(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_VANITY_URL,
                params,
            },
        });
    }
    async fetchGuildWebhooks(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_WEBHOOKS,
                params,
            },
        });
    }
    async fetchGuildWidget(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_WIDGET,
                params,
            },
        });
    }
    async fetchGuildWidgetJson(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_WIDGET_JSON,
                params,
            },
        });
    }
    async fetchGuildWidgetPng(guildId, options = {}) {
        const params = { guildId };
        const query = {
            style: options.style,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILD_WIDGET_PNG,
                params,
            },
        });
    }
    async fetchInvite(code, options = {}) {
        const params = { code };
        const query = {
            with_counts: options.withCounts,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.INVITE,
                params,
            },
        });
    }
    async fetchMe(options = {}) {
        const query = {
            with_analytics_token: options.withAnalyticsToken,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME,
            },
        });
    }
    fetchMeBillingPaymentSources() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_BILLING_PAYMENT_SOURCES,
            }
        });
    }
    async fetchMeBillingPayments(options = {}) {
        const query = {
            limit: options.limit,
            before_id: options.beforeId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_BILLING_PAYMENTS,
            },
        });
    }
    fetchMeBillingSubscriptions() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_BILLING_SUBSCRIPTIONS,
            },
        });
    }
    fetchMeChannels() {
        return this.request({
            route: {
                path: endpoints_1.Api.ME_CHANNELS,
            },
        });
    }
    fetchMeConnections() {
        return this.request({
            route: {
                path: endpoints_1.Api.ME_CONNECTIONS,
            },
        });
    }
    async fetchMeConnectionAccessToken(platform, accountId) {
        const params = { platform, accountId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_CONNECTION_ACCESS_TOKEN,
                params,
            },
        });
    }
    async fetchMeConnectionSubreddits(accountId) {
        const params = { accountId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_CONNECTION_REDDIT_SUBREDDITS,
                params,
            },
        });
    }
    async fetchMeFeedSettings(options = {}) {
        const query = {
            include_autosubscribed_game: options.includeAutosubscribedGames,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_FEED_SETTINGS,
            },
        });
    }
    async fetchMeGuilds(options = {}) {
        const query = {
            after: options.after,
            before: options.before,
            limit: options.limit,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                path: endpoints_1.Api.ME_GUILDS,
            },
        });
    }
    async fetchMentions(options = {}) {
        const query = {
            after: options.after,
            around: options.around,
            before: options.before,
            everyone: options.everyone,
            limit: options.limit,
            roles: options.roles,
        };
        if (this.clientsideChecks) {
            if (query.limit !== undefined) {
                if (query.limit < 1 || 100 < query.limit) {
                    throw new Error('Limit has to be between 1 and 100');
                }
            }
            if ((query.after && query.around) ||
                (query.after && query.before) ||
                (query.around && query.before)) {
                throw new Error('Choose between around, before, or after, cannot have more than one.');
            }
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_MENTIONS,
            },
        });
    }
    async fetchMessage(channelId, messageId) {
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_MESSAGE,
                params,
            },
        });
    }
    async fetchMessages(channelId, options = {}) {
        const params = { channelId };
        const query = {
            after: options.after,
            around: options.around,
            before: options.before,
            limit: options.limit,
        };
        if (this.clientsideChecks) {
            if (query.limit !== undefined) {
                if (query.limit < 1 || 100 < query.limit) {
                    throw new Error('Limit has to be between 1 and 100');
                }
            }
            if ((query.after && query.around) ||
                (query.after && query.before) ||
                (query.around && query.before)) {
                throw new Error('Choose between around, before, or after, cannot have more than one.');
            }
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_MESSAGES,
                params,
            },
        });
    }
    async fetchMeStickerPacks(countryCode) {
        const query = {
            country_code: countryCode,
        };
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.ME_STICKER_PACKS,
            },
        });
    }
    async fetchOauth2Applications(options = {}) {
        const query = {
            with_team_applications: options.withTeamApplications,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_APPLICATIONS,
            },
        });
    }
    async fetchOauth2Application(applicationId = '@me') {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_APPLICATION,
                params,
            },
        });
    }
    async fetchOauth2ApplicationAssets(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_APPLICATION_ASSETS,
                params,
            },
        });
    }
    async fetchOauth2ApplicationWhitelist(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_APPLICATION_WHITELIST,
                params,
            },
        });
    }
    async fetchOauth2Authorize(options = {}) {
        const query = {
            client_id: options.clientId,
            response_type: options.responseType,
            scope: options.scope,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_AUTHORIZE,
            },
        });
    }
    async fetchOauth2AuthorizeWebhookChannels(guildId) {
        const query = {
            guild_id: guildId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_AUTHORIZE_WEBHOOK_CHANNELS,
            },
        });
    }
    fetchOauth2Tokens() {
        // fetchAuthorizedApplications
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_TOKENS,
            },
        });
    }
    async fetchOauth2Token(tokenId) {
        const params = { tokenId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.OAUTH2_TOKEN,
                params,
            },
        });
    }
    async fetchPinnedMessages(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_PINS,
                params,
            },
        });
    }
    async fetchReactions(channelId, messageId, emoji, options = {}) {
        const params = { channelId, messageId, emoji };
        const query = {
            after: options.after,
            before: options.before,
            limit: options.limit,
        };
        if (this.clientsideChecks) {
            //params
            if (query.limit !== undefined) {
                if (query.limit < 1 || 100 < query.limit) {
                    throw new Error('Limit has to be between 1 and 100');
                }
            }
            if (query.after && query.before) {
                throw new Error('Choose between after or before, cannot have more than one.');
            }
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CHANNEL_MESSAGE_REACTION,
                params,
            },
        });
    }
    async fetchStoreApplicationAssets(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.STORE_APPLICATION_ASSETS,
                params,
            },
        });
    }
    async fetchStorePublishedListingsSkus(applicationId) {
        const query = {
            application_id: applicationId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.STORE_PUBLISHED_LISTINGS_SKUS,
            },
            useAuth: false,
        });
    }
    async fetchStorePublishedListingsSku(skuId) {
        const query = { skuId };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.STORE_PUBLISHED_LISTINGS_SKU,
            },
        });
    }
    async fetchStorePublishedListingsSkuSubscriptionPlans(skuId) {
        const query = { skuId };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.STORE_PUBLISHED_LISTINGS_SKU_SUBSCRIPTION_PLANS,
            },
        });
    }
    async fetchStreamPreview(streamKey) {
        const params = { streamKey };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.STREAM_PREVIEW,
                params,
            }
        });
    }
    fetchTeams() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAMS,
            },
        });
    }
    async fetchTeam(teamId) {
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAM,
                params,
            },
        });
    }
    async fetchTeamApplications(teamId) {
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAM_APPLICATIONS,
                params,
            },
        });
    }
    async fetchTeamMembers(teamId) {
        const params = { teamId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAM_MEMBERS,
                params,
            },
        });
    }
    async fetchTeamMember(teamId, userId) {
        const params = { teamId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAM_MEMBER,
                params,
            },
        });
    }
    async fetchTeamPayouts(teamId, options = {}) {
        const params = { teamId };
        const query = {
            limit: options.limit,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.TEAM_PAYOUTS,
                params,
            },
        });
    }
    async fetchTemplate(templateId) {
        const params = { templateId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.GUILDS_TEMPLATE,
                params,
            },
        });
    }
    async fetchUser(userId) {
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.USER,
                params,
            },
        });
    }
    async fetchUserActivityMetadata(userId, sessionId, activityId) {
        const params = { userId, sessionId, activityId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.USER_ACTIVITY_METADATA,
                params,
            },
        });
    }
    async fetchUserChannels(userId) {
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.USER_CHANNELS,
                params,
            },
        });
    }
    async fetchUserProfile(userId) {
        const params = { userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.USER_PROFILE,
                params,
            },
        });
    }
    fetchVoiceIce() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.VOICE_ICE,
            },
        });
    }
    async fetchVoiceRegions(guildId) {
        const route = {
            method: constants_2.HTTPMethods.GET,
            path: endpoints_1.Api.VOICE_REGIONS,
            params: {},
        };
        if (guildId) {
            route.path = endpoints_1.Api.GUILD_REGIONS;
            route.params.guildId = guildId;
            if (this.clientsideChecks) {
            }
        }
        return this.request({ route });
    }
    async fetchWebhook(webhookId) {
        const params = { webhookId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.WEBHOOK,
                params,
            },
        });
    }
    async fetchWebhookToken(webhookId, token) {
        const params = { webhookId, token };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.WEBHOOK_TOKEN,
                params,
            },
        });
    }
    async followChannel(channelId, options) {
        const body = {
            webhook_channel_id: options.webhookChannelId,
        };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_FOLLOWERS,
                params,
            },
        });
    }
    async forgotPassword(options) {
        const body = {
            email: options.email,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_PASSWORD_FORGOT,
            },
        });
    }
    integrationJoin(integrationId) {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.INTEGRATION_JOIN,
                params: { integrationId },
            },
        });
    }
    async joinGuild(guildId, options = {}) {
        const params = { guildId };
        const query = {
            lurker: options.lurker,
            session_id: options.sessionId,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            query,
            route: {
                method: constants_2.HTTPMethods.PUT,
                path: endpoints_1.Api.GUILD_JOIN,
                params,
            },
        });
    }
    async leaveGuild(guildId) {
        const params = { guildId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_GUILD,
                params,
            },
        });
    }
    async login(options) {
        const body = {
            captcha_key: options.captchaKey,
            email: options.email,
            gift_code_sku_id: options.giftCodeSKUId,
            login_source: options.loginSource,
            password: options.password,
            undelete: options.undelete,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_LOGIN,
            },
        });
    }
    async loginMfaSms(options) {
        const body = {
            code: options.code,
            gift_code_sku_id: options.giftCodeSKUId,
            login_source: options.loginSource,
            ticket: options.ticket,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_MFA_SMS,
            },
        });
    }
    async loginMfaSmsSend(options) {
        const body = {
            ticket: options.ticket,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_MFA_SMS_SEND,
            },
        });
    }
    async loginMfaTotp(options) {
        const body = {
            code: options.code,
            gift_code_sku_id: options.giftCodeSKUId,
            login_source: options.loginSource,
            ticket: options.ticket,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_MFA_TOTP,
            },
        });
    }
    async logout(options = {}) {
        const body = {
            provider: options.provider,
            token: options.token,
            voip_provider: options.voipProvider,
            voip_token: options.voipToken,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_LOGOUT,
            },
        });
    }
    async messageSuppressEmbeds(channelId, messageId, options = {}) {
        const body = {
            suppress: options.suppress,
        };
        const params = { channelId, messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_MESSAGE_SUPPRESS_EMBEDS,
                params,
            },
        });
    }
    async oauth2Authorize(options = {}) {
        const body = {
            authorize: options.authorize,
            bot_guild_id: options.botGuildId,
            captcha_key: options.captchaKey,
            permissions: options.permissions,
            webhook_channel_id: options.webhookChannelId,
            webhook_guild_id: options.webhookGuildId,
        };
        const query = {
            client_id: options.clientId,
            prompt: options.prompt,
            redirect_uri: options.redirectUri,
            response_type: options.responseType,
            scope: options.scope,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            query,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_AUTHORIZE,
            },
        });
    }
    async redeemGiftCode(code, options = {}) {
        const body = {
            channel_id: options.channelId,
        };
        const params = { code };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ENTITLEMENTS_GIFT_CODE_REDEEM,
                params,
            },
        });
    }
    async register(options) {
        const body = {
            captcha_key: options.captchaKey,
            consent: options.consent,
            email: options.email,
            fingerprint: options.fingerprint,
            gift_code_sku_id: options.giftCodeSKUId,
            invite: options.invite,
            password: options.password,
            username: options.username,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_REGISTER,
            },
        });
    }
    async removeGuildBan(guildId, userId, options = {}) {
        const params = { guildId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_BAN,
                params,
            },
        });
    }
    async removeGuildMember(guildId, userId, options = {}) {
        const params = { guildId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_MEMBER,
                params,
            },
        });
    }
    async removeGuildMemberRole(guildId, userId, roleId, options = {}) {
        const params = { guildId, userId, roleId };
        if (this.clientsideChecks) {
        }
        return this.request({
            headers: {
                [constants_2.DiscordHeaders.AUDIT_LOG_REASON]: (options.reason) ? encodeURIComponent(options.reason) : options.reason,
            },
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.GUILD_MEMBER_ROLE,
                params,
            },
        });
    }
    async removeMention(messageId) {
        const params = { messageId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.ME_MENTION,
                params,
            },
        });
    }
    async removeOauth2ApplicationWhitelistUser(applicationId, userId) {
        const params = { applicationId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.OAUTH2_APPLICATION_WHITELIST_USER,
                params,
            },
        });
    }
    async removeRecipient(channelId, userId) {
        const params = { channelId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_RECIPIENT,
                params,
            },
        });
    }
    async removeTeamMember(teamId, userId) {
        const params = { teamId, userId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.TEAM_MEMBER,
                params,
            },
        });
    }
    async resetOauth2Application(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body: {},
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_RESET,
                params,
            },
        });
    }
    async resetOauth2ApplicationBot(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body: {},
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_BOT_RESET,
                params,
            },
        });
    }
    async resetPassword(options) {
        const body = {
            password: options.password,
            push_provider: options.pushProvider,
            push_token: options.pushToken,
            push_voip_provider: options.pushVoipProvider,
            push_voip_token: options.pushVoipToken,
            token: options.token,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_PASSWORD_RESET,
            },
        });
    }
    async resetPasswordMfa(options) {
        const body = {
            code: options.code,
            password: options.password,
            ticket: options.ticket,
            token: options.token,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_PASSWORD_RESET,
            },
        });
    }
    async search(searchType, searchId, options = {}, retry = true, retryNumber = 0) {
        const route = {
            method: constants_2.HTTPMethods.GET,
            path: '',
            params: {},
        };
        switch (searchType) {
            case 'channel':
                {
                    route.path = endpoints_1.Api.CHANNEL_MESSAGES_SEARCH;
                    route.params.channelId = searchId;
                }
                ;
                break;
            case 'guild':
                {
                    route.path = endpoints_1.Api.GUILD_SEARCH;
                    route.params.guildId = searchId;
                }
                ;
                break;
            default:
                {
                    throw new Error('Invalid Search Type');
                }
                ;
        }
        const query = {
            attachment_extensions: options.attachmentExtensions,
            attachment_filename: options.attachmentFilename,
            author_id: options.authorId,
            channel_id: options.channelId,
            content: options.content,
            has: options.has,
            include_nsfw: options.includeNSFW,
            limit: options.limit,
            max_id: options.maxId,
            mentions: options.mentions,
            min_id: options.minId,
            offset: options.offset,
        };
        if (this.clientsideChecks) {
        }
        const response = await this.request({
            dataOnly: false,
            query,
            route,
        });
        const body = await response.json();
        if (response.status === 202 && retry) {
            if (5 < ++retryNumber) {
                throw new Error('Retried 5 times, stopping the search.');
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.search(searchType, searchId, options, retry, retryNumber)
                        .then(resolve)
                        .catch(reject);
                }, body['retry_after'] || 5000);
            });
        }
        return body;
    }
    async searchChannel(channelId, options = {}, retry = true, retryNumber = 0) {
        return this.search('channel', channelId, options, retry, retryNumber);
    }
    async searchGuild(guildId, options = {}, retry = true, retryNumber = 0) {
        return this.search('guild', guildId, options, retry, retryNumber);
    }
    async searchLobbies(applicationId, options = {}) {
        const body = {
            application_id: applicationId,
            filter: options.filter,
            sort: options.sort,
            limit: options.limit,
            distance: options.distance,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.LOBBIES_SEARCH,
            },
        });
    }
    async sendDownloadText(number) {
        const body = {
            phone_number: number,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.DOWNLOAD_SMS,
            },
        });
    }
    async sendFriendRequest(options) {
        const body = {
            discriminator: options.discriminator,
            username: options.username,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_RELATIONSHIPS,
            },
        });
    }
    async sendLobbyData(lobbyId, data) {
        const body = { data };
        const params = { lobbyId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.LOBBY_SEND,
                params,
            },
        });
    }
    async startChannelCallRinging(channelId, options = {}) {
        const body = { recipients: options.recipients };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_CALL_RING,
                params,
            },
        });
    }
    async stopChannelCallRinging(channelId, options = {}) {
        const body = { recipients: options.recipients };
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_CALL_STOP_RINGING,
                params,
            },
        });
    }
    async submitConnectionPinCode(platform, pin) {
        const params = { platform, pin };
        if (this.clientsideChecks) {
        }
        // after this request, continue to callback?
        return this.request({
            route: {
                method: constants_2.HTTPMethods.GET,
                path: endpoints_1.Api.CONNECTION_CALLBACK_CONTINUATION_PIN,
                params,
            },
        });
    }
    async submitOauth2ApplicationApproval(applicationId) {
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_APPROVALS,
                params,
            },
        });
    }
    async syncGuildIntegration(guildId, integrationId) {
        const params = { guildId, integrationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.GUILD_INTEGRATION_SYNC,
                params,
            },
        });
    }
    async transferOauth2Application(applicationId, options) {
        const body = {
            code: options.code,
            team_id: options.teamId,
        };
        const params = { applicationId };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.OAUTH2_APPLICATION_TRANSFER,
                params,
            },
        });
    }
    async triggerTyping(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.CHANNEL_TYPING,
                params,
            },
        });
    }
    async unAckChannel(channelId) {
        const params = { channelId };
        if (this.clientsideChecks) {
            clientsidechecks_1.verifyData(params, {
                channelId: { required: true, type: clientsidechecks_1.Types.SNOWFLAKE },
            });
        }
        return this.request({
            route: {
                method: constants_2.HTTPMethods.DELETE,
                path: endpoints_1.Api.CHANNEL_MESSAGES_ACK,
                params,
            },
        });
    }
    async verify(options) {
        const body = {
            captcha_key: options.captchaKey,
            token: options.token,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_VERIFY,
            },
        });
    }
    async verifyCaptcha(options) {
        const body = {
            captcha_key: options.captchaKey,
        };
        if (this.clientsideChecks) {
        }
        return this.request({
            body,
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.ME_CAPTCHA_VERIFY,
            },
        });
    }
    verifyResend() {
        return this.request({
            route: {
                method: constants_2.HTTPMethods.POST,
                path: endpoints_1.Api.AUTH_VERIFY_RESEND,
            },
        });
    }
}
exports.Client = Client;

/// <reference types="node" />
import { Request, RequestFile, RequestOptions, Response } from '../../Iris-Rest';
import { RestRequest } from './request';
export declare namespace RestClientEvents {
    interface RequestPayload {
        request: Request;
        restRequest: RestRequest;
    }
    interface ResponsePayload {
        response: Response;
        restRequest: RestRequest;
    }
}
export declare namespace RequestTypes {
    interface File extends RequestFile {
    }
    interface Options extends RequestOptions {
        dataOnly?: boolean;
        errorOnRatelimit?: boolean;
        fingerprint?: string;
        skipRatelimitCheck?: boolean;
        token?: string;
        useAuth?: boolean;
    }
    interface AcceptTemplate {
        icon?: Buffer | string;
        name: string;
    }
    interface ActivateOauth2ApplicationLicense {
        code?: string;
        guildId: string;
    }
    interface AddConnection {
        name: string;
        friendSync?: boolean;
    }
    interface AddGuildMember {
        accessToken: string;
        deaf?: boolean;
        mute?: boolean;
        nick?: string;
        roles?: Array<string>;
    }
    interface AddGuildMemberRole {
        reason?: string;
    }
    interface AddTeamMember {
        discriminator: string;
        username: string;
    }
    interface AddOauth2ApplicationWhitelistUser {
        branchIds?: Array<string>;
        discriminator: string;
        username: string;
    }
    interface AuthorizeIpAddress {
        token: string;
    }
    interface BeginGuildPrune {
        computePruneCount?: boolean;
        days?: number;
        includeRoles?: Array<string>;
        reason?: string;
    }
    interface ConnectionCallback {
        code: string;
        friendSync: boolean;
        fromContinuation: boolean;
        insecure?: boolean;
        openIdParams: object;
        state: string;
    }
    interface CreateApplicationNews {
        applicationId: string;
        channelId: string;
        description?: string;
        messageId: string;
        thumbnailOverride?: Buffer | string;
        title?: string;
        url?: string;
    }
    interface CreateChannelInvite {
        maxAge?: number;
        maxUses?: number;
        targetUser?: string;
        targetUserType?: number;
        temporary?: boolean;
        unique?: boolean;
    }
    interface CreateChannelMessageEmbed {
        author?: {
            iconUrl?: string;
            name?: string;
            url?: string;
        };
        color?: number;
        description?: string;
        fields?: Array<{
            inline?: boolean;
            name: string;
            value: string;
        }>;
        footer?: {
            iconUrl?: string;
            text: string;
        };
        image?: {
            url?: string;
        };
        provider?: {
            name?: string;
            url?: string;
        };
        thumbnail?: {
            url?: string;
        };
        timestamp?: string;
        title?: string;
        type?: string;
        url?: string;
        video?: {
            url?: string;
        };
    }
    interface CreateChannelMessageEmbedFunction {
        toJSON: () => RawChannelMessageEmbed;
    }
    interface CreateChannelOverwrite {
        allow: number;
        deny: number;
        id: string;
        type: number | string;
    }
    interface CreateDm {
        recipientId?: string;
        recipients?: Array<string>;
    }
    interface CreateGuild {
        channels?: Array<CreateGuildChannel>;
        defaultMessageNotifications?: number;
        explicitContentFilter?: number;
        icon?: Buffer | string;
        name: string;
        region: string;
        roles?: Array<CreateGuildRole>;
        verificationLevel?: number;
    }
    interface CreateGuildBan {
        deleteMessageDays?: string;
        reason?: string;
    }
    interface CreateGuildChannel {
        branchId?: string;
        bitrate?: number;
        name: string;
        nsfw?: boolean;
        parentId?: string;
        permissionOverwrites?: Array<CreateChannelOverwrite>;
        reason?: string;
        skuId?: string;
        topic?: string;
        type: number;
        userLimit?: number;
    }
    interface CreateGuildEmoji {
        name: string;
        image: Buffer | string;
        reason?: string;
        roles?: Array<string>;
    }
    interface CreateGuildIntegration {
        id: string;
        reason?: string;
        type: string;
    }
    interface CreateGuildRole {
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
        name?: string;
        permissions?: number;
        reason?: string;
    }
    interface CreateGuildTemplate {
        description?: string;
        name: string;
    }
    interface CreateLobby {
        capacity?: number;
        locked?: boolean;
        metadata?: any;
        ownerId?: string;
        type?: number;
    }
    interface CreateMeBillingPaymentSource {
        billingAddress: {
            city: string;
            country: string;
            line1: string;
            line2: string;
            name: string;
            postalCode: string;
            state: string;
        };
        paymentGateway: string;
        token: string;
    }
    interface CreateMeBillingSubscription {
        paymentGatewayPlanId: string;
        paymentSourceId: string;
        trialId?: string;
    }
    interface CreateMessage {
        activity?: {
            partyId?: string;
            sessionId?: string;
            type?: number;
        };
        allowedMentions?: {
            parse?: Array<string>;
            repliedUser?: boolean;
            roles?: Array<string>;
            users?: Array<string>;
        };
        applicationId?: string;
        content?: string;
        embed?: CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction | null;
        file?: RequestFile;
        files?: Array<RequestFile>;
        hasSpoiler?: boolean;
        messageReference?: {
            channelId: string;
            guildId?: string;
            messageId: string;
        };
        nonce?: string;
        stickerIds?: Array<string>;
        tts?: boolean;
    }
    interface CreateOauth2Application {
        name: string;
        teamId?: string;
    }
    interface CreateOauth2ApplicationAsset {
        image: Buffer | string;
        name: string;
        type: string;
    }
    interface CreateStoreApplicationAsset {
        file?: RequestFile;
        files?: Array<RequestFile>;
    }
    interface CreateTeam {
        icon?: Buffer | string | null;
        name?: string;
    }
    interface CreateWebhook {
        avatar?: string;
        name: string;
    }
    interface DeleteAccount {
        code?: string;
        password: string;
    }
    interface DeleteChannel {
        reason?: string;
    }
    interface DeleteChannelOverwrite {
        reason?: string;
    }
    interface DeleteGuild {
        code?: string;
    }
    interface DeleteGuildEmoji {
        reason?: string;
    }
    interface DeleteGuildIntegration {
        reason?: string;
    }
    interface DeleteGuildRole {
        reason?: string;
    }
    interface DeleteInvite {
        reason?: string;
    }
    interface DeleteMessage {
        reason?: string;
    }
    interface DeleteOauth2Application {
        code?: string;
    }
    interface DeleteTeam {
        code?: string;
    }
    interface DeleteWebhook {
        reason?: string;
    }
    interface DisableAccount {
        code?: string;
        password: string;
    }
    interface EditApplicationNews {
        channelId?: string;
        description?: string;
        messageId?: string;
        thumbnail?: Buffer | string;
        title?: string;
    }
    interface EditChannel {
        bitrate?: number;
        icon?: Buffer | string;
        name?: string;
        nsfw?: boolean;
        parentId?: string;
        permissionOverwrites?: Array<CreateChannelOverwrite>;
        position?: string;
        rateLimitPerUser?: number;
        reason?: string;
        topic?: string;
        type?: number;
        userLimit?: number;
    }
    interface EditChannelOverwrite {
        allow?: number;
        deny?: number;
        reason?: string;
        type?: number | string;
    }
    interface EditConnection {
        friendSync?: boolean;
        visibility?: boolean;
    }
    interface EditGuild {
        afkChannelId?: null | string;
        afkTimeout?: number;
        banner?: Buffer | string;
        code?: string;
        defaultMessageNotifications?: string;
        description?: string;
        discoverySplash?: Buffer | string | null;
        explicitContentFilter?: number;
        features?: Array<string>;
        icon?: Buffer | string | null;
        name?: string;
        ownerId?: string;
        preferredLocale?: string;
        reason?: string;
        region?: string;
        rulesChannelId?: null | string;
        splash?: Buffer | string | null;
        systemChannelFlags?: number;
        systemChannelId?: null | string;
        verificationLevel?: number;
    }
    interface EditGuildChannel {
        id: string;
        lockPermissions?: boolean;
        parentId?: string;
        position?: number;
    }
    interface EditGuildChannels extends Array<EditGuildChannel> {
    }
    interface EditGuildChannelsExtra {
        reason?: string;
    }
    interface EditGuildEmbed {
        channelId?: string;
        enabled: boolean;
        reason?: string;
    }
    interface EditGuildEmoji {
        name?: string;
        reason?: string;
        roles?: Array<string>;
    }
    interface EditGuildIntegration {
        enableEmoticons?: boolean;
        expireBehavior?: number;
        expireGracePeriod?: number;
        reason?: string;
    }
    interface EditGuildMember {
        channelId?: string | null;
        deaf?: boolean;
        mute?: boolean;
        nick?: string;
        reason?: string;
        roles?: Array<string>;
    }
    interface EditGuildMemberVerification {
        description?: string;
        enabled?: boolean;
        formFields?: Array<string>;
    }
    interface EditGuildMfaLevel {
        code: string;
        level: number;
        reason?: string;
    }
    interface EditGuildNick {
        reason?: string;
    }
    interface EditGuildRole {
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
        name?: string;
        permissions?: number;
        reason?: string;
    }
    interface EditGuildRolePosition {
        id: string;
        position?: number;
    }
    interface EditGuildRolePositions extends Array<EditGuildRolePosition> {
    }
    interface EditGuildRolePositionsExtra {
        reason?: string;
    }
    interface EditGuildVanity {
        reason?: string;
    }
    interface EditLobby {
        capacity?: number;
        locked?: boolean;
        metadata?: any;
        ownerId?: string;
        type?: number;
    }
    interface EditLobbyMember {
        metadata?: any;
    }
    interface EditMe {
        avatar?: Buffer | null | string;
        code?: string;
        customStatus?: {
            emojiId?: string;
            emojiName?: string;
            expiresAt?: Date | string;
            text?: string;
        };
        discriminator?: number | string;
        email?: string;
        flags?: number;
        newPassword?: string;
        password?: string;
        username?: string;
    }
    interface EditMeBillingPaymentSource {
        billingAddress?: {
            city: string;
            country: string;
            line1: string;
            line2: string;
            name: string;
            postalCode: string;
            state: string;
        };
        default?: boolean;
    }
    interface EditMeBillingSubscription {
        paymentGatewayPlanId?: string;
        paymentSourceId?: string;
        status?: string;
    }
    interface EditMessage {
        allowedMentions?: {
            parse?: Array<string>;
            roles?: Array<string>;
            users?: Array<string>;
        };
        content?: string;
        embed?: CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction | null;
        flags?: number;
    }
    interface EditOauth2Application {
        description?: string;
        icon?: Buffer | string;
        name?: string;
        redirectUris?: Array<string>;
    }
    interface EditSettings {
        [key: string]: any;
    }
    interface EditTeam {
        code?: string;
        icon?: Buffer | string | null;
        name?: string;
        ownerUserId?: string;
    }
    interface EditWebhook {
        avatar?: Buffer | string | null;
        channelId?: string;
        name?: string;
        reason?: string;
    }
    interface EditWebhookTokenMessage {
        allowedMentions?: {
            parse?: Array<string>;
            roles?: Array<string>;
            users?: Array<string>;
        };
        content?: string;
        embed?: CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction;
        embeds?: Array<CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction>;
    }
    interface ExecuteWebhook {
        allowedMentions?: {
            parse?: Array<string>;
            roles?: Array<string>;
            users?: Array<string>;
        };
        avatarUrl?: string;
        content?: string;
        embed?: CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction;
        embeds?: Array<CreateChannelMessageEmbed | CreateChannelMessageEmbedFunction>;
        file?: RequestFile;
        files?: Array<RequestFile>;
        tts?: boolean;
        username?: string;
        wait?: boolean;
    }
    interface FetchGiftCode {
        countryCode?: string;
        withApplication?: boolean;
        withSubscriptionPlan?: boolean;
    }
    interface FetchGuildAuditLogs {
        actionType?: number;
        before?: string;
        limit?: number;
        userId?: string;
    }
    interface FetchGuildMembers {
        after?: string;
        limit?: number;
    }
    interface FetchGuildMembersSearch {
        limit?: number;
        query: string;
    }
    interface FetchGuildPruneCount {
        days?: number;
        includeRoles?: Array<string>;
    }
    interface FetchGuildWidgetPng {
        style?: string;
    }
    interface FetchInvite {
        withCounts?: boolean;
    }
    interface FetchMe {
        withAnalyticsToken?: boolean;
    }
    interface FetchMeBillingPayments {
        beforeId?: string;
        limit?: number;
    }
    interface FetchMeFeedSettings {
        includeAutosubscribedGames?: boolean;
    }
    interface FetchMeGuilds {
        after?: string;
        before?: string;
        limit?: number;
    }
    interface FetchMentions {
        after?: string;
        around?: string;
        before?: string;
        everyone?: boolean;
        limit?: number;
        roles?: boolean;
    }
    interface FetchMessages {
        after?: string;
        around?: string;
        before?: string;
        limit?: number;
    }
    interface FetchOauth2Applications {
        withTeamApplications?: boolean;
    }
    interface FetchOauth2Authorize {
        clientId?: string;
        responseType?: string;
        scope?: string;
    }
    interface FetchReactions {
        after?: string;
        before?: string;
        limit?: number;
    }
    interface FetchTeamPayouts {
        limit?: number;
    }
    interface FollowChannel {
        webhookChannelId: string;
    }
    interface ForgotPassword {
        email: string;
    }
    interface JoinGuild {
        lurker?: boolean;
        sessionId?: string;
    }
    interface Login {
        captchaKey?: string;
        email: string;
        giftCodeSKUId?: string;
        loginSource?: string;
        password: string;
        undelete?: boolean;
    }
    interface LoginMfaSms {
        code: string;
        giftCodeSKUId?: string;
        loginSource?: string;
        ticket: string;
    }
    interface LoginMfaSmsSend {
        ticket: string;
    }
    interface LoginMfaTotp {
        code: string;
        giftCodeSKUId?: string;
        loginSource?: string;
        ticket: string;
    }
    interface Logout {
        provider?: string;
        token?: string;
        voipProvider?: string;
        voipToken?: string;
    }
    interface MessageSuppressEmbeds {
        suppress?: boolean;
    }
    interface Oauth2Authorize {
        authorize?: boolean;
        botGuildId?: string;
        captchaKey?: string;
        clientId?: string;
        permissions?: number;
        prompt?: string;
        redirectUri?: string;
        responseType?: string;
        scope?: string;
        webhookChannelId?: string;
        webhookGuildId?: string;
    }
    interface RedeemGiftCode {
        channelId?: string;
    }
    interface Register {
        captchaKey?: string;
        consent: boolean;
        email: string;
        fingerprint?: string;
        giftCodeSKUId?: string;
        invite?: string;
        password: string;
        username: string;
    }
    interface RemoveGuildBan {
        reason?: string;
    }
    interface RemoveGuildMember {
        reason?: string;
    }
    interface RemoveGuildMemberRole {
        reason?: string;
    }
    interface ResetPassword {
        password: string;
        pushProvider?: string;
        pushToken?: string;
        pushVoipProvider?: string;
        pushVoipToken?: string;
        token: string;
    }
    interface ResetPasswordMfa {
        code: string;
        password: string;
        ticket: string;
        token: string;
    }
    interface SearchLobbies {
        filter?: Array<{
            key: string;
            comparison: number;
            cast: number;
            value: string;
        }>;
        sort?: Array<{
            key: string;
            cast: number;
            near_value: string;
        }>;
        limit?: number;
        distance?: number;
    }
    interface SearchOptions {
        attachmentFilename?: string | Array<string>;
        attachmentExtensions?: string | Array<string>;
        authorId?: string | Array<string>;
        channelId?: string;
        content?: string;
        has?: string | Array<string>;
        includeNSFW?: boolean;
        limit?: number;
        maxId?: string;
        mentions?: string | Array<string>;
        minId?: string;
        offset?: number;
    }
    interface SendFriendRequest {
        discriminator: string;
        username: string;
    }
    interface StartChannelCallRinging {
        recipients?: Array<string>;
    }
    interface StopChannelCallRinging {
        recipients?: Array<string>;
    }
    interface TransferOauth2Application {
        code?: string;
        teamId: string;
    }
    interface Verify {
        captchaKey: string;
        token?: string;
    }
    interface VerifyCaptcha {
        captchaKey: string;
    }
    interface RawChannelMessageEmbed {
        author?: {
            icon_url?: string;
            name?: string;
            url?: string;
        };
        color?: number;
        description?: string;
        fields?: Array<{
            inline?: boolean;
            name: string;
            value: string;
        }>;
        footer?: {
            icon_url?: string;
            text: string;
        };
        image?: {
            url?: string;
        };
        provider?: {
            name?: string;
            url?: string;
        };
        thumbnail?: {
            url?: string;
        };
        timestamp?: string;
        title?: string;
        type?: string;
        url?: string;
        video?: {
            url?: string;
        };
    }
    interface RouteInvite {
        username?: string;
    }
    interface RouteWidget {
        id?: string;
        theme?: string;
        username?: string;
    }
}
export declare namespace ResponseTypes {
    type CreateMessage = DiscordTypes.Message;
    type EditMessage = DiscordTypes.Message;
}
export declare namespace DiscordTypes {
    interface ChannelPartial {
        id: string;
        name: string;
    }
    interface Message {
        activity?: {
            cover_image?: string;
            name?: string;
            party_id: string;
            type: number;
        };
        application?: {
            cover_image: null | string;
            description: string;
            icon: null | string;
            id: string;
            name: string;
            primary_sku_id: string;
        };
        attachments?: Array<MessageAttachment>;
        author: User;
        call?: {
            ended_timestamp: null | string;
            participiants: Array<string>;
        };
        channel_id: string;
        content: string;
        edited_timestamp?: string;
        embeds?: Array<MessageEmbed>;
        guild_id?: string;
        id: string;
        mention_channels?: Array<ChannelPartial>;
        mention_everyone: boolean;
        mention_roles: Array<string>;
        mentions: Array<{
            bot: boolean;
            discriminator: string;
            id: string;
            username: string;
        }>;
        message_reference?: {
            channel_id: string;
            guild_id?: string;
            message_id: string;
        };
        nonce: null | string;
        pinned: boolean;
        timestamp: string;
        tts: boolean;
        type: number;
        webhook_id?: string;
    }
    interface MessageAttachment {
        filename: string;
        height: number;
        id: string;
        proxy_url: string;
        size: number;
        url: string;
        width: number;
    }
    interface MessageEmbed {
        author?: {
            icon_url?: string;
            name?: string;
            proxy_icon_url?: string;
            url?: string;
        };
        color?: number;
        description?: string;
        fields?: Array<{
            inline?: boolean;
            name: string;
            value: string;
        }>;
        footer?: {
            icon_url?: string;
            proxy_icon_url?: string;
            text: string;
        };
        image?: {
            height?: number;
            proxy_url?: string;
            url?: string;
            width?: number;
        };
        provider?: {
            name?: string;
            url?: string;
        };
        reference_id?: string;
        thumbnail?: {
            height?: number;
            proxy_url?: string;
            url?: string;
            width?: number;
        };
        timestamp?: string;
        title?: string;
        type?: string;
        url?: string;
        video?: {
            height?: number;
            url?: string;
            width?: number;
        };
    }
    interface User {
        avatar: null | string;
        bot: boolean;
        discriminator: string;
        id: string;
        username: string;
    }
}

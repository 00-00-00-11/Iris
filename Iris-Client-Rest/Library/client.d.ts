/// <reference types="node" />
import { URL } from 'url';
import { Client as RestClient, ClientOptions as RestClientOptions, Response } from '../../Iris-Rest';
import { BaseCollection, EventSpewer } from '../../Iris-Utils';
import { Bucket } from './bucket';
import { BucketCollection } from './bucketcollection';
import { AuthTypes } from './constants';
import { RequestTypes, RestClientEvents } from './types';
export interface ClientOptions extends RestClientOptions {
    authType?: AuthTypes | string;
    bucketsExpireIn?: number;
    clientsideChecks?: boolean;
    errorOnRatelimit?: boolean;
    fingerprint?: string;
    globalBucket?: Bucket;
    routesCollection?: BaseCollection<string, string>;
}
export declare class Client extends EventSpewer {
    readonly buckets: BucketCollection;
    readonly routes: BaseCollection<string, string>;
    authType: AuthTypes;
    clientsideChecks: boolean;
    errorOnRatelimit: boolean;
    fingerprint?: string;
    globalBucket: Bucket;
    restClient: RestClient;
    token?: string;
    constructor(token?: string, options?: ClientOptions);
    get authTypeText(): string;
    get isBearer(): boolean;
    get isBot(): boolean;
    get isUser(): boolean;
    get tokenFormatted(): string;
    setAuthType(type: AuthTypes | string): void;
    request(info: RequestTypes.Options | string | URL, init?: RequestTypes.Options): Promise<any>;
    delete(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    get(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    head(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    options(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    patch(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    post(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    put(info: string | URL | RequestTypes.Options, init?: RequestTypes.Options): Promise<Response>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: 'request', listener: (payload: RestClientEvents.RequestPayload) => any): this;
    on(event: 'response', listener: (payload: RestClientEvents.ResponsePayload) => any): this;
    acceptAgreements(privacy?: boolean, terms?: boolean): Promise<any>;
    acceptInvite(code: string): Promise<any>;
    acceptTeamInvite(token: string): Promise<any>;
    acceptTemplate(templateId: string, options: RequestTypes.AcceptTemplate): Promise<any>;
    ackChannelMessage(channelId: string, messageId: string, token: string): Promise<any>;
    ackChannelPins(channelId: string): Promise<any>;
    ackGuild(guildId: string): Promise<any>;
    activateOauth2ApplicationLicense(applicationId: string, options: RequestTypes.ActivateOauth2ApplicationLicense): Promise<any>;
    addConnection(platform: string, accountId: string, options: RequestTypes.AddConnection): Promise<any>;
    addGuildMember(guildId: string, userId: string, options: RequestTypes.AddGuildMember): Promise<any>;
    addGuildMemberRole(guildId: string, userId: string, roleId: string, options?: RequestTypes.AddGuildMemberRole): Promise<any>;
    addPinnedMessage(channelId: string, messageId: string): Promise<any>;
    addRecipient(channelId: string, userId: string): Promise<any>;
    addOauth2ApplicationWhitelistUser(applicationId: string, options: RequestTypes.AddOauth2ApplicationWhitelistUser): Promise<any>;
    addTeamMember(teamId: string, options: RequestTypes.AddTeamMember): Promise<any>;
    authorizeIpAddress(options: RequestTypes.AuthorizeIpAddress): Promise<any>;
    beginGuildPrune(guildId: string, options?: RequestTypes.BeginGuildPrune): Promise<any>;
    bulkDeleteMessages(channelId: string, messageIds: Array<string>): Promise<any>;
    connectionCallback(platform: string, options: RequestTypes.ConnectionCallback): Promise<any>;
    createApplicationNews(options: RequestTypes.CreateApplicationNews): Promise<any>;
    createChannelInvite(channelId: string, options?: RequestTypes.CreateChannelInvite): Promise<any>;
    createChannelStoreListingGrantEntitlement(channelId: string): Promise<any>;
    createDm(options?: RequestTypes.CreateDm): Promise<any>;
    createGuild(options: RequestTypes.CreateGuild): Promise<any>;
    createGuildBan(guildId: string, userId: string, options?: RequestTypes.CreateGuildBan): Promise<any>;
    createGuildChannel(guildId: string, options: RequestTypes.CreateGuildChannel): Promise<any>;
    createGuildEmoji(guildId: string, options: RequestTypes.CreateGuildEmoji): Promise<any>;
    createGuildIntegration(guildId: string, options: RequestTypes.CreateGuildIntegration): Promise<any>;
    createGuildRole(guildId: string, options?: RequestTypes.CreateGuildRole): Promise<any>;
    createGuildTemplate(guildId: string, options: RequestTypes.CreateGuildTemplate): Promise<any>;
    createLobby(applicationId: string, options?: RequestTypes.CreateLobby): Promise<any>;
    createMeBillingPaymentSource(options: RequestTypes.CreateMeBillingPaymentSource): Promise<any>;
    createMeBillingSubscription(options: RequestTypes.CreateMeBillingSubscription): Promise<any>;
    createMessage(channelId: string, options?: RequestTypes.CreateMessage | string): Promise<any>;
    createOauth2Application(options: RequestTypes.CreateOauth2Application): Promise<any>;
    createOauth2ApplicationAsset(applicationId: string, options: RequestTypes.CreateOauth2ApplicationAsset): Promise<any>;
    createOauth2ApplicationBot(applicationId: string): Promise<any>;
    createReaction(channelId: string, messageId: string, emoji: string): Promise<any>;
    createStoreApplicationAsset(applicationId: string, options?: RequestTypes.CreateStoreApplicationAsset): Promise<any>;
    createTeam(options?: RequestTypes.CreateTeam): Promise<any>;
    createWebhook(channelId: string, options: RequestTypes.CreateWebhook): Promise<any>;
    crosspostMessage(channelId: string, messageId: string): Promise<any>;
    deleteAccount(options: RequestTypes.DeleteAccount): Promise<any>;
    deleteChannel(channelId: string, options?: RequestTypes.DeleteChannel): Promise<any>;
    deleteChannelOverwrite(channelId: string, overwriteId: string, options?: RequestTypes.DeleteChannelOverwrite): Promise<any>;
    deleteConnection(platform: string, accountId: string): Promise<any>;
    deleteGuild(guildId: string, options?: RequestTypes.DeleteGuild): Promise<any>;
    deleteGuildEmoji(guildId: string, emojiId: string, options?: RequestTypes.DeleteGuildEmoji): Promise<any>;
    deleteGuildIntegration(guildId: string, integrationId: string, options?: RequestTypes.DeleteGuildIntegration): Promise<any>;
    deleteGuildPremiumSubscription(guildId: string, subscriptionId: string): Promise<any>;
    deleteGuildRole(guildId: string, roleId: string, options?: RequestTypes.DeleteGuildRole): Promise<any>;
    deleteGuildTemplate(guildId: string, templateId: string): Promise<any>;
    deleteInvite(code: string, options?: RequestTypes.DeleteInvite): Promise<any>;
    deleteLobby(lobbyId: string): Promise<any>;
    deleteMeBillingPaymentSource(paymentSourceId: string): Promise<any>;
    deleteMeBillingSubscription(subscriptionId: string): Promise<any>;
    deleteMessage(channelId: string, messageId: string, options?: RequestTypes.DeleteMessage): Promise<any>;
    deleteOauth2Application(applicationId: string, options?: RequestTypes.DeleteOauth2Application): Promise<any>;
    deleteOauth2ApplicationAsset(applicationId: string, assetId: string): Promise<any>;
    deletePinnedMessage(channelId: string, messageId: string): Promise<any>;
    deleteReactions(channelId: string, messageId: string): Promise<any>;
    deleteReactionsEmoji(channelId: string, messageId: string, emoji: string): Promise<any>;
    deleteReaction(channelId: string, messageId: string, emoji: string, userId?: string): Promise<any>;
    deleteRelationship(userId: string): Promise<any>;
    deleteStoreApplicationAsset(applicationId: string, assetId: string): Promise<any>;
    deleteTeam(teamId: string, options?: RequestTypes.DeleteTeam): Promise<any>;
    deleteWebhook(webhookId: string, options?: RequestTypes.DeleteWebhook): Promise<any>;
    deleteWebhookToken(webhookId: string, token: string, options?: RequestTypes.DeleteWebhook): Promise<any>;
    deleteWebhookTokenMessage(webhookId: string, token: string, messageId: string): Promise<any>;
    disableAccount(options: RequestTypes.DisableAccount): Promise<any>;
    editApplicationNews(newsId: string, options?: RequestTypes.EditApplicationNews): Promise<any>;
    editChannel(channelId: string, options?: RequestTypes.EditChannel): Promise<any>;
    editChannelOverwrite(channelId: string, overwriteId: string, options?: RequestTypes.EditChannelOverwrite): Promise<any>;
    editConnection(platform: string, accountId: string, options?: RequestTypes.EditConnection): Promise<any>;
    editGuild(guildId: string, options?: RequestTypes.EditGuild): Promise<any>;
    editGuildChannels(guildId: string, channels: RequestTypes.EditGuildChannels, options?: RequestTypes.EditGuildChannelsExtra): Promise<any>;
    editGuildEmbed(guildId: string, options: RequestTypes.EditGuildEmbed): Promise<any>;
    editGuildEmoji(guildId: string, emojiId: string, options?: RequestTypes.EditGuildEmoji): Promise<any>;
    editGuildIntegration(guildId: string, integrationId: string, options?: RequestTypes.EditGuildIntegration): Promise<any>;
    editGuildMember(guildId: string, userId: string, options?: RequestTypes.EditGuildMember): Promise<any>;
    editGuildMemberVerification(guildId: string, options?: RequestTypes.EditGuildMemberVerification): Promise<any>;
    editGuildMfaLevel(guildId: string, options: RequestTypes.EditGuildMfaLevel): Promise<any>;
    editGuildNick(guildId: string, nick: string, options?: RequestTypes.EditGuildNick): Promise<any>;
    editGuildRole(guildId: string, roleId: string, options?: RequestTypes.EditGuildRole): Promise<any>;
    editGuildRolePositions(guildId: string, roles: RequestTypes.EditGuildRolePositions, options?: RequestTypes.EditGuildRolePositionsExtra): Promise<any>;
    editGuildVanity(guildId: string, code: string, options?: RequestTypes.EditGuildVanity): Promise<any>;
    editLobby(lobbyId: string, options?: RequestTypes.EditLobby): Promise<any>;
    editLobbyMember(lobbyId: string, userId: string, options?: RequestTypes.EditLobbyMember): Promise<any>;
    editMe(options?: RequestTypes.EditMe): Promise<any>;
    editMeBillingPaymentSource(paymentSourceId: string, options?: RequestTypes.EditMeBillingPaymentSource): Promise<any>;
    editMeBillingSubscription(subscriptionId: string, options?: RequestTypes.EditMeBillingSubscription): Promise<any>;
    editMessage(channelId: string, messageId: string, options?: RequestTypes.EditMessage | string): Promise<any>;
    editNote(userId: string, note: string): Promise<any>;
    editOauth2Application(applicationId: string, options?: RequestTypes.EditOauth2Application): Promise<any>;
    editRelationship(userId: string, type: number): Promise<any>;
    editSettings(options?: RequestTypes.EditSettings): Promise<any>;
    editTeam(teamId: string, options?: RequestTypes.EditTeam): Promise<any>;
    editUser(options?: RequestTypes.EditMe): Promise<any>;
    editWebhook(webhookId: string, options?: RequestTypes.EditWebhook): Promise<any>;
    editWebhookToken(webhookId: string, token: string, options?: RequestTypes.EditWebhook): Promise<any>;
    editWebhookTokenMessage(webhookId: string, token: string, messageId: string, options?: RequestTypes.EditWebhookTokenMessage | string): Promise<any>;
    enableOauth2ApplicationAssets(applicationId: string): Promise<any>;
    enableOauth2ApplicationRpc(applicationId: string): Promise<any>;
    executeWebhook(webhookId: string, token: string, options?: RequestTypes.ExecuteWebhook | string, compatibleType?: string): Promise<any>;
    fetchActivities(): Promise<any>;
    fetchApplicationNews(applicationIds?: string | Array<string>): Promise<any>;
    fetchApplicationNewsId(newsId: string): Promise<any>;
    fetchApplications(): Promise<any>;
    fetchApplication(applicationId: string): Promise<any>;
    fetchApplicationsDetectable(): Promise<any>;
    fetchApplicationsPublic(applicationIds: string | Array<string>): Promise<any>;
    fetchApplicationsTrendingGlobal(): Promise<any>;
    fetchAuthConsentRequired(): Promise<any>;
    fetchChannel(channelId: string): Promise<any>;
    fetchChannelCall(channelId: string): Promise<any>;
    fetchChannelInvites(channelId: string): Promise<any>;
    fetchChannelStoreListing(channelId: string): Promise<any>;
    fetchChannelWebhooks(channelId: string): Promise<any>;
    fetchConsentRequired(): Promise<any>;
    fetchConnectionAuthorizeUrl(platform: string): Promise<any>;
    fetchDiscoverableGuilds(): Promise<any>;
    fetchDms(userId?: string): Promise<any>;
    fetchEmojiGuild(emojiId: string): Promise<any>;
    fetchExperiments(fingerprint?: string): Promise<any>;
    fetchGateway(): Promise<any>;
    fetchGatewayBot(): Promise<any>;
    fetchGiftCode(code: string, options?: RequestTypes.FetchGiftCode): Promise<any>;
    fetchGuild(guildId: string): Promise<any>;
    fetchGuildApplications(guildId: string, channelId?: string): Promise<any>;
    fetchGuildAuditLogs(guildId: string, options: RequestTypes.FetchGuildAuditLogs): Promise<any>;
    fetchGuildBans(guildId: string): Promise<any>;
    fetchGuildChannels(guildId: string): Promise<any>;
    fetchGuildEmbed(guildId: string): Promise<any>;
    fetchGuildEmojis(guildId: string): Promise<any>;
    fetchGuildEmoji(guildId: string, emojiId: string): Promise<any>;
    fetchGuildIntegrations(guildId: string): Promise<any>;
    fetchGuildInvites(guildId: string): Promise<any>;
    fetchGuildMembers(guildId: string, options?: RequestTypes.FetchGuildMembers): Promise<any>;
    fetchGuildMembersSearch(guildId: string, options: RequestTypes.FetchGuildMembersSearch): Promise<any>;
    fetchGuildMember(guildId: string, userId: string): Promise<any>;
    fetchGuildMemberVerification(guildId: string): Promise<any>;
    fetchGuildPremiumSubscriptions(guildId: string): Promise<any>;
    fetchGuildPreview(guildId: string): Promise<any>;
    fetchGuildPruneCount(guildId: string, options?: RequestTypes.FetchGuildPruneCount): Promise<any>;
    fetchGuildRoles(guildId: string): Promise<any>;
    fetchGuildTemplates(guildId: string): Promise<any>;
    fetchGuildVanityUrl(guildId: string): Promise<any>;
    fetchGuildWebhooks(guildId: string): Promise<any>;
    fetchGuildWidget(guildId: string): Promise<any>;
    fetchGuildWidgetJson(guildId: string): Promise<any>;
    fetchGuildWidgetPng(guildId: string, options?: RequestTypes.FetchGuildWidgetPng): Promise<any>;
    fetchInvite(code: string, options?: RequestTypes.FetchInvite): Promise<any>;
    fetchMe(options?: RequestTypes.FetchMe): Promise<any>;
    fetchMeBillingPaymentSources(): Promise<any>;
    fetchMeBillingPayments(options?: RequestTypes.FetchMeBillingPayments): Promise<any>;
    fetchMeBillingSubscriptions(): Promise<any>;
    fetchMeChannels(): Promise<any>;
    fetchMeConnections(): Promise<any>;
    fetchMeConnectionAccessToken(platform: string, accountId: string): Promise<any>;
    fetchMeConnectionSubreddits(accountId: string): Promise<any>;
    fetchMeFeedSettings(options?: RequestTypes.FetchMeFeedSettings): Promise<any>;
    fetchMeGuilds(options?: RequestTypes.FetchMeGuilds): Promise<any>;
    fetchMentions(options?: RequestTypes.FetchMentions): Promise<any>;
    fetchMessage(channelId: string, messageId: string): Promise<any>;
    fetchMessages(channelId: string, options?: RequestTypes.FetchMessages): Promise<any>;
    fetchMeStickerPacks(countryCode?: string): Promise<any>;
    fetchOauth2Applications(options?: RequestTypes.FetchOauth2Applications): Promise<any>;
    fetchOauth2Application(applicationId?: string): Promise<any>;
    fetchOauth2ApplicationAssets(applicationId: string): Promise<any>;
    fetchOauth2ApplicationWhitelist(applicationId: string): Promise<any>;
    fetchOauth2Authorize(options?: RequestTypes.FetchOauth2Authorize): Promise<any>;
    fetchOauth2AuthorizeWebhookChannels(guildId: string): Promise<any>;
    fetchOauth2Tokens(): Promise<any>;
    fetchOauth2Token(tokenId: string): Promise<any>;
    fetchPinnedMessages(channelId: string): Promise<any>;
    fetchReactions(channelId: string, messageId: string, emoji: string, options?: RequestTypes.FetchReactions): Promise<any>;
    fetchStoreApplicationAssets(applicationId: string): Promise<any>;
    fetchStorePublishedListingsSkus(applicationId: string): Promise<any>;
    fetchStorePublishedListingsSku(skuId: string): Promise<any>;
    fetchStorePublishedListingsSkuSubscriptionPlans(skuId: string): Promise<any>;
    fetchStreamPreview(streamKey: string): Promise<any>;
    fetchTeams(): Promise<any>;
    fetchTeam(teamId: string): Promise<any>;
    fetchTeamApplications(teamId: string): Promise<any>;
    fetchTeamMembers(teamId: string): Promise<any>;
    fetchTeamMember(teamId: string, userId: string): Promise<any>;
    fetchTeamPayouts(teamId: string, options?: RequestTypes.FetchTeamPayouts): Promise<any>;
    fetchTemplate(templateId: string): Promise<any>;
    fetchUser(userId: string): Promise<any>;
    fetchUserActivityMetadata(userId: string, sessionId: string, activityId: string): Promise<any>;
    fetchUserChannels(userId: string): Promise<any>;
    fetchUserProfile(userId: string): Promise<any>;
    fetchVoiceIce(): Promise<any>;
    fetchVoiceRegions(guildId?: string): Promise<any>;
    fetchWebhook(webhookId: string): Promise<any>;
    fetchWebhookToken(webhookId: string, token: string): Promise<any>;
    followChannel(channelId: string, options: RequestTypes.FollowChannel): Promise<any>;
    forgotPassword(options: RequestTypes.ForgotPassword): Promise<any>;
    integrationJoin(integrationId: string): Promise<any>;
    joinGuild(guildId: string, options?: RequestTypes.JoinGuild): Promise<any>;
    leaveGuild(guildId: string): Promise<any>;
    login(options: RequestTypes.Login): Promise<any>;
    loginMfaSms(options: RequestTypes.LoginMfaSms): Promise<any>;
    loginMfaSmsSend(options: RequestTypes.LoginMfaSmsSend): Promise<any>;
    loginMfaTotp(options: RequestTypes.LoginMfaTotp): Promise<any>;
    logout(options?: RequestTypes.Logout): Promise<any>;
    messageSuppressEmbeds(channelId: string, messageId: string, options?: RequestTypes.MessageSuppressEmbeds): Promise<any>;
    oauth2Authorize(options?: RequestTypes.Oauth2Authorize): Promise<any>;
    redeemGiftCode(code: string, options?: RequestTypes.RedeemGiftCode): Promise<any>;
    register(options: RequestTypes.Register): Promise<any>;
    removeGuildBan(guildId: string, userId: string, options?: RequestTypes.RemoveGuildBan): Promise<any>;
    removeGuildMember(guildId: string, userId: string, options?: RequestTypes.RemoveGuildMember): Promise<any>;
    removeGuildMemberRole(guildId: string, userId: string, roleId: string, options?: RequestTypes.RemoveGuildMemberRole): Promise<any>;
    removeMention(messageId: string): Promise<any>;
    removeOauth2ApplicationWhitelistUser(applicationId: string, userId: string): Promise<any>;
    removeRecipient(channelId: string, userId: string): Promise<any>;
    removeTeamMember(teamId: string, userId: string): Promise<any>;
    resetOauth2Application(applicationId: string): Promise<any>;
    resetOauth2ApplicationBot(applicationId: string): Promise<any>;
    resetPassword(options: RequestTypes.ResetPassword): Promise<any>;
    resetPasswordMfa(options: RequestTypes.ResetPasswordMfa): Promise<any>;
    search(searchType: 'channel' | 'guild', searchId: string, options?: RequestTypes.SearchOptions, retry?: boolean, retryNumber?: number): Promise<any>;
    searchChannel(channelId: string, options?: RequestTypes.SearchOptions, retry?: boolean, retryNumber?: number): Promise<any>;
    searchGuild(guildId: string, options?: RequestTypes.SearchOptions, retry?: boolean, retryNumber?: number): Promise<any>;
    searchLobbies(applicationId: string, options?: RequestTypes.SearchLobbies): Promise<any>;
    sendDownloadText(number: string): Promise<any>;
    sendFriendRequest(options: RequestTypes.SendFriendRequest): Promise<any>;
    sendLobbyData(lobbyId: string, data: string): Promise<any>;
    startChannelCallRinging(channelId: string, options?: RequestTypes.StartChannelCallRinging): Promise<any>;
    stopChannelCallRinging(channelId: string, options?: RequestTypes.StopChannelCallRinging): Promise<any>;
    submitConnectionPinCode(platform: string, pin: string): Promise<any>;
    submitOauth2ApplicationApproval(applicationId: string): Promise<any>;
    syncGuildIntegration(guildId: string, integrationId: string): Promise<any>;
    transferOauth2Application(applicationId: string, options: RequestTypes.TransferOauth2Application): Promise<any>;
    triggerTyping(channelId: string): Promise<any>;
    unAckChannel(channelId: string): Promise<any>;
    verify(options: RequestTypes.Verify): Promise<any>;
    verifyCaptcha(options: RequestTypes.VerifyCaptcha): Promise<any>;
    verifyResend(): Promise<any>;
}

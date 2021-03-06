"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = exports.Gift = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const basestructure_1 = require("./basestructure");
const store_1 = require("./store");
const user_1 = require("./user");
const keysGift = new baseset_1.BaseSet([
    constants_1.DiscordKeys.APPLICATION_ID,
    constants_1.DiscordKeys.CODE,
    constants_1.DiscordKeys.EXPIRES_AT,
    constants_1.DiscordKeys.MAX_USES,
    constants_1.DiscordKeys.REDEEMED,
    constants_1.DiscordKeys.SKU_ID,
    constants_1.DiscordKeys.STORE_LISTING,
    constants_1.DiscordKeys.SUBSCRIPTION_PLAN,
    constants_1.DiscordKeys.SUBSCRIPTION_PLAN_ID,
    constants_1.DiscordKeys.USER,
    constants_1.DiscordKeys.USES,
]);
const keysMergeGift = new baseset_1.BaseSet([
    constants_1.DiscordKeys.SUBSCRIPTION_PLAN,
]);
/**
 * Discord Nitro Gift Structure
 * @category Structure
 */
class Gift extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysGift;
        this._keysMerge = keysMergeGift;
        this.applicationId = '';
        this.code = '';
        this.maxUses = 0;
        this.redeemed = false;
        this.skuId = '';
        this.subscriptionPlanId = '';
        this.uses = 0;
        this.merge(data);
    }
    get longUrl() {
        return iris_client_rest_1.Endpoints.Gift.LONG(this.code);
    }
    get url() {
        return iris_client_rest_1.Endpoints.Gift.SHORT(this.code);
    }
    fetch(options) {
        return this.client.rest.fetchGiftCode(this.code, options);
    }
    redeem(options) {
        return this.client.rest.redeemGiftCode(this.code, options);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.EXPIRES_AT:
                    {
                        value = new Date(value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.STORE_LISTING:
                    {
                        value = new store_1.StoreListing(this.client, value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.SUBSCRIPTION_PLAN:
                    {
                        value = new SubscriptionPlan(this.client, value);
                        this.subscriptionPlanId = value.id;
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
                            user = new user_1.User(this.client, value);
                        }
                        value = user;
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Gift = Gift;
const keysSubscriptionPlan = new baseset_1.BaseSet([
    constants_1.DiscordKeys.CURRENCY,
    constants_1.DiscordKeys.ID,
    constants_1.DiscordKeys.INTERVAL,
    constants_1.DiscordKeys.INTERVAL_COUNT,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.PRICE,
    constants_1.DiscordKeys.SKU_ID,
    constants_1.DiscordKeys.TAX_INCLUSIVE,
]);
/**
 * Subscription Plan, used in [[Gift]]
 * @category Structure
 */
class SubscriptionPlan extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysSubscriptionPlan;
        this.currency = 'usd';
        this.id = '';
        this.interval = 0;
        this.intervalCount = 0;
        this.name = '';
        this.price = 0;
        this.skuId = '';
        this.taxInclusive = false;
        this.merge(data);
    }
}
exports.SubscriptionPlan = SubscriptionPlan;

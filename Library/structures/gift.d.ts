import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { BaseStructure, BaseStructureData } from './basestructure';
import { StoreListing } from './store';
import { User } from './user';
/**
 * Discord Nitro Gift Structure
 * @category Structure
 */
export declare class Gift extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    applicationId: string;
    code: string;
    expiresAt: Date;
    maxUses: number;
    redeemed: boolean;
    skuId: string;
    storeListing?: StoreListing;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionPlanId: string;
    uses: number;
    user: User;
    constructor(client: ShardClient, data: BaseStructureData);
    get longUrl(): string;
    get url(): string;
    fetch(options: RequestTypes.FetchGiftCode): Promise<Gift>;
    redeem(options: RequestTypes.RedeemGiftCode): Promise<any>;
    mergeValue(key: string, value: any): void;
}
/**
 * Subscription Plan, used in [[Gift]]
 * @category Structure
 */
export declare class SubscriptionPlan extends BaseStructure {
    readonly _keys: BaseSet<string>;
    currency: string;
    id: string;
    interval: number;
    intervalCount: number;
    name: string;
    price: number;
    skuId: string;
    taxInclusive: boolean;
    constructor(client: ShardClient, data: BaseStructureData);
}

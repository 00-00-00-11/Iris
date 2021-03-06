import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { Oauth2AssetTypes } from '../constants';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Team } from './team';
import { UserWithFlags, UserWithToken } from './user';
/**
 * Oauth2 Application Structure
 * @category Structure
 */
export declare class Oauth2Application extends BaseStructure {
    readonly _keys: BaseSet<string>;
    bot?: UserWithToken;
    botPublic: boolean;
    botRequireCodeGrant: boolean;
    coverImage?: string | null;
    description: string;
    flags: number;
    guildId?: string;
    icon: null | string;
    id: string;
    name: string;
    owner: UserWithFlags;
    primarySkuId?: string;
    redirectUris?: Array<string>;
    rpcApplicationState?: number;
    rpcOrigins?: Array<string>;
    secret?: string;
    slug?: string;
    storeApplicationState?: number;
    summary: string;
    team?: Team;
    verifyKey: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get coverImageUrl(): null | string;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get jumpLink(): null | string;
    get iconUrl(): null | string;
    get isOnDiscord(): boolean;
    get oauth2Url(): string;
    get platformDiscordUrl(): null | string;
    coverImageUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    iconUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    oauth2UrlFormat(options?: UrlQuery): string;
    createAsset(options: RequestTypes.CreateOauth2ApplicationAsset): Promise<Oauth2ApplicationAsset>;
    createStoreAsset(options: RequestTypes.CreateStoreApplicationAsset): Promise<import("./store").StoreApplicationAsset>;
    deleteAsset(assetId: string): Promise<any>;
    deleteStoreAsset(assetId: string): Promise<any>;
    fetchAssets(): Promise<import("detritus-utils").BaseCollection<string, Oauth2ApplicationAsset>>;
    fetchNews(): Promise<import("detritus-utils").BaseCollection<string, import("./applicationnews").ApplicationNews>>;
    fetchStoreAssets(): Promise<import("detritus-utils").BaseCollection<string, import("./store").StoreApplicationAsset>>;
    joinGuild(options?: RequestTypes.JoinGuild): Promise<any>;
    mergeValue(key: string, value: any): void;
}
export declare const keysOauth2ApplicationAsset: BaseSet<string>;
export declare class Oauth2ApplicationAsset extends BaseStructure {
    readonly _keys: BaseSet<string>;
    applicationId: string;
    id: string;
    name: string;
    type: Oauth2AssetTypes;
    constructor(client: ShardClient, data: BaseStructureData);
    get isLarge(): boolean;
    get isSmall(): boolean;
    get url(): string;
    urlFormat(format?: null | string, query?: UrlQuery): string;
    delete(): Promise<any>;
}

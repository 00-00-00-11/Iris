import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { Distributors } from '../constants';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
export declare const SpecialThirdPartySkus: {
    [key: string]: string;
};
export interface ApplicationDeveloper {
    id: string;
    name: string;
}
export interface ApplicationExecutable {
    arguments?: string;
    name: string;
    os: string;
}
export interface ApplicationPublisher {
    id: string;
    name: string;
}
/**
 * Application Structure, used for channels, guilds, presences, etc..
 * @category Structure
 */
export declare class Application extends BaseStructure {
    readonly _keys: BaseSet<string>;
    aliases?: BaseSet<string>;
    botPublic?: boolean;
    botRequireCodeGrant?: boolean;
    coverImage: null | string;
    description: string;
    developers?: Array<ApplicationDeveloper>;
    eulaId?: string;
    executables?: Array<ApplicationExecutable>;
    guildId?: string;
    hook?: boolean;
    icon: null | string;
    id: string;
    name: string;
    overlay?: boolean;
    overlayCompatibilityHook?: boolean;
    primarySkuId?: string;
    publishers?: Array<ApplicationPublisher>;
    rpcOrigins?: BaseSet<string>;
    slug: null | string;
    splash: null | string;
    summary: string;
    thirdPartySkus?: BaseCollection<string, ApplicationThirdPartySku>;
    verifyKey: string;
    youtubeTrailerVideoId?: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get coverImageUrl(): null | string;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get jumpLink(): null | string;
    get iconUrl(): null | string;
    get isOnDiscord(): boolean;
    get platformDiscordUrl(): null | string;
    get splashUrl(): null | string;
    get youtubeTrailerUrl(): null | string;
    coverImageUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    iconUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    matches(name: string): boolean;
    splashUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    createAsset(options: RequestTypes.CreateOauth2ApplicationAsset): Promise<import("./oauth2application").Oauth2ApplicationAsset>;
    createStoreAsset(options: RequestTypes.CreateStoreApplicationAsset): Promise<import("./store").StoreApplicationAsset>;
    deleteAsset(assetId: string): Promise<any>;
    deleteStoreAsset(assetId: string): Promise<any>;
    fetchAssets(): Promise<BaseCollection<string, import("./oauth2application").Oauth2ApplicationAsset>>;
    fetchNews(): Promise<BaseCollection<string, import("./applicationnews").ApplicationNews>>;
    fetchStoreAssets(): Promise<BaseCollection<string, import("./store").StoreApplicationAsset>>;
    joinGuild(options?: RequestTypes.JoinGuild): Promise<any>;
    mergeValue(key: string, value: any): void;
}
export declare class ApplicationThirdPartySku extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly application: Application;
    distributor: Distributors;
    id: null | string;
    sku: null | string;
    constructor(application: Application, data: BaseStructureData);
    get key(): string;
    get name(): string;
    get url(): null | string;
}

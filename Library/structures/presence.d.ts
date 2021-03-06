import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { ActivityPlatformTypes } from '../constants';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Application } from './application';
import { Emoji } from './emoji';
import { User } from './user';
export declare const SpecialApplications: Readonly<{
    XBOX: string;
}>;
export declare const SpecialPrefixes: Readonly<{
    SPOTIFY: string;
}>;
export declare const ImageSizes: Readonly<{
    SMALL: number;
    LARGE: number;
}>;
/**
 * Presence Structure, used to detail a user's presence in a guild (or general if you have them added (non-bots only))
 * @category Structure
 */
export declare class Presence extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly _keysSkipDifference: BaseSet<string>;
    _activities?: BaseCollection<string, PresenceActivity>;
    _guildIds: BaseSet<string> | string;
    clientStatus?: {
        desktop?: string;
        mobile?: string;
        web?: string;
    };
    lastGuildId: string;
    lastModified?: number;
    status: string;
    user: User;
    constructor(client: ShardClient, data: BaseStructureData);
    get activity(): null | PresenceActivity;
    get activities(): BaseCollection<string, PresenceActivity>;
    get game(): null | PresenceActivity;
    get guildIds(): BaseSet<string>;
    get isDnd(): boolean;
    get isIdle(): boolean;
    get isOffline(): boolean;
    get isOnline(): boolean;
    get showMobileIcon(): boolean;
    activityFor(guildId: string): null | PresenceActivity;
    activitiesFor(guildId: string): BaseCollection<string, PresenceActivity>;
    get _shouldDelete(): boolean;
    _deleteGuildId(guildId: string): void;
    _hasGuildId(guildId: string): boolean;
    mergeValue(key: string, value: any): void;
    toString(): string;
}
/**
 * Presence Activity Structure, used in [Presence]
 * @category Structure
 */
export declare class PresenceActivity extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly _keysSkipDifference: BaseSet<string>;
    readonly user: User;
    _guildIds: BaseSet<string> | string;
    applicationId?: string;
    assets?: PresenceActivityAssets;
    buttons?: Array<string>;
    createdAt?: number;
    details?: string;
    emoji?: Emoji;
    flags: number;
    id: string;
    instance?: boolean;
    metadata?: any;
    name: string;
    party?: {
        id?: string;
        size?: [number, number];
    };
    platform?: ActivityPlatformTypes;
    position: number;
    secrets?: {
        join?: string;
        match?: string;
        spectate?: string;
    };
    sessionId?: string;
    state?: string;
    syncId?: string;
    timestamps?: PresenceActivityTimestamps;
    type: number;
    url?: string;
    constructor(user: User, data: BaseStructureData);
    get application(): Application | null;
    get applicationIsXbox(): boolean;
    get canInstance(): boolean;
    get canJoin(): boolean;
    get canJoinRequest(): boolean;
    get canPlay(): boolean;
    get canSpectate(): boolean;
    get canSync(): boolean;
    get group(): BaseCollection<string, User>;
    get guildIds(): BaseSet<string>;
    get imageUrl(): null | string;
    get isCustomStatus(): boolean;
    get isListening(): boolean;
    get isPlaying(): boolean;
    get isStreaming(): boolean;
    get isWatching(): boolean;
    get isOnAndroid(): boolean;
    get isOnIOS(): boolean;
    get isOnSpotify(): boolean;
    get isOnSamsung(): boolean;
    get isOnXbox(): boolean;
    get partyIsFull(): boolean;
    get partyIsSpotify(): boolean;
    get partyMaxSize(): number | null;
    get partySize(): number | null;
    get platformType(): string;
    get platformDiscordUrl(): null | string;
    get spotifyTrackUrl(): null | string;
    get typeText(): string;
    hasFlag(flag: number): boolean;
    imageUrlFormat(format?: null | string, query?: UrlQuery): null | string;
    fetchApplication(): Promise<Application | null>;
    fetchButtonUrls(): Promise<any>;
    fetchMetadata(): Promise<any>;
    get _shouldDelete(): boolean;
    _deleteGuildId(guildId: string): void;
    _hasGuildId(guildId: string): boolean;
    mergeValue(key: string, value: any): void;
    toString(): string;
}
/**
 * Presence Activity Assets Structure, used in [PresenceActivity]
 * @category Structure
 */
export declare class PresenceActivityAssets extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly activity: PresenceActivity;
    largeImage?: string;
    largeText?: string;
    smallImage?: string;
    smallText?: string;
    constructor(activity: PresenceActivity, data: BaseStructureData);
    get imageUrl(): string | null;
    get largeImageUrl(): string | null;
    get smallImageUrl(): string | null;
    imageUrlFormat(format?: null | string, query?: UrlQuery, hash?: null | string): null | string;
    largeImageUrlFormat(format?: null | string, query?: UrlQuery): string | null;
    smallImageUrlFormat(format?: null | string, query?: UrlQuery): string | null;
    mergeValue(key: string, value: any): void;
}
/**
 * Presence Activity Timestamp Structure
 * used to describe when they started doing an activity and if they ended it or not
 * @category Structure
 */
export declare class PresenceActivityTimestamps extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly activity: PresenceActivity;
    end?: number;
    start?: number;
    constructor(activity: PresenceActivity, data: BaseStructureData);
    get elapsedTime(): number;
    get totalTime(): number;
    mergeValue(key: string, value: any): void;
}

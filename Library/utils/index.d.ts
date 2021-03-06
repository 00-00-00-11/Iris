import { Snowflake, Tools } from '../../Iris-Utils';
declare const guildIdToShardId: typeof Tools.guildIdToShardId;
import { CommandRatelimit, CommandRatelimitItem } from '../command/ratelimit';
import { Message } from '../structures/message';
import * as Markup from './markup';
import * as PermissionTools from './permissions';
export { guildIdToShardId, Markup, PermissionTools, Snowflake, };
export * from './embed';
export declare type UrlQuery = {
    [key: string]: any;
};
export declare function addQuery(url: string, query?: UrlQuery): string;
export declare function anyToCamelCase(object: any, skip?: Array<string>): any;
export declare function getAcronym(name?: string): string;
export declare function getExceededRatelimits(ratelimits: Array<CommandRatelimit>, message: Message, now?: number): Array<{
    item: CommandRatelimitItem;
    ratelimit: CommandRatelimit;
    remaining: number;
}>;
export declare function getFiles(directory: string, subdirectories?: boolean): Promise<Array<string>>;
export declare function getFormatFromHash(hash: string, format?: null | string, defaultFormat?: string): string;
export declare function getFirstArgument(value: string): [string, string];
export declare function hexToInt(hex: string): number;
export declare function intToHex(int: number, hashtag?: boolean): string;
export declare function intToRGB(int: number): {
    r: number;
    g: number;
    b: number;
};
export interface DiscordRegexMatch {
    animated?: boolean;
    channelId?: string;
    guildId?: string;
    id?: string;
    language?: string;
    matched: string;
    mentionType?: string;
    messageId?: string;
    name?: string;
    text?: string;
}
export interface DiscordRegexPayload {
    match: {
        regex: RegExp;
        type: string;
    };
    matches: Array<DiscordRegexMatch>;
}
export declare function regex(type: string, content: string, onlyFirst?: boolean): DiscordRegexPayload;
export declare function rgbToInt(r: number, g: number, b: number): number;
export declare function toCamelCase(value: string): string;

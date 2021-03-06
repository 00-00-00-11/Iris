import { Timers } from '../../Iris-Utils';
import { BaseCollection } from '../collections/basecollection';
import { CommandRatelimitTypes } from '../constants';
/**
 * Command Ratelimit Options
 * @category Command Options
 */
export interface CommandRatelimitOptions {
    duration?: number;
    limit?: number;
    type?: CommandRatelimitTypes | string;
}
/**
 * Command Ratelimit Item
 * @category Command
 */
export interface CommandRatelimitItem {
    replied: boolean;
    start: number;
    timeout: Timers.Timeout;
    usages: number;
}
/**
 * Command Ratelimit Options and Cache
 * @category Command
 */
export declare class CommandRatelimit {
    readonly cache: BaseCollection<string, CommandRatelimitItem>;
    duration: number;
    limit: number;
    type: CommandRatelimitTypes;
    constructor(options?: boolean | CommandRatelimitOptions);
    get(cacheId: string): CommandRatelimitItem;
}

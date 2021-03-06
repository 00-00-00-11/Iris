import { CommandAttributes, CommandClient } from '../commandclient';
import { Message } from '../structures/message';
import { ArgumentOptions, Argument, ArgumentDefault, ArgumentType } from './argument';
import { ArgumentParser, ParsedArgs, ParsedErrors } from './argumentparser';
import { Context } from './context';
import { CommandRatelimit, CommandRatelimitItem, CommandRatelimitOptions } from './ratelimit';
export declare type FailedPermissions = Array<bigint>;
/**
 * @category Command
 */
export declare type CommandCallbackBefore = (context: Context) => Promise<boolean> | boolean;
/**
 * @category Command
 */
export declare type CommandCallbackBeforeRun = (context: Context, args: ParsedArgs) => Promise<boolean> | boolean;
/**
 * @category Command
 */
export declare type CommandCallbackCancel = (context: Context) => Promise<any | Message> | any | Message;
/**
 * @category Command
 */
export declare type CommandCallbackCancelRun = (context: Context, args: ParsedArgs) => Promise<any | Message> | any | Message;
/**
 * @category Command
 */
export declare type CommandCallbackError = (context: Context, args: ParsedArgs, error: any) => Promise<any> | any;
/**
 * @category Command
 */
export declare type CommandCallbackPermissionsFail = (context: Context, permissions: FailedPermissions) => Promise<any> | any;
/**
 * @category Command
 */
export declare type CommandCallbackSuccess = (context: Context, args: ParsedArgs) => Promise<any> | any;
/**
 * @category Command
 */
export declare type CommandCallbackRatelimit = (context: Context, ratelimits: Array<{
    item: CommandRatelimitItem;
    ratelimit: CommandRatelimit;
    remaining: number;
}>, metadata: {
    global: boolean;
    now: number;
}) => Promise<any> | any;
/**
 * @category Command
 */
export declare type CommandCallbackRun = (context: Context, args: ParsedArgs) => Promise<any | Message> | any | Message;
/**
 * @category Command
 */
export declare type CommandCallbackRunError = (context: Context, args: ParsedArgs, error: any) => Promise<any> | any;
/**
 * @category Command
 */
export declare type CommandCallbackTypeError = (context: Context, args: ParsedArgs, errors: ParsedErrors) => Promise<any | Message> | any | Message;
/**
 * Command Options
 * @category Command Options
 */
export interface CommandOptions extends ArgumentOptions {
    _file?: string;
    args?: Array<ArgumentOptions>;
    disableDm?: boolean;
    disableDmReply?: boolean;
    metadata?: {
        [key: string]: any;
    };
    name: string;
    permissions?: Array<bigint | number>;
    permissionsClient?: Array<bigint | number>;
    permissionsIgnoreClientOwner?: boolean;
    priority?: number;
    ratelimit?: boolean | CommandRatelimitOptions | null;
    ratelimits?: Array<CommandRatelimitOptions>;
    responseOptional?: boolean;
    triggerTypingAfter?: number;
    onBefore?: CommandCallbackBefore;
    onBeforeRun?: CommandCallbackBeforeRun;
    onCancel?: CommandCallbackCancel;
    onCancelRun?: CommandCallbackCancelRun;
    onError?: CommandCallbackError;
    onPermissionsFail?: CommandCallbackPermissionsFail;
    onPermissionsFailClient?: CommandCallbackPermissionsFail;
    onRatelimit?: CommandCallbackRatelimit;
    run?: CommandCallbackRun;
    onRunError?: CommandCallbackRunError;
    onSuccess?: CommandCallbackSuccess;
    onTypeError?: CommandCallbackTypeError;
}
/**
 * Command itself
 * Command flow is ratelimit check -> permission check -> `onBefore` -> arg parse -> `onBeforeRun` -> `run` -> `onSuccess | onRunError`
 * @category Command
 */
export declare class Command<ParsedArgsFinished = ParsedArgs> {
    readonly _file?: string;
    readonly argParser: ArgumentParser;
    readonly commandClient: CommandClient;
    arg: Argument;
    disableDm: boolean;
    disableDmReply: boolean;
    metadata: {
        [key: string]: any;
    };
    permissions?: Array<bigint>;
    permissionsClient?: Array<bigint>;
    permissionsIgnoreClientOwner?: boolean;
    priority: number;
    ratelimits: Array<CommandRatelimit>;
    responseOptional: boolean;
    triggerTypingAfter: number;
    onBefore?(context: Context): Promise<boolean> | boolean;
    onBeforeRun?(context: Context, args: ParsedArgs): Promise<boolean> | boolean;
    onCancel?(context: Context): Promise<any | Message> | any | Message;
    onCancelRun?(context: Context, args: ParsedArgs): Promise<any | Message> | any | Message;
    onError?(context: Context, args: ParsedArgs, error: any): Promise<any> | any;
    onPermissionsFail?(context: Context, permissions: FailedPermissions): Promise<any> | any;
    onPermissionsFailClient?(context: Context, permissions: FailedPermissions): Promise<any> | any;
    onRatelimit?(context: Context, ratelimits: Array<{
        item: CommandRatelimitItem;
        ratelimit: CommandRatelimit;
        remaining: number;
    }>, metadata: {
        global: boolean;
        now: number;
    }): Promise<any> | any;
    run?(context: Context, args: ParsedArgsFinished): Promise<any | Message> | any | Message;
    onRunError?(context: Context, args: ParsedArgsFinished, error: any): Promise<any> | any;
    onSuccess?(context: Context, args: ParsedArgsFinished): Promise<any> | any;
    onTypeError?(context: Context, args: ParsedArgs, errors: ParsedErrors): Promise<any | Message> | any | Message;
    constructor(commandClient: CommandClient, options: CommandOptions);
    get aliases(): Array<string>;
    set aliases(value: Array<string>);
    set args(value: Array<ArgumentOptions>);
    get choices(): Array<any> | undefined;
    set choices(value: Array<any> | undefined);
    get default(): ArgumentDefault;
    set default(value: ArgumentDefault);
    get help(): string;
    set help(value: string);
    get label(): string;
    set label(value: string);
    get name(): string;
    set name(value: string);
    get names(): string[];
    set prefixes(value: Array<string>);
    set type(value: ArgumentType);
    setAliases(value: Array<string>): this;
    setArgs(value: Array<ArgumentOptions>): this;
    setChoices(value: Array<any> | undefined): this;
    setDefault(value: ArgumentDefault): this;
    setHelp(value: string): this;
    setLabel(value: string): this;
    setName(value: string): this;
    setPrefixes(value: Array<string>): this;
    setType(value: ArgumentType): this;
    check(name: string): boolean;
    getArgs(attributes: CommandAttributes, context: Context): Promise<{
        errors: ParsedErrors;
        parsed: ParsedArgs;
    }>;
    getName(content: string): null | string;
}

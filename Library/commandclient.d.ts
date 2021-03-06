import { EventSpewer, EventSubscription } from '../Iris-Utils';
import { ShardClient } from './client';
import { ClusterClient, ClusterClientOptions, ClusterClientRunOptions } from './clusterclient';
import { ClientEvents } from './constants';
import { GatewayClientEvents } from './gateway/clientevents';
import { Command, CommandCallbackRun, CommandOptions } from './command/command';
import { Context } from './command/context';
import { CommandEvents } from './command/events';
import { CommandRatelimit, CommandRatelimitOptions } from './command/ratelimit';
import { BaseCollection, BaseSet } from './collections';
import { Message } from './structures';
export interface CommandClientOptions extends ClusterClientOptions {
    activateOnEdits?: boolean;
    ignoreMe?: boolean;
    maxEditDuration?: number;
    mentionsEnabled?: boolean;
    onCommandCheck?: CommandClientCommandCheck;
    onMessageCheck?: CommandClientMessageCheck;
    onPrefixCheck?: CommandClientPrefixCheck;
    prefix?: string;
    prefixes?: Array<string>;
    prefixSpace?: boolean;
    ratelimit?: CommandRatelimitOptions;
    ratelimits?: Array<CommandRatelimitOptions>;
    useClusterClient?: boolean;
}
export declare type CommandClientCommandCheck = (context: Context, command: Command) => boolean | Promise<boolean>;
export declare type CommandClientMessageCheck = (context: Context) => boolean | Promise<boolean>;
export declare type CommandClientPrefixes = Array<string> | BaseSet<string> | Set<string> | string;
export declare type CommandClientPrefixCheck = (context: Context) => CommandClientPrefixes | Promise<CommandClientPrefixes>;
export interface CommandClientAdd extends CommandOptions {
    _class?: any;
}
export interface CommandClientRunOptions extends ClusterClientRunOptions {
}
export interface CommandAttributes {
    content: string;
    prefix: string;
}
export interface CommandReply {
    command: Command;
    context: Context;
    reply: Message;
}
/**
 * Command Client, hooks onto the ShardClient to provide easier command handling
 * Flow is `onMessageCheck` -> `onPrefixCheck` -> `onCommandCheck`
 * @category Clients
 */
export declare class CommandClient extends EventSpewer {
    readonly _clientSubscriptions: Array<EventSubscription>;
    activateOnEdits: boolean;
    client: ClusterClient | ShardClient;
    commands: Array<Command>;
    ignoreMe: boolean;
    maxEditDuration: number;
    mentionsEnabled: boolean;
    prefixes: {
        custom: BaseSet<string>;
        mention: BaseSet<string>;
    };
    ran: boolean;
    ratelimits: Array<CommandRatelimit>;
    replies: BaseCollection<string, CommandReply>;
    onCommandCheck?(context: Context, command: Command): boolean | Promise<boolean>;
    onMessageCheck?(context: Context): boolean | Promise<boolean>;
    onPrefixCheck?(context: Context): CommandClientPrefixes | Promise<CommandClientPrefixes>;
    constructor(token: ShardClient | string, options?: CommandClientOptions);
    get rest(): import("detritus-client-rest").Client | import("./rest").RestClient;
    setActivateOnEdits(value: boolean): void;
    setMaxEditDuration(value: number): void;
    setMentionsEnabled(value: boolean): void;
    setPrefixSpace(value: boolean): void;
    add(options: Command | CommandClientAdd | string, run?: CommandCallbackRun): CommandClient;
    addMultiple(commands?: Array<CommandOptions>): CommandClient;
    addMultipleIn(directory: string, options?: {
        isAbsolute?: boolean;
        subdirectories?: boolean;
    }): Promise<CommandClient>;
    addMentionPrefixes(): void;
    clear(): void;
    getAttributes(context: Context): Promise<CommandAttributes | null>;
    getCommand(attributes: CommandAttributes): Command | null;
    getPrefixes(context: Context): Promise<BaseSet<string>>;
    resetSubscriptions(): void;
    setSubscriptions(): void;
    kill(): void;
    run(options?: CommandClientRunOptions): Promise<ClusterClient | ShardClient>;
    storeReply(messageId: string, command: Command, context: Context, reply: Message): void;
    handleMessageCreate(event: GatewayClientEvents.MessageCreate): Promise<void>;
    handleMessageUpdate(event: GatewayClientEvents.MessageUpdate): Promise<void>;
    handle(name: ClientEvents.MESSAGE_CREATE, event: GatewayClientEvents.MessageCreate): Promise<void>;
    handle(name: ClientEvents.MESSAGE_UPDATE, event: GatewayClientEvents.MessageUpdate): Promise<void>;
    handleDelete(name: string, deletePayload: {
        raw: {
            id: string;
        };
    }): Promise<void>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: ClientEvents.COMMAND_DELETE, listener: (payload: CommandEvents.CommandDelete) => any): this;
    on(event: 'commandDelete', listener: (payload: CommandEvents.CommandDelete) => any): this;
    on(event: ClientEvents.COMMAND_ERROR, listener: (payload: CommandEvents.CommandError) => any): this;
    on(event: 'commandError', listener: (payload: CommandEvents.CommandError) => any): this;
    on(event: ClientEvents.COMMAND_FAIL, listener: (payload: CommandEvents.CommandFail) => any): this;
    on(event: 'commandFail', listener: (payload: CommandEvents.CommandFail) => any): this;
    on(event: ClientEvents.COMMAND_NONE, listener: (payload: CommandEvents.CommandNone) => any): this;
    on(event: 'commandNone', listener: (payload: CommandEvents.CommandNone) => any): this;
    on(event: ClientEvents.COMMAND_PERMISSIONS_FAIL_CLIENT, listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): this;
    on(event: 'commandPermissionsFailClient', listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): this;
    on(event: ClientEvents.COMMAND_PERMISSIONS_FAIL, listener: (payload: CommandEvents.CommandPermissionsFail) => any): this;
    on(event: 'commandPermissionsFail', listener: (payload: CommandEvents.CommandPermissionsFail) => any): this;
    on(event: ClientEvents.COMMAND_RAN, listener: (payload: CommandEvents.CommandRan) => any): this;
    on(event: 'commandRan', listener: (payload: CommandEvents.CommandRan) => any): this;
    on(event: ClientEvents.COMMAND_RATELIMIT, listener: (payload: CommandEvents.CommandRatelimit) => any): this;
    on(event: 'commandRatelimit', listener: (payload: CommandEvents.CommandRatelimit) => any): this;
    on(event: ClientEvents.COMMAND_RESPONSE_DELETE, listener: (payload: CommandEvents.CommandResponseDelete) => any): this;
    on(event: 'commandResponseDelete', listener: (payload: CommandEvents.CommandResponseDelete) => any): this;
    on(event: ClientEvents.COMMAND_RUN_ERROR, listener: (payload: CommandEvents.CommandRunError) => any): this;
    on(event: 'commandRunError', listener: (payload: CommandEvents.CommandRunError) => any): this;
    on(event: ClientEvents.KILLED, listener: () => any): this;
    on(event: 'killed', listener: () => any): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: ClientEvents.COMMAND_DELETE, listener: (payload: CommandEvents.CommandDelete) => any): this;
    once(event: 'commandDelete', listener: (payload: CommandEvents.CommandDelete) => any): this;
    once(event: ClientEvents.COMMAND_ERROR, listener: (payload: CommandEvents.CommandError) => any): this;
    once(event: 'commandError', listener: (payload: CommandEvents.CommandError) => any): this;
    once(event: ClientEvents.COMMAND_FAIL, listener: (payload: CommandEvents.CommandFail) => any): this;
    once(event: 'commandFail', listener: (payload: CommandEvents.CommandFail) => any): this;
    once(event: ClientEvents.COMMAND_NONE, listener: (payload: CommandEvents.CommandNone) => any): this;
    once(event: 'commandNone', listener: (payload: CommandEvents.CommandNone) => any): this;
    once(event: ClientEvents.COMMAND_PERMISSIONS_FAIL_CLIENT, listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): this;
    once(event: 'commandPermissionsFailClient', listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): this;
    once(event: ClientEvents.COMMAND_PERMISSIONS_FAIL, listener: (payload: CommandEvents.CommandPermissionsFail) => any): this;
    once(event: 'commandPermissionsFail', listener: (payload: CommandEvents.CommandPermissionsFail) => any): this;
    once(event: ClientEvents.COMMAND_RAN, listener: (payload: CommandEvents.CommandRan) => any): this;
    once(event: 'commandRan', listener: (payload: CommandEvents.CommandRan) => any): this;
    once(event: ClientEvents.COMMAND_RATELIMIT, listener: (payload: CommandEvents.CommandRatelimit) => any): this;
    once(event: 'commandRatelimit', listener: (payload: CommandEvents.CommandRatelimit) => any): this;
    once(event: ClientEvents.COMMAND_RESPONSE_DELETE, listener: (payload: CommandEvents.CommandResponseDelete) => any): this;
    once(event: 'commandResponseDelete', listener: (payload: CommandEvents.CommandResponseDelete) => any): this;
    once(event: ClientEvents.COMMAND_RUN_ERROR, listener: (payload: CommandEvents.CommandRunError) => any): this;
    once(event: 'commandRunError', listener: (payload: CommandEvents.CommandRunError) => any): this;
    once(event: ClientEvents.KILLED, listener: () => any): this;
    once(event: 'killed', listener: () => any): this;
    subscribe(event: string | symbol, listener: (...args: any[]) => void): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_DELETE, listener: (payload: CommandEvents.CommandDelete) => any): EventSubscription;
    subscribe(event: 'commandDelete', listener: (payload: CommandEvents.CommandDelete) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_ERROR, listener: (payload: CommandEvents.CommandError) => any): EventSubscription;
    subscribe(event: 'commandError', listener: (payload: CommandEvents.CommandError) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_FAIL, listener: (payload: CommandEvents.CommandFail) => any): EventSubscription;
    subscribe(event: 'commandFail', listener: (payload: CommandEvents.CommandFail) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_NONE, listener: (payload: CommandEvents.CommandNone) => any): EventSubscription;
    subscribe(event: 'commandNone', listener: (payload: CommandEvents.CommandNone) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_PERMISSIONS_FAIL_CLIENT, listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): EventSubscription;
    subscribe(event: 'commandPermissionsFailClient', listener: (payload: CommandEvents.CommandPermissionsFailClient) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_PERMISSIONS_FAIL, listener: (payload: CommandEvents.CommandPermissionsFail) => any): EventSubscription;
    subscribe(event: 'commandPermissionsFail', listener: (payload: CommandEvents.CommandPermissionsFail) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_RAN, listener: (payload: CommandEvents.CommandRan) => any): EventSubscription;
    subscribe(event: 'commandRan', listener: (payload: CommandEvents.CommandRan) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_RATELIMIT, listener: (payload: CommandEvents.CommandRatelimit) => any): EventSubscription;
    subscribe(event: 'commandRatelimit', listener: (payload: CommandEvents.CommandRatelimit) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_RESPONSE_DELETE, listener: (payload: CommandEvents.CommandResponseDelete) => any): EventSubscription;
    subscribe(event: 'commandResponseDelete', listener: (payload: CommandEvents.CommandResponseDelete) => any): EventSubscription;
    subscribe(event: ClientEvents.COMMAND_RUN_ERROR, listener: (payload: CommandEvents.CommandRunError) => any): EventSubscription;
    subscribe(event: 'commandRunError', listener: (payload: CommandEvents.CommandRunError) => any): EventSubscription;
    subscribe(event: ClientEvents.KILLED, listener: () => any): EventSubscription;
    subscribe(event: 'killed', listener: () => any): EventSubscription;
}

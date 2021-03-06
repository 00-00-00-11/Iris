"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandClient = void 0;
const path = require("path");
const iris_utils_1 = require("../Iris-Utils");
const client_1 = require("./client");
const clusterclient_1 = require("./clusterclient");
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const command_1 = require("./command/command");
const context_1 = require("./command/context");
const ratelimit_1 = require("./command/ratelimit");
const collections_1 = require("./collections");
const structures_1 = require("./structures");
/**
 * Command Client, hooks onto the ShardClient to provide easier command handling
 * Flow is `onMessageCheck` -> `onPrefixCheck` -> `onCommandCheck`
 * @category Clients
 */
class CommandClient extends iris_utils_1.EventSpewer {
    constructor(token, options = {}) {
        super();
        this._clientSubscriptions = [];
        this.activateOnEdits = false;
        this.ignoreMe = true;
        this.maxEditDuration = 5 * 60 * 1000;
        this.mentionsEnabled = true;
        this.ratelimits = [];
        options = Object.assign({ useClusterClient: true }, options);
        if (process.env.CLUSTER_MANAGER === 'true') {
            token = process.env.CLUSTER_TOKEN;
            options.useClusterClient = true;
        }
        let client;
        if (typeof (token) === 'string') {
            if (options.useClusterClient) {
                client = new clusterclient_1.ClusterClient(token, options);
            }
            else {
                client = new client_1.ShardClient(token, options);
            }
        }
        else {
            client = token;
        }
        if (!client || !(client instanceof clusterclient_1.ClusterClient || client instanceof client_1.ShardClient)) {
            throw new Error('Token has to be a string or an instance of a client');
        }
        this.client = client;
        Object.defineProperty(this.client, 'commandClient', { value: this });
        this.activateOnEdits = !!options.activateOnEdits || this.activateOnEdits;
        this.commands = [];
        this.ignoreMe = options.ignoreMe || this.ignoreMe;
        this.maxEditDuration = +(options.maxEditDuration || this.maxEditDuration);
        this.mentionsEnabled = !!(options.mentionsEnabled || options.mentionsEnabled === undefined);
        this.prefixes = Object.freeze({
            custom: new collections_1.BaseSet(),
            mention: new collections_1.BaseSet(),
        });
        this.ran = this.client.ran;
        this.replies = new collections_1.BaseCollection({ expire: this.maxEditDuration });
        this.onCommandCheck = options.onCommandCheck || this.onCommandCheck;
        this.onMessageCheck = options.onMessageCheck || this.onMessageCheck;
        this.onPrefixCheck = options.onPrefixCheck || this.onPrefixCheck;
        if (options.prefix !== undefined) {
            if (options.prefixes === undefined) {
                options.prefixes = [];
            }
            options.prefixes.push(options.prefix);
        }
        if (options.prefixes !== undefined) {
            options.prefixes.sort((x, y) => y.length - x.length);
            for (let prefix of options.prefixes) {
                prefix = prefix.trim();
                if (options.prefixSpace) {
                    prefix += ' ';
                }
                this.prefixes.custom.add(prefix);
            }
        }
        if (this.ran) {
            this.addMentionPrefixes();
        }
        if (options.ratelimit) {
            this.ratelimits.push(new ratelimit_1.CommandRatelimit(options.ratelimit));
        }
        if (options.ratelimits) {
            for (let rOptions of options.ratelimits) {
                const rType = (rOptions.type || '').toLowerCase();
                if (this.ratelimits.some((ratelimit) => ratelimit.type === rType)) {
                    throw new Error(`Ratelimit with type ${rType} already exists`);
                }
                this.ratelimits.push(new ratelimit_1.CommandRatelimit(rOptions));
            }
        }
        if (!this.prefixes.custom.size && !this.mentionsEnabled) {
            throw new Error('You must pass in prefixes or enable mentions!');
        }
        Object.defineProperties(this, {
            _clientSubscriptions: { enumerable: false, writable: false },
            activateOnEdits: { configurable: true, writable: false },
            client: { enumerable: false, writable: false },
            commands: { writable: false },
            maxEditDuration: { configurable: true, writable: false },
            mentionsEnabled: { configurable: true, writable: false },
            onCommandCheck: { enumerable: false, writable: true },
            onPrefixCheck: { enumerable: false, writable: true },
            prefixes: { writable: false },
            prefixSpace: { configurable: true, writable: false },
            ran: { configurable: true, writable: false },
            replies: { enumerable: false, writable: false },
        });
    }
    get rest() {
        return this.client.rest;
    }
    /* Set Options */
    setActivateOnEdits(value) {
        Object.defineProperty(this, 'activateOnEdits', { value });
    }
    setMaxEditDuration(value) {
        Object.defineProperty(this, 'maxEditDuration', { value });
    }
    setMentionsEnabled(value) {
        Object.defineProperty(this, 'mentionsEnabled', { value });
    }
    setPrefixSpace(value) {
        Object.defineProperty(this, 'prefixSpace', { value });
    }
    /* Generic Command Function */
    add(options, run) {
        let command;
        if (options instanceof command_1.Command) {
            command = options;
        }
        else {
            if (typeof (options) === 'string') {
                options = { name: options, run };
            }
            else {
                if (run !== undefined) {
                    options.run = run;
                }
            }
            // create a normal command class with the options given
            if (options._class === undefined) {
                command = new command_1.Command(this, options);
            }
            else {
                // check for `.constructor` to make sure it's a class
                if (options._class.constructor) {
                    command = new options._class(this, options);
                }
                else {
                    // else it's just a function, `ts-node` outputs these
                    command = options._class(this, options);
                }
                if (!command._file) {
                    Object.defineProperty(command, '_file', { value: options._file });
                }
            }
        }
        if (typeof (command.run) !== 'function') {
            throw new Error('Command needs a run function');
        }
        for (let name of command.names) {
            if (this.commands.some((c) => c.check(name))) {
                throw new Error(`Alias/name \`${name}\` already exists.`);
            }
        }
        this.commands.push(command);
        this.commands.sort((x, y) => y.priority - x.priority);
        this.setSubscriptions();
        return this;
    }
    addMultiple(commands = []) {
        for (let command of commands) {
            this.add(command);
        }
        return this;
    }
    async addMultipleIn(directory, options = {}) {
        options = Object.assign({}, options);
        if (!options.isAbsolute) {
            if (require.main) {
                // require.main.path exists but typescript doesn't let us use it..
                directory = path.join(path.dirname(require.main.filename), directory);
            }
        }
        const files = await utils_1.getFiles(directory, options.subdirectories);
        const errors = {};
        const addCommand = (imported, filepath) => {
            if (!imported) {
                return;
            }
            if (typeof (imported) === 'function') {
                this.add({ _file: filepath, _class: imported, name: '' });
            }
            else if (imported instanceof command_1.Command) {
                Object.defineProperty(imported, '_file', { value: filepath });
                this.add(imported);
            }
            else if (typeof (imported) === 'object' && Object.keys(imported).length) {
                if (Array.isArray(imported)) {
                    for (let child of imported) {
                        addCommand(child, filepath);
                    }
                }
                else {
                    if ('name' in imported) {
                        this.add({ ...imported, _file: filepath });
                    }
                }
            }
        };
        for (let file of files) {
            if (!file.endsWith((constants_1.IS_TS_NODE) ? '.ts' : '.js')) {
                continue;
            }
            const filepath = path.resolve(directory, file);
            try {
                let importedCommand = require(filepath);
                if (typeof (importedCommand) === 'object' && importedCommand.__esModule) {
                    importedCommand = importedCommand.default;
                }
                addCommand(importedCommand, filepath);
            }
            catch (error) {
                errors[filepath] = error;
            }
        }
        if (Object.keys(errors).length) {
            throw new errors_1.ImportedCommandsError(errors);
        }
        return this;
    }
    addMentionPrefixes() {
        let user = null;
        if (this.client instanceof clusterclient_1.ClusterClient) {
            for (let [shardId, shard] of this.client.shards) {
                if (shard.user != null) {
                    user = shard.user;
                    break;
                }
            }
        }
        else if (this.client instanceof client_1.ShardClient) {
            if (this.client.user != null) {
                user = this.client.user;
            }
        }
        if (user !== null) {
            this.prefixes.mention.add(user.mention);
            this.prefixes.mention.add(`<@!${user.id}>`);
        }
    }
    clear() {
        for (let command of this.commands) {
            if (command._file) {
                const requirePath = require.resolve(command._file);
                if (requirePath) {
                    delete require.cache[requirePath];
                }
            }
        }
        this.commands.length = 0;
        this.resetSubscriptions();
    }
    async getAttributes(context) {
        let content = context.message.content.trim();
        let contentLower = content.toLowerCase();
        if (!content) {
            return null;
        }
        let prefix = '';
        if (this.mentionsEnabled) {
            for (let mention of this.prefixes.mention) {
                if (contentLower.startsWith(mention)) {
                    prefix = mention;
                    break;
                }
            }
        }
        if (!prefix) {
            const customPrefixes = await Promise.resolve(this.getPrefixes(context));
            for (let custom of customPrefixes) {
                if (contentLower.startsWith(custom)) {
                    prefix = custom;
                    break;
                }
            }
        }
        if (prefix) {
            content = content.substring(prefix.length).trim();
            return { content, prefix };
        }
        return null;
    }
    getCommand(attributes) {
        if (attributes.content) {
            const insensitive = attributes.content.toLowerCase();
            for (let command of this.commands) {
                const name = command.getName(insensitive);
                if (name) {
                    attributes.content = attributes.content.substring(name.length).trim();
                    return command;
                }
            }
        }
        return null;
    }
    async getPrefixes(context) {
        if (typeof (this.onPrefixCheck) === 'function') {
            const prefixes = await Promise.resolve(this.onPrefixCheck(context));
            if (prefixes === this.prefixes.custom) {
                return prefixes;
            }
            let sorted;
            if (prefixes instanceof Set || prefixes instanceof collections_1.BaseSet) {
                sorted = Array.from(prefixes);
            }
            else if (typeof (prefixes) === 'string') {
                sorted = [prefixes];
            }
            else if (Array.isArray(prefixes)) {
                sorted = prefixes;
            }
            else {
                throw new Error('Invalid Prefixes Type Received');
            }
            return new collections_1.BaseSet(sorted.sort((x, y) => y.length - x.length));
        }
        return this.prefixes.custom;
    }
    resetSubscriptions() {
        while (this._clientSubscriptions.length) {
            const subscription = this._clientSubscriptions.shift();
            if (subscription) {
                subscription.remove();
            }
        }
    }
    setSubscriptions() {
        this.resetSubscriptions();
        const subscriptions = this._clientSubscriptions;
        subscriptions.push(this.client.subscribe(constants_1.ClientEvents.MESSAGE_CREATE, this.handleMessageCreate.bind(this)));
        subscriptions.push(this.client.subscribe(constants_1.ClientEvents.MESSAGE_DELETE, this.handleDelete.bind(this, constants_1.ClientEvents.MESSAGE_DELETE)));
        subscriptions.push(this.client.subscribe(constants_1.ClientEvents.MESSAGE_UPDATE, this.handleMessageUpdate.bind(this)));
    }
    /* Kill/Run */
    kill() {
        this.client.kill();
        this.emit(constants_1.ClientEvents.KILLED);
        this.resetSubscriptions();
        this.removeAllListeners();
    }
    async run(options = {}) {
        if (this.ran) {
            return this.client;
        }
        await this.client.run(options);
        Object.defineProperty(this, 'ran', { value: true });
        this.addMentionPrefixes();
        return this.client;
    }
    storeReply(messageId, command, context, reply) {
        if (this.maxEditDuration && reply instanceof structures_1.Message) {
            this.replies.set(messageId, { command, context, reply });
        }
    }
    /* Handler */
    async handleMessageCreate(event) {
        return this.handle(constants_1.ClientEvents.MESSAGE_CREATE, event);
    }
    async handleMessageUpdate(event) {
        if (event.isEmbedUpdate) {
            return;
        }
        return this.handle(constants_1.ClientEvents.MESSAGE_UPDATE, event);
    }
    async handle(name, event) {
        const { message } = event;
        // message will only be null on embed updates
        if (!message || (this.ignoreMe && message.fromMe)) {
            return;
        }
        let typing = null;
        if (name === constants_1.ClientEvents.MESSAGE_CREATE) {
            ({ typing } = event);
        }
        const context = new context_1.Context(message, typing, this);
        if (typeof (this.onMessageCheck) === 'function') {
            try {
                const shouldContinue = await Promise.resolve(this.onMessageCheck(context));
                if (!shouldContinue) {
                    const error = new Error('Message check returned false');
                    const payload = { context, error };
                    this.emit(constants_1.ClientEvents.COMMAND_NONE, payload);
                    return;
                }
            }
            catch (error) {
                const payload = { context, error };
                this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                return;
            }
        }
        if (name === constants_1.ClientEvents.MESSAGE_UPDATE) {
            if (!this.activateOnEdits) {
                return;
            }
            const { differences } = event;
            if (!differences || !differences.content) {
                return;
            }
        }
        let attributes = null;
        try {
            if (!message.fromUser) {
                throw new Error('Message is not from a user.');
            }
            if (message.isEdited) {
                const difference = message.editedAtUnix - message.timestampUnix;
                if (this.maxEditDuration < difference) {
                    throw new Error('Edit timestamp is higher than max edit duration');
                }
            }
            attributes = await this.getAttributes(context);
            if (!attributes) {
                throw new Error('Does not start with any allowed prefixes');
            }
        }
        catch (error) {
            const payload = { context, error };
            this.emit(constants_1.ClientEvents.COMMAND_NONE, payload);
            return;
        }
        const command = this.getCommand(attributes);
        if (command) {
            context.command = command;
            if (typeof (this.onCommandCheck) === 'function') {
                try {
                    const shouldContinue = await Promise.resolve(this.onCommandCheck(context, command));
                    if (!shouldContinue) {
                        const error = new Error('Command check returned false');
                        const payload = { context, error };
                        this.emit(constants_1.ClientEvents.COMMAND_NONE, payload);
                        return;
                    }
                }
                catch (error) {
                    const payload = { context, error };
                    this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                    return;
                }
            }
        }
        else {
            const error = new Error('Unknown Command');
            const payload = { context, error };
            this.emit(constants_1.ClientEvents.COMMAND_NONE, payload);
            return;
        }
        if (!command.responseOptional && !message.canReply) {
            const error = new Error('Cannot send messages in this channel');
            const payload = { command, context, error };
            this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
            return;
        }
        if (this.ratelimits.length || command.ratelimits.length) {
            const now = Date.now();
            {
                const ratelimits = utils_1.getExceededRatelimits(this.ratelimits, message, now);
                if (ratelimits.length) {
                    const global = true;
                    const payload = { command, context, global, ratelimits, now };
                    this.emit(constants_1.ClientEvents.COMMAND_RATELIMIT, payload);
                    if (typeof (command.onRatelimit) === 'function') {
                        try {
                            await Promise.resolve(command.onRatelimit(context, ratelimits, { global, now }));
                        }
                        catch (error) {
                            // do something with this error?
                        }
                    }
                    return;
                }
            }
            {
                const ratelimits = utils_1.getExceededRatelimits(command.ratelimits, message, now);
                if (ratelimits.length) {
                    const global = false;
                    const payload = { command, context, global, ratelimits, now };
                    this.emit(constants_1.ClientEvents.COMMAND_RATELIMIT, payload);
                    if (typeof (command.onRatelimit) === 'function') {
                        try {
                            await Promise.resolve(command.onRatelimit(context, ratelimits, { global, now }));
                        }
                        catch (error) {
                            // do something with this error?
                        }
                    }
                    return;
                }
            }
        }
        if (context.inDm) {
            if (command.disableDm) {
                const error = new Error('Command with DMs disabled used in DM');
                if (command.disableDmReply) {
                    const payload = { command, context, error };
                    this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                }
                else {
                    try {
                        const reply = await message.reply(`Cannot use \`${command.name}\` in DMs.`);
                        this.storeReply(message.id, command, context, reply);
                        const payload = { command, context, error, reply };
                        this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                    }
                    catch (e) {
                        const payload = { command, context, error, extra: e };
                        this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                    }
                }
                return;
            }
        }
        else {
            // check the bot's permissions in the server
            // should never be ignored since it's most likely the bot will rely on this permission to do whatever action
            if (Array.isArray(command.permissionsClient) && command.permissionsClient.length) {
                const failed = [];
                const channel = context.channel;
                const member = context.me;
                if (channel && member) {
                    const total = member.permissionsIn(channel);
                    if (!member.isOwner && !utils_1.PermissionTools.checkPermissions(total, constants_1.Permissions.ADMINISTRATOR)) {
                        for (let permission of command.permissionsClient) {
                            if (!utils_1.PermissionTools.checkPermissions(total, permission)) {
                                failed.push(permission);
                            }
                        }
                    }
                }
                else {
                    for (let permission of command.permissionsClient) {
                        failed.push(permission);
                    }
                }
                if (failed.length) {
                    const payload = { command, context, permissions: failed };
                    this.emit(constants_1.ClientEvents.COMMAND_PERMISSIONS_FAIL_CLIENT, payload);
                    if (typeof (command.onPermissionsFailClient) === 'function') {
                        try {
                            await Promise.resolve(command.onPermissionsFailClient(context, failed));
                        }
                        catch (error) {
                            // do something with this error?
                        }
                    }
                    return;
                }
            }
            // if command doesn't specify it should ignore the client owner, or if the user isn't a client owner
            // continue to permission checking
            if (!command.permissionsIgnoreClientOwner || !context.user.isClientOwner) {
                // check the user's permissions
                if (Array.isArray(command.permissions) && command.permissions.length) {
                    const failed = [];
                    const channel = context.channel;
                    const member = context.member;
                    if (channel && member) {
                        const total = member.permissionsIn(channel);
                        if (!member.isOwner && !utils_1.PermissionTools.checkPermissions(total, constants_1.Permissions.ADMINISTRATOR)) {
                            for (let permission of command.permissions) {
                                if (!utils_1.PermissionTools.checkPermissions(total, permission)) {
                                    failed.push(permission);
                                }
                            }
                        }
                    }
                    else {
                        for (let permission of command.permissions) {
                            failed.push(permission);
                        }
                    }
                    if (failed.length) {
                        const payload = { command, context, permissions: failed };
                        this.emit(constants_1.ClientEvents.COMMAND_PERMISSIONS_FAIL, payload);
                        if (typeof (command.onPermissionsFail) === 'function') {
                            try {
                                await Promise.resolve(command.onPermissionsFail(context, failed));
                            }
                            catch (error) {
                                // do something with this error?
                            }
                        }
                        return;
                    }
                }
            }
        }
        if (typeof (command.onBefore) === 'function') {
            try {
                const shouldContinue = await Promise.resolve(command.onBefore(context));
                if (!shouldContinue) {
                    if (typeof (command.onCancel) === 'function') {
                        const reply = await Promise.resolve(command.onCancel(context));
                        this.storeReply(message.id, command, context, reply);
                    }
                    return;
                }
            }
            catch (error) {
                const payload = { command, context, error };
                this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
                return;
            }
        }
        const prefix = context.prefix = attributes.prefix;
        const { errors, parsed: args } = await command.getArgs(attributes, context);
        if (Object.keys(errors).length) {
            if (typeof (command.onTypeError) === 'function') {
                const reply = await Promise.resolve(command.onTypeError(context, args, errors));
                this.storeReply(message.id, command, context, reply);
            }
            const error = new Error('Command errored out while converting args');
            const payload = { command, context, error, extra: errors };
            this.emit(constants_1.ClientEvents.COMMAND_ERROR, payload);
            return;
        }
        try {
            if (typeof (command.onBeforeRun) === 'function') {
                const shouldRun = await Promise.resolve(command.onBeforeRun(context, args));
                if (!shouldRun) {
                    if (typeof (command.onCancelRun) === 'function') {
                        const reply = await Promise.resolve(command.onCancelRun(context, args));
                        this.storeReply(message.id, command, context, reply);
                    }
                    return;
                }
            }
            let timeout = null;
            try {
                if (command.triggerTypingAfter !== -1) {
                    if (command.triggerTypingAfter) {
                        timeout = new iris_utils_1.Timers.Timeout();
                        timeout.start(command.triggerTypingAfter, async () => {
                            try {
                                await context.triggerTyping();
                            }
                            catch (error) {
                                // do something maybe?
                            }
                        });
                    }
                    else {
                        await context.triggerTyping();
                    }
                }
                if (typeof (command.run) === 'function') {
                    const reply = await Promise.resolve(command.run(context, args));
                    this.storeReply(message.id, command, context, reply);
                }
                if (timeout) {
                    timeout.stop();
                }
                const payload = { args, command, context, prefix };
                this.emit(constants_1.ClientEvents.COMMAND_RAN, payload);
                if (typeof (command.onSuccess) === 'function') {
                    await Promise.resolve(command.onSuccess(context, args));
                }
            }
            catch (error) {
                if (timeout) {
                    timeout.stop();
                }
                const payload = { args, command, context, error, prefix };
                this.emit(constants_1.ClientEvents.COMMAND_RUN_ERROR, payload);
                if (typeof (command.onRunError) === 'function') {
                    await Promise.resolve(command.onRunError(context, args, error));
                }
            }
        }
        catch (error) {
            if (typeof (command.onError) === 'function') {
                await Promise.resolve(command.onError(context, args, error));
            }
            const payload = { args, command, context, error, prefix };
            this.emit(constants_1.ClientEvents.COMMAND_FAIL, payload);
        }
    }
    async handleDelete(name, deletePayload) {
        const messageId = deletePayload.raw.id;
        if (this.replies.has(messageId)) {
            const { command, context, reply } = this.replies.get(messageId);
            this.replies.delete(messageId);
            const payload = { command, context, reply };
            this.emit(constants_1.ClientEvents.COMMAND_DELETE, payload);
        }
        else {
            for (let [commandId, { command, context, reply }] of this.replies) {
                if (reply.id === messageId) {
                    this.replies.delete(commandId);
                    const payload = { command, context, reply };
                    this.emit(constants_1.ClientEvents.COMMAND_RESPONSE_DELETE, payload);
                }
            }
        }
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
    subscribe(event, listener) {
        return super.subscribe(event, listener);
    }
}
exports.CommandClient = CommandClient;

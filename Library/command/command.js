"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const argument_1 = require("./argument");
const argumentparser_1 = require("./argumentparser");
const ratelimit_1 = require("./ratelimit");
/**
 * Command itself
 * Command flow is ratelimit check -> permission check -> `onBefore` -> arg parse -> `onBeforeRun` -> `run` -> `onSuccess | onRunError`
 * @category Command
 */
class Command {
    constructor(commandClient, options) {
        this.argParser = new argumentparser_1.ArgumentParser();
        this.disableDm = false;
        this.disableDmReply = false;
        this.metadata = {};
        this.permissionsIgnoreClientOwner = false;
        this.priority = 0;
        this.ratelimits = [];
        this.responseOptional = false;
        this.triggerTypingAfter = -1;
        this.commandClient = commandClient;
        options = Object.assign({}, options);
        this.arg = new argument_1.Argument(Object.assign({ prefix: '' }, options, { metadata: undefined }));
        this.disableDm = !!options.disableDm;
        this.disableDmReply = !!options.disableDmReply;
        this.metadata = Object.assign(this.metadata, options.metadata);
        this.permissions = (options.permissions) ? options.permissions.map((x) => BigInt(x)) : undefined;
        this.permissionsClient = (options.permissionsClient) ? options.permissionsClient.map((x) => BigInt(x)) : undefined;
        this.permissionsIgnoreClientOwner = !!options.permissionsIgnoreClientOwner;
        this.priority = options.priority || this.priority;
        this.responseOptional = !!options.responseOptional;
        if (options.args) {
            this.args = options.args;
        }
        if (options.triggerTypingAfter !== undefined) {
            this.triggerTypingAfter = Math.max(options.triggerTypingAfter, this.triggerTypingAfter);
        }
        if (options._file) {
            this._file = options._file;
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
        Object.defineProperties(this, {
            _file: { configurable: true, writable: false },
            client: { enumerable: false, writable: false },
            commandClient: { enumerable: false, writable: false },
        });
        this.onBefore = options.onBefore || this.onBefore;
        this.onBeforeRun = options.onBeforeRun || this.onBeforeRun;
        this.onCancel = options.onCancel || this.onCancel;
        this.onCancelRun = options.onCancelRun || this.onCancelRun;
        this.onError = options.onError || this.onError;
        this.onPermissionsFail = options.onPermissionsFail || this.onPermissionsFail;
        this.onPermissionsFailClient = options.onPermissionsFailClient || this.onPermissionsFailClient;
        this.run = options.run || this.run;
        this.onRatelimit = options.onRatelimit || this.onRatelimit;
        this.onRunError = options.onRunError || this.onRunError;
        this.onSuccess = options.onSuccess || this.onSuccess;
        this.onTypeError = options.onTypeError || this.onTypeError;
    }
    get aliases() {
        return this.arg.aliases;
    }
    set aliases(value) {
        this.setAliases(value);
    }
    set args(value) {
        this.setArgs(value);
    }
    get choices() {
        return this.arg.choices;
    }
    set choices(value) {
        this.setChoices(value);
    }
    get default() {
        return this.arg.default;
    }
    set default(value) {
        this.setDefault(value);
    }
    get help() {
        return this.arg.help;
    }
    set help(value) {
        this.setHelp(value);
    }
    get label() {
        return this.arg.label;
    }
    set label(value) {
        this.setLabel(value);
    }
    get name() {
        return this.arg.name;
    }
    set name(value) {
        this.setName(value);
    }
    get names() {
        return this.arg.names;
    }
    set prefixes(value) {
        this.setPrefixes(value);
    }
    set type(value) {
        this.setType(value);
    }
    setAliases(value) {
        this.arg.aliases = value;
        return this;
    }
    setArgs(value) {
        this.argParser.initialize(value);
        return this;
    }
    setChoices(value) {
        this.arg.choices = value;
        return this;
    }
    setDefault(value) {
        this.arg.default = value;
        return this;
    }
    setHelp(value) {
        this.arg.help = value;
        return this;
    }
    setLabel(value) {
        this.arg.label = value;
        return this;
    }
    setName(value) {
        this.arg.name = value.toLowerCase();
        return this;
    }
    setPrefixes(value) {
        this.arg.setPrefixes(value);
        return this;
    }
    setType(value) {
        this.arg.type = value;
        return this;
    }
    check(name) {
        return this.arg.check(name);
    }
    async getArgs(attributes, context) {
        const { errors, parsed } = await this.argParser.parse(attributes, context);
        const { arg } = this;
        try {
            if (this.arg.positionalArgs) {
                const positional = await this.arg.positionalArgs.parse(attributes, context);
                Object.assign(errors, positional.errors);
                Object.assign(parsed, positional.parsed);
            }
            else {
                let value = attributes.content.trim();
                if (value) {
                    value = await arg.parse(value, context);
                }
                else {
                    if (arg.default !== undefined) {
                        if (typeof (arg.default) === 'function') {
                            value = await Promise.resolve(arg.default(context));
                        }
                        else {
                            value = arg.default;
                        }
                        if (typeof (value) === 'string') {
                            value = await arg.parse(value, context);
                        }
                    }
                    else if (arg.required) {
                        throw new Error(arg.help || 'Missing required parameter');
                    }
                    else {
                        value = await arg.parse(value, context);
                    }
                }
                parsed[arg.label] = value;
            }
        }
        catch (error) {
            errors[arg.label] = error;
        }
        return { errors, parsed };
    }
    getName(content) {
        return this.arg.getName(content);
    }
}
exports.Command = Command;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = exports.rgbToInt = exports.regex = exports.intToRGB = exports.intToHex = exports.hexToInt = exports.getFirstArgument = exports.getFormatFromHash = exports.getFiles = exports.getExceededRatelimits = exports.getAcronym = exports.anyToCamelCase = exports.addQuery = exports.Snowflake = exports.PermissionTools = exports.Markup = exports.guildIdToShardId = void 0;
const fs = require("fs");
const url_1 = require("url");
const iris_utils_1 = require("../../Iris-Utils");
Object.defineProperty(exports, "Snowflake", { enumerable: true, get: function () { return iris_utils_1.Snowflake; } });
const { guildIdToShardId } = iris_utils_1.Tools;
exports.guildIdToShardId = guildIdToShardId;
const constants_1 = require("../constants");
const Markup = require("./markup");
exports.Markup = Markup;
const PermissionTools = require("./permissions");
exports.PermissionTools = PermissionTools;
__exportStar(require("./embed"), exports);
function addQuery(url, query) {
    if (query) {
        const params = new url_1.URLSearchParams();
        for (let key in query) {
            if (query[key] !== undefined) {
                params.append(key, query[key]);
            }
        }
        const string = params.toString();
        if (string) {
            if (url.includes('?')) {
                url += '&' + string;
            }
            else {
                url += '?' + string;
            }
        }
    }
    return url;
}
exports.addQuery = addQuery;
function anyToCamelCase(object, skip) {
    if (object === null) {
        return object;
    }
    if (typeof (object) === 'object') {
        if (Array.isArray(object)) {
            const obj = [];
            for (let value of object) {
                obj.push(anyToCamelCase(value));
            }
            return obj;
        }
        else {
            const obj = {};
            for (let key in object) {
                if (skip && skip.includes(key)) {
                    obj[key] = object[key];
                }
                else {
                    obj[toCamelCase(key)] = anyToCamelCase(object[key]);
                }
            }
            return obj;
        }
    }
    return object;
}
exports.anyToCamelCase = anyToCamelCase;
function getAcronym(name) {
    if (name != null) {
        return name.replace(/\w+/g, match => match[0]).replace(/\s/g, '');
    }
    return '';
}
exports.getAcronym = getAcronym;
function getExceededRatelimits(ratelimits, message, now = Date.now()) {
    const exceeded = [];
    for (const ratelimit of ratelimits) {
        let cacheId;
        switch (ratelimit.type) {
            case constants_1.CommandRatelimitTypes.CHANNEL:
                {
                    cacheId = message.channelId;
                }
                ;
                break;
            case constants_1.CommandRatelimitTypes.GUILD:
                {
                    cacheId = message.guildId || message.channelId;
                }
                ;
                break;
            default:
                {
                    cacheId = message.author.id;
                }
                ;
        }
        const item = ratelimit.get(cacheId);
        if (ratelimit.limit <= item.usages++) {
            const remaining = (item.start + ratelimit.duration) - now;
            exceeded.push({ item, ratelimit, remaining });
        }
    }
    return exceeded;
}
exports.getExceededRatelimits = getExceededRatelimits;
async function getFiles(directory, subdirectories) {
    if (subdirectories) {
        const dirents = await new Promise((resolve, reject) => {
            fs.readdir(directory, { withFileTypes: true }, (error, files) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(files);
                }
            });
        });
        const names = [];
        for (let folder of dirents.filter((dirent) => dirent.isDirectory())) {
            const files = await getFiles(`${directory}/${folder.name}`, subdirectories);
            for (let name of files) {
                names.push(`${folder.name}/${name}`);
            }
        }
        for (let file of dirents.filter((dirent) => dirent.isFile())) {
            names.push(file.name);
        }
        return names;
    }
    else {
        const names = await new Promise((resolve, reject) => {
            fs.readdir(directory, (error, files) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(files);
                }
            });
        });
        return names;
    }
}
exports.getFiles = getFiles;
function getFormatFromHash(hash, format, defaultFormat = constants_1.ImageFormats.PNG) {
    if (format) {
        format = format.toLowerCase();
    }
    else {
        format = defaultFormat;
        if (hash.startsWith('a_')) {
            format = constants_1.ImageFormats.GIF;
        }
    }
    if (!constants_1.IMAGE_FORMATS.includes(format)) {
        throw new Error(`Invalid format: '${format}', valid: ${constants_1.IMAGE_FORMATS}`);
    }
    return format;
}
exports.getFormatFromHash = getFormatFromHash;
const QuotesAll = {
    '"': '"',
    '\'': '\'',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '???': '???',
    '??': '??',
    '???': '???',
    '???': '???',
};
const Quotes = {
    END: Object.values(QuotesAll),
    START: Object.keys(QuotesAll),
};
function getFirstArgument(value) {
    let result = value.slice(0, 1);
    value = value.slice(1);
    // check to see if this word starts with any of the quote starts
    // if yes, then continue onto the next word
    if (Quotes.START.includes(result)) {
        let index = value.indexOf(QuotesAll[result], 1);
        if (index !== -1) {
            result = value.slice(0, index);
            value = value.slice(index + 1).trim();
            return [result, value];
        }
    }
    // check for the next space, if not then we consume the whole thing
    let index = value.indexOf(' ');
    if (index === -1) {
        result += value.slice(0, value.length);
        value = '';
    }
    else {
        result += value.slice(0, index);
        value = value.slice(index).trim();
    }
    return [result, value];
}
exports.getFirstArgument = getFirstArgument;
function hexToInt(hex) {
    return parseInt(hex.replace(/#/, ''), 16);
}
exports.hexToInt = hexToInt;
function intToHex(int, hashtag) {
    return ((hashtag) ? '#' : '') + int.toString(16).padStart(6, '0');
}
exports.intToHex = intToHex;
function intToRGB(int) {
    return {
        r: (int >> 16) & 0x0ff,
        g: (int >> 8) & 0x0ff,
        b: int & 0x0ff,
    };
}
exports.intToRGB = intToRGB;
function regex(type, content, onlyFirst = false) {
    type = String(type || '').toUpperCase();
    const regex = constants_1.DiscordRegex[type];
    if (regex === undefined) {
        throw new Error(`Unknown regex type: ${type}`);
    }
    regex.lastIndex = 0;
    const payload = {
        match: { regex, type },
        matches: [],
    };
    let match = null;
    while (match = regex.exec(content)) {
        const result = { matched: match[0] };
        switch (type) {
            case constants_1.DiscordRegexNames.EMOJI:
                {
                    result.name = match[1];
                    result.id = match[2];
                    result.animated = content.startsWith('<a:');
                }
                ;
                break;
            case constants_1.DiscordRegexNames.JUMP_CHANNEL:
                {
                    result.guildId = match[1];
                    result.channelId = match[2];
                }
                ;
                break;
            case constants_1.DiscordRegexNames.JUMP_CHANNEL_MESSAGE:
                {
                    result.guildId = match[1];
                    result.channelId = match[2];
                    result.messageId = match[3];
                }
                ;
                break;
            case constants_1.DiscordRegexNames.MENTION_CHANNEL:
            case constants_1.DiscordRegexNames.MENTION_ROLE:
                {
                    result.id = match[1];
                }
                ;
                break;
            case constants_1.DiscordRegexNames.MENTION_USER:
                {
                    result.id = match[2];
                    result.mentionType = match[1];
                }
                ;
                break;
            case constants_1.DiscordRegexNames.TEXT_CODEBLOCK:
                {
                    result.language = match[2];
                    result.text = match[3];
                }
                ;
                break;
            case constants_1.DiscordRegexNames.TEXT_BOLD:
            case constants_1.DiscordRegexNames.TEXT_CODESTRING:
            case constants_1.DiscordRegexNames.TEXT_ITALICS:
            case constants_1.DiscordRegexNames.TEXT_SNOWFLAKE:
            case constants_1.DiscordRegexNames.TEXT_SPOILER:
            case constants_1.DiscordRegexNames.TEXT_STRIKE:
            case constants_1.DiscordRegexNames.TEXT_UNDERLINE:
            case constants_1.DiscordRegexNames.TEXT_URL:
                {
                    result.text = match[1];
                }
                ;
                break;
            default:
                {
                    throw new Error(`Unknown regex type: ${type}`);
                }
                ;
        }
        payload.matches.push(result);
        if (onlyFirst) {
            break;
        }
    }
    regex.lastIndex = 0;
    return payload;
}
exports.regex = regex;
function rgbToInt(r, g, b) {
    return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
}
exports.rgbToInt = rgbToInt;
function toCamelCase(value) {
    if (!value.includes('_')) {
        return value;
    }
    value = value
        .split('_')
        .map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
        .join('');
    return value.charAt(0).toLowerCase() + value.slice(1);
}
exports.toCamelCase = toCamelCase;

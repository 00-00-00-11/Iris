"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const iris_client_rest_1 = require("../../Iris-Client-Rest");
const baseset_1 = require("../collections/baseset");
const constants_1 = require("../constants");
const basestructure_1 = require("./basestructure");
const user_1 = require("./user");
const keysTemplate = new baseset_1.BaseSet([
    constants_1.DiscordKeys.CODE,
    constants_1.DiscordKeys.CREATED_AT,
    constants_1.DiscordKeys.CREATOR,
    constants_1.DiscordKeys.CREATOR_ID,
    constants_1.DiscordKeys.DESCRIPTION,
    constants_1.DiscordKeys.IS_DIRTY,
    constants_1.DiscordKeys.NAME,
    constants_1.DiscordKeys.SERIALIZED_SOURCE_GUILD,
    constants_1.DiscordKeys.SOURCE_GUILD_ID,
    constants_1.DiscordKeys.UPDATED_AT,
    constants_1.DiscordKeys.USAGE_COUNT,
]);
const keysMergeTemplate = new baseset_1.BaseSet([
    constants_1.DiscordKeys.SOURCE_GUILD_ID,
]);
/**
 * Guild Template Structure
 * @category Structure
 */
class Template extends basestructure_1.BaseStructure {
    constructor(client, data) {
        super(client);
        this._keys = keysTemplate;
        this._keysMerge = keysMergeTemplate;
        this.code = '';
        this.creatorId = '';
        this.description = '';
        this.isDirty = false;
        this.name = '';
        this.sourceGuildId = '';
        this.usageCount = 0;
        this.merge(data);
    }
    get createdAtUnix() {
        return this.createdAt.getTime();
    }
    get isUpdated() {
        return this.createdAt === this.updatedAt;
    }
    get longUrl() {
        return iris_client_rest_1.Endpoints.Template.LONG(this.code);
    }
    get updatedAtUnix() {
        return this.updatedAt.getTime();
    }
    get url() {
        return iris_client_rest_1.Endpoints.Template.SHORT(this.code);
    }
    delete() {
        return this.client.rest.deleteGuildTemplate(this.sourceGuildId, this.code);
    }
    fetch() {
        return this.client.rest.fetchTemplate(this.code);
    }
    mergeValue(key, value) {
        if (value !== undefined) {
            switch (key) {
                case constants_1.DiscordKeys.CREATED_AT:
                    {
                        value = new Date(value);
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.CREATOR:
                    {
                        let creator;
                        if (this.client.users.has(value.id)) {
                            creator = this.client.users.get(value.id);
                            creator.merge(value);
                        }
                        else {
                            creator = new user_1.User(this.client, value);
                        }
                        value = creator;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.IS_DIRTY:
                    {
                        value = !!value;
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.SERIALIZED_SOURCE_GUILD:
                    {
                    }
                    ;
                    break;
                case constants_1.DiscordKeys.UPDATED_AT:
                    {
                        value = new Date(value);
                    }
                    ;
                    break;
            }
            return super.mergeValue(key, value);
        }
    }
}
exports.Template = Template;

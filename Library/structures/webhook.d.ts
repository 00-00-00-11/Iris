import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseSet } from '../collections/baseset';
import { WebhookTypes } from '../constants';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Channel } from './channel';
import { Guild } from './guild';
import { User } from './user';
/**
 * Webhook Structure
 * @category Structure
 */
export declare class Webhook extends BaseStructure {
    readonly _keys: BaseSet<string>;
    avatar: null | string;
    channelId: string;
    discriminator: string;
    guildId: string;
    id: string;
    name: string;
    token?: null | string;
    type: WebhookTypes;
    user?: null | User;
    constructor(client: ShardClient, data: BaseStructureData);
    get avatarUrl(): string;
    get channel(): Channel | null;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get defaultAvatarUrl(): string;
    get guild(): Guild | null;
    get jumpLink(): string;
    get mention(): string;
    avatarUrlFormat(format?: string, query?: UrlQuery): string;
    createMessage(options: RequestTypes.ExecuteWebhook, compatibleType?: string): Promise<import("./message").Message | null>;
    delete(options?: RequestTypes.DeleteWebhook): Promise<any>;
    deleteMessage(messageId: string): Promise<any>;
    edit(options?: RequestTypes.EditWebhook): Promise<Webhook>;
    editMessage(messageId: string, options?: RequestTypes.EditWebhookTokenMessage): Promise<import("./message").Message>;
    execute(options: RequestTypes.ExecuteWebhook, compatibleType?: string): Promise<import("./message").Message | null>;
    mergeValue(key: string, value: any): void;
    toString(): string;
}

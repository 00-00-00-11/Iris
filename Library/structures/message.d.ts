import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { MessageTypes } from '../constants';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Application } from './application';
import { Attachment } from './attachment';
import { Channel } from './channel';
import { Guild } from './guild';
import { Member } from './member';
import { MessageEmbed } from './messageembed';
import { PresenceActivity } from './presence';
import { Reaction } from './reaction';
import { Role } from './role';
import { Sticker } from './sticker';
import { User } from './user';
/**
 * Channel Message Structure
 * @category Structure
 */
export declare class Message extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    readonly _keysSkipDifference: BaseSet<string>;
    _content: string;
    _attachments?: BaseCollection<string, Attachment>;
    _embeds?: BaseCollection<number, MessageEmbed>;
    _mentions?: BaseCollection<string, Member | User>;
    _mentionChannels?: BaseCollection<string, Channel>;
    _mentionRoles?: BaseCollection<string, null | Role>;
    _reactions?: BaseCollection<string, Reaction>;
    _stickers?: BaseCollection<string, Sticker>;
    activity?: MessageActivity;
    application?: Application;
    author: User;
    call?: MessageCall;
    channelId: string;
    content: string;
    deleted: boolean;
    editedTimestampUnix: number;
    flags: number;
    guildId?: string;
    id: string;
    member?: Member;
    mentionEveryone: boolean;
    messageReference?: MessageReference;
    nonce?: string;
    pinned: boolean;
    referencedMessage: Message | null;
    timestampUnix: number;
    tts: boolean;
    type: MessageTypes;
    webhookId?: string;
    constructor(client: ShardClient, data: BaseStructureData);
    get attachments(): BaseCollection<string, Attachment>;
    get canDelete(): boolean;
    get canManage(): boolean;
    get canReact(): boolean;
    get canReply(): boolean;
    get channel(): Channel | null;
    get createdAt(): Date;
    get createdAtUnix(): number;
    get editedAt(): Date | null;
    get editedAtUnix(): number;
    get editedTimestamp(): Date | null;
    get embeds(): BaseCollection<number, MessageEmbed>;
    get fromBot(): boolean;
    get fromMe(): boolean;
    get fromSystem(): boolean;
    get fromUser(): boolean;
    get fromWebhook(): boolean;
    get guild(): Guild | null;
    get hasAttachment(): boolean;
    get hasFlagCrossposted(): boolean;
    get hasFlagIsCrossposted(): boolean;
    get hasFlagSuppressEmbeds(): boolean;
    get inDm(): boolean;
    get isEdited(): boolean;
    get isReply(): boolean;
    get jumpLink(): string;
    get mentionHere(): boolean;
    get mentions(): BaseCollection<string, Member | User>;
    get mentionChannels(): BaseCollection<string, Channel>;
    get mentionRoles(): BaseCollection<string, null | Role>;
    get reactions(): BaseCollection<string, Reaction>;
    get stickers(): BaseCollection<string, Sticker>;
    get systemContent(): string;
    get timestamp(): Date;
    convertContent(options?: {
        escapeMentions?: boolean;
        guildSpecific?: boolean;
        nick?: boolean;
        text?: string;
    }): string;
    hasFlag(flag: number): boolean;
    ack(token: string): Promise<any>;
    crosspost(): Promise<Message>;
    delete(options?: RequestTypes.DeleteMessage): Promise<any>;
    deleteReaction(emoji: string, userId?: string): Promise<any>;
    deleteReactions(): Promise<any>;
    edit(options?: RequestTypes.EditMessage | string): Promise<Message>;
    fetchReactions(emoji: string, options?: RequestTypes.FetchReactions): Promise<BaseCollection<string, User>>;
    pin(): Promise<any>;
    publish(options: RequestTypes.CreateApplicationNews): Promise<import("./applicationnews").ApplicationNews>;
    react(emoji: string): Promise<any>;
    removeMention(): Promise<any>;
    reply(options?: RequestTypes.CreateMessage | string): Promise<Message>;
    suppressEmbeds(suppress?: boolean): Promise<any>;
    triggerTyping(): Promise<any>;
    unpin(): Promise<any>;
    difference(key: string, value: any): [boolean, any];
    mergeValue(key: string, value: any): void;
    toString(): string;
}
/**
 * Channel Message Activity Structure, used for inviting people to listen/join
 * @category Structure
 */
export declare class MessageActivity extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly message: Message;
    coverImage: null | string;
    name: null | string;
    partyId: string;
    type: number;
    constructor(message: Message, data: BaseStructureData);
    get activity(): null | PresenceActivity;
    get group(): BaseCollection<string, User>;
}
/**
 * Channel Message Call Structure, used to define the call properties in the DM it's from
 * Used to format the content
 * @category Structure
 */
export declare class MessageCall extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly message: Message;
    endedTimestamp: Date | null;
    participants: Array<string>;
    constructor(message: Message, data: BaseStructureData);
    get duration(): number;
    get isEnded(): boolean;
    mergeValue(key: string, value: any): void;
}
/**
 * Channel Message Reference Structure, used to tell the client that this is from a server webhook or a reply
 * Used for crossposts
 * @category Structure
 */
export declare class MessageReference extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly parent: Message;
    channelId: string;
    guildId?: string;
    messageId?: string;
    constructor(message: Message, data: BaseStructureData);
    get channel(): null | Channel;
    get guild(): null | Guild;
    get message(): null | Message;
}
export declare function messageSystemContent(message: Message, text?: string): string;

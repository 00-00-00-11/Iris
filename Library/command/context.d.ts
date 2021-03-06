import { RequestTypes } from '../../Iris-Client-Rest';
import { Timers } from '../../Iris-Utils';
import { ShardClient } from '../client';
import { ClusterClient } from '../clusterclient';
import { ClusterProcessChild } from '../cluster/processchild';
import { CommandClient } from '../commandclient';
import { Message, Typing } from '../structures';
import { Command } from './command';
export declare type EditOrCreate = RequestTypes.CreateMessage & RequestTypes.EditMessage;
export interface EditOrReply extends EditOrCreate {
    delete?: boolean;
}
/**
 * Command Context
 * @category Command
 */
export declare class Context {
    readonly client: ShardClient;
    readonly commandClient: CommandClient;
    readonly message: Message;
    readonly typing: Typing | null;
    command?: Command;
    metadata?: {
        [key: string]: any;
    };
    prefix?: string;
    typingTimeout?: Timers.Timeout;
    constructor(message: Message, typing: Typing | null, commandClient: CommandClient);
    get application(): import("../structures").Oauth2Application | null;
    get cluster(): ClusterClient | null;
    get gateway(): import("detritus-client-socket/lib/gateway").Socket;
    get manager(): ClusterProcessChild | null;
    get owners(): import("detritus-utils").BaseCollection<string, import("../structures").User>;
    get rest(): import("../rest").RestClient;
    get shardCount(): number;
    get shardId(): number;
    get response(): Message | null;
    get applications(): import("../collections").Applications;
    get channels(): import("../collections").Channels;
    get emojis(): import("../collections").Emojis;
    get guilds(): import("../collections").Guilds;
    get members(): import("../collections").Members;
    get messages(): import("../collections").Messages;
    get notes(): import("../collections").Notes;
    get presences(): import("../collections").Presences;
    get relationships(): import("../collections").Relationships;
    get roles(): import("../collections").Roles;
    get sessions(): import("../collections").Sessions;
    get typings(): import("../collections").TypingCollection;
    get users(): import("../collections").Users;
    get voiceCalls(): import("../collections").VoiceCalls;
    get voiceConnections(): import("../collections").VoiceConnections;
    get voiceStates(): import("../collections").VoiceStates;
    get canDelete(): boolean;
    get canManage(): boolean;
    get canReact(): boolean;
    get canReply(): boolean;
    get channel(): import("../structures").ChannelBase | import("../structures").ChannelDM | import("../structures").ChannelGuildVoice | import("../structures").ChannelDMGroup | import("../structures").ChannelGuildBase | import("../structures").ChannelGuildCategory | import("../structures").ChannelGuildText | import("../structures").ChannelGuildStore | null;
    get channelId(): string;
    get content(): string;
    get fromBot(): boolean;
    get fromSystem(): boolean;
    get fromUser(): boolean;
    get fromWebhook(): boolean;
    get guild(): import("../structures").Guild | null;
    get guildId(): string | undefined;
    get inDm(): boolean;
    get me(): import("../structures").Member | null;
    get member(): import("../structures").Member | undefined;
    get messageId(): string;
    get systemContent(): string;
    get user(): import("../structures").User;
    get userId(): string;
    get voiceChannel(): import("../structures").ChannelGuildVoice | null;
    get voiceConnection(): import("../media/voiceconnection").VoiceConnection | undefined;
    get voiceState(): import("../structures").VoiceState | null;
    editOrReply(options?: EditOrReply | string): Promise<Message>;
    reply(options?: RequestTypes.CreateMessage | string): Promise<Message>;
    triggerTyping(): Promise<any>;
    toJSON(): Message;
    toString(): string;
}

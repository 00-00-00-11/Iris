import { RequestTypes } from '../../Iris-Client-Rest';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { ShardClient } from '../client';
import { ImageFormats } from '../constants';
import { UrlQuery } from '../utils';
import { BaseStructure, BaseStructureData } from './basestructure';
import { Guild } from './guild';
import { Role } from './role';
import { User } from './user';
/**
 * Emoji Structure
 * @category Structure
 */
export declare class Emoji extends BaseStructure {
    readonly _keys: BaseSet<string>;
    readonly _keysMerge: BaseSet<string>;
    _roles?: BaseCollection<string, null | Role>;
    animated: boolean;
    available?: boolean;
    guildId?: string;
    id: null | string;
    managed?: boolean;
    name: string;
    requireColons?: boolean;
    user?: User;
    constructor(client: ShardClient, data: BaseStructureData);
    get createdAt(): Date | null;
    get createdAtUnix(): null | number;
    get endpointFormat(): string;
    get format(): string;
    get guild(): Guild | null;
    get roles(): BaseCollection<string, null | Role>;
    get url(): string;
    urlFormat(format?: ImageFormats | null, query?: UrlQuery): string;
    edit(options: RequestTypes.EditGuildEmoji): Promise<Emoji>;
    delete(options?: RequestTypes.DeleteGuildEmoji): Promise<any>;
    fetchData(options?: {
        format?: ImageFormats | null;
        query?: UrlQuery;
    }): Promise<any>;
    mergeValue(key: string, value: any): void;
    toString(): string;
    toJSON(withRoles?: boolean): any;
}

import { RequestTypes } from '../../Iris-Client-Rest';
import { ShardClient } from '../client';
import { BaseCollection } from '../collections/basecollection';
import { BaseSet } from '../collections/baseset';
import { TeamMembershipStates, TeamPayoutAccountStatuses } from '../constants';
import { BaseStructure, BaseStructureData } from './basestructure';
import { User, UserMixin } from './user';
/**
 * Team Structure
 * an application's team
 * @category Structure
 */
export declare class Team extends BaseStructure {
    readonly _keys: BaseSet<string>;
    icon: null | string;
    id: string;
    members: BaseCollection<string, TeamMember>;
    name: string;
    ownerUserId: string;
    payoutAccountStatus?: TeamPayoutAccountStatuses;
    constructor(client: ShardClient, data: BaseStructureData);
    get createdAt(): Date;
    get createdAtUnix(): number;
    get owner(): null | TeamMember;
    addMember(options: RequestTypes.AddTeamMember): Promise<any>;
    edit(options?: RequestTypes.EditTeam): Promise<any>;
    fetch(): Promise<Team>;
    fetchApplications(): Promise<any>;
    fetchMembers(): Promise<BaseCollection<string, TeamMember>>;
    fetchMember(userId: string): Promise<TeamMember>;
    fetchPayouts(options?: RequestTypes.FetchTeamPayouts): Promise<any>;
    delete(options?: RequestTypes.DeleteTeam): Promise<any>;
    removeTeamMember(userId: string): Promise<any>;
    mergeValue(key: string, value: any): void;
}
/**
 * Team Member Structure
 * an application's team member
 * @category Structure
 */
export declare class TeamMember extends UserMixin {
    readonly _keys: BaseSet<string>;
    membershipState: TeamMembershipStates;
    permissions: BaseSet<string>;
    teamId: string;
    user: User;
    constructor(client: ShardClient, data: BaseStructureData);
    get accepted(): boolean;
    get invited(): boolean;
    fetch(): Promise<this>;
    fetchTeam(): Promise<Team>;
    remove(): Promise<any>;
    transferOwnership(options?: {
        code?: string;
    }): Promise<any>;
    mergeValue(key: string, value: any): void;
}

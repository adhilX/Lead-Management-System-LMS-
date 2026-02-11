import { IBaseRepo } from './Ibase.repo';
import { ILead } from '../../entity/lead.entity';

export interface ILeadRepo extends IBaseRepo<ILead> {
    findAllLeads(filter: any, options: any): Promise<{ leads: ILead[]; total: number }>;
    getStats(filter: any): Promise<any>;
}

import { ILead } from '../../entity/lead.entity';

export interface ILeadService {
    createLead(userId: string, data: Partial<ILead>): Promise<ILead>;
    getLeads(userId: string, query: any): Promise<{ leads: ILead[]; total: number; page: number; totalPages: number }>;
    getLead(userId: string, leadId: string): Promise<ILead>;
    updateLead(userId: string, leadId: string, data: Partial<ILead>): Promise<ILead>;
    deleteLead(userId: string, leadId: string): Promise<boolean>;
    getStats(userId: string, query: any): Promise<any>;
}

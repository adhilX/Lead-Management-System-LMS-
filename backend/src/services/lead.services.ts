import { ILeadService } from '../interfaces/Iservice/ILead.service';
import { ILeadRepo } from '../interfaces/Irepo/Ilead.repo';
import { ILead } from '../entity/lead.entity';

export class LeadService implements ILeadService {
    constructor(private leadRepo: ILeadRepo) { }

    async createLead(userId: string, data: Partial<ILead>): Promise<ILead> {
        if (!data.name || !data.phone || !data.source || !data.status) {
            throw new Error('Missing required fields');
        }
        return await this.leadRepo.create({ ...data, createdBy: userId } as any);
    }

    async getLeads(userId: string, query: any): Promise<{ data: ILead[]; pagination: { total: number; page: number; totalPages: number } }> {
        let { page = 1, limit = 10, sort, ...filter } = query;

        limit = Math.min(Number(limit), 100);

        let sortObj: any = { createdAt: -1 };
        if (sort) {
            const [field, order] = sort.split(':');
            sortObj = { [field]: order === 'desc' ? -1 : 1 };
        }

        const options = { page, limit, sort: sortObj, ...filter };
        const repoFilter = { createdBy: userId };

        const { leads, total } = await this.leadRepo.findAllLeads(repoFilter, options);

        return {
            data: leads,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
            }
        };
    }

    async getLead(userId: string, leadId: string): Promise<ILead> {
        const lead = await this.leadRepo.findById(leadId);
        if (!lead) {
            throw new Error('Lead not found');
        }
        if (lead.createdBy.toString() !== userId) {
            throw new Error('Not authorized to view this lead');
        }
        return lead;
    }

    async updateLead(userId: string, leadId: string, data: Partial<ILead>): Promise<ILead> {
        await this.getLead(userId, leadId);

        const updatedLead = await this.leadRepo.update(leadId, data);
        if (!updatedLead) {
            throw new Error('Lead not found or update failed');
        }
        return updatedLead;
    }

    async deleteLead(userId: string, leadId: string): Promise<boolean> {
        await this.getLead(userId, leadId);
        return await this.leadRepo.delete(leadId);
    }

    async getStats(userId: string, query: any): Promise<any> {
        const filter = { createdBy: userId, ...query };
        const stats = await this.leadRepo.getStats(filter);
        return stats[0] || { totalLeads: 0, byStatus: {}, bySource: {} };
    }
}

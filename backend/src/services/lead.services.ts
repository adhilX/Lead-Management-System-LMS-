import { ILeadService } from '../interfaces/Iservice/ILead.service';
import { ILeadRepo } from '../interfaces/Irepo/Ilead.repo';
import { ILead } from '../entity/lead.entity';
import ResponseError from '../utils/responseError';
import { STATUS_CODES } from '../constants/statusCodes';

export class LeadService implements ILeadService {
    constructor(private leadRepo: ILeadRepo) { }

    async createLead(userId: string, data: Partial<ILead>): Promise<ILead> {
        if (!data.name || !data.phone || !data.source || !data.status) {
            // Basic validation, detailed validation can be in middleware or here
            throw new ResponseError('Missing required fields', STATUS_CODES.BAD_REQUEST);
        }
        return await this.leadRepo.create({ ...data, createdBy: userId } as any);
    }

    async getLeads(userId: string, query: any): Promise<{ leads: ILead[]; total: number; page: number; totalPages: number }> {
        const { page = 1, limit = 10, sort, ...filter } = query;

        // Convert 'field:order' string to object { field: order } for Mongoose
        let sortObj: any = { createdAt: -1 };
        if (sort) {
            const [field, order] = sort.split(':');
            sortObj = { [field]: order === 'desc' ? -1 : 1 };
        }

        const options = { page, limit, sort: sortObj, ...filter }; // pass remaining filter params like q, status, etc.
        const repoFilter = { createdBy: userId }; // Ensure scoping to user

        const { leads, total } = await this.leadRepo.findAllLeads(repoFilter, options);

        return {
            leads,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }

    async getLead(userId: string, leadId: string): Promise<ILead> {
        const lead = await this.leadRepo.findById(leadId);
        if (!lead) {
            throw new ResponseError('Lead not found', STATUS_CODES.NOT_FOUND);
        }
        if (lead.createdBy.toString() !== userId) {
            throw new ResponseError('Not authorized to view this lead', STATUS_CODES.FORBIDDEN);
        }
        return lead;
    }

    async updateLead(userId: string, leadId: string, data: Partial<ILead>): Promise<ILead> {
        // Check ownership first
        await this.getLead(userId, leadId);

        const updatedLead = await this.leadRepo.update(leadId, data);
        if (!updatedLead) {
            throw new ResponseError('Lead not found or update failed', STATUS_CODES.NOT_FOUND);
        }
        return updatedLead;
    }

    async deleteLead(userId: string, leadId: string): Promise<boolean> {
        // Check ownership first
        await this.getLead(userId, leadId);
        return await this.leadRepo.delete(leadId);
    }

    async getStats(userId: string, query: any): Promise<any> {
        const filter = { createdBy: userId, ...query };
        const stats = await this.leadRepo.getStats(filter);
        return stats[0] || { totalLeads: 0, byStatus: {}, bySource: {} };
    }
}

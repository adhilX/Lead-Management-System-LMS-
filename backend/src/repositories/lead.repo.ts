import { BaseRepository } from './base.repo';
import { mongo } from 'mongoose';
import { ILead } from '../entity/lead.entity';
import { ILeadRepo } from '../interfaces/Irepo/Ilead.repo';
import Lead from '../models/lead.model';

export class LeadRepository extends BaseRepository<ILead> implements ILeadRepo {
    constructor() {
        super(Lead);
    }

    async findAllLeads(filter: any, options: any): Promise<{ leads: ILead[]; total: number }> {
        const { page = 1, limit = 10, sort = { createdAt: -1 }, ...query } = options;
        const skip = (page - 1) * limit;

        // Build Mongoose Filter
        const mongooseFilter: any = { ...filter };

        // Search query (name, email, phone)
        if (query.q) {
            const regex = new RegExp(query.q, 'i');
            mongooseFilter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
        }

        // Exact filters
        if (query.status) mongooseFilter.status = query.status;
        if (query.source) mongooseFilter.source = query.source;

        // Date Range Filter
        if (query.createdFrom || query.createdTo) {
            mongooseFilter.createdAt = {};
            if (query.createdFrom) mongooseFilter.createdAt.$gte = new Date(query.createdFrom);
            if (query.createdTo) mongooseFilter.createdAt.$lte = new Date(query.createdTo);
        }

        const [leads, total] = await Promise.all([
            this._model.find(mongooseFilter).sort(sort).skip(skip).limit(Number(limit)).exec(),
            this._model.countDocuments(mongooseFilter),
        ]);

        return { leads, total };
    }

    async getStats(filter: any): Promise<any> {
        const mongooseFilter: any = { ...filter };

        // Ensure createdBy is an ObjectId for aggregation
        if (mongooseFilter.createdBy && typeof mongooseFilter.createdBy === 'string') {
            mongooseFilter.createdBy = new mongo.ObjectId(mongooseFilter.createdBy);
        }

        // Apply date filters if present (reusing logic or passing pre-built filter)
        if (filter.createdFrom || filter.createdTo) {
            mongooseFilter.createdAt = {};
            if (filter.createdFrom) mongooseFilter.createdAt.$gte = new Date(filter.createdFrom);
            if (filter.createdTo) mongooseFilter.createdAt.$lte = new Date(filter.createdTo);
            // Remove raw strings from filter to avoid query errors if they exist
            delete mongooseFilter.createdFrom;
            delete mongooseFilter.createdTo;
        }

        return await this._model.aggregate([
            { $match: mongooseFilter },
            {
                $facet: {
                    totalLeads: [{ $count: 'count' }],
                    byStatus: [
                        { $group: { _id: '$status', count: { $sum: 1 } } },
                    ],
                    bySource: [
                        { $group: { _id: '$source', count: { $sum: 1 } } },
                    ],
                },
            },
            {
                $project: {
                    totalLeads: { $arrayElemAt: ['$totalLeads.count', 0] },
                    byStatus: {
                        $arrayToObject: {
                            $map: {
                                input: '$byStatus',
                                as: 'status',
                                in: { k: '$$status._id', v: '$$status.count' },
                            },
                        },
                    },
                    bySource: {
                        $arrayToObject: {
                            $map: {
                                input: '$bySource',
                                as: 'source',
                                in: { k: '$$source._id', v: '$$source.count' },
                            },
                        },
                    },
                },
            },
        ]);
    }
}

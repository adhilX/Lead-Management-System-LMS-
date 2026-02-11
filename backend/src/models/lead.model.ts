import mongoose, { Schema } from 'mongoose';
import { ILead, LeadSource, LeadStatus } from '../entity/lead.entity';

const LeadSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        source: {
            type: String,
            enum: Object.values(LeadSource),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(LeadStatus),
            default: LeadStatus.NEW,
        },
        notes: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ILead>('Lead', LeadSchema);

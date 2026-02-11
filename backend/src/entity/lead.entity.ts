import { Document, Types } from 'mongoose';

export enum LeadStatus {
    NEW = 'new',
    CONTACTED = 'contacted',
    QUALIFIED = 'qualified',
    WON = 'won',
    LOST = 'lost',
}

export enum LeadSource {
    WEBSITE = 'website',
    REFERRAL = 'referral',
    COLD = 'cold',
}

export interface ILead extends Document {
    name: string;
    email?: string;
    phone: string;
    source: LeadSource;
    status: LeadStatus;
    notes?: string;
    createdBy: Types.ObjectId; // Reference to User
    createdAt: Date;
    updatedAt: Date;
}

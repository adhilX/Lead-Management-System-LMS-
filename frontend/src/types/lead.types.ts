export const LeadStatus = {
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    WON: 'won',
    LOST: 'lost',
} as const;

export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export const LeadSource = {
    WEBSITE: 'website',
    REFERRAL: 'referral',
    COLD: 'cold',
} as const;

export type LeadSource = typeof LeadSource[keyof typeof LeadSource];

export interface ILead {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    source: LeadSource;
    status: LeadStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadFilters {
    page: number;
    limit: number;
    q?: string;
    status?: string;
    source?: string;
    sort?: string;
}

export interface LeadState {
    leads: ILead[];
    total: number;
    page: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    stats: any;
}

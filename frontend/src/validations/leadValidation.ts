import { z } from 'zod';

// Phone number validation regex (supports various formats)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export const leadFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),

    email: z
        .string()
        .min(1, 'Email is required')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Invalid email address'
        }),

    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(phoneRegex, 'Invalid phone number format'),

    source: z.enum(['website', 'referral', 'cold']),

    status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost']),

    notes: z
        .string()
        .max(500, 'Notes must not exceed 500 characters')
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { STATUS_CODES } from '../constants/statusCodes';

const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export const leadSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z.string()
        .email('Invalid email address')
        .optional()
        .or(z.literal('')),
    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number format'),
    source: z.enum(['website', 'referral', 'cold'], {
        message: "Source must be 'website', 'referral', or 'cold'"
    }),
    status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost'], {
        message: "Status must be 'new', 'contacted', 'qualified', 'won', 'lost'"
    }).optional(),
    notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
});

export const validateLead = (req: Request, res: Response, next: NextFunction): void => {
    try {
        leadSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue: z.ZodIssue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'Validation failed',
                errors: errorMessages
            });
            return;
        }
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

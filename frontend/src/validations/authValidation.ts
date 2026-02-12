import { z } from 'zod';

// Phone number validation regex (supports various formats)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// Login validation schema
export const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'Invalid email address'
        }),

    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
});

// Register validation schema
export const registerFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
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

    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;

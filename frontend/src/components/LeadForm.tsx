import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadService } from '../services/leadService';
import { type ILead, LeadStatus, LeadSource } from '../types/lead.types';
import { leadFormSchema, type LeadFormData } from '../validations/leadValidation';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadFormProps {
    existingLead?: ILead;
    onClose: () => void;
    onSuccess: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ existingLead, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        mode: 'onChange', // Validate on change for better UX
        reValidateMode: 'onChange', // Re-validate on change after first submit
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            source: LeadSource.WEBSITE,
            status: LeadStatus.NEW,
            notes: '',
        }
    });

    useEffect(() => {
        if (existingLead) {
            reset({
                name: existingLead.name,
                email: existingLead.email || '',
                phone: existingLead.phone,
                source: existingLead.source,
                status: existingLead.status,
                notes: existingLead.notes || '',
            }, {
                keepDefaultValues: false,
            });
        }
    }, [existingLead, reset]);

    const onSubmit = async (data: LeadFormData) => {
        try {
            // Validation ensures source/status are valid enum values, so safe to cast
            const leadData = data as Partial<ILead>;

            if (existingLead && existingLead._id) {
                await leadService.updateLead(existingLead._id, leadData);
                toast.success('Lead updated successfully');
            } else {
                await leadService.createLead(leadData);
                toast.success('Lead created successfully');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save lead');
        }
    };

    return (
        <div className="fixed inset-0  overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed z-[-1] inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold leading-6 text-slate-900" id="modal-headline">
                                {existingLead ? 'Edit Lead' : 'Add New Lead'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm ${errors.name ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Jane Doe"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm ${errors.email ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                        placeholder="jane@example.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm ${errors.phone ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                                    <select
                                        {...register('source')}
                                        className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm bg-white ${errors.source ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    >
                                        {Object.values(LeadSource).map((src) => (
                                            <option key={src} value={src}>{src}</option>
                                        ))}
                                    </select>
                                    {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        {...register('status')}
                                        className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm bg-white ${errors.status ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    >
                                        {Object.values(LeadStatus).map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm ${errors.notes ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Add any additional notes about this lead..."
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-white py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="-ml-1 mr-2 h-4 w-4" />
                                            Save Lead
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadForm;

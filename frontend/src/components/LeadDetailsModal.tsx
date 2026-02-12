import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Mail, Phone, User, FileText, Globe, Clock, Edit2 } from 'lucide-react';
import { type ILead, LeadStatus } from '../types/lead.types';

interface LeadDetailsModalProps {
    lead: ILead | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (lead: ILead) => void;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, isOpen, onClose, onEdit }) => {
    if (!isOpen || !lead) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case LeadStatus.NEW: return 'bg-blue-100 text-blue-800 border-blue-200';
            case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case LeadStatus.QUALIFIED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case LeadStatus.WON: return 'bg-green-100 text-green-800 border-green-200';
            case LeadStatus.LOST: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return createPortal(
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed z-[-1] inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">

                    {/* Header */}
                    <div className="bg-slate-50 px-4 py-4 sm:px-6 flex justify-between items-center border-b border-slate-100">
                        <h3 className="text-lg font-bold leading-6 text-slate-900 flex items-center gap-2" id="modal-title">
                            <User className="w-5 h-5 text-slate-500" />
                            Lead Details
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-4 py-5 sm:p-6 space-y-6">
                        {/* Status & Basic Info */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{lead.name}</h2>
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${getStatusColor(lead.status)} uppercase tracking-wide`}>
                                        {lead.status}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    Created: {new Date(lead.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    Contact Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Email</p>
                                            <p className="text-sm text-slate-900 break-all">{lead.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            <Phone className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Phone</p>
                                            <p className="text-sm text-slate-900">{lead.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    Lead Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            <Globe className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Source</p>
                                            <p className="text-sm text-slate-900 capitalize">{lead.source}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Last Updated</p>
                                            <p className="text-sm text-slate-900">{formatDate(lead.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-slate-500" />
                                Notes
                            </h4>
                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                                {lead.notes ? lead.notes : <span className="text-slate-400 italic">No notes available.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-4 py-4 sm:px-6 flex flex-row-reverse gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-lg border border-transparent bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:w-auto sm:text-sm items-center gap-2"
                            onClick={() => onEdit(lead)}
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Lead
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LeadDetailsModal;

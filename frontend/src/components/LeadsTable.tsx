import { Edit2, Trash2, Phone, Mail, Calendar, Search } from 'lucide-react';
import type { ILead } from '../types/lead.types';

interface LeadsTableProps {
    leads: ILead[];
    loading: boolean;
    onRowClick: (lead: ILead) => void;
    onEdit: (lead: ILead) => void;
    onDelete: (id: string) => void;
    getStatusColor: (status: string) => string;
}

const LeadsTable = ({ leads, loading, onRowClick, onEdit, onDelete, getStatusColor }: LeadsTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    ) : leads.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-900">No leads found</p>
                                    <p className="text-slate-500 mt-1">Try adjusting your filters or add a new lead.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        leads.map((lead) => (
                            <tr
                                key={lead._id}
                                className="hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => onRowClick(lead)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-slate-900">{lead.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        {lead.email && (
                                            <div className="text-sm text-slate-600 flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-slate-400" />
                                                {lead.email}
                                            </div>
                                        )}
                                        <div className="text-sm text-slate-600 flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            {lead.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <span className="capitalize">{lead.source}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { onEdit(lead); }}
                                            className="p-1 text-black hover:bg-gray-100 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(lead._id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LeadsTable;

import { Search, Filter, Plus, X } from 'lucide-react';
import { LeadSource, LeadStatus } from '../types/lead.types';

interface LeadsFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filters: {
        status: string;
        source: string;
        q: string;
    };
    onFilterChange: (filters: { status: string; source: string; q: string }) => void;
    onClearFilters: () => void;
    onAddLead: () => void;
}

const LeadsFilters = ({ searchQuery, onSearchChange, filters, onFilterChange, onClearFilters, onAddLead }: LeadsFiltersProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex flex-1 gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="relative w-32 sm:w-40">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
                        value={filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                    >
                        <option value="">Status</option>
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="relative w-32 sm:w-40 hidden sm:block">
                    <select
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
                        value={filters.source}
                        onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
                    >
                        <option value="">Source</option>
                        {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {(filters.status || filters.source || filters.q) && (
                    <button
                        onClick={onClearFilters}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        title="Clear Filters"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            <button
                onClick={onAddLead}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto font-medium shadow-sm hover:shadow"
            >
                <Plus className="w-5 h-5" />
                Add Lead
            </button>
        </div>
    );
};

export default LeadsFilters;

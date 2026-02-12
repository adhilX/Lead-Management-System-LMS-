import { Users, UserPlus, CheckCircle, TrendingUp } from 'lucide-react';
import { LeadStatus } from '../types/lead.types';

interface StatsGridProps {
    stats: any;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Leads</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalLeads || 0}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">New Leads</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.byStatus?.[LeadStatus.NEW] || 0}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <UserPlus className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Qualified</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.byStatus?.[LeadStatus.QUALIFIED] || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {stats?.totalLeads > 0
                                ? Math.round(((stats?.byStatus?.[LeadStatus.WON] || 0) / stats.totalLeads) * 100)
                                : 0}%
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsGrid;

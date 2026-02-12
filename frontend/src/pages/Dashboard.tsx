import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leadService } from '../services/leadService';
import type { RootState, AppDispatch } from '../redux/store';
import { LeadSource, LeadStatus, type ILead } from '../types/lead.types';
import LeadForm from '../components/LeadForm';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import {
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Filter,
    Users,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    UserPlus,
    CheckCircle,
    Phone,
    Mail,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    // Local State
    const [leads, setLeads] = useState<ILead[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters State
    const [filters, setFilters] = useState({
        status: '',
        source: '',
        q: '',
    });

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingLead, setEditingLead] = useState<ILead | undefined>(undefined);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [leadsData, statsData] = await Promise.all([
                leadService.getLeads({ page, limit: 10, ...filters }),
                leadService.getStats()
            ]);

            setLeads(leadsData.leads);
            setTotalPages(leadsData.totalPages);
            setStats(statsData);
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await leadService.deleteLead(id);
                toast.success('Lead deleted successfully');
                loadData(); // Refresh
            } catch (err) {
                console.error("Delete failed", err);
                toast.error("Failed to delete lead");
            }
        }
    };

    const handleEdit = (lead: ILead) => {
        setEditingLead(lead);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingLead(undefined);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingLead(undefined);
    };

    const handleFormSuccess = () => {
        loadData();
    };


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case LeadStatus.NEW: return 'bg-blue-100 text-blue-800';
            case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-800';
            case LeadStatus.QUALIFIED: return 'bg-indigo-100 text-indigo-800';
            case LeadStatus.WON: return 'bg-green-100 text-green-800';
            case LeadStatus.LOST: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800 text-gray-300">
                <div className="flex items-center justify-center h-16 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-white" />
                        Lead CRM
                    </h1>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        <li>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg transition-colors">
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center md:hidden">
                        <h1 className="text-xl font-bold text-slate-900">Lead CRM</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Stats Grid */}
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

                        {/* Actions Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex flex-1 gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search leads..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={filters.q}
                                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                    />
                                </div>
                                <div className="relative w-32 sm:w-40">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    >
                                        <option value="">Status</option>
                                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="relative w-32 sm:w-40 hidden sm:block">
                                    <select
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
                                        value={filters.source}
                                        onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                    >
                                        <option value="">Source</option>
                                        {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleAdd}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto font-medium shadow-sm hover:shadow"
                            >
                                <Plus className="w-5 h-5" />
                                Add Lead
                            </button>
                        </div>

                        {/* Leads Table */}
                        <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
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
                                                <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
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
                                                            <button onClick={() => handleEdit(lead)} className="p-1 text-black hover:bg-gray-100 rounded transition-colors" title="Edit">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(lead._id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-slate-700">
                                                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(page - 1)}
                                                    disabled={page === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(page + 1)}
                                                    disabled={page === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

            </div>

            {/* Lead Form Modal - Moved to root level to avoid clipping */}
            {showForm && (
                <LeadForm
                    existingLead={editingLead}
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default Dashboard;

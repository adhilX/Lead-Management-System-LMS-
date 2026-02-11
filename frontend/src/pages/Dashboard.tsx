import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leadService } from '../services/leadService';
import type { RootState, AppDispatch } from '../redux/store';
import { LeadSource, LeadStatus, type ILead } from '../types/lead.types';
import LeadForm from '../components/LeadForm';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    // Local State
    const [leads, setLeads] = useState<ILead[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load data');
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
                loadData(); // Refresh
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete lead");
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
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Lead CRM</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, {user?.name}</span>
                            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500 text-sm">Total Leads</h3>
                        <p className="text-2xl font-bold">{stats?.totalLeads || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500 text-sm">New</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats?.byStatus?.[LeadStatus.NEW] || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500 text-sm">Qualified</h3>
                        <p className="text-2xl font-bold text-green-600">{stats?.byStatus?.[LeadStatus.QUALIFIED] || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500 text-sm">Won</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats?.byStatus?.[LeadStatus.WON] || 0}</p>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="border rounded px-3 py-2 w-full md:w-64"
                            value={filters.q}
                            onChange={(e) => setFilters({ ...filters, q: e.target.value, status: filters.status /* keep other filters */ })} // React state update needs careful merge if not using ...filters spread correctly in onChange context, here cleaner to just spread prev if using callback, or just ...filters. Wait, `setFilters({ ...filters, q: ... })` is correct.
                        />
                        <select
                            className="border rounded px-3 py-2"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                            className="border rounded px-3 py-2"
                            value={filters.source}
                            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                        >
                            <option value="">All Sources</option>
                            {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
                    >
                        + Add Lead
                    </button>
                </div>

                {/* Leads Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {loading && leads.length === 0 ? (
                        <div className="p-8 text-center">Loading...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-gray-500 text-sm">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lead.email}</div>
                                                <div className="text-sm text-gray-500">{lead.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${lead.status === LeadStatus.NEW ? 'bg-blue-100 text-blue-800' :
                                                        lead.status === LeadStatus.WON ? 'bg-green-100 text-green-800' :
                                                            lead.status === LeadStatus.LOST ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {lead.source}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleEdit(lead)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No leads found. Create one to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Lead Form Modal */}
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

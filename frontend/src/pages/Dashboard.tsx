import { useEffect, useState, useCallback } from 'react';
import { leadService } from '../services/leadService';
import { LeadStatus, type ILead } from '../types/lead.types';
import LeadForm from '../components/LeadForm';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import LeadDetailsModal from '../components/LeadDetailsModal';
import Pagination from '../components/Pagination';
import LeadsTable from '../components/LeadsTable';
import LeadsFilters from '../components/LeadsFilters';

import useDebounce from '../hooks/useDebounce';
import StatsGrid from '../components/StatsGrid';

const Dashboard = () => {

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

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Update filters when debounced query changes
    useEffect(() => {
        setFilters(prev => ({ ...prev, q: debouncedSearchQuery }));
        setPage(1); // Reset page on search
    }, [debouncedSearchQuery]);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingLead, setEditingLead] = useState<ILead | undefined>(undefined);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [leadsData, statsData] = await Promise.all([
                leadService.getLeads({ page, limit: 5, ...filters }),
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


    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; leadId: string | null }>({
        isOpen: false,
        leadId: null
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDeleteClick = (id: string) => {
        setConfirmModal({ isOpen: true, leadId: id });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.leadId) return;

        try {
            await leadService.deleteLead(confirmModal.leadId);
            toast.success('Lead deleted successfully');
            loadData(); // Refresh
            setConfirmModal({ isOpen: false, leadId: null });
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete lead");
        }
    };

    // Lead Details Modal State
    const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleRowClick = (lead: ILead) => {
        setSelectedLead(lead);
        setShowDetails(true);
    };

    const handleEdit = (lead: ILead) => {
        setShowDetails(false);
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
        <div className="space-y-6">
            {/* Stats Grid */}
            <StatsGrid stats={stats} />
            {/* Actions Bar */}
            <LeadsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => {
                    setFilters({ status: '', source: '', q: '' });
                    setSearchQuery('');
                }}
                onAddLead={handleAdd}
            />

            {/* Leads Table */}
            <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
                <LeadsTable
                    leads={leads}
                    loading={loading}
                    onRowClick={handleRowClick}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    getStatusColor={getStatusColor}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Lead Form Modal */}
            {showForm && (
                <LeadForm
                    existingLead={editingLead}
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title="Delete Lead"
                message="Are you sure you want to delete this lead? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Lead Details Modal */}
            <LeadDetailsModal
                isOpen={showDetails}
                lead={selectedLead}
                onClose={() => setShowDetails(false)}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default Dashboard;


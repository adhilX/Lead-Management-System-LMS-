import api from '../axios/axiosInstance';
import type { ILead, LeadFilters } from '../types/lead.types';

export const leadService = {
    getLeads: async (filters: LeadFilters) => {
        const response = await api.get('/leads', { params: filters });
        return response.data;
    },

    createLead: async (data: Partial<ILead>) => {
        const response = await api.post('/leads', data);
        return response.data.lead;
    },

    updateLead: async (id: string, data: Partial<ILead>) => {
        const response = await api.patch(`/leads/${id}`, data);
        return response.data.lead;
    },

    deleteLead: async (id: string) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/leads/stats/summary');
        return response.data;
    },
};  

import axiosInstance from '../lib/axios';

export const adminApi = {
    getAnalytics: async () => {
        const response = await axiosInstance.get('/admin/analytics');
        return response.data;
    },
    getUsers: async (page = 1, search = '') => {
        const response = await axiosInstance.get(`/admin/users?page=${page}&search=${search}`);
        return response.data;
    },
    updateUserRole: async (userId, role) => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
        return response.data;
    },
    toggleBan: async (userId, banned) => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/ban`, { banned });
        return response.data;
    },
    deleteUser: async (userId) => {
        const response = await axiosInstance.delete(`/admin/users/${userId}`);
        return response.data;
    },
    getSessions: async () => {
        const response = await axiosInstance.get('/admin/sessions');
        return response.data;
    },
    getProblems: async () => {
        const response = await axiosInstance.get('/admin/problems');
        return response.data;
    }
};

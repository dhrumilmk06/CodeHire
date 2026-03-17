import axiosInstance from '../lib/axios';

export const userApi = {
    updateRole: async (role) => {
        const response = await axiosInstance.patch('/users/role', { role });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/users/me');
        return response.data;
    },
    getParticipantSessions: async (userId) => {
        const response = await axiosInstance.get(`/users/participants/${userId}/sessions`);
        return response.data;
    }
};

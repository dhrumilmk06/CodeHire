import axiosInstance from '../lib/axios'

// we are craetin object sessionApi becuse we can esaily acces this api 
// below all the api is fn of of this sessionApi object

export const sessionApi = {
    createSession: async (data) => {
        const response = await axiosInstance.post('/sessions', data);
        return response.data
    },
    getActiveSessions: async () => {
        const response = await axiosInstance.get('/sessions/active')
        return response.data;
    },
    getMyReecentSessions: async () => {
        const response = await axiosInstance.get('/sessions/my-recent')
        return response.data;
    },
    getSessionById: async (id) => {
        const response = await axiosInstance.get(`/sessions/${id}`)
        return response.data;
    },
    joinSession: async (id) => {
        const response = await axiosInstance.post(`/sessions/${id}/join`)
        return response.data;
    },
    endSession: async (id) => {
        const response = await axiosInstance.post(`/sessions/${id}/end`)
        return response.data;
    },
    getStreamToken: async () => {
        const response = await axiosInstance.get(`/chat/token`)
        return response.data;
    },
}
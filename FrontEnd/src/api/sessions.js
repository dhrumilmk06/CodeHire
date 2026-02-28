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
    getSessionNotes: async (id) => {
        const response = await axiosInstance.get(`/sessions/${id}/notes`);
        return response.data;
    },
    setSessionDecision: async ({ id, decision }) => {
        const response = await axiosInstance.patch(`/sessions/${id}/decision`, { decision });
        return response.data;
    },
    updateTimings: async (id, timings) => {
        const response = await axiosInstance.patch(`/sessions/${id}/timings`, { timings });
        return response.data;
    },
    updateActiveProblem: async (id, data) => {
        const response = await axiosInstance.patch(`/sessions/${id}/activeProblem`, data);
        return response.data;
    },
    saveProblemCode: async (id, problemId, code) => {
        const response = await axiosInstance.patch(`/sessions/${id}/code/${problemId}`, { code });
        return response.data;
    },
    getProblemCode: async (id, problemId) => {
        const response = await axiosInstance.get(`/sessions/${id}/code/${problemId}`);
        return response.data;
    },
}
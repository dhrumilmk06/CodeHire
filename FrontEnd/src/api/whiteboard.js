import axiosInstance from '../lib/axios';

export const whiteboardApi = {
    saveSnapshot: async (sessionId, { imageData, excalidrawData, label }) => {
        const response = await axiosInstance.post(`/whiteboard/${sessionId}/snapshot`, {
            imageData,
            excalidrawData,
            label,
        });
        return response.data;
    },

    getSnapshots: async (sessionId) => {
        const response = await axiosInstance.get(`/whiteboard/${sessionId}/snapshots`);
        return response.data;
    },

    getSnapshotById: async (sessionId, snapshotId) => {
        const response = await axiosInstance.get(`/whiteboard/${sessionId}/snapshot/${snapshotId}`);
        return response.data;
    },

    deleteSnapshot: async (sessionId, snapshotId) => {
        const response = await axiosInstance.delete(`/whiteboard/${sessionId}/snapshot/${snapshotId}`);
        return response.data;
    },

    reviewDesign: async (snapshotId, sessionId, designContext = '') => {
        const response = await axiosInstance.post('/ai/whiteboard-review', {
            snapshotId,
            sessionId,
            designContext,
        });
        return response.data;
    },
};

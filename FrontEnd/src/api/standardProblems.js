import axiosInstance from "../lib/axios";

// Fetch paginated standard problems (or all if lightweight=true for dropdowns)
export const fetchStandardProblems = async ({ limit = 50, offset = 0, lightweight = false }) => {
    try {
        const url = `/standard-problems?limit=${limit}&offset=${offset}&lightweight=${lightweight}`;
        const response = await axiosInstance.get(url);
        return response.data; // { problems: [...], total: X }
    } catch (error) {
        console.error("Error fetching standard problems:", error);
        throw error;
    }
};

// Fetch a single standard problem by ID
export const fetchStandardProblemById = async (id) => {
    try {
        const response = await axiosInstance.get(`/standard-problems/${id}`);
        return response.data; // { problem: { ... } }
    } catch (error) {
        console.error(`Error fetching standard problem ${id}:`, error);
        throw error;
    }
};

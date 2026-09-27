import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Fetch a paginated list of standard problems.
 * @param {Object} options 
 * @param {number} options.limit 
 * @param {number} options.offset 
 * @param {boolean} options.lightweight 
 * @returns {Promise<{ problems: Array, total: number, limit: number, offset: number }>}
 */
export const fetchStandardProblems = async ({ limit = 50, offset = 0, lightweight = false } = {}) => {
    try {
        const response = await axios.get(`${API_URL}/api/standard-problems`, {
            params: { limit, offset, lightweight }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch standard problems');
    }
};

/**
 * Fetch a single standard problem by ID with full details.
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const fetchStandardProblemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/standard-problems/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch problem details');
    }
};

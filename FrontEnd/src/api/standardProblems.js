import axiosInstance from "../lib/axios";

// Fetch paginated standard problems with search and filters (or all if lightweight=true for dropdowns)
export const fetchStandardProblems = async ({
    limit = 30,
    offset = 0,
    search = "",
    difficulty = "All",
    category = "All",
    lightweight = false
} = {}) => {
    try {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            lightweight: String(lightweight),
        });
        if (search && search.trim()) params.append("search", search.trim());
        if (difficulty && difficulty !== "All") params.append("difficulty", difficulty);
        if (category && category !== "All") params.append("category", category);

        const response = await axiosInstance.get(`/standard-problems?${params.toString()}`);
        return response.data; // { problems: [...], total: X, stats: {...}, categories: [...], hasMore: boolean }
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

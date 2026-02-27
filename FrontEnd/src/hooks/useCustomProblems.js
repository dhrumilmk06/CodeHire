import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";


/** Fetch all custom problems owned by the current user */
export const useMyProblems = () =>
    useQuery({
        queryKey: ["my-problems"],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/problems');
            return data.problems;
        },
    });

/** Create a new custom problem */
export const useCreateProblem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (problemData) => {
            const { data } = await axiosInstance.post('/problems', problemData);
            return data.problem;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-problems"] }),
    });
};

/** Update an existing custom problem */
export const useUpdateProblem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...problemData }) => {
            const { data } = await axiosInstance.put(`/problems/${id}`, problemData);
            return data.problem;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-problems"] }),
    });
};

/** Delete a custom problem */
export const useDeleteProblem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/problems/${id}`);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-problems"] }),
    });
};

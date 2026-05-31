import axiosInstance from '../lib/axios';

export const bugBountyApi = {
  // ── Problems ──────────────────────────────────────────────────────────────
  getProblems: async ({ language, difficulty, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (language)   params.append('language', language);
    if (difficulty) params.append('difficulty', difficulty);
    const response = await axiosInstance.get(`/bug-bounty/problems?${params}`);
    return response.data;
  },

  getProblem: async (id) => {
    const response = await axiosInstance.get(`/bug-bounty/problems/${id}`);
    return response.data;
  },

  // ── Submission ────────────────────────────────────────────────────────────
  submitFix: async (id, { fixedCode, sessionId, timeTakenSeconds }) => {
    const response = await axiosInstance.post(`/bug-bounty/problems/${id}/submit`, {
      fixedCode,
      sessionId,
      timeTakenSeconds,
    });
    return response.data;
  },

  runTests: async (id, fixedCode) => {
    const response = await axiosInstance.post(`/bug-bounty/problems/${id}/run-tests`, { fixedCode });
    return response.data;
  },

  // ── Hints ─────────────────────────────────────────────────────────────────
  requestHint: async (id, submissionId) => {
    const response = await axiosInstance.post(`/bug-bounty/problems/${id}/hints`, { submissionId });
    return response.data;
  },

  // ── Single Submission ─────────────────────────────────────────────────────
  getSubmission: async (id) => {
    const response = await axiosInstance.get(`/bug-bounty/submissions/${id}`);
    return response.data;
  },

  // ── Host: list submissions ────────────────────────────────────────────────
  getSubmissions: async ({ status, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    const response = await axiosInstance.get(`/bug-bounty/submissions?${params}`);
    return response.data;
  },

  // ── Host: manual review ───────────────────────────────────────────────────
  reviewSubmission: async (id, { manualReviewScore, manualReviewFeedback }) => {
    const response = await axiosInstance.put(`/bug-bounty/submissions/${id}/review`, {
      manualReviewScore,
      manualReviewFeedback,
    });
    return response.data;
  },

  // ── Leaderboard ───────────────────────────────────────────────────────────
  getLeaderboard: async (limit = 10) => {
    const response = await axiosInstance.get(`/bug-bounty/leaderboard?limit=${limit}`);
    return response.data;
  },
};

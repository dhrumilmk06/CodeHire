import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// Attach the Clerk session token to every outgoing request
axiosInstance.interceptors.request.use(async (config) => {
    try {
        // Try window.Clerk first (available after ClerkProvider mounts)
        // Fallback: wait a tick and retry once if not ready
        let token = null;

        if (window.Clerk?.session) {
            token = await window.Clerk.session.getToken();
        } else {
            // Wait for Clerk to load (up to 3 seconds)
            await new Promise((resolve) => {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (window.Clerk?.session || attempts > 30) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
            token = await window.Clerk?.session?.getToken();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.warn("[Axios] Failed to attach Clerk token:", err?.message);
    }
    return config;
})

export default axiosInstance
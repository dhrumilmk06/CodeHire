import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// Attach the Clerk session token to every outgoing request
axiosInstance.interceptors.request.use(async (config) => {
    try {
        // window.Clerk is available after ClerkProvider mounts
        const token = await window.Clerk?.session?.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (err) {
        // silently skip if Clerk is not ready yet
    }
    return config
})

export default axiosInstance
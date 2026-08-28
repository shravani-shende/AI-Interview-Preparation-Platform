import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export const getAuthToken = () => sessionStorage.getItem("authToken")

export const setAuthToken = (token) => {
    if (token) {
        sessionStorage.setItem("authToken", token)
    } else {
        sessionStorage.removeItem("authToken")
    }
}

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
export async function register({ username, email, password }) {
    try {
        const res = await api.post("/api/auth/register", { username, email, password })
        return res;
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function login({ email, password }) {
    try {
        const res = await api.post("/api/auth/login", { email, password })
        return res;
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function logout() {
    try {
        const res = await api.get("/api/auth/logout")
        return res
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function getMe() {
    try {
        const res = await api.get("/api/auth/get-me")
        return res
    } catch (err) {
        console.log(err)
        throw err
    }
}
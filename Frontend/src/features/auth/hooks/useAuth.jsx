import { useContext } from "react";
import { authContext } from "../services/auth.context";
import { login, register, logout, getMe, setAuthToken } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(authContext)
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setAuthToken(data.data.user.token)
            setUser(data.data.user)
            return true
        } catch {
            return false
        } finally {
            setLoading(false)
        }

    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setAuthToken(data.data.token)
            const currentUser = await getMe()
            setUser(currentUser.data)
            return true
        } catch {
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout()
            setAuthToken(null)
            setUser(null)
        } catch {
            setAuthToken(null)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleLogin, handleLogout, handleRegister }
}

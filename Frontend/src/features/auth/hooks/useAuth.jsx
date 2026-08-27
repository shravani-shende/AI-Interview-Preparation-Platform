import { useContext } from "react";
import { authContext } from "../services/auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(authContext)
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.data.user)
            return true
        } catch (err) {
            return false
        } finally {
            setLoading(false)
        }

    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            await register({ username, email, password })
            const currentUser = await getMe()
            setUser(currentUser.data)
            return true
        } catch (err) {
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleLogin, handleLogout, handleRegister }
}

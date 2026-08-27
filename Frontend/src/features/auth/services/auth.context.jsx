import { createContext, useState,useEffect } from "react";
import { getMe } from "./auth.api";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const restoreUser = async () => {
            try {
                const response = await getMe()
                setUser(response.data)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        restoreUser()
    }, [])
 
    return (
        <authContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </authContext.Provider>
    )
}

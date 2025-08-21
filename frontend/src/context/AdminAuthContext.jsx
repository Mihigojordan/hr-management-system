import { createContext, useContext, useEffect, useState } from "react";
import adminAuthService from "../services/adminAuthService";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminAuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    lockAdmin: () => { },
    unlockAdmin: () => { },
    isAuthenticated: false,
    isLocked: false,
    isLoading: true
})

export const AdminAuthContextProvider = ({ children }) => {
    // Initialize state with default values
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLocked, setIsLocked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Helper function to update state
    const updateAuthState = (authData) => {
        const { user: userData, isAuthenticated: authStatus, isLocked: lockStatus } = authData

        setUser(userData)
        setIsAuthenticated(authStatus)
        setIsLocked(lockStatus)
    }

    const login = async (data) => {
        try {
            const { adminEmail, password } = data
            const response = await adminAuthService.adminLogin({ adminEmail, password })

            if (response.authenticated) {
                // Fetch user profile after successful login
                try {
                    const userProfile = await adminAuthService.getAdminProfile()
                    
                    updateAuthState({
                        user: userProfile.admin,
                        isAuthenticated: true,
                        isLocked: false
                    })
                } catch (profileError) {
                    console.log('Error fetching user profile after login:', profileError)
                    
                    // Still update auth status even if profile fetch fails
                    updateAuthState({
                        user: null,
                        isAuthenticated: true,
                        isLocked: false
                    })
                }
            }

            return response

        } catch (error) {
            throw new Error(error.message);
        }
    }

    const logout = async () => {
        try {
            const response = await adminAuthService.logout()
            
            // Clear auth state
            updateAuthState({
                user: null,
                isAuthenticated: false,
                isLocked: false
            })

            return response

        } catch (error) {
            // Still clear local state even if logout request fails
            updateAuthState({
                user: null,
                isAuthenticated: false,
                isLocked: false
            })
            throw new Error(error.message);
        }
    }

    const lockAdmin = async () => {
        try {
            const response = await adminAuthService.lockAdmin()
            
            updateAuthState({
                user,
                isAuthenticated,
                isLocked: true
            })
            
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const unlockAdmin = async (password) => {
        try {
            const response = await adminAuthService.unlockAdmin({ password })
            
            updateAuthState({
                user,
                isAuthenticated,
                isLocked: false
            })
            
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const checkAuthStatus = async () => {
        setIsLoading(true)
        
        try {
            // Try to fetch profile data to verify authentication
            const response = await adminAuthService.getAdminProfile()

            if (response.authenticated) {
                const result  = response.admin;
                console.log('Admin profile fetched successfully:', result);
                
                updateAuthState({
                    user: result,
                    isAuthenticated: true,
                    isLocked: result.isLocked || false
                })
            } else {
                // Server says we're not authenticated
                updateAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLocked: false
                })
            }

        } catch (error) {
            console.log('Error from checkAuthStatus:', error)
            
            // Clear auth state on any error
            updateAuthState({
                user: null,
                isAuthenticated: false,
                isLocked: false
            })

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const values = {
        login,
        logout,
        lockAdmin,
        unlockAdmin,
        user,
        isLoading,
        isAuthenticated,
        isLocked
    }

    return (
        <AdminAuthContext.Provider value={values}>
            {children}
        </AdminAuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAdminAuth() {
    const context = useContext(AdminAuthContext)
    
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthContextProvider')
    }

    return context
}
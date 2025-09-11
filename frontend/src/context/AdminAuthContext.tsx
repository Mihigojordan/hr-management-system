import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import adminAuthService from '../services/adminAuthService';

// Interface for Admin user data
interface Admin {
  id: string;
  adminName: string;
  adminEmail: string;
  isLocked?: boolean;
  [key: string]: unknown; // Allow additional fields
}

// Interface for login data
interface LoginData {
  adminEmail: string;
  password: string;
}

// Interface for unlock data
interface UnlockData {
  password: string;
}

// Interface for auth context values
interface AdminAuthContextType {
  user: Admin | null;
  login: (data: LoginData) => Promise<unknown>;
  logout: () => Promise<unknown>;
  lockAdmin: () => Promise<unknown>;
  unlockAdmin: (password: string) => Promise<unknown>;
  isAuthenticated: boolean;
  isLocked: boolean;
  isLoading: boolean;
}

// Create context with default values
export const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  lockAdmin: () => Promise.resolve(),
  unlockAdmin: () => Promise.resolve(),
  isAuthenticated: false,
  isLocked: false,
  isLoading: true,
});

// Interface for auth state
interface AuthState {
  user: Admin | null;
  isAuthenticated: boolean;
  isLocked: boolean;
}

// Props for the context provider
interface AdminAuthContextProviderProps {
  children: ReactNode;
}

/**
 * Admin Auth Context Provider
 * Provides authentication state and methods to React components
 */
export const AdminAuthContextProvider: React.FC<AdminAuthContextProviderProps> = ({ children }) => {
  // Initialize state with default values
  const [user, setUser] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to update state
  const updateAuthState = (authData: AuthState) => {
    const { user: userData, isAuthenticated: authStatus, isLocked: lockStatus } = authData;

    setUser(userData);
    setIsAuthenticated(authStatus);
    setIsLocked(lockStatus);
  };

  /**
   * Login an admin
   * @param data - Login credentials
   * @returns Login response
   */
  const login = async (data: LoginData): Promise<unknown> => {
    try {
      const { adminEmail, password } = data;
      const response = await adminAuthService.adminLogin({ adminEmail, password });

      if (response?.authenticated) {
        // Fetch user profile after successful login
        try {
          const userProfile = await adminAuthService.getAdminProfile();
          if (userProfile?.admin) {
            updateAuthState({
              user: userProfile.admin,
              isAuthenticated: true,
              isLocked: false,
            });
          } else {
            // Update auth status even if profile is null
            updateAuthState({
              user: null,
              isAuthenticated: true,
              isLocked: false,
            });
          }
        } catch (profileError) {
          console.log('Error fetching user profile after login:', profileError);
          // Still update auth status even if profile fetch fails
          updateAuthState({
            user: null,
            isAuthenticated: true,
            isLocked: false,
          });
        }
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Logout an admin
   * @returns Logout response
   */
  const logout = async (): Promise<unknown> => {
    try {
      const response = await adminAuthService.logout();

      // Clear auth state
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLocked: false,
      });

      return response;
    } catch (error: any) {
      // Still clear local state even if logout request fails
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLocked: false,
      });
      throw new Error(error.message);
    }
  };

  /**
   * Lock admin account
   * @returns Lock response
   */
  const lockAdmin = async (): Promise<unknown> => {
    try {
      const response = await adminAuthService.lockAdmin();

      updateAuthState({
        user,
        isAuthenticated,
        isLocked: true,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Unlock admin account
   * @param password - Admin password
   * @returns Unlock response
   */
  const unlockAdmin = async (password: string): Promise<unknown> => {
    try {
      const response = await adminAuthService.unlockAdmin({ password });

      updateAuthState({
        user,
        isAuthenticated,
        isLocked: false,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Check authentication status on mount
   */
  const checkAuthStatus = async () => {
    setIsLoading(true);

    try {
      // Try to fetch profile data to verify authentication
      const response = await adminAuthService.getAdminProfile();

      if (response?.authenticated && response.admin) {
        console.log('Admin profile fetched successfully:', response.admin);

        updateAuthState({
          user: response.admin,
          isAuthenticated: true,
          isLocked: response.admin.isLocked || false,
        });
      } else {
        // Server says we're not authenticated or response is null
        updateAuthState({
          user: null,
          isAuthenticated: false,
          isLocked: false,
        });
      }
    } catch (error) {
      console.log('Error from checkAuthStatus:', error);

      // Clear auth state on any error
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLocked: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run checkAuthStatus on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Context values
  const values: AdminAuthContextType = {
    login,
    logout,
    lockAdmin,
    unlockAdmin,
    user,
    isLoading,
    isAuthenticated,
    isLocked,
  };

  return <AdminAuthContext.Provider value={values}>{children}</AdminAuthContext.Provider>;
};

/**
 * Hook to access admin auth context
 * @returns Admin auth context values
 */
export default function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthContextProvider');
  }

  return context;
}
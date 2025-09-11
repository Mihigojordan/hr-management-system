import api from '../api/api'; // Adjust the import path as needed
import { type AxiosInstance, type AxiosResponse } from 'axios'; // Type-only imports for verbatimModuleSyntax

// Interface for admin data
interface Admin {
  id: string;
  adminName: string;
  adminEmail: string;
  isLocked?: boolean;
  [key: string]: unknown; // Allow additional fields
}

// Interface for admin registration and validation data
interface AdminData {
  adminName: string;
  adminEmail: string;
  password: string;
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

// Interface for validation result
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Interface for API responses
interface AuthResponse {
  authenticated?: boolean;
  admin?: Admin;
  token?: string;
  message?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Admin Auth Service
 * Handles all admin authentication-related API calls
 */
class AdminAuthService {
  private api: AxiosInstance = api; // Reference to axios instance

  /**
   * Register a new admin
   * @param adminData - Admin registration data
   * @returns Response with success message and admin ID
   */
  async registerAdmin(adminData: AdminData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/admin/register', adminData);
      return response.data;
    } catch (error: any) {
      console.error('Error registering admin:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to register admin';
      throw new Error(errorMessage);
    }
  }

  /**
   * Admin login
   * @param loginData - Admin login data
   * @returns Response with JWT token
   */
  async adminLogin(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/admin/login', loginData);
      return response.data;
    } catch (error: any) {
      console.error('Error logging in admin:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to login admin';
      throw new Error(errorMessage);
    }
  }

  /**
   * Admin logout
   * @returns Response with success message
   */
  async logout(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/admin/logout');
      return response.data;
    } catch (error: any) {
      console.error('Error logging out admin:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to logout admin';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get admin profile
   * @returns Admin profile object or null if not found
   */
  async getAdminProfile(): Promise<AuthResponse | null> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.get('/admin/profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Admin not found
      }
      console.error('Error fetching admin profile:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch admin profile';
      throw new Error(errorMessage);
    }
  }

  /**
   * Lock admin account
   * @returns Response with success message
   */
  async lockAdmin(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/admin/lock');
      return response.data;
    } catch (error: any) {
      console.error('Error locking admin account:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to lock admin account';
      throw new Error(errorMessage);
    }
  }

  /**
   * Unlock admin account
   * @param unlockData - Unlock data
   * @returns Response with success message
   */
  async unlockAdmin(unlockData: UnlockData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/admin/unlock', unlockData);
      return response.data;
    } catch (error: any) {
      console.error('Error unlocking admin account:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to unlock admin account';
      throw new Error(errorMessage);
    }
  }

  /**
   * Find admin by email
   * @param email - Admin's email
   * @returns Admin object or null if not found
   */
  async findAdminByEmail(email: string): Promise<Admin | null> {
    try {
      const response: AxiosResponse<Admin> = await this.api.get(`/admin/by-email/${email}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Admin not found
      }
      console.error('Error finding admin by email:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to find admin';
      throw new Error(errorMessage);
    }
  }

  /**
   * Find admin by ID
   * @param id - Admin's ID
   * @returns Admin object or null if not found
   */
  async findAdminById(id: string): Promise<Admin | null> {
    try {
      const response: AxiosResponse<Admin> = await this.api.get(`/admin/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Admin not found
      }
      console.error('Error finding admin by ID:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to find admin';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validate admin data before sending to backend
   * @param adminData - Admin data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  validateAdminData(adminData: AdminData): ValidationResult {
    const errors: string[] = [];

    if (!adminData.adminEmail) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(adminData.adminEmail)) {
      errors.push('Email format is invalid');
    }

    if (!adminData.adminName?.trim()) {
      errors.push('Name is required');
    }

    if (!adminData.password) {
      errors.push('Password is required');
    } else if (adminData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Basic email validation
   * @param email - Email to validate
   * @returns True if email format is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create and export a singleton instance
const adminAuthService = new AdminAuthService();
export default adminAuthService;

// Named exports for individual methods
export const {
  registerAdmin,
  adminLogin,
  logout,
  getAdminProfile,
  lockAdmin,
  unlockAdmin,
  findAdminByEmail,
  findAdminById,
  validateAdminData,
} = adminAuthService;
import api from '../api/api'; // Adjust the path to your axios instance

/**
 * Employee Service
 * Handles all employee-related API calls
 */
class EmployeeService {
    /**
     * Create a new employee with optional file uploads
     * @param {FormData} employeeData - Employee creation data wrapped in FormData
     * @returns {Promise<Object>} Response with created employee data
     */
    async createEmployee(employeeData) {
        try {
            const response = await api.post('/employees', employeeData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating employee:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create employee';

            throw new Error(errorMessage);
        }
    }

    /**
     * Get all employees
     * @returns {Promise<Array>} Array of employee objects
     */
    async getAllEmployees() {
        try {
            const response = await api.get('/employees');
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch employees';

            throw new Error(errorMessage);
        }
    }

    /**
     * Get employee by ID
     * @param {string} id - Employee's ID
     * @returns {Promise<Object|null>} Employee object or null if not found
     */
    async getEmployeeById(id) {
        try {
            const response = await api.get(`/employees/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Employee not found
            }

            console.error('Error fetching employee by ID:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch employee';

            throw new Error(errorMessage);
        }
    }

    /**
     * Update employee
     * @param {string} id - Employee's ID
     * @param {FormData} updateData - Employee update data wrapped in FormData
     * @returns {Promise<Object>} Response with updated employee data
     */
    async updateEmployee(id, updateData) {
        try {
            const response = await api.put(`/employees/${id}`, updateData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating employee:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update employee';

            throw new Error(errorMessage);
        }
    }

    /**
     * Delete employee
     * @param {string} id - Employee's ID
     * @returns {Promise<void>} Deletes employee and returns nothing
     */
    async deleteEmployee(id) {
        try {
            await api.delete(`/employees/${id}`);
        } catch (error) {
            console.error('Error deleting employee:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to delete employee';

            throw new Error(errorMessage);
        }
    }

    /**
     * Validate employee data before sending to backend
     * @param {Object} employeeData - Employee data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validateEmployeeData(employeeData) {
        const errors = [];

        if (!employeeData.first_name?.trim()) {
            errors.push('First name is required');
        }
        if (!employeeData.last_name?.trim()) {
            errors.push('Last name is required');
        }
        if (!employeeData.email?.trim()) {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
            errors.push('Invalid email format');
        }
        if (!employeeData.phone?.trim()) {
            errors.push('Phone number is required');
        }
        if (!employeeData.position?.trim()) {
            errors.push('Position is required');
        }
        if (!employeeData.departmentId?.trim()) {
            errors.push('Department ID is required');
        }
        if (!employeeData.date_of_birth) {
            errors.push('Date of birth is required');
        }
        if (!employeeData.gender?.trim()) {
            errors.push('Gender is required');
        }
        if (!employeeData.national_id?.trim()) {
            errors.push('National ID is required');
        }
        if (!employeeData.address?.trim()) {
            errors.push('Address is required');
        }
        if (!employeeData.date_hired) {
            errors.push('Date hired is required');
        }
        if (employeeData.emergency_contact_phone && !/^\+?\d{10,15}$/.test(employeeData.emergency_contact_phone)) {
            errors.push('Invalid emergency contact phone format');
        }
        if (employeeData.bank_account_number && !/^\d{8,20}$/.test(employeeData.bank_account_number)) {
            errors.push('Invalid bank account number format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate employee ID format
     * @param {string} id - Employee ID to validate
     * @returns {boolean} True if ID format is valid
     */
    isValidId(id) {
        return id && typeof id === 'string' && id.trim().length > 0;
    }

    /**
     * Check if employee exists by ID
     * @param {string} id - Employee's ID
     * @returns {Promise<boolean>} True if employee exists, false otherwise
     */
    async employeeExists(id) {
        try {
            const employee = await this.getEmployeeById(id);
            return employee !== null;
        } catch {
            return false;
        }
    }
}

// Create and export a singleton instance
const employeeService = new EmployeeService();
export default employeeService;

// Named exports for individual methods if needed
export const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    validateEmployeeData,
    employeeExists
} = employeeService;
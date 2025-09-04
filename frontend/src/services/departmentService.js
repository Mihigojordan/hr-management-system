import api from '../api/api'; // Adjust the import path as needed

/**
 * Department Service
 * Handles all department-related API calls
 */
class DepartmentService {
    /**
     * Create a new department
     * @param {Object} departmentData - Department creation data
     * @param {string} departmentData.name - Department's name
     * @param {string} departmentData.description - Department's description
     * @returns {Promise<Object>} Response with created department data
     */
    async createDepartment(departmentData) {
        try {
            const response = await api.post('/departments', departmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating department:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create department';

            throw new Error(errorMessage);
        }
    }

    /**
     * Get all departments
     * @returns {Promise<Array>} Array of department objects
     */
    async getAllDepartments() {
        try {
            const response = await api.get('/departments');
            return response.data;
        } catch (error) {
            console.error('Error fetching departments:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch departments';

            throw new Error(errorMessage);
        }
    }

    /**
     * Get department by ID
     * @param {string} id - Department's ID
     * @returns {Promise<Object|null>} Department object or null if not found
     */
    async getDepartmentById(id) {
        try {
            const response = await api.get(`/departments/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Department not found
            }

            console.error('Error fetching department by ID:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch department';

            throw new Error(errorMessage);
        }
    }

    /**
     * Update department
     * @param {string} id - Department's ID
     * @param {Object} updateData - Department update data
     * @param {string} updateData.name - Department's name
     * @param {string} updateData.description - Department's description
     * @returns {Promise<Object>} Response with updated department data
     */
    async updateDepartment(id, updateData) {
        try {
            const response = await api.put(`/departments/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating department:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update department';

            throw new Error(errorMessage);
        }
    }

    /**
     * Delete department
     * @param {string} id - Department's ID
     * @returns {Promise<Object>} Response with success message
     */
    async deleteDepartment(id) {
        try {
            const response = await api.delete(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting department:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to delete department';

            throw new Error(errorMessage);
        }
    }

    /**
     * Find departments by name (search functionality)
     * @param {string} searchTerm - Search term for department name
     * @returns {Promise<Array>} Array of matching departments
     */
    async findDepartmentsByName(searchTerm) {
        try {
            const response = await api.get(`/departments/search?name=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return []; // No departments found
            }

            console.error('Error searching departments by name:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to search departments';

            throw new Error(errorMessage);
        }
    }

    /**
     * Validate department data before sending to backend
     * @param {Object} departmentData - Department data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validateDepartmentData(departmentData) {
        const errors = [];

        if (!departmentData.name?.trim()) {
            errors.push('Department name is required');
        } else if (departmentData.name.trim().length < 2) {
            errors.push('Department name must be at least 2 characters long');
        } else if (departmentData.name.trim().length > 100) {
            errors.push('Department name must not exceed 100 characters');
        }

        if (departmentData.description && departmentData.description.trim().length > 500) {
            errors.push('Department description must not exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate department ID format
     * @param {string} id - Department ID to validate
     * @returns {boolean} True if ID format is valid
     */
    isValidId(id) {
        // Basic validation - adjust based on your ID format requirements
        return id && typeof id === 'string' && id.trim().length > 0;
    }

    /**
     * Check if department exists by ID
     * @param {string} id - Department's ID
     * @returns {Promise<boolean>} True if department exists, false otherwise
     */
    async departmentExists(id) {
        try {
            const department = await this.getDepartmentById(id);
            return department !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get department statistics
     * @returns {Promise<Object>} Department statistics
     */
    async getDepartmentStats() {
        try {
            const response = await api.get('/departments/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching department statistics:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch department statistics';

            throw new Error(errorMessage);
        }
    }
}

// Create and export a singleton instance
const departmentService = new DepartmentService();
export default departmentService;

// Named exports for individual methods if needed
export const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    findDepartmentsByName,
    validateDepartmentData,
    departmentExists,
    getDepartmentStats
} = departmentService;
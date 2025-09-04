import api from '../api/api'; // adjust your axios instance path

/**
 * Contract Service
 * Handles all contract-related API calls
 */
class ContractService {
  /**
   * Create a new contract
   * @param {Object} contractData - Contract creation data
   * @param {string} contractData.employeeId
   * @param {string} contractData.departmentId
   * @param {string} contractData.contractType
   * @param {string} contractData.startDate - ISO string
   * @param {string} [contractData.endDate] - ISO string
   * @param {number} contractData.salary
   * @param {string} [contractData.currency]
   * @param {string} [contractData.status]
   * @returns {Promise<Object>} Created contract
   */
  async createContract(contractData) {
    try {
      const response = await api.post('/contracts', contractData);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create contract';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all contracts
   * @returns {Promise<Array>} Array of contracts
   */
  async getAllContracts() {
    try {
      const response = await api.get('/contracts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch contracts';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get contract by ID
   * @param {string} id
   * @returns {Promise<Object|null>} Contract or null if not found
   */
  async getContractById(id) {
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error('Error fetching contract by ID:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch contract';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a contract
   * @param {string} id
   * @param {Object} updateData - Same fields as createContract
   * @returns {Promise<Object>} Updated contract
   */
  async updateContract(id, updateData) {
    try {
      const response = await api.patch(`/contracts/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating contract:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update contract';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a contract
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteContract(id) {
    try {
      await api.delete(`/contracts/${id}`);
    } catch (error) {
      console.error('Error deleting contract:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete contract';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validate contract data before sending to backend
   * @param {Object} contractData
   * @returns {Object} { isValid: boolean, errors: Array<string> }
   */
  validateContractData(contractData) {
    const errors = [];
    if (!contractData.employeeId) errors.push('Employee ID is required');
    if (!contractData.departmentId) errors.push('Department ID is required');
    if (!contractData.contractType) errors.push('Contract type is required');
    if (!contractData.startDate) errors.push('Start date is required');
    if (!contractData.salary && contractData.salary !== 0) errors.push('Salary is required');

    return { isValid: errors.length === 0, errors };
  }
}

// Singleton instance
const contractService = new ContractService();
export default contractService;

// Named exports
export const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  validateContractData,
} = contractService;

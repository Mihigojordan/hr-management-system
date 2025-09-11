import api from '../api/api'; // Adjust the import path as needed
import { type AxiosInstance, type AxiosResponse } from 'axios'; // Type-only imports for verbatimModuleSyntax
import type { Contract,ContractData } from '../types/model';
// Interface for contract data (used for create/update payloads)


// Interface for validation result
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Contract Service
 * Handles all contract-related API calls
 */
class ContractService {
  private api: AxiosInstance = api; // Reference to axios instance

  /**
   * Create a new contract
   * @param contractData - Contract creation data
   * @returns Created contract
   */
  async createContract(contractData: ContractData): Promise<Contract> {
    try {
      // Convert employeeId and departmentId to numbers if they're strings
      const payload: ContractData = {
        ...contractData,
       
      };
      const response: AxiosResponse<Contract> = await this.api.post('/contracts', payload);
      return response.data;
    } catch (error: any) {
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
   * @returns Array of contracts
   */
  async getAllContracts(): Promise<Contract[]> {
    try {
      const response: AxiosResponse<Contract[]> = await this.api.get('/contracts');
      return response.data;
    } catch (error: any) {
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
   * @param id - Contract ID
   * @returns Contract or null if not found
   */
  async getContractById(id: string | number): Promise<Contract | null> {
    try {
      const response: AxiosResponse<Contract> = await this.api.get(`/contracts/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
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
   * @param id - Contract ID
   * @param updateData - Data to update
   * @returns Updated contract
   */
  async updateContract(id: string | number, updateData: Partial<ContractData>): Promise<Contract> {
    try {
      // Convert employeeId and departmentId to numbers if they're strings
      const payload: Partial<ContractData> = {
        ...updateData,
      };
      const response: AxiosResponse<Contract> = await this.api.patch(`/contracts/${id}`, payload);
      return response.data;
    } catch (error: any) {
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
   * @param id - Contract ID
   * @returns Promise resolving to void
   */
  async deleteContract(id: string | number): Promise<void> {
    try {
      await this.api.delete(`/contracts/${id}`);
    } catch (error: any) {
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
   * @param contractData - Contract data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  validateContractData(contractData: Partial<ContractData>): ValidationResult {
    const errors: string[] = [];

    if (!contractData.employeeId) {
      errors.push('Employee ID is required');
    }
    if (!contractData.departmentId ) {
      errors.push('Department ID is required');
    }
    if (!contractData.contractType) {
      errors.push('Contract type is required');
    }
    if (!contractData.startDate) {
      errors.push('Start date is required');
    }
    if (contractData.salary == null) {
      // Check for null or undefined, allow 0
      errors.push('Salary is required');
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Singleton instance
const contractService = new ContractService();
export default contractService;

// Named exports for individual methods
export const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  validateContractData,
} = contractService;
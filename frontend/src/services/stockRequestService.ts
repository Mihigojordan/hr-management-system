// stockRequestService.js
import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // Adjust this path to your axios instance

// Type definitions for request and request items
export type RequestStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PARTIALLY_ISSUED' 
  | 'ISSUED' 
  | 'CLOSED';

export interface RequestItem {
  id: string;
  stockInId: string;
  qtyRequested: number;
  qtyApproved?: number;
  qtyIssued?: number;
  qtyRemaining?: number;
  qtyReceived?: number;
}

export interface Request {
  id: string;
  ref_no: string;
  siteId: string;
  requestedByAdminId?: string;
  requestedByEmployeeId?: string;
  status: RequestStatus;
  notes?: string;
  requestItems: RequestItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Input types
export type CreateRequestInput = Omit<Request, 'id' | 'status' | 'requestItems' | 'createdAt' | 'updatedAt'> & {
  items: { stockInId: string; qtyRequested: number }[];
};

export type UpdateRequestInput = Partial<CreateRequestInput>;

export type ApproveRequestInput = {
  approvedByAdminId?: string;
  approvedByEmployeeId?: string;
  itemModifications?: Array<{
    requestItemId: string;
    qtyRequested?: number;
    qtyApproved?: number;
    stockInId?: string;
  }>;
  itemsToAdd?: Array<{ stockInId: string; qtyRequested: number; qtyApproved?: number }>;
  itemsToRemove?: string[];
  comment?: string;
};

export type IssueMaterialsInput = {
  requestId: string;
  issuedByAdminId?: string;
  issuedByEmployeeId?: string;
  items: Array<{ requestItemId: string; qtyIssued: number; notes?: string }>;
};

export type ReceiveMaterialsInput = {
  requestId: string;
  receivedByAdminId?: string;
  receivedByEmployeeId?: string;
  items: Array<{ requestItemId: string; qtyReceived: number }>;
};

// Frontend service
class RequestService {
  private api: AxiosInstance = api;
  private baseUrl = '/stock-requests';

  // Create request
  async createRequest(data: CreateRequestInput): Promise<Request> {
    try {
      const response: AxiosResponse<Request> = await this.api.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating request:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create request');
    }
  }

  // Get all requests
  async getAllRequests(): Promise<{data:{requests:Request[]}}> {
    try {
      const response: AxiosResponse<{data:{requests:Request[]}}> = await this.api.get(`${this.baseUrl}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch requests');
    }
  }

  // Get request by ID
  async getRequestById(id: string): Promise<Request | null> {
    try {
      const response: AxiosResponse<Request> = await this.api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('Error fetching request by ID:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch request');
    }
  }

  // Approve request
  async approveRequest(id: string, data: ApproveRequestInput): Promise<Request> {
    try {
      const response: AxiosResponse<Request> = await this.api.patch(`${this.baseUrl}/approve/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error approving request:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to approve request');
    }
  }

  // Reject request
  async rejectRequest(id: string, notes?: string): Promise<Request> {
    try {
      const response: AxiosResponse<Request> = await this.api.patch(`${this.baseUrl}/reject/${id}`, { notes });
      return response.data;
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to reject request');
    }
  }

  // Issue materials
  async issueMaterials(data: IssueMaterialsInput): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.patch(`${this.baseUrl}/issue`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error issuing materials:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to issue materials');
    }
  }

  // Receive materials
  async receiveMaterials(data: ReceiveMaterialsInput): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.patch(`${this.baseUrl}/receive`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error receiving materials:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to receive materials');
    }
  }

  // Update request
  async updateRequest(id: string, data: UpdateRequestInput): Promise<Request> {
    try {
      const response: AxiosResponse<Request> = await this.api.patch(`${this.baseUrl}/${id}/modify-approve`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating request:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update request');
    }
  }

  // Delete request
  async deleteRequest(id: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting request:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete request');
    }
  }
}

// Export singleton instance
const requestService = new RequestService();
export default requestService;

export const {
  createRequest,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  issueMaterials,
  receiveMaterials,
  updateRequest,
  deleteRequest,
} = requestService;

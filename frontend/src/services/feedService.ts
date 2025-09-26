import api from '../api/api'; // Adjust path
import { type AxiosInstance, type AxiosResponse } from 'axios';

// ---------------- Interfaces ----------------
export interface FeedData {
  name: string;
  type: string;
  proteinContent: number;
  quantityAvailable: number;
  feedingRate: number;
}

export interface Feed extends FeedData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  dailyFeedRecords?: DailyFeedRecord[];
}

export interface DailyFeedRecordData {
  date: string;
  quantityGiven: number;
  notes?: string;
  feedId: string;
  cageId: string;
  administeredByEmployee?: string;
  administeredByAdmin?: string;
}

export interface DailyFeedRecord extends DailyFeedRecordData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  feed?: Feed;
  cage?: { id: string; cageCode: string; cageName: string };
  employee?: { id: string; name: string };
  admin?: { id: string; name: string };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DeleteResponse {
  message: string;
}

// ---------------- Service Class ----------------
class FeedService {
  private api: AxiosInstance = api;

  // ---------- Feed ----------
  async createFeed(data: FeedData): Promise<Feed> {
    try {
      const response: AxiosResponse<Feed> = await this.api.post('/feeds', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create feed');
    }
  }

  async getAllFeeds(): Promise<Feed[]> {
    try {
      const response: AxiosResponse<Feed[]> = await this.api.get('/feeds');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch feeds');
    }
  }

  async getFeedById(id: string): Promise<Feed | null> {
    try {
      const response: AxiosResponse<Feed> = await this.api.get(`/feeds/one/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch feed');
    }
  }

  async updateFeed(id: string, updateData: Partial<FeedData>): Promise<Feed> {
    try {
      const response: AxiosResponse<Feed> = await this.api.put(`/feeds/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update feed');
    }
  }

  async deleteFeed(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/feeds/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete feed');
    }
  }

  // ---------- DailyFeedRecord ----------
  async createDailyFeedRecord(data: DailyFeedRecordData): Promise<DailyFeedRecord> {
    try {
      const response: AxiosResponse<DailyFeedRecord> = await this.api.post('/feeds/records', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create record');
    }
  }

  async getAllDailyFeedRecords(): Promise<DailyFeedRecord[]> {
    try {
      const response: AxiosResponse<DailyFeedRecord[]> = await this.api.get('/feeds/records');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch records');
    }
  }

  async getDailyFeedRecordById(id: string): Promise<DailyFeedRecord | null> {
    try {
      const response: AxiosResponse<DailyFeedRecord> = await this.api.get(`/feeds/records/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch record');
    }
  }

  async updateDailyFeedRecord(id: string, updateData: Partial<DailyFeedRecordData>): Promise<DailyFeedRecord> {
    try {
      const response: AxiosResponse<DailyFeedRecord> = await this.api.put(`/feeds/records/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update record');
    }
  }

  async deleteDailyFeedRecord(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/feeds/records/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete record');
    }
  }

  // ---------- Validation ----------
  validateFeedData(data: FeedData): ValidationResult {
    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Feed name is required');
    if (!data.type?.trim()) errors.push('Feed type is required');
    if (data.proteinContent <= 0) errors.push('Protein content must be positive');
    if (data.quantityAvailable < 0) errors.push('Quantity available cannot be negative');
    if (data.feedingRate <= 0) errors.push('Feeding rate must be positive');

    return { isValid: errors.length === 0, errors };
  }

  validateDailyFeedRecordData(data: DailyFeedRecordData): ValidationResult {
    const errors: string[] = [];
    if (!data.date) errors.push('Date is required');
    if (data.quantityGiven <= 0) errors.push('Quantity given must be positive');
    if (!data.feedId?.trim()) errors.push('Feed ID is required');
    if (!data.cageId?.trim()) errors.push('Cage ID is required');
    return { isValid: errors.length === 0, errors };
  }
}

// ---------- Singleton & exports ----------
const feedService = new FeedService();
export default feedService;

export const {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed,
  createDailyFeedRecord,
  getAllDailyFeedRecords,
  getDailyFeedRecordById,
  updateDailyFeedRecord,
  deleteDailyFeedRecord,
  validateFeedData,
  validateDailyFeedRecordData,
} = feedService;

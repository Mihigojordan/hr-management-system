import api from '../api/api'; // axios instance
import { type AxiosInstance, type AxiosResponse } from 'axios';

// ---------- Interfaces ----------

// DTO for creating/updating feed
export interface FeedData {
  name: string;
  type: string;
  proteinContent: number;
  quantityAvailable: number;
  feedingRate: number;
  cageId: string;
  administeredByEmployee?: string | null;
  administeredByAdmin?: string | null;
  date: string; // ISO string
  quantityGiven: number;
  notes?: string | null;
}

// Feed entity with ID and relations
export interface Feed extends FeedData {
  id: string;
  cage?: { id: string; cageName: string };
   employee?: { id: string; first_name: string;last_name:string };
  admin?: { id: string; adminName: string };
  createdAt?: string;
  updatedAt?: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Delete response
export interface DeleteResponse {
  message: string;
}

/**
 * Feed Service
 */
class FeedService {
  private api: AxiosInstance = api;

  async createFeed(feedData: FeedData): Promise<Feed> {
    try {
      const response: AxiosResponse<Feed> = await this.api.post('/feeds', feedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating feed:', error);
      throw new Error(error.response?.data?.message || 'Failed to create feed');
    }
  }

  async getAllFeeds(): Promise<Feed[]> {
    try {
      const response: AxiosResponse<Feed[]> = await this.api.get('/feeds');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching feeds:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feeds');
    }
  }

  async getFeedById(id: string): Promise<Feed | null> {
    try {
      const response: AxiosResponse<Feed> = await this.api.get(`/feeds/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('Error fetching feed:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feed');
    }
  }

  async updateFeed(id: string, updateData: Partial<FeedData>): Promise<Feed> {
    try {
      const response: AxiosResponse<Feed> = await this.api.put(`/feeds/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating feed:', error);
      throw new Error(error.response?.data?.message || 'Failed to update feed');
    }
  }

  async deleteFeed(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/feeds/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting feed:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete feed');
    }
  }

  validateFeedData(feedData: FeedData): ValidationResult {
    const errors: string[] = [];

    if (!feedData.name?.trim()) errors.push('Feed name is required');
    if (!feedData.type?.trim()) errors.push('Feed type is required');
    if (feedData.proteinContent < 0) errors.push('Protein content must be non-negative');
    if (feedData.quantityAvailable < 0) errors.push('Quantity available must be non-negative');
    if (feedData.feedingRate <= 0) errors.push('Feeding rate must be greater than 0');
    if (!feedData.cageId)  errors.push('Cage ID is required');
    if (!feedData.date) errors.push('Feeding date is required');
    if (feedData.quantityGiven <= 0) errors.push('Quantity given must be greater than 0');

    return { isValid: errors.length === 0, errors };
  }
}

// Singleton export
const feedService = new FeedService();
export default feedService;
export const {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed,
  validateFeedData,
} = feedService;

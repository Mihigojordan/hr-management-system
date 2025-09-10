import api from '../api/api'; // Adjust path as needed
import { AxiosResponse } from 'axios';

export interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    employment_type: string;
    experience_level: string;
    industry?: string;
    companyId?: number;
    skills_required?: string[];
    status?: string;
    posted_at?: Date;
    expiry_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

type CreateJobInput = Omit<Job, 'id' | 'created_at' | 'updated_at'>;
type UpdateJobInput = Partial<CreateJobInput>;

class JobService {
    async createJob(jobData: CreateJobInput): Promise<Job> {
        try {
            const response: AxiosResponse<Job> = await api.post('/jobs', jobData);
            return response.data;
        } catch (error: any) {
            console.error('Error creating job:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to create job');
        }
    }

    async getAllJobs(): Promise<Job[]> {
        try {
            const response: AxiosResponse<Job[]> = await api.get('/jobs');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch jobs');
        }
    }

    async getJobById(id: number | string): Promise<Job | null> {
        try {
            const response: AxiosResponse<Job> = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            console.error('Error fetching job by ID:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch job');
        }
    }

    async updateJob(id: number | string, updateData: UpdateJobInput): Promise<Job> {
        try {
            const response: AxiosResponse<Job> = await api.put(`/jobs/${id}`, updateData);
            return response.data;
        } catch (error: any) {
            console.error('Error updating job:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to update job');
        }
    }

    async deleteJob(id: number | string): Promise<{ message: string }> {
        try {
            const response: AxiosResponse<{ message: string }> = await api.delete(`/jobs/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting job:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete job');
        }
    }

    async searchJobs(searchTerm: string): Promise<Job[]> {
        try {
            const response: AxiosResponse<Job[]> = await api.get(`/jobs/search?query=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return [];
            console.error('Error searching jobs:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to search jobs');
        }
    }

    validateJobData(jobData: CreateJobInput) {
        const errors: string[] = [];

        if (!jobData.title?.trim()) errors.push('Job title is required');
        else if (jobData.title.trim().length < 2) errors.push('Job title must be at least 2 characters');
        else if (jobData.title.trim().length > 200) errors.push('Job title must not exceed 200 characters');

        if (!jobData.description?.trim()) errors.push('Job description is required');
        else if (jobData.description.trim().length > 2000) errors.push('Job description must not exceed 2000 characters');

        if (!jobData.location?.trim()) errors.push('Job location is required');

        if (!jobData.employment_type?.trim()) errors.push('Employment type is required');

        if (!jobData.experience_level?.trim()) errors.push('Experience level is required');

        return { isValid: errors.length === 0, errors };
    }
}

const jobService = new JobService();
export default jobService;

export const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJobs,
    validateJobData
} = jobService;

import api from '../api/api';
import { AxiosResponse } from 'axios';

export type ApplicationStage = 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWED' | 'HIRED' | 'REJECTED';

export interface Applicant {
    id: number;
    jobId: number;
    name: string;
    email: string;
    phone?: string;
    cvUrl?: string;
    skills?: string[];
    experienceYears?: number;
    stage: ApplicationStage;
    created_at?: Date;
    updated_at?: Date;
}

export type CreateApplicantInput = Omit<Applicant, 'id' | 'created_at' | 'updated_at' | 'stage'> & { stage?: ApplicationStage };
export type UpdateApplicantInput = Partial<CreateApplicantInput>;

class ApplicantService {
    async createApplicant(applicantData: CreateApplicantInput): Promise<Applicant> {
        try {
            const response: AxiosResponse<Applicant> = await api.post('/applicants', applicantData);
            return response.data;
        } catch (error: any) {
            console.error('Error creating applicant:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to create applicant');
        }
    }

    async getAllApplicants(): Promise<Applicant[]> {
        try {
            const response: AxiosResponse<Applicant[]> = await api.get('/applicants');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching applicants:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch applicants');
        }
    }

    async getApplicantById(id: number | string): Promise<Applicant | null> {
        try {
            const response: AxiosResponse<Applicant> = await api.get(`/applicants/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            console.error('Error fetching applicant by ID:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch applicant');
        }
    }

    async updateApplicant(id: number | string, updateData: UpdateApplicantInput): Promise<Applicant> {
        try {
            const response: AxiosResponse<Applicant> = await api.put(`/applicants/${id}`, updateData);
            return response.data;
        } catch (error: any) {
            console.error('Error updating applicant:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to update applicant');
        }
    }

    async deleteApplicant(id: number | string): Promise<{ message: string }> {
        try {
            const response: AxiosResponse<{ message: string }> = await api.delete(`/applicants/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting applicant:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete applicant');
        }
    }

    async searchApplicants(query: string): Promise<Applicant[]> {
        try {
            const response: AxiosResponse<Applicant[]> = await api.get(`/applicants/search?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return [];
            console.error('Error searching applicants:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to search applicants');
        }
    }

    validateApplicantData(data: CreateApplicantInput) {
        const errors: string[] = [];
        if (!data.jobId) errors.push('Job ID is required');
        if (!data.name?.trim()) errors.push('Applicant name is required');
        if (!data.email?.trim()) errors.push('Applicant email is required');
        return { isValid: errors.length === 0, errors };
    }
}

// Singleton instance
const applicantService = new ApplicantService();
export default applicantService;

// Named exports
export const {
    createApplicant,
    getAllApplicants,
    getApplicantById,
    updateApplicant,
    deleteApplicant,
    searchApplicants,
    validateApplicantData
} = applicantService;

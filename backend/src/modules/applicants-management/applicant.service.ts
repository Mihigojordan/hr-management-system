import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationStage, Prisma } from '../../../generated/prisma';

@Injectable()
export class ApplicantService {
  constructor(private prisma: PrismaService) {}


  async create(applicantData: {
    jobId: string;
    name: string;
    email: string;
    phone?: string;
    cvUrl?: string;
    coverLetter?: string;
    skills?: string[];
    education: any[];
    experienceYears?: number;
    stage?: ApplicationStage;
  }) {
    try {

      console.log(applicantData);
      


   
      const job = await this.prisma.job.findUnique({
        where: { id: applicantData.jobId },
      });

      if (!job) {
        throw new NotFoundException('Job does not exist');
      }

     
      const now = new Date();
      // if (job.status !== 'OPEN' || (job.expiry_date && job.expiry_date > now)) {
      //   throw new BadRequestException('Job is closed or expired');
      // }

      //  Prepare data for Prisma
      const dataToInsert: Prisma.ApplicantCreateInput = {
        job: { connect: { id: applicantData.jobId } },
        name: applicantData.name,
        email: applicantData.email,
        phone: applicantData.phone,
        cvUrl: applicantData.cvUrl,
        coverLetter: applicantData.coverLetter,
        skills: applicantData.skills ? applicantData.skills : undefined,
        education: applicantData.education ? applicantData.education : undefined,
        experienceYears: Number(applicantData.experienceYears),
        stage: applicantData.stage || ApplicationStage.APPLIED,
      };

      //  Create applicant
      const createdApplicant = await this.prisma.applicant.create({
        data: dataToInsert,
      });

      return createdApplicant;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException || error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to create applicant');
    }
  } 
  async findAll() {
    try {
      return await this.prisma.applicant.findMany({
        include: { job: true }, 
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch applicants');
    }
  }

  async findOne(id: string) {
    try {
      const applicant = await this.prisma.applicant.findUnique({
        where: { id },
        include: { job: true },
      });
      if (!applicant) throw new NotFoundException('Applicant not found');
      return applicant;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch applicant');
    }
  }

 async update(
  id: string,
  applicantData: {
    jobId?: string;
    name?: string;
    email?: string;
    phone?: string;
    cvUrl?: string;
    coverLetter?: string;
    skills?: string[];
    education?: any[];
    experienceYears?: number;
    stage?: ApplicationStage;
  },
) {
  try {
   
    const applicant = await this.prisma.applicant.findUnique({ where: { id } });
    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    
    if (applicantData.jobId) {
      const job = await this.prisma.job.findUnique({ where: { id: applicantData.jobId } });
      if (!job) {
        throw new NotFoundException('Job does not exist');
      }

      const now = new Date();
      if (job.status !== 'OPEN' || (job.expiry_date && job.expiry_date < now)) {
        throw new BadRequestException('Job is closed or expired');
      }
    }

    //  Prepare Prisma data
    const dataToUpdate: Prisma.ApplicantUpdateInput = {
      name: applicantData.name,
      email: applicantData.email,
      phone: applicantData.phone,
      cvUrl: applicantData.cvUrl,
      coverLetter: applicantData.coverLetter,
      skills: applicantData.skills ? applicantData.skills : undefined,
      education: applicantData.education ? applicantData.education : undefined,
      
      experienceYears: applicantData.experienceYears,
      stage: applicantData.stage,
      ...(applicantData.jobId ? { job: { connect: { id: applicantData.jobId } } } : {}),
    };

    //  Update applicant
    const updated = await this.prisma.applicant.update({
      where: { id },
      data: dataToUpdate,
    });

    return updated;
  } catch (error) {
    console.error(error);
    throw error instanceof NotFoundException || error instanceof BadRequestException
      ? error
      : new InternalServerErrorException('Failed to update applicant');
  }
}

async remove(id: string) {
  try {
    
    const applicant = await this.prisma.applicant.findUnique({ where: { id } });
    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    //  Delete applicant
    await this.prisma.applicant.delete({ where: { id } });
    return { message: 'Applicant deleted successfully' };
  } catch (error) {
    console.error(error);
    throw error instanceof NotFoundException
      ? error
      : new InternalServerErrorException('Failed to delete applicant');
  }
}


}

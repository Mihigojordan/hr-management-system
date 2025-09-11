// src/job/job.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        try {
            console.log(data);
            
            return await this.prisma.job.create({ data });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to create job');
        }
    }

    async findAll() {
        try {
            return await this.prisma.job.findMany({
                include: { appplicants: true }, // fetch company info if exists
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to fetch jobs');
        }
    }

    async findOne(id: number) {
        try {
            const job = await this.prisma.job.findUnique({
                where: { id },
                include: { appplicants: true },
            });
            if (!job) throw new NotFoundException('Job not found');
            return job;
        } catch (error) {
            console.error(error);
            throw error instanceof NotFoundException
                ? error
                : new InternalServerErrorException('Failed to fetch job');
        }
    }

    async update(id: number, data: any) {
        try {
            const updated = await this.prisma.job.update({
                where: { id },
                data,
            });
            return updated;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to update job');
        }
    }

    async remove(id: number) {
        try {
            await this.prisma.job.delete({ where: { id } });
            return { message: 'Job deleted successfully' };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to delete job');
        }
    }
}

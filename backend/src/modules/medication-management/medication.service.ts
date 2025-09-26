import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Medication } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicationService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Medication> {
    try {
      return await this.prisma.medication.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Medication[]> {
    try {
      return await this.prisma.medication.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Medication> {
    try {
      const med = await this.prisma.medication.findUnique({ where: { id } });
      if (!med) throw new NotFoundException('Medication not found');
      return med;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any): Promise<Medication> {
    try {
      return await this.prisma.medication.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<Medication> {
    try {
      return await this.prisma.medication.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

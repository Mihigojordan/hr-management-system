import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicineGateway } from './medecine.gateway';

@Injectable()
export class MedicineService {
  constructor(
    private prisma: PrismaService,
    private gateway: MedicineGateway,
  ) {}

  async create(data: any, employeeId: string) {
    try {
      if (!data.addedById) {
        throw new BadRequestException('Employee (addedById) is required');
      }

      // Calculate total cost if not provided
      const totalCost =
        data.pricePerUnit && data.quantity
          ? data.pricePerUnit * data.quantity
          : data.totalCost;

      const medicine = await this.prisma.medicine.create({
        data: { ...data, totalCost },
        include: { addedBy: true }, // Include employee details
      });

      this.gateway.emitMedicineCreated(medicine); // Real-time emit
      return { message: 'Medicine added successfully', medicine };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.medicine.findMany({
        include: { addedBy: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const medicine = await this.prisma.medicine.findUnique({
        where: { id },
        include: { addedBy: true },
      });

      if (!medicine) throw new BadRequestException('Medicine not found');
      return medicine;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      const existing = await this.prisma.medicine.findUnique({
        where: { id },
      });
      if (!existing) throw new BadRequestException('Medicine not found');

      const totalCost =
        data.pricePerUnit && data.quantity
          ? data.pricePerUnit * data.quantity
          : existing.totalCost;

      const updated = await this.prisma.medicine.update({
        where: { id },
        data: { ...data, totalCost },
        include: { addedBy: true },
      });

      this.gateway.emitMedicineUpdated(updated); // Real-time emit
      return { message: 'Medicine updated successfully', updated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.medicine.findUnique({ where: { id } });
      if (!existing) throw new BadRequestException('Medicine not found');

      await this.prisma.medicine.delete({ where: { id } });

      this.gateway.emitMedicineDeleted(id); // Real-time emit
      return { message: 'Medicine deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

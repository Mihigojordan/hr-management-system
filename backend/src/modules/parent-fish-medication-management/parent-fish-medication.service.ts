import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParentFishMedicationService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a medication record for parent fish
  async create(data: any) {
    if (!data.parentFishPoolId || !data.medicationId || !data.employeeId) {
      throw new Error('parentFishPoolId, medicationId, and employeeId are required.');
    }

    return this.prisma.parentFishMedication.create({
      data: {
        parentFishPoolId: data.parentFishPoolId,
        medicationId: data.medicationId,
        employeeId: data.employeeId,
        quantity: data.quantity ?? 0,
      },
      include: {
        parentFishPool: true,
        medication: true,
        employee: true,
      },
    });
  }

  // Get all medication records
  async findAll() {
    return this.prisma.parentFishMedication.findMany({
      include: {
        parentFishPool: true,
        medication: true,
        employee: true,
      },
    });
  }

  // Get a single medication record by ID
  async findOne(id: string) {
    return this.prisma.parentFishMedication.findUnique({
      where: { id },
      include: {
        parentFishPool: true,
        medication: true,
        employee: true,
      },
    });
  }

  // Update a medication record
  async update(id: string, data: any) {
    return this.prisma.parentFishMedication.update({
      where: { id },
      data: {
        parentFishPoolId: data.parentFishPoolId,
        medicationId: data.medicationId,
        employeeId: data.employeeId,
        quantity: data.quantity,
      },
      include: {
        parentFishPool: true,
        medication: true,
        employee: true,
      },
    });
  }

  // Delete a medication record
  async remove(id: string) {
    return this.prisma.parentFishMedication.delete({
      where: { id },
    });
  }
}

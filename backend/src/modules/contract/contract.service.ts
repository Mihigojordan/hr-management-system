import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContractStatus, ContractType } from '../../../generated/prisma';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    employeeId: string;
    departmentId: string;
    contractType: ContractType;
    startDate: Date;
    endDate?: Date;
    salary: number;
    currency?: string;
    status?: ContractStatus;
  }) {
    // ✅ ensure employee exists
    const employee = await this.prisma.employee.findUnique({ where: { id: data.employeeId } });
    if (!employee) throw new NotFoundException(`Employee with ID ${data.employeeId} not found`);

    // ✅ ensure department exists
    const department = await this.prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) throw new NotFoundException(`Department with ID ${data.departmentId} not found`);

    // ✅ If creating an ACTIVE contract, terminate all others
    if (!data.status || data.status === ContractStatus.ACTIVE) {
      await this.prisma.contract.updateMany({
        where: { employeeId: data.employeeId, status: ContractStatus.ACTIVE },
        data: { status: ContractStatus.TERMINATED },
      });
    }

    return this.prisma.contract.create({
      data: {
        ...data,
        salary: Number(data.salary),
        status: data.status || ContractStatus.ACTIVE,
        currency: data.currency || 'RWF',
      },
      include: { employee: true, department: true },
    });
  }

  async findAll() {
    return this.prisma.contract.findMany({
      include: { employee: true, department: true },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { employee: { include : {contracts:true}}, department: true },
    });
    if (!contract) throw new NotFoundException(`Contract with ID ${id} not found`);
    return contract;
  }

  async update(id: string, data: {
    employeeId?: string;
    departmentId?: string;
    contractType?: ContractType;
    startDate?: Date;
    endDate?: Date;
    salary?: number;
    currency?: string;
    status?: ContractStatus;
  }) {
    const existing = await this.findOne(id);

    if (data.employeeId) {
      const employee = await this.prisma.employee.findUnique({ where: { id: data.employeeId } });
      if (!employee) throw new NotFoundException(`Employee with ID ${data.employeeId} not found`);
    }

    if (data.departmentId) {
      const department = await this.prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) throw new NotFoundException(`Department with ID ${data.departmentId} not found`);
    }

    // ✅ If updating to ACTIVE, terminate all other contracts of that employee
    if (data.status === ContractStatus.ACTIVE) {
      await this.prisma.contract.updateMany({
        where: {
          employeeId: data.employeeId || existing.employeeId,
          status: ContractStatus.ACTIVE,
          NOT: { id }, // exclude the contract being updated
        },
        data: { status: ContractStatus.TERMINATED },
      });
    }

    return this.prisma.contract.update({
      where: { id },
      data,
      include: { employee: true, department: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws if not found
    return this.prisma.contract.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.contract.create({ data });
  }

  async findAll() {
    return this.prisma.contract.findMany({
      include: { employees: true },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { employees: true },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async update(id: string, data: any) {
    return this.prisma.contract.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.contract.delete({
      where: { id },
    });
  }
}

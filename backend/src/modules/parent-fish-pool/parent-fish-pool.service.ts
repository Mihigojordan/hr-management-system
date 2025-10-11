import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentFishPoolService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(data: any) {
    // Basic validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new BadRequestException('Name is required and must be a non-empty string.');
    }

    if (data.description && typeof data.description !== 'string') {
      throw new BadRequestException('Description must be a string.');
    }

    // Check if name already exists
    const existing = await this.prisma.parentFishPool.findUnique({
      where: { name: data.name.trim() },
    });

    if (existing) {
      throw new BadRequestException(`ParentFishPool with name "${data.name}" already exists.`);
    }

    return this.prisma.parentFishPool.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
      },
    });
  }

  // ✅ Find all
  async findAll() {
    return this.prisma.parentFishPool.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Find one
  async findOne(id: string) {
    const pool = await this.prisma.parentFishPool.findUnique({ where: { id } });
    if (!pool) throw new NotFoundException('ParentFishPool not found.');
    return pool;
  }

  // ✅ Update
  async update(id: string, data: any) {
    const pool = await this.prisma.parentFishPool.findUnique({ where: { id } });
    if (!pool) throw new NotFoundException('ParentFishPool not found.');

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        throw new BadRequestException('Name must be a non-empty string.');
      }

      // Check for existing name (excluding this record)
      const nameExists = await this.prisma.parentFishPool.findFirst({
        where: {
          name: data.name.trim(),
          NOT: { id },
        },
      });

      if (nameExists) {
        throw new BadRequestException(`ParentFishPool with name "${data.name}" already exists.`);
      }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      throw new BadRequestException('Description must be a string.');
    }

    return this.prisma.parentFishPool.update({
      where: { id },
      data: {
        name: data.name?.trim() ?? pool.name,
        description: data.description?.trim() ?? pool.description,
      },
    });
  }

  // ✅ Delete
  async remove(id: string) {
    const pool = await this.prisma.parentFishPool.findUnique({ where: { id } });
    if (!pool) throw new NotFoundException('ParentFishPool not found.');

    return this.prisma.parentFishPool.delete({ where: { id } });
  }
}

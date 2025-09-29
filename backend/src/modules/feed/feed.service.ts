import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      console.log(data);
      
      return await this.prisma.feed.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.feed.findMany({
        include: {
          cage: true,
          employee: true,
          admin: true,
        },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAllByCageId(id:string) {
    try {
      return await this.prisma.feed.findMany({
        where:{cageId:id},
        include: {
          cage: true,
          employee: true,
          admin: true,
        },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const feed = await this.prisma.feed.findUnique({
        where: { id },
        include: {
          cage: true,
          employee: true,
          admin: true,
        },
      });
      if (!feed) throw new NotFoundException('Feed record not found');
      return feed;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      const feed = await this.prisma.feed.findUnique({ where: { id } });
      if (!feed) throw new NotFoundException('Feed record not found');

      return await this.prisma.feed.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const feed = await this.prisma.feed.findUnique({ where: { id } });
      if (!feed) throw new NotFoundException('Feed record not found');

      return await this.prisma.feed.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

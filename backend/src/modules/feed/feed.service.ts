import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  // ----- Feed CRUD -----
  async createFeed(data: any) {
    try {
      return await this.prisma.feed.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllFeeds() {
    try {
      return await this.prisma.feed.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getFeedById(id: string) {
    try {
      const feed = await this.prisma.feed.findUnique({ where: { id } });
      if (!feed) throw new NotFoundException('Feed not found');
      return feed;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateFeed(id: string, data: any) {
    try {
      return await this.prisma.feed.update({ where: { id }, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteFeed(id: string) {
    try {
      return await this.prisma.feed.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ----- DailyFeedRecord CRUD -----
  async createDailyFeedRecord(data: any) {
    try {
      return await this.prisma.dailyFeedRecord.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllDailyFeedRecords() {
    try {
        console.log('sjsjs');
        
      return await this.prisma.dailyFeedRecord.findMany({
        include: { feed: true, cage: true, employee: true, admin: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDailyFeedRecordById(id: string) {
    try {
      const record = await this.prisma.dailyFeedRecord.findUnique({
        where: { id },
        include: { feed: true, cage: true, employee: true, admin: true },
      });
      if (!record) throw new NotFoundException('Daily feed record not found');
      return record;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateDailyFeedRecord(id: string, data: any) {
    try {
      return await this.prisma.dailyFeedRecord.update({ where: { id }, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDailyFeedRecord(id: string) {
    try {
      return await this.prisma.dailyFeedRecord.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

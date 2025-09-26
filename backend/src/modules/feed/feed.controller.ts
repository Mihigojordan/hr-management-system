import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // ----- Feed endpoints -----
  @Post()
  async createFeed(@Body() body: any) {
    return await this.feedService.createFeed(body);
  }

  @Get()
  async getAllFeeds() {
    return await this.feedService.getAllFeeds();
  }

  @Get('one/:id')
  async getFeedById(@Param('id') id: string) {
    return await this.feedService.getFeedById(id);
  }

  @Put(':id')
  async updateFeed(@Param('id') id: string, @Body() body: any) {
    return await this.feedService.updateFeed(id, body);
  }

  @Delete(':id')
  async deleteFeed(@Param('id') id: string) {
    return await this.feedService.deleteFeed(id);
  }

  // ----- DailyFeedRecord endpoints -----
  @Post('records')
  async createDailyFeedRecord(@Body() body: any) {
    return await this.feedService.createDailyFeedRecord(body);
  }

  @Get('records')
  async getAllDailyFeedRecords() {
    return await this.feedService.getAllDailyFeedRecords();
  }

  @Get('records/:id')
  async getDailyFeedRecordById(@Param('id') id: string) {
    return await this.feedService.getDailyFeedRecordById(id);
  }

  @Put('records/:id')
  async updateDailyFeedRecord(@Param('id') id: string, @Body() body: any) {
    return await this.feedService.updateDailyFeedRecord(id, body);
  }

  @Delete('records/:id')
  async deleteDailyFeedRecord(@Param('id') id: string) {
    return await this.feedService.deleteDailyFeedRecord(id);
  }
}

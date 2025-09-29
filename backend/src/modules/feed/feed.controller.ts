import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async create(@Body() data: any) {
    try {
      return await this.feedService.create(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.feedService.findAll();
    } catch (error) {
      return { error: error.message };
    }
  }
  @Get('cage/:id')
  async findAllByCageId(@Param('id') id: string) {
    try {
      return await this.feedService.findAllByCageId(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.feedService.findOne(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.feedService.update(id, data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.feedService.remove(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}

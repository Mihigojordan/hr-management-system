import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { AssetRequestService } from './request.service';

@Controller('asset-requests')
export class AssetRequestController {
  constructor(private readonly assetRequestService: AssetRequestService) {}

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.assetRequestService.create(body);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.assetRequestService.findAll();
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.assetRequestService.findOne(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.assetRequestService.update(id, body);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.assetRequestService.remove(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    try {
      return await this.assetRequestService.approve(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    try {
      return await this.assetRequestService.reject(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch(':id/issue')
  async issue(@Param('id') id: string) {
    try {
      return await this.assetRequestService.issue(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AssetService } from './asset.service';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async create(@Body() body: any) {
    return await this.assetService.create(body);
  }

  @Get()
  async findAll() {
    return await this.assetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.assetService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.assetService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.assetService.remove(id);
  }
}

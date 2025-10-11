import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ParentFishPoolService } from './parent-fish-pool.service';

@Controller('parent-fish-pools')
export class ParentFishPoolController {
  constructor(private readonly parentFishPoolService: ParentFishPoolService) {}

  @Post()
  create(@Body() body: any) {
    return this.parentFishPoolService.create(body);
  }

  @Get()
  findAll() {
    return this.parentFishPoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentFishPoolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.parentFishPoolService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentFishPoolService.remove(id);
  }
}

import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ParentFishMedicationService } from './parent-fish-medication.service';

@Controller('parent-fish-medication')
export class ParentFishMedicationController {
  constructor(private readonly service: ParentFishMedicationService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

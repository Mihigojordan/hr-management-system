import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PondMedicationService } from './pond-medication.service';

@Controller('pond-medication')
export class PondMedicationController {
  constructor(private readonly pondMedicationService: PondMedicationService) {}

  @Post(':employeeId')
  create(@Body() data: any, @Param('employeeId') employeeId: string) {
    return this.pondMedicationService.create(data, employeeId);
  }

  @Get()
  findAll() {
    return this.pondMedicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pondMedicationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.pondMedicationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pondMedicationService.remove(id);
  }
}

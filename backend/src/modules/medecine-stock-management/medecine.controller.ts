import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MedicineService } from './medecine.service';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  async create(@Body() data: any , ) {
    return this.medicineService.create(data);
  }

  @Get()
  async findAll() {
    return this.medicineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.medicineService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}

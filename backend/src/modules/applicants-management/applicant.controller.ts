import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApplicantService } from './applicant.service';

@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.applicantService.create(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.applicantService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.applicantService.findOne(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.applicantService.update(Number(id), body);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.applicantService.remove(Number(id));
    } catch (error) {
      throw error;
    }
  }
}

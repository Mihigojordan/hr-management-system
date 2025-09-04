import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractStatus, ContractType } from '../../../generated/prisma';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  create(@Body() createContractData: {
    employeeId: string;
    departmentId: string;
    contractType: ContractType;
    startDate: string;
    endDate?: string;
    salary: number;
    currency?: string;
    status?: ContractStatus;
  }) {
    return this.contractService.create({
      ...createContractData,
      startDate: new Date(createContractData.startDate),
      endDate: createContractData.endDate ? new Date(createContractData.endDate) : undefined,
    });
  }

  @Get()
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractData: {
      employeeId?: string;
      departmentId?: string;
      contractType?: ContractType;
      startDate?: string;
      endDate?: string;
      salary?: number;
      currency?: string;
      status?: ContractStatus;
    },
  ) {
    return this.contractService.update(id, {
      ...updateContractData,
      startDate: updateContractData.startDate ? new Date(updateContractData.startDate) : undefined,
      endDate: updateContractData.endDate ? new Date(updateContractData.endDate) : undefined,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }
}

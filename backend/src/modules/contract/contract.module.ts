import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ContractController],
  providers: [ContractService, PrismaService],
  exports: [ContractService], // 👈 export if other modules need it
})
export class ContractModule {}

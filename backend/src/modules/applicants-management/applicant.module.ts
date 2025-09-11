import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ApplicantController],
  providers: [ApplicantService, PrismaService],
  exports: [ApplicantService],
})
export class ApplicantModule {}

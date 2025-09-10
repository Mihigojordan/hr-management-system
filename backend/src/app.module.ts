import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentModule } from './modules/department/department.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ContractModule } from './modules/contract/contract.module';
import { JobModule } from './modules/job-management/job.module';
import { ApplicantModule } from './modules/applicants-management/applicant.module';

@Module({
  imports: [
    AdminModule,
    PrismaModule,
    DepartmentModule,
    EmployeeModule,
    ContractModule,
    JobModule,
    ApplicantModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

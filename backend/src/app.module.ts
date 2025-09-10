import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentModule } from './modules/department/department.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ContractModule } from './modules/contract/contract.module';
import { EmailModule } from './global/email/email.module';

@Module({
  imports: [
    AdminModule,
    PrismaModule,
    DepartmentModule,
    EmployeeModule,
    ContractModule,
    EmailModule
  ],
  controllers: [AppController],
})
export class AppModule {}

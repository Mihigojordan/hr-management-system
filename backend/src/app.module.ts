import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentModule } from './modules/department/department.module';

@Module({
  imports: [
    AdminModule,
    PrismaModule,
    DepartmentModule
  ],
  controllers: [AppController],
})
export class AppModule {}

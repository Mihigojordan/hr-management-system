import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentModule } from './modules/department/department.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ContractModule } from './modules/contract/contract.module';
import { JobModule } from './modules/job-management/job.module';
import { ApplicantModule } from './modules/applicants-management/applicant.module';
import { EmailModule } from './global/email/email.module';
import { ClientModule } from './modules/client-management/client.module';

import { ActivityModule } from './modules/activity-management/activity.module';
import { AssetModule } from './modules/assets-management/asset.module';
import { SiteModule } from './modules/site-management/site.module';
import { CageModule } from './modules/cage-management/cage.module';
import { StoreModule } from './modules/store-management/store.module';
import { MedicationModule } from './modules/medication-management/medication.module';
import { FeedModule } from './modules/feed/feed.module';
import { AssetRequestModule } from './modules/asset-requisition-managment/request.module';

@Module({ 
  imports: [
    AdminModule,
    PrismaModule,
    DepartmentModule,
    EmployeeModule,
    ContractModule,
    JobModule,
    ApplicantModule,
    EmailModule,
    ClientModule,
    ActivityModule,
    AssetModule,
    SiteModule,
    CageModule,
    StoreModule,
    MedicationModule,
    FeedModule,
    AssetRequestModule
  ],
  controllers: [AppController],
})
export class AppModule {}

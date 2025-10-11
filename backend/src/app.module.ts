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
import { StockModule } from './modules/stockin-management/stock.module';
import { ParentFishPoolModule } from './modules/parent-fish-pool/parent-fish-pool.module';
import { FeedstockModule } from './modules/feedstock-management/feedstock.module';
import { ParentFishFeedingModule } from './modules/parent-fish-feeding-management/parent-fish-feeding.module';
import { MedicineModule } from './modules/medecine-stock-management/medecine.module';
import { ParentFishMedicationModule } from './modules/parent-fish-medication-management/parent-fish-medication.module';

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
    AssetRequestModule,
    StockModule,
    FeedstockModule,
    MedicineModule,
    ParentFishPoolModule,
FeedstockModule,
ParentFishFeedingModule,
ParentFishMedicationModule
  
  ],
  controllers: [AppController],
})
export class AppModule {}

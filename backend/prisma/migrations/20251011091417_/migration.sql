-- AlterTable
ALTER TABLE `parentfishpool` ADD COLUMN `employeeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ParentFishPool` ADD CONSTRAINT `ParentFishPool_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

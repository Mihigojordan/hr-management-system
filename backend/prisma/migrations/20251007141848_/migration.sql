-- AlterTable
ALTER TABLE `request` ADD COLUMN `comments` JSON NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedByAdminId` VARCHAR(191) NULL,
    ADD COLUMN `rejectedByEmployeeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_rejectedByAdminId_fkey` FOREIGN KEY (`rejectedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_rejectedByEmployeeId_fkey` FOREIGN KEY (`rejectedByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

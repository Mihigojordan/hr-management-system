/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_adminId_fkey`;

-- DropIndex
DROP INDEX `Activity_adminId_fkey` ON `activity`;

-- AlterTable
ALTER TABLE `activity` ADD COLUMN `employeeId` VARCHAR(191) NULL,
    MODIFY `adminId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `google_id` VARCHAR(191) NULL,
    ADD COLUMN `is2FA` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isLocked` BOOLEAN NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_google_id_key` ON `Employee`(`google_id`);

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `title` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_contractId_fkey`;

-- DropIndex
DROP INDEX `Employee_contractId_fkey` ON `employee`;

-- AlterTable
ALTER TABLE `contract` DROP COLUMN `title`,
    ADD COLUMN `employeeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `contractId`;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

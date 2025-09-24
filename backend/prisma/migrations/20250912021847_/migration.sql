/*
  Warnings:

  - You are about to drop the column `departmentId` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `contract` table. All the data in the column will be lost.
  - The values [PROBATION] on the enum `Contract_contractType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `title` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_employeeId_fkey`;

-- DropIndex
DROP INDEX `Contract_departmentId_fkey` ON `contract`;

-- DropIndex
DROP INDEX `Contract_employeeId_fkey` ON `contract`;

-- AlterTable
ALTER TABLE `contract` DROP COLUMN `departmentId`,
    DROP COLUMN `employeeId`,
    DROP COLUMN `status`,
    ADD COLUMN `benefits` VARCHAR(191) NULL,
    ADD COLUMN `probationPeriod` VARCHAR(191) NULL,
    ADD COLUMN `terminationConditions` VARCHAR(191) NULL,
    ADD COLUMN `terms` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `workingHours` VARCHAR(191) NULL,
    MODIFY `contractType` ENUM('PERMANENT', 'TEMPORARY', 'INTERNSHIP') NOT NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `contractId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

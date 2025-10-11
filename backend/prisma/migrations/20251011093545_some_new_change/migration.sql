/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `parentfishmedication` table. All the data in the column will be lost.
  - Made the column `employeeId` on table `parentfishmedication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `parentfishmedication` DROP FOREIGN KEY `ParentFishMedication_employeeId_fkey`;

-- DropIndex
DROP INDEX `ParentFishMedication_employeeId_fkey` ON `parentfishmedication`;

-- AlterTable
ALTER TABLE `parentfishmedication` DROP COLUMN `updatedAt`,
    MODIFY `employeeId` VARCHAR(191) NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `ParentFishMedication` ADD CONSTRAINT `ParentFishMedication_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

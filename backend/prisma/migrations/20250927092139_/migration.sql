/*
  Warnings:

  - You are about to drop the column `feedingRate` on the `feed` table. All the data in the column will be lost.
  - You are about to drop the column `quantityAvailable` on the `feed` table. All the data in the column will be lost.
  - You are about to drop the `dailyfeedrecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cageId` to the `Feed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Feed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityGiven` to the `Feed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Feed` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dailyfeedrecord` DROP FOREIGN KEY `DailyFeedRecord_administeredByAdmin_fkey`;

-- DropForeignKey
ALTER TABLE `dailyfeedrecord` DROP FOREIGN KEY `DailyFeedRecord_administeredByEmployee_fkey`;

-- DropForeignKey
ALTER TABLE `dailyfeedrecord` DROP FOREIGN KEY `DailyFeedRecord_cageId_fkey`;

-- DropForeignKey
ALTER TABLE `dailyfeedrecord` DROP FOREIGN KEY `DailyFeedRecord_feedId_fkey`;

-- AlterTable
ALTER TABLE `feed` DROP COLUMN `feedingRate`,
    DROP COLUMN `quantityAvailable`,
    ADD COLUMN `administeredByAdmin` VARCHAR(191) NULL,
    ADD COLUMN `administeredByEmployee` VARCHAR(191) NULL,
    ADD COLUMN `cageId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `quantityGiven` DOUBLE NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `dailyfeedrecord`;

-- CreateIndex
CREATE INDEX `Feed_cageId_idx` ON `Feed`(`cageId`);

-- CreateIndex
CREATE INDEX `Feed_administeredByEmployee_idx` ON `Feed`(`administeredByEmployee`);

-- CreateIndex
CREATE INDEX `Feed_administeredByAdmin_idx` ON `Feed`(`administeredByAdmin`);

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_administeredByEmployee_fkey` FOREIGN KEY (`administeredByEmployee`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_administeredByAdmin_fkey` FOREIGN KEY (`administeredByAdmin`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `administeredBy` on the `medication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `medication` DROP FOREIGN KEY `Medication_administeredBy_fkey`;

-- DropIndex
DROP INDEX `Medication_administeredBy_fkey` ON `medication`;

-- AlterTable
ALTER TABLE `medication` DROP COLUMN `administeredBy`,
    ADD COLUMN `administeredByAdmin` VARCHAR(191) NULL,
    ADD COLUMN `administeredByEmployee` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Feed` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `proteinContent` DOUBLE NOT NULL,
    `quantityAvailable` DOUBLE NOT NULL,
    `feedingRate` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyFeedRecord` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantityGiven` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `cageId` VARCHAR(191) NOT NULL,
    `administeredByEmployee` VARCHAR(191) NULL,
    `administeredByAdmin` VARCHAR(191) NULL,

    INDEX `DailyFeedRecord_feedId_idx`(`feedId`),
    INDEX `DailyFeedRecord_cageId_idx`(`cageId`),
    INDEX `DailyFeedRecord_administeredByEmployee_idx`(`administeredByEmployee`),
    INDEX `DailyFeedRecord_administeredByAdmin_idx`(`administeredByAdmin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_administeredByEmployee_fkey` FOREIGN KEY (`administeredByEmployee`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_administeredByAdmin_fkey` FOREIGN KEY (`administeredByAdmin`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyFeedRecord` ADD CONSTRAINT `DailyFeedRecord_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feed`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyFeedRecord` ADD CONSTRAINT `DailyFeedRecord_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyFeedRecord` ADD CONSTRAINT `DailyFeedRecord_administeredByEmployee_fkey` FOREIGN KEY (`administeredByEmployee`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyFeedRecord` ADD CONSTRAINT `DailyFeedRecord_administeredByAdmin_fkey` FOREIGN KEY (`administeredByAdmin`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

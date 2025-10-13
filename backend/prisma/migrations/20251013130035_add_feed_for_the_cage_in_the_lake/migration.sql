/*
  Warnings:

  - You are about to drop the `feed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `feed` DROP FOREIGN KEY `Feed_administeredByAdmin_fkey`;

-- DropForeignKey
ALTER TABLE `feed` DROP FOREIGN KEY `Feed_administeredByEmployee_fkey`;

-- DropForeignKey
ALTER TABLE `feed` DROP FOREIGN KEY `Feed_cageId_fkey`;

-- DropTable
DROP TABLE `feed`;

-- CreateTable
CREATE TABLE `FeedCage` (
    `id` VARCHAR(191) NOT NULL,
    `quantityGiven` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,
    `cageId` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeedCage_cageId_idx`(`cageId`),
    INDEX `FeedCage_employeeId_idx`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FeedCage` ADD CONSTRAINT `FeedCage_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedCage` ADD CONSTRAINT `FeedCage_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `FeedStock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedCage` ADD CONSTRAINT `FeedCage_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

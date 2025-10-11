-- AlterTable
ALTER TABLE `assetrequestitem` MODIFY `procurementStatus` ENUM('NOT_REQUIRED', 'REQUIRED', 'ORDERED', 'PARTIALLY_ORDERED', 'COMPLETED') NOT NULL DEFAULT 'NOT_REQUIRED';

-- CreateTable
CREATE TABLE `ParentFishPool` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

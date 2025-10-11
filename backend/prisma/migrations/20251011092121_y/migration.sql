-- AlterTable
ALTER TABLE `parentfishpool` ADD COLUMN `employeeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Medicine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `dosageForm` ENUM('LIQUID', 'POWDER', 'TABLET', 'CAPSULE', 'OTHER') NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `purchaseDate` DATETIME(3) NULL,
    `expiryDate` DATETIME(3) NULL,
    `pricePerUnit` DOUBLE NULL,
    `totalCost` DOUBLE NULL,
    `addedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParentFishPool` ADD CONSTRAINT `ParentFishPool_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_addedById_fkey` FOREIGN KEY (`addedById`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

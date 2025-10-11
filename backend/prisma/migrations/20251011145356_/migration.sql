-- CreateTable
CREATE TABLE `ParentEggMigration` (
    `id` VARCHAR(191) NOT NULL,
    `parentPoolId` VARCHAR(191) NOT NULL,
    `laboratoryBoxId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'DISCARDED') NOT NULL DEFAULT 'ACTIVE',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParentEggMigration` ADD CONSTRAINT `ParentEggMigration_parentPoolId_fkey` FOREIGN KEY (`parentPoolId`) REFERENCES `ParentFishPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentEggMigration` ADD CONSTRAINT `ParentEggMigration_laboratoryBoxId_fkey` FOREIGN KEY (`laboratoryBoxId`) REFERENCES `LaboratoryBox`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentEggMigration` ADD CONSTRAINT `ParentEggMigration_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

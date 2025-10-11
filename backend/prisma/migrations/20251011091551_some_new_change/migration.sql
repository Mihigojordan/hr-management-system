-- CreateTable
CREATE TABLE `ParentFishMedication` (
    `id` VARCHAR(191) NOT NULL,
    `parentFishPoolId` VARCHAR(191) NOT NULL,
    `medicationId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `dosage` DOUBLE NOT NULL,
    `dateGiven` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParentFishMedication` ADD CONSTRAINT `ParentFishMedication_parentFishPoolId_fkey` FOREIGN KEY (`parentFishPoolId`) REFERENCES `ParentFishPool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentFishMedication` ADD CONSTRAINT `ParentFishMedication_medicationId_fkey` FOREIGN KEY (`medicationId`) REFERENCES `Medicine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentFishMedication` ADD CONSTRAINT `ParentFishMedication_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

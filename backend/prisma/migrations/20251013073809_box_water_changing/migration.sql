-- CreateTable
CREATE TABLE `LaboratoryBoxWaterChanging` (
    `id` VARCHAR(191) NOT NULL,
    `boxId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `litersChanged` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaboratoryBoxWaterChanging` ADD CONSTRAINT `LaboratoryBoxWaterChanging_boxId_fkey` FOREIGN KEY (`boxId`) REFERENCES `LaboratoryBox`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaboratoryBoxWaterChanging` ADD CONSTRAINT `LaboratoryBoxWaterChanging_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

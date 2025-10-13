-- CreateTable
CREATE TABLE `PondMedication` (
    `id` VARCHAR(191) NOT NULL,
    `eggtoPondId` VARCHAR(191) NOT NULL,
    `medicationId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PondMedication` ADD CONSTRAINT `PondMedication_eggtoPondId_fkey` FOREIGN KEY (`eggtoPondId`) REFERENCES `EggToPondMigration`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PondMedication` ADD CONSTRAINT `PondMedication_medicationId_fkey` FOREIGN KEY (`medicationId`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PondMedication` ADD CONSTRAINT `PondMedication_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

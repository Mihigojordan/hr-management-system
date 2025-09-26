-- DropForeignKey
ALTER TABLE `medication` DROP FOREIGN KEY `Medication_cageId_fkey`;

-- DropIndex
DROP INDEX `Medication_cageId_fkey` ON `medication`;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

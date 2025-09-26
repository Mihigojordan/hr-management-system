-- DropForeignKey
ALTER TABLE `medication` DROP FOREIGN KEY `Medication_administeredBy_fkey`;

-- DropForeignKey
ALTER TABLE `medication` DROP FOREIGN KEY `Medication_cageId_fkey`;

-- DropIndex
DROP INDEX `Medication_administeredBy_fkey` ON `medication`;

-- DropIndex
DROP INDEX `Medication_cageId_fkey` ON `medication`;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`cageCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_administeredBy_fkey` FOREIGN KEY (`administeredBy`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

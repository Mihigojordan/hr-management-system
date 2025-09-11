-- AlterTable
ALTER TABLE `employee` ADD COLUMN `bank_account_number` VARCHAR(191) NULL,
    ADD COLUMN `bank_name` VARCHAR(191) NULL,
    ADD COLUMN `emergency_contact_name` VARCHAR(191) NULL,
    ADD COLUMN `emergency_contact_phone` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;

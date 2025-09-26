/*
  Warnings:

  - You are about to drop the column `manager_name` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `store` DROP COLUMN `manager_name`,
    ADD COLUMN `managerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

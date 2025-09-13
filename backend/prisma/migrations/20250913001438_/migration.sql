/*
  Warnings:

  - The primary key for the `applicant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `job` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `applicant` DROP FOREIGN KEY `Applicant_jobId_fkey`;

-- DropIndex
DROP INDEX `Applicant_jobId_fkey` ON `applicant`;

-- AlterTable
ALTER TABLE `applicant` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `jobId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `job` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

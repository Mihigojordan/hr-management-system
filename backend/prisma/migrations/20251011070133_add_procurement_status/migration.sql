/*
  Warnings:

  - The values [RECIEVED] on the enum `AssetRequest_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [RECIEVED] on the enum `AssetRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `assetrequest` MODIFY `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'RECEIVED', 'CLOSED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `assetrequestitem` ADD COLUMN `procurementStatus` ENUM('NOT_REQUIRED', 'REQUIRED', 'ORDERED', 'COMPLETED') NOT NULL DEFAULT 'NOT_REQUIRED',
    ADD COLUMN `quantityIssued` INTEGER NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('PENDING', 'ISSUED', 'PARTIALLY_ISSUED', 'PENDING_PROCUREMENT') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `request` MODIFY `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'RECEIVED', 'CLOSED') NOT NULL DEFAULT 'PENDING';

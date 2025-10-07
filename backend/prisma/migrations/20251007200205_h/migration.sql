/*
  Warnings:

  - The values [RECEIVED] on the enum `AssetRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `assetrequest` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ISSUED', 'PARTIALLY_ISSUED', 'CLOSED', 'RECIEVED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `request` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ISSUED', 'PARTIALLY_ISSUED', 'CLOSED', 'RECIEVED') NOT NULL DEFAULT 'PENDING';

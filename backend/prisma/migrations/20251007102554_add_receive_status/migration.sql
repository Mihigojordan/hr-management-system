/*
  Warnings:

  - You are about to drop the column `qtyApproved` on the `requestitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `request` MODIFY `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'RECEVIED', 'CLOSED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `requestitem` DROP COLUMN `qtyApproved`;

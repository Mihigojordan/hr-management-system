/*
  Warnings:

  - You are about to drop the `assetrequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assetrequestitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assetrequest` DROP FOREIGN KEY `AssetRequest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `assetrequestitem` DROP FOREIGN KEY `AssetRequestItem_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `assetrequestitem` DROP FOREIGN KEY `AssetRequestItem_requestId_fkey`;

-- DropTable
DROP TABLE `assetrequest`;

-- DropTable
DROP TABLE `assetrequestitem`;

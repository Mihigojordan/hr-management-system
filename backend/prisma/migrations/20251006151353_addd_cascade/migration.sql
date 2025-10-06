-- DropForeignKey
ALTER TABLE `requestitem` DROP FOREIGN KEY `RequestItem_requestId_fkey`;

-- DropForeignKey
ALTER TABLE `requestitem` DROP FOREIGN KEY `RequestItem_stockInId_fkey`;

-- DropIndex
DROP INDEX `RequestItem_requestId_fkey` ON `requestitem`;

-- DropIndex
DROP INDEX `RequestItem_stockInId_fkey` ON `requestitem`;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

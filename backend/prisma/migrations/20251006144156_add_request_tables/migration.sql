-- CreateTable
CREATE TABLE `Request` (
    `id` VARCHAR(191) NOT NULL,
    `ref_no` VARCHAR(50) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `requestedByAdminId` VARCHAR(191) NULL,
    `requestedByEmployeeId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `receivedAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `closedByAdminId` VARCHAR(191) NULL,
    `closedByEmployeeId` VARCHAR(191) NULL,
    `issuedAt` DATETIME(3) NULL,
    `issuedByAdminId` VARCHAR(191) NULL,
    `issuedByEmployeeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Request_ref_no_key`(`ref_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestItem` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `stockInId` VARCHAR(191) NOT NULL,
    `qtyRequested` DECIMAL(12, 3) NOT NULL,
    `qtyApproved` DECIMAL(12, 3) NULL,
    `qtyIssued` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `qtyRemaining` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `qtyReceived` DECIMAL(12, 3) NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockHistory` (
    `id` VARCHAR(191) NOT NULL,
    `stockInId` VARCHAR(191) NOT NULL,
    `movementType` ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    `sourceType` ENUM('GRN', 'ISSUE', 'ADJUSTMENT', 'RECEIPT') NOT NULL,
    `sourceId` VARCHAR(191) NULL,
    `qtyBefore` DECIMAL(12, 3) NOT NULL,
    `qtyChange` DECIMAL(12, 3) NOT NULL,
    `qtyAfter` DECIMAL(12, 3) NOT NULL,
    `unitPrice` DECIMAL(12, 2) NULL,
    `notes` TEXT NULL,
    `createdByAdminId` VARCHAR(191) NULL,
    `createdByEmployeeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_requestedByAdminId_fkey` FOREIGN KEY (`requestedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_requestedByEmployeeId_fkey` FOREIGN KEY (`requestedByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_closedByAdminId_fkey` FOREIGN KEY (`closedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_closedByEmployeeId_fkey` FOREIGN KEY (`closedByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_issuedByAdminId_fkey` FOREIGN KEY (`issuedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_issuedByEmployeeId_fkey` FOREIGN KEY (`issuedByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Request`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_createdByEmployeeId_fkey` FOREIGN KEY (`createdByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

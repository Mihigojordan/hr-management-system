-- CreateTable
CREATE TABLE `StockCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StockCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockIn` (
    `id` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `unit` ENUM('PCS', 'KG', 'LITERS', 'METER', 'BOX', 'PACK', 'OTHER') NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `reorderLevel` INTEGER NULL DEFAULT 1,
    `supplier` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `stockcategoryId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StockIn_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_stockcategoryId_fkey` FOREIGN KEY (`stockcategoryId`) REFERENCES `StockCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

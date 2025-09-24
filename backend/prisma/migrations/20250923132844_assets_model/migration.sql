-- CreateTable
CREATE TABLE `Asset` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('MACHINERY', 'VEHICLE', 'BUILDING', 'EQUIPMENT', 'SOFTWARE', 'OTHER') NOT NULL,
    `description` VARCHAR(191) NULL,
    `assetImg` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `purchaseDate` DATETIME(3) NULL,
    `purchaseCost` DOUBLE NULL,
    `status` ENUM('ACTIVE', 'MAINTENANCE', 'RETIRED', 'DISPOSED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

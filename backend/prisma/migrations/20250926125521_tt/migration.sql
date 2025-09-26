-- CreateTable
CREATE TABLE `Cage` (
    `id` VARCHAR(191) NOT NULL,
    `cageCode` VARCHAR(191) NOT NULL,
    `cageName` VARCHAR(191) NOT NULL,
    `cageNetType` ENUM('FINGERLING', 'JUVENILE', 'ADULT') NOT NULL,
    `cageDepth` DOUBLE NOT NULL,
    `cageStatus` ENUM('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE') NOT NULL,
    `cageCapacity` INTEGER NOT NULL,
    `cageType` VARCHAR(191) NULL,
    `cageVolume` DOUBLE NULL,
    `stockingDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Cage_cageCode_key`(`cageCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

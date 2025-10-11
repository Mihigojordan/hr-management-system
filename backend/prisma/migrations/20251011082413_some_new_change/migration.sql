-- CreateTable
CREATE TABLE `ParentFishFeeding` (
    `id` VARCHAR(191) NOT NULL,
    `parentFishPoolId` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParentFishFeeding` ADD CONSTRAINT `ParentFishFeeding_parentFishPoolId_fkey` FOREIGN KEY (`parentFishPoolId`) REFERENCES `ParentFishPool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentFishFeeding` ADD CONSTRAINT `ParentFishFeeding_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `FeedStock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentFishFeeding` ADD CONSTRAINT `ParentFishFeeding_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

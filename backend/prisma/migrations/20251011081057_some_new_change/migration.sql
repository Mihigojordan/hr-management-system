-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `adminName` VARCHAR(191) NULL,
    `adminEmail` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `google_id` VARCHAR(191) NULL,
    `is2FA` BOOLEAN NULL DEFAULT false,
    `isLocked` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_id_key`(`id`),
    UNIQUE INDEX `Admin_adminEmail_key`(`adminEmail`),
    UNIQUE INDEX `Admin_google_id_key`(`google_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `date_of_birth` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `national_id` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NULL,
    `bank_account_number` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `cv` VARCHAR(191) NULL,
    `application_letter` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NULL DEFAULT 'SINGLE',
    `date_hired` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'TERMINATED', 'RESIGNED', 'PROBATION') NOT NULL DEFAULT 'ACTIVE',
    `experience` JSON NULL,
    `emergency_contact_name` VARCHAR(191) NULL,
    `emergency_contact_phone` VARCHAR(191) NULL,
    `google_id` VARCHAR(191) NULL,
    `isLocked` BOOLEAN NULL DEFAULT false,
    `is2FA` BOOLEAN NULL DEFAULT false,
    `siteId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_id_key`(`id`),
    UNIQUE INDEX `Employee_email_key`(`email`),
    UNIQUE INDEX `Employee_national_id_key`(`national_id`),
    UNIQUE INDEX `Employee_google_id_key`(`google_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contract` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `contractType` ENUM('PERMANENT', 'TEMPORARY', 'INTERNSHIP') NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `salary` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'RWF',
    `benefits` VARCHAR(191) NULL,
    `workingHours` VARCHAR(191) NULL,
    `probationPeriod` VARCHAR(191) NULL,
    `terminationConditions` VARCHAR(191) NULL,
    `terms` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `location` VARCHAR(191) NOT NULL,
    `employment_type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP') NOT NULL,
    `experience_level` ENUM('ENTRY', 'MID', 'SENIOR', 'EXECUTIVE') NOT NULL,
    `industry` VARCHAR(191) NULL,
    `skills_required` JSON NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `posted_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiry_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applicant` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `cvUrl` VARCHAR(191) NULL,
    `skills` JSON NULL,
    `experienceYears` INTEGER NULL,
    `education` JSON NULL,
    `coverLetter` TEXT NULL,
    `start_date` DATETIME(3) NULL,
    `stage` ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'HIRED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `profileImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `adminId` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `managerId` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `contact_email` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Store_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Site` (
    `id` VARCHAR(191) NOT NULL,
    `siteCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `siteImg` VARCHAR(191) NULL,
    `managerId` VARCHAR(191) NULL,
    `supervisorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Site_siteCode_key`(`siteCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Medication` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `method` ENUM('FEED', 'BATH', 'WATER', 'INJECTION') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `cageId` VARCHAR(191) NOT NULL,
    `administeredByEmployee` VARCHAR(191) NULL,
    `administeredByAdmin` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feed` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('PELLET', 'SEED', 'FRUIT', 'VEGETABLE', 'INSECT', 'OTHER') NOT NULL,
    `proteinContent` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantityGiven` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,
    `cageId` VARCHAR(191) NOT NULL,
    `administeredByEmployee` VARCHAR(191) NULL,
    `administeredByAdmin` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Feed_cageId_idx`(`cageId`),
    INDEX `Feed_administeredByEmployee_idx`(`administeredByEmployee`),
    INDEX `Feed_administeredByAdmin_idx`(`administeredByAdmin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Request` (
    `id` VARCHAR(191) NOT NULL,
    `ref_no` VARCHAR(50) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `requestedByAdminId` VARCHAR(191) NULL,
    `requestedByEmployeeId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'RECEIVED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `receivedAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `closedByAdminId` VARCHAR(191) NULL,
    `closedByEmployeeId` VARCHAR(191) NULL,
    `issuedAt` DATETIME(3) NULL,
    `issuedByAdminId` VARCHAR(191) NULL,
    `issuedByEmployeeId` VARCHAR(191) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `rejectedByAdminId` VARCHAR(191) NULL,
    `rejectedByEmployeeId` VARCHAR(191) NULL,
    `comments` JSON NULL,
    `attachments` JSON NULL,
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
    `qtyIssued` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `qtyRemaining` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `qtyReceived` DECIMAL(12, 3) NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetRequest` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED', 'RECEIVED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetRequestItem` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `quantityIssued` INTEGER NULL DEFAULT 0,
    `status` ENUM('PENDING', 'ISSUED', 'PARTIALLY_ISSUED', 'PENDING_PROCUREMENT') NOT NULL DEFAULT 'PENDING',
    `procurementStatus` ENUM('NOT_REQUIRED', 'REQUIRED', 'ORDERED', 'PARTIALLY_ORDERED', 'COMPLETED') NOT NULL DEFAULT 'NOT_REQUIRED',
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

-- CreateTable
CREATE TABLE `ParentFishPool` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ParentFishPool_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedStock` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `lowStockLevel` INTEGER NULL DEFAULT 1,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_manager_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_supervisor_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_administeredByEmployee_fkey` FOREIGN KEY (`administeredByEmployee`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_administeredByAdmin_fkey` FOREIGN KEY (`administeredByAdmin`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_cageId_fkey` FOREIGN KEY (`cageId`) REFERENCES `Cage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_administeredByEmployee_fkey` FOREIGN KEY (`administeredByEmployee`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_administeredByAdmin_fkey` FOREIGN KEY (`administeredByAdmin`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_stockcategoryId_fkey` FOREIGN KEY (`stockcategoryId`) REFERENCES `StockCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `Request` ADD CONSTRAINT `Request_rejectedByAdminId_fkey` FOREIGN KEY (`rejectedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_rejectedByEmployeeId_fkey` FOREIGN KEY (`rejectedByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItem` ADD CONSTRAINT `RequestItem_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetRequest` ADD CONSTRAINT `AssetRequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetRequestItem` ADD CONSTRAINT `AssetRequestItem_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `AssetRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetRequestItem` ADD CONSTRAINT `AssetRequestItem_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Request`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_createdByEmployeeId_fkey` FOREIGN KEY (`createdByEmployeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

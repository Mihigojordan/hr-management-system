-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_departmentId_fkey`;

-- DropIndex
DROP INDEX `Contract_employeeId_fkey` ON `contract`;

-- DropIndex
DROP INDEX `Employee_departmentId_fkey` ON `employee`;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

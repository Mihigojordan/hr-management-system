/*
  Warnings:

  - You are about to alter the column `type` on the `feed` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(14))`.

*/
-- AlterTable
ALTER TABLE `feed` MODIFY `type` ENUM('PELLET', 'SEED', 'FRUIT', 'VEGETABLE', 'INSECT', 'OTHER') NOT NULL;

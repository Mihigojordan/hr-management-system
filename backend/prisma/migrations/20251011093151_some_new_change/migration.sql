/*
  Warnings:

  - You are about to drop the column `dateGiven` on the `parentfishmedication` table. All the data in the column will be lost.
  - You are about to drop the column `dosage` on the `parentfishmedication` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `ParentFishMedication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parentfishmedication` DROP COLUMN `dateGiven`,
    DROP COLUMN `dosage`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

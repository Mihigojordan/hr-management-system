/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ParentFishPool` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ParentFishPool_name_key` ON `ParentFishPool`(`name`);

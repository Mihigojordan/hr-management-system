/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Admin_google_id_key` ON `Admin`(`google_id`);

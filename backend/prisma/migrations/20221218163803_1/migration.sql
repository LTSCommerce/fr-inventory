/*
  Warnings:

  - Added the required column `updatedAt` to the `Responder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ResponderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `responder` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `responderitem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

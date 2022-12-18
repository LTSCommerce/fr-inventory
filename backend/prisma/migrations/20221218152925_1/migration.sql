-- CreateTable
CREATE TABLE `ItemType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `hasExpiryDate` BOOLEAN NOT NULL DEFAULT false,
    `minimum` INTEGER NOT NULL DEFAULT 1,
    `hasBattery` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Responder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `callsign` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResponderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemTypeId` INTEGER NOT NULL,
    `responderId` INTEGER NOT NULL,
    `expiry` DATETIME(3) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResponderItem` ADD CONSTRAINT `ResponderItem_itemTypeId_fkey` FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResponderItem` ADD CONSTRAINT `ResponderItem_responderId_fkey` FOREIGN KEY (`responderId`) REFERENCES `Responder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

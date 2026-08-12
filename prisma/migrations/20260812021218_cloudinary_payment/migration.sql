-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `paymentReceiptPublicId` VARCHAR(191) NULL,
    ADD COLUMN `paymentReceiptUrl` VARCHAR(191) NULL,
    ADD COLUMN `paymentSubmittedAt` DATETIME(3) NULL,
    ADD COLUMN `paymentVerifiedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Ground` ADD COLUMN `paymentQrPublicId` VARCHAR(191) NULL,
    ADD COLUMN `paymentQrUrl` VARCHAR(191) NULL;

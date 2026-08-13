-- DropIndex
DROP INDEX `User_resetToken_key` ON `User`;

-- AlterTable
ALTER TABLE `GroundImage` ADD COLUMN `publicId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PlayerProfile` ADD COLUMN `profileImagePublicId` VARCHAR(191) NULL;

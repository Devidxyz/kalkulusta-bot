-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_msgId_fkey`;

-- AlterTable
ALTER TABLE `Reaction` ADD COLUMN `ratingId` INTEGER NULL;

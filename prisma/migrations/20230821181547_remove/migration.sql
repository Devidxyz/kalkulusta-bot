/*
  Warnings:

  - You are about to drop the column `ratingId` on the `Reaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Reaction_msgId_fkey` ON `Reaction`;

-- AlterTable
ALTER TABLE `Reaction` DROP COLUMN `ratingId`;

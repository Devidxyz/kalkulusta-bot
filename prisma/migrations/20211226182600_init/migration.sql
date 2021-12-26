/*
  Warnings:

  - Added the required column `channelId` to the `RatingStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RatingStatus` ADD COLUMN `channelId` CHAR(18) NOT NULL;

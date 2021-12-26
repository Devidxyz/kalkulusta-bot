-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(18) NOT NULL,
    `channelId` CHAR(18) NOT NULL,
    `deleted` BOOLEAN NOT NULL,
    `ratingMsgId` INTEGER NOT NULL,

    UNIQUE INDEX `Rating_ratingMsgId_key`(`ratingMsgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatingMsg` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `msgId` CHAR(18) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `text` VARCHAR(1024) NOT NULL,
    `aspect1` TINYINT NOT NULL,
    `aspect2` TINYINT NOT NULL,
    `aspect3` TINYINT NOT NULL,
    `aspect4` TINYINT NOT NULL,
    `aspect5` TINYINT NOT NULL,
    `sexy` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatingStatus` (
    `userId` CHAR(18) NOT NULL,
    `ratingMsgId` INTEGER NULL,

    UNIQUE INDEX `RatingStatus_ratingMsgId_key`(`ratingMsgId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(18) NOT NULL,
    `reason` VARCHAR(1024) NULL,
    `ratingId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryMessage` (
    `channelId` CHAR(18) NOT NULL,
    `msgId` CHAR(18) NOT NULL,

    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_ratingMsgId_fkey` FOREIGN KEY (`ratingMsgId`) REFERENCES `RatingMsg`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatingStatus` ADD CONSTRAINT `RatingStatus_ratingMsgId_fkey` FOREIGN KEY (`ratingMsgId`) REFERENCES `RatingMsg`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_ratingId_fkey` FOREIGN KEY (`ratingId`) REFERENCES `Rating`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

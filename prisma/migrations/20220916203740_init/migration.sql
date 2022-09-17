-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` CHAR(18) NOT NULL,
    `channelId` CHAR(18) NOT NULL,
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
    `deleted` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
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
ALTER TABLE `Report` ADD CONSTRAINT `Report_ratingId_fkey` FOREIGN KEY (`ratingId`) REFERENCES `Rating`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

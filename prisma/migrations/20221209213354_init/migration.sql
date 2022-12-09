-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `channelId` VARCHAR(20) NOT NULL,
    `msgId` VARCHAR(20) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject` VARCHAR(100) NOT NULL,
    `text` VARCHAR(1024) NOT NULL,
    `aspect1` TINYINT NOT NULL,
    `aspect2` TINYINT NOT NULL,
    `aspect3` TINYINT NOT NULL,
    `aspect4` TINYINT NOT NULL,
    `aspect5` TINYINT NOT NULL,
    `sexy` BOOLEAN NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Rating_msgId_key`(`msgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `reason` VARCHAR(1024) NULL,
    `ratingId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryMessage` (
    `channelId` VARCHAR(20) NOT NULL,
    `msgId` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reaction` (
    `userId` VARCHAR(191) NOT NULL,
    `msgId` VARCHAR(191) NOT NULL,
    `positive` BOOLEAN NOT NULL,

    PRIMARY KEY (`userId`, `msgId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_ratingId_fkey` FOREIGN KEY (`ratingId`) REFERENCES `Rating`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_msgId_fkey` FOREIGN KEY (`msgId`) REFERENCES `Rating`(`msgId`) ON DELETE CASCADE ON UPDATE CASCADE;

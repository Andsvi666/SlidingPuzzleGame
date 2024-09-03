-- CreateTable
CREATE TABLE `game_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user` INTEGER NOT NULL,
    `selectedImage` INTEGER NOT NULL,
    `selectedSettings` INTEGER NOT NULL,

    INDEX `selectedImage`(`selectedImage`, `selectedSettings`),
    INDEX `selectedSettings`(`selectedSettings`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `isChallangeMode` BOOLEAN NOT NULL,
    `player` INTEGER NOT NULL,
    `image` INTEGER NOT NULL,
    `settings` INTEGER NOT NULL,
    `resultsDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `image`(`image`, `settings`),
    INDEX `player`(`player`),
    INDEX `game_results_ibfk_3`(`settings`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `difficultyName` VARCHAR(100) NOT NULL,
    `imageSegments` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageName` VARCHAR(100) NOT NULL,
    `isApproved` BOOLEAN NOT NULL,
    `userAuthor` INTEGER NOT NULL,
    `uploadDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `userAuthor`(`userAuthor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logType` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `server_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logText` VARCHAR(250) NOT NULL,
    `user` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `dateTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `type`(`type`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `type` INTEGER NOT NULL,
    `registrationDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userType` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_profiles` ADD CONSTRAINT `game_profiles_ibfk_1` FOREIGN KEY (`selectedSettings`) REFERENCES `game_settings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_profiles` ADD CONSTRAINT `game_profiles_ibfk_2` FOREIGN KEY (`selectedImage`) REFERENCES `images`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_profiles` ADD CONSTRAINT `game_profiles_ibfk_3` FOREIGN KEY (`user`) REFERENCES `user_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ibfk_2` FOREIGN KEY (`image`) REFERENCES `images`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ibfk_3` FOREIGN KEY (`settings`) REFERENCES `game_settings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ibfk_4` FOREIGN KEY (`player`) REFERENCES `user_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`userAuthor`) REFERENCES `user_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `server_logs` ADD CONSTRAINT `server_logs_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `server_logs` ADD CONSTRAINT `server_logs_ibfk_2` FOREIGN KEY (`type`) REFERENCES `log_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`type`) REFERENCES `user_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


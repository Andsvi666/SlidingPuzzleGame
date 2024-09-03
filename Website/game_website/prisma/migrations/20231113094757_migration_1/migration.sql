/*
  Warnings:

  - You are about to drop the column `imageSegments` on the `game_settings` table. All the data in the column will be lost.
  - You are about to drop the column `logType` on the `log_types` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `user_types` table. All the data in the column will be lost.
  - Added the required column `ImageSegments` to the `game_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logtype` to the `log_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picturesCount` to the `user_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usertype` to the `user_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `game_results` DROP FOREIGN KEY `game_results_ibfk_2`;

-- DropForeignKey
ALTER TABLE `game_results` DROP FOREIGN KEY `game_results_ibfk_4`;

-- DropForeignKey
ALTER TABLE `server_logs` DROP FOREIGN KEY `server_logs_ibfk_1`;

-- DropForeignKey
ALTER TABLE `server_logs` DROP FOREIGN KEY `server_logs_ibfk_2`;

-- AlterTable
ALTER TABLE `game_profiles` MODIFY `selectedImage` INTEGER NOT NULL DEFAULT 1,
    MODIFY `selectedSettings` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `game_settings` DROP COLUMN `imageSegments`,
    ADD COLUMN `ImageSegments` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `log_types` DROP COLUMN `logType`,
    ADD COLUMN `logtype` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `user_profiles` ADD COLUMN `picturesCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_types` DROP COLUMN `userType`,
    ADD COLUMN `usertype` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ibfk_4` FOREIGN KEY (`player`) REFERENCES `user_profiles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ibfk_5` FOREIGN KEY (`image`) REFERENCES `images`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `server_logs` ADD CONSTRAINT `server_logs_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user_profiles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `server_logs` ADD CONSTRAINT `server_logs_ibfk_2` FOREIGN KEY (`type`) REFERENCES `log_types`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

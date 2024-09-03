/*
  Warnings:

  - You are about to drop the column `ImageSegments` on the `game_settings` table. All the data in the column will be lost.
  - Added the required column `imageSegments` to the `game_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game_settings` DROP COLUMN `ImageSegments`,
    ADD COLUMN `imageSegments` INTEGER NOT NULL;

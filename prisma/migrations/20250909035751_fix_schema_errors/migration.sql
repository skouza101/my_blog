/*
  Warnings:

  - You are about to drop the column `comment` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "comment",
DROP COLUMN "like";

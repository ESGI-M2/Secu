/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "lastname" TEXT;

-- DropTable
DROP TABLE "Movie";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorCode" TEXT,
ADD COLUMN     "twoFactorCodeExpires" TIMESTAMP(3);

/*
  Warnings:

  - Added the required column `role` to the `AccountActivation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountActivation" ADD COLUMN     "role" "Role" NOT NULL;

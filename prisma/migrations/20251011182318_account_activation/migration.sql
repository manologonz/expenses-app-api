-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AccountActivation" (
    "id" SERIAL NOT NULL,
    "activationToken" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountActivation_pkey" PRIMARY KEY ("id")
);

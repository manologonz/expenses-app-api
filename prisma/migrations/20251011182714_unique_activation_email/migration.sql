/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AccountActivation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccountActivation_email_key" ON "AccountActivation"("email");

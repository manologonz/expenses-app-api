/*
  Warnings:

  - You are about to drop the `TagsOnPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_tagId_fkey";

-- DropTable
DROP TABLE "public"."TagsOnPosts";

-- CreateTable
CREATE TABLE "_ExpenseToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExpenseToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExpenseToTag_B_index" ON "_ExpenseToTag"("B");

-- AddForeignKey
ALTER TABLE "_ExpenseToTag" ADD CONSTRAINT "_ExpenseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToTag" ADD CONSTRAINT "_ExpenseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

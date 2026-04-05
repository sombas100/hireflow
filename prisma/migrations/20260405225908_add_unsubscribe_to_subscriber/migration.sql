/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribeToken]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unsubscribeToken` to the `Subscriber` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "isSubscribed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "unsubscribeToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_unsubscribeToken_key" ON "Subscriber"("unsubscribeToken");

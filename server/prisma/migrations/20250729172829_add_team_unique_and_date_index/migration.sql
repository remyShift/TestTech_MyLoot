/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "CoinEarning_date_idx" ON "CoinEarning"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

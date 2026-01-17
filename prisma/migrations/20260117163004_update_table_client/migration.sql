/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "client_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "client_cnpj_key" ON "client"("cnpj");

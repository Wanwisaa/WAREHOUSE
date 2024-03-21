/*
  Warnings:

  - You are about to drop the column `จำนวน` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `ชื่อสินค้า` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `รหัสสินค้า` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `รายละเอียด` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `สถานที่เก็บ` on the `products` table. All the data in the column will be lost.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePlace` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storagePlace" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL
);
INSERT INTO "new_products" ("id") SELECT "id" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

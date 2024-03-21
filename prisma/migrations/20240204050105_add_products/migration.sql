-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "รหัสสินค้า" TEXT NOT NULL,
    "ชื่อสินค้า" TEXT NOT NULL,
    "รายละเอียด" TEXT NOT NULL,
    "สถานที่เก็บ" TEXT NOT NULL,
    "จำนวน" INTEGER NOT NULL
);

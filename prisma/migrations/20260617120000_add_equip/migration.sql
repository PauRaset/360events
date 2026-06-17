-- CreateTable
CREATE TABLE "Equip" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcio" TEXT,
    "fotos" TEXT[],
    "destacat" BOOLEAN NOT NULL DEFAULT false,
    "actiu" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equip_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "FotoGaleria" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titol" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actiu" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoGaleria_pkey" PRIMARY KEY ("id")
);


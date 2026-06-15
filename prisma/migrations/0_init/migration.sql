-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstatReserva" AS ENUM ('NOVA', 'EN_REVISIO', 'PRESSUPOST_ENVIAT', 'CONFIRMADA', 'CANCELLADA');

-- CreateTable
CREATE TABLE "Artista" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcio" TEXT NOT NULL,
    "riderTecnic" TEXT,
    "fotos" TEXT[],
    "videos" TEXT[],
    "destacat" BOOLEAN NOT NULL DEFAULT false,
    "actiu" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipusEvent" TEXT NOT NULL,
    "dataEvent" TIMESTAMP(3) NOT NULL,
    "ubicacio" TEXT NOT NULL,
    "assistents" INTEGER,
    "missatge" TEXT,
    "artistaId" TEXT,
    "servei" TEXT,
    "estat" "EstatReserva" NOT NULL DEFAULT 'NOVA',
    "gcalEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artista_slug_key" ON "Artista"("slug");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE SET NULL ON UPDATE CASCADE;


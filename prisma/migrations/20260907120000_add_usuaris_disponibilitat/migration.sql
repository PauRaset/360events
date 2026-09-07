-- CreateEnum
CREATE TYPE "RolUsuari" AS ENUM ('ADMIN', 'ARTISTA');

-- CreateEnum
CREATE TYPE "EstatDia" AS ENUM ('OCUPAT', 'RESERVAT');

-- CreateTable
CREATE TABLE "Usuari" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuari" NOT NULL DEFAULT 'ARTISTA',
    "artistaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disponibilitat" (
    "id" TEXT NOT NULL,
    "artistaId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "estat" "EstatDia" NOT NULL DEFAULT 'OCUPAT',
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Disponibilitat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuari_email_key" ON "Usuari"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuari_artistaId_key" ON "Usuari"("artistaId");

-- CreateIndex
CREATE UNIQUE INDEX "Disponibilitat_artistaId_data_key" ON "Disponibilitat"("artistaId", "data");

-- AddForeignKey
ALTER TABLE "Usuari" ADD CONSTRAINT "Usuari_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilitat" ADD CONSTRAINT "Disponibilitat_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE CASCADE ON UPDATE CASCADE;


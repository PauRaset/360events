-- CreateEnum
CREATE TYPE "EstatPressupost" AS ENUM ('ESBORRANY', 'ENVIAT', 'SIGNAT', 'REBUTJAT', 'CANCELLAT');

-- CreateTable
CREATE TABLE "Pressupost" (
    "id" TEXT NOT NULL,
    "codi" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "estat" "EstatPressupost" NOT NULL DEFAULT 'ESBORRANY',
    "artistaId" TEXT,
    "reservaId" TEXT,
    "clientNom" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientTelefon" TEXT,
    "tipusEvent" TEXT,
    "dataEvent" DATE NOT NULL,
    "horaInici" TEXT,
    "ubicacio" TEXT,
    "concepte" TEXT NOT NULL,
    "condicions" TEXT,
    "importCentims" INTEGER NOT NULL,
    "signatNom" TEXT,
    "signatDni" TEXT,
    "signatData" TIMESTAMP(3),
    "signatIp" TEXT,
    "signatUserAgent" TEXT,
    "signatHash" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pressupost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pressupost_codi_key" ON "Pressupost"("codi");

-- CreateIndex
CREATE UNIQUE INDEX "Pressupost_token_key" ON "Pressupost"("token");

-- AddForeignKey
ALTER TABLE "Pressupost" ADD CONSTRAINT "Pressupost_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pressupost" ADD CONSTRAINT "Pressupost_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE SET NULL ON UPDATE CASCADE;


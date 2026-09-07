-- ============================================================
-- 360Events.cat · Migració: Pressupost (pressupostos i contractes)
-- Enganxa i executa al SQL Editor de Neon. Idempotent.
-- ============================================================

DO $$ BEGIN
  CREATE TYPE "EstatPressupost" AS ENUM ('ESBORRANY', 'ENVIAT', 'SIGNAT', 'REBUTJAT', 'CANCELLAT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "Pressupost" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "Pressupost_codi_key" ON "Pressupost"("codi");
CREATE UNIQUE INDEX IF NOT EXISTS "Pressupost_token_key" ON "Pressupost"("token");

DO $$ BEGIN
  ALTER TABLE "Pressupost" ADD CONSTRAINT "Pressupost_artistaId_fkey"
    FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Pressupost" ADD CONSTRAINT "Pressupost_reservaId_fkey"
    FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Registre de la migració a Prisma
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT '2932fac3-c7a2-4b50-a426-c6fa8122979f', 'd61d367089861e65d910a68ad105f6aa2ed53e600142ac7b891405bbc078ef37', now(), '20260907130000_add_pressupostos', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20260907130000_add_pressupostos'
);

-- Verificació
SELECT count(*) AS pressupostos FROM "Pressupost";

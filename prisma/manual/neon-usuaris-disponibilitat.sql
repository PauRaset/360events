-- ============================================================
-- 360Events.cat · Migració: Usuari + Disponibilitat
-- Enganxa i executa al SQL Editor de Neon. Idempotent.
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE "RolUsuari" AS ENUM ('ADMIN', 'ARTISTA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EstatDia" AS ENUM ('OCUPAT', 'RESERVAT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Taula Usuari
CREATE TABLE IF NOT EXISTS "Usuari" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuari" NOT NULL DEFAULT 'ARTISTA',
    "artistaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usuari_pkey" PRIMARY KEY ("id")
);

-- Taula Disponibilitat
CREATE TABLE IF NOT EXISTS "Disponibilitat" (
    "id" TEXT NOT NULL,
    "artistaId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "estat" "EstatDia" NOT NULL DEFAULT 'OCUPAT',
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Disponibilitat_pkey" PRIMARY KEY ("id")
);

-- Índexs únics
CREATE UNIQUE INDEX IF NOT EXISTS "Usuari_email_key" ON "Usuari"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Usuari_artistaId_key" ON "Usuari"("artistaId");
CREATE UNIQUE INDEX IF NOT EXISTS "Disponibilitat_artistaId_data_key" ON "Disponibilitat"("artistaId", "data");

-- Claus foranes
DO $$ BEGIN
  ALTER TABLE "Usuari" ADD CONSTRAINT "Usuari_artistaId_fkey"
    FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Disponibilitat" ADD CONSTRAINT "Disponibilitat_artistaId_fkey"
    FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Registre de la migració a Prisma
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT 'dda57f5f-0897-4f69-ad1c-e2116bd28248', '7f9127ba0cfa63e4e6e4abee9ed91b45fcf26dc706b05c4bbb2736b7c6b33b04', now(), '20260907120000_add_usuaris_disponibilitat', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20260907120000_add_usuaris_disponibilitat'
);

-- Verificació
SELECT 'Usuari' AS taula, count(*) FROM "Usuari"
UNION ALL SELECT 'Disponibilitat', count(*) FROM "Disponibilitat";

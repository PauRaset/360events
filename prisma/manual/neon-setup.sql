-- ============================================================
-- 360Events.cat · Bootstrap inicial de la base de dades
-- Enganxa i executa aquest fitxer al SQL Editor de Neon.
-- Idempotent: es pot executar més d'un cop sense error.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- Enum EstatReserva
DO $$ BEGIN
  CREATE TYPE "EstatReserva" AS ENUM ('NOVA', 'EN_REVISIO', 'PRESSUPOST_ENVIAT', 'CONFIRMADA', 'CANCELLADA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Taula Artista
CREATE TABLE IF NOT EXISTS "Artista" (
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

-- Taula Reserva
CREATE TABLE IF NOT EXISTS "Reserva" (
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

-- Índex únic de slug
CREATE UNIQUE INDEX IF NOT EXISTS "Artista_slug_key" ON "Artista"("slug");

-- Clau forana Reserva -> Artista
DO $$ BEGIN
  ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_artistaId_fkey"
    FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- Taula de control de migracions de Prisma
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT 'da1da4e5-1d60-4aff-8639-9c3dfe71e049', '2f65427ea1153c45e917cc26f20fe1a94442b276b3a149d8512d3f66b68fc36b', now(), '0_init', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '0_init'
);

-- Seed: 3 artistes destacats
INSERT INTO "Artista" (id, slug, nom, categoria, descripcio, "riderTecnic", fotos, videos, destacat, actiu)
VALUES ('art_la_montecarlo', 'la-montecarlo', 'La Montecarlo', 'Orquestra · Versions', 'Una orquestra versàtil que omple la pista amb els grans èxits de totes les èpoques. De la rumba al pop actual, La Montecarlo aporta espectacle, vestuari i una posada en escena pensada per fer ballar tothom, des de la sobretaula fins a l’última cançó.', 'Escenari mínim 6×4 m. Connexió elèctrica 380V / 32A. So i llums propis (poden adaptar-se a l’equip de la sala). Temps de muntatge: 3 h. Camerino amb aigua i refrigeri per a 8 músics.', ARRAY[]::text[], ARRAY[]::text[], true, true)
ON CONFLICT (slug) DO UPDATE SET
  nom = EXCLUDED.nom,
  categoria = EXCLUDED.categoria,
  descripcio = EXCLUDED.descripcio,
  "riderTecnic" = EXCLUDED."riderTecnic",
  destacat = EXCLUDED.destacat;

INSERT INTO "Artista" (id, slug, nom, categoria, descripcio, "riderTecnic", fotos, videos, destacat, actiu)
VALUES ('art_dj_pep_maso', 'dj-pep-maso', 'DJ Pep Masó', 'DJ · Sessions', 'DJ resident amb més de quinze anys fent vibrar pistes d’arreu de Catalunya. Sessions open format que llegeixen el públic en temps real: house, comercial, llatí i clàssics atemporals. Ideal per a casaments, festes privades i esdeveniments d’empresa que volen una nit rodona.', 'Taula DJ Pioneer (CDJ + DJM) o equivalent. Punt de llum sobre cabina. Connexió elèctrica estable. Pot aportar equip de so per a esdeveniments de fins a 300 persones.', ARRAY[]::text[], ARRAY[]::text[], true, true)
ON CONFLICT (slug) DO UPDATE SET
  nom = EXCLUDED.nom,
  categoria = EXCLUDED.categoria,
  descripcio = EXCLUDED.descripcio,
  "riderTecnic" = EXCLUDED."riderTecnic",
  destacat = EXCLUDED.destacat;

INSERT INTO "Artista" (id, slug, nom, categoria, descripcio, "riderTecnic", fotos, videos, destacat, actiu)
VALUES ('art_laia_manetti', 'laia-manetti', 'Laia Manetti', 'Veu · Directe', 'Veu elegant i propera per als moments que demanen emoció. Laia Manetti acompanya cerimònies, còctels i sopars amb un repertori acústic de jazz, soul i versions delicades. Format flexible: des de veu i piano fins a trio en directe.', 'Dos monitors de terra, microfonia vocal i DI per a teclat. Espai mínim 3×2 m. Prova de so 1 h abans de l’esdeveniment.', ARRAY[]::text[], ARRAY[]::text[], true, true)
ON CONFLICT (slug) DO UPDATE SET
  nom = EXCLUDED.nom,
  categoria = EXCLUDED.categoria,
  descripcio = EXCLUDED.descripcio,
  "riderTecnic" = EXCLUDED."riderTecnic",
  destacat = EXCLUDED.destacat;

-- Verificació
SELECT slug, nom, categoria, destacat FROM "Artista" ORDER BY nom;

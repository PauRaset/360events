-- ============================================================
-- 360Events.cat · Migració: FotoGaleria (galeria d'imatges)
-- Enganxa i executa al SQL Editor de Neon. Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS "FotoGaleria" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titol" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actiu" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FotoGaleria_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT 'b5e0cdf4-5db8-43c3-b57b-a339c47a6688', '94d5af76c718602d39a5d15483a7cb9987f04e6d635db13ddf5081869dd1436a', now(), '20261117120000_add_foto_galeria', now(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20261117120000_add_foto_galeria');

SELECT count(*) AS fotos FROM "FotoGaleria";

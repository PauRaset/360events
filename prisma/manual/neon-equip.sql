-- ============================================================
-- 360Events.cat · Migració: taula Equip (lloguer d'equips)
-- Enganxa i executa al SQL Editor de Neon. Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS "Equip" (
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


-- Registre de la migració a Prisma (perquè 'migrate deploy' la consideri aplicada)
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT '4184baef-1ca7-41ae-a8d4-9520a5c393db', 'c25934c0ba2ef836d9568c0c651b66f001160ef6c05bdfa25f001bf0351ca4e1', now(), '20260617120000_add_equip', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20260617120000_add_equip'
);

-- Catàleg inicial (sense fotos; edita'ls al panell per afegir-ne)
INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_d6056e659c2d43ee81de47a447bb87f2', 'DAP Audio MK2', 'So', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'DAP Audio MK2' AND categoria = 'So');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_2735bd7fc1c24b9aa58d4ad7424e1d93', 'Bose L1 Pro', 'So', ARRAY[]::text[], false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Bose L1 Pro' AND categoria = 'So');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_c9e0b8ef57b4458caaf48884e4fb1601', 'Controladors Pioneer XDJ-RR', 'DJ', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Controladors Pioneer XDJ-RR' AND categoria = 'DJ');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_ec050c4d5e0840cfae0a6a71910cb596', 'Caps mòbils LED Beam', 'Il·luminació', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Caps mòbils LED Beam' AND categoria = 'Il·luminació');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_c1f9058a80814616a0377a8e97f34b07', 'Sistemes d’il·luminació LED', 'Il·luminació', ARRAY[]::text[], false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Sistemes d’il·luminació LED' AND categoria = 'Il·luminació');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_c7a31a00e31041fc9814c0b68d58c18e', 'Estructures modulars il·luminades amb funda de licra', 'Estructures', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Estructures modulars il·luminades amb funda de licra' AND categoria = 'Estructures');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_26051d5f4dc4487b8471012d190a88cf', 'Foc fred', 'Efectes especials', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Foc fred' AND categoria = 'Efectes especials');

INSERT INTO "Equip" (id, nom, categoria, fotos, destacat, actiu, ordre)
SELECT 'equip_49bad6a2b72b4c209806b507218ac103', 'Micròfons i accessoris', 'Accessoris', ARRAY[]::text[], false, true, 0
WHERE NOT EXISTS (SELECT 1 FROM "Equip" WHERE nom = 'Micròfons i accessoris' AND categoria = 'Accessoris');

-- Verificació
SELECT categoria, nom, actiu FROM "Equip" ORDER BY categoria, ordre, nom;

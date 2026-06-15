import { PrismaClient } from '@prisma/client';
import { artistes } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed: inserint artistes...');
  for (const a of artistes) {
    const artista = await prisma.artista.upsert({
      where: { slug: a.slug },
      update: { ...a, fotos: [], videos: [] },
      create: { ...a, fotos: [], videos: [] },
    });
    console.log(`   ✓ ${artista.nom} (${artista.slug})`);
  }
  console.log('✅ Seed completat.');
}

main()
  .catch((e) => {
    console.error('❌ Error al seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

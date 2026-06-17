import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { artistaSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Cos de la petició no vàlid' },
      { status: 400 },
    );
  }

  const parsed = artistaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dades no vàlides', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const artista = await prisma.artista.create({
      data: {
        nom: d.nom,
        slug: d.slug,
        categoria: d.categoria,
        descripcio: d.descripcio,
        riderTecnic: d.riderTecnic && d.riderTecnic.length > 0 ? d.riderTecnic : null,
        fotos: d.fotos,
        videos: d.videos,
        destacat: d.destacat,
        actiu: d.actiu,
      },
    });
    return NextResponse.json({ ok: true, id: artista.id }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { ok: false, error: 'Ja existeix un artista amb aquest slug' },
        { status: 409 },
      );
    }
    console.error('[artistes POST] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut crear l’artista' },
      { status: 500 },
    );
  }
}

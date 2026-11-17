import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const schema = z.object({
  url: z.string().url(),
  titol: z.string().trim().max(160).optional().or(z.literal('')),
});

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.rol !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cos no vàlid' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Dades no vàlides' }, { status: 400 });
  }

  try {
    // Nova foto al final.
    const max = await prisma.fotoGaleria.aggregate({ _max: { ordre: true } });
    const foto = await prisma.fotoGaleria.create({
      data: {
        url: parsed.data.url,
        titol: parsed.data.titol && parsed.data.titol.length > 0 ? parsed.data.titol : null,
        ordre: (max._max.ordre ?? 0) + 1,
      },
    });
    return NextResponse.json({ ok: true, id: foto.id }, { status: 201 });
  } catch (err) {
    console.error('[galeria POST] Error:', err);
    return NextResponse.json({ ok: false, error: 'No s’ha pogut desar la foto' }, { status: 500 });
  }
}

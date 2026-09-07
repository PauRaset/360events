import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { disponibilitatSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

/** Comprova que qui fa la petició pot gestionar aquest artista. */
async function autoritzat(artistaId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user) return false;
  if (user.rol === 'ADMIN') return true;
  return user.rol === 'ARTISTA' && user.artistaId === artistaId;
}

/** Bloqueja un dia (marca l'artista com a ocupat). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cos no vàlid' }, { status: 400 });
  }

  const parsed = disponibilitatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Dades no vàlides' }, { status: 400 });
  }

  const { artistaId, data, nota } = parsed.data;
  if (!(await autoritzat(artistaId))) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }

  const dia = new Date(`${data}T00:00:00.000Z`);
  try {
    await prisma.disponibilitat.upsert({
      where: { artistaId_data: { artistaId, data: dia } },
      update: { nota: nota || null },
      create: { artistaId, data: dia, estat: 'OCUPAT', nota: nota || null },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[disponibilitat POST] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut desar' },
      { status: 500 },
    );
  }
}

/** Allibera un dia (torna a estar disponible). */
export async function DELETE(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cos no vàlid' }, { status: 400 });
  }

  const parsed = disponibilitatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Dades no vàlides' }, { status: 400 });
  }

  const { artistaId, data } = parsed.data;
  if (!(await autoritzat(artistaId))) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }

  const dia = new Date(`${data}T00:00:00.000Z`);
  try {
    await prisma.disponibilitat.deleteMany({ where: { artistaId, data: dia } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[disponibilitat DELETE] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut alliberar' },
      { status: 500 },
    );
  }
}

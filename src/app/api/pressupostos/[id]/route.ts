import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { pressupostSchema } from '@/lib/schemas';
import type { Session } from 'next-auth';

export const runtime = 'nodejs';

function canManage(session: Session | null, artistaId: string | null) {
  const user = session?.user;
  if (!user) return false;
  if (user.rol === 'ADMIN') return true;
  return user.rol === 'ARTISTA' && !!artistaId && user.artistaId === artistaId;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  const pressupost = await prisma.pressupost.findUnique({ where: { id: params.id } });
  if (!pressupost) {
    return NextResponse.json({ ok: false, error: 'No trobat' }, { status: 404 });
  }
  if (!canManage(session, pressupost.artistaId)) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  if (pressupost.estat !== 'ESBORRANY') {
    return NextResponse.json(
      { ok: false, error: 'Només es poden editar els esborranys' },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cos no vàlid' }, { status: 400 });
  }
  const parsed = pressupostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dades no vàlides', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const artistaId =
    session?.user?.rol === 'ARTISTA'
      ? pressupost.artistaId
      : d.artistaId && d.artistaId.length > 0
        ? d.artistaId
        : null;

  try {
    await prisma.pressupost.update({
      where: { id: params.id },
      data: {
        artistaId,
        clientNom: d.clientNom,
        clientEmail: d.clientEmail,
        clientTelefon: d.clientTelefon || null,
        tipusEvent: d.tipusEvent || null,
        dataEvent: new Date(`${d.dataEvent}T00:00:00.000Z`),
        horaInici: d.horaInici || null,
        ubicacio: d.ubicacio || null,
        concepte: d.concepte,
        condicions: d.condicions || null,
        importCentims: Math.round(d.importEuros * 100),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pressupostos PATCH] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut desar' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  const pressupost = await prisma.pressupost.findUnique({ where: { id: params.id } });
  if (!pressupost) {
    return NextResponse.json({ ok: false, error: 'No trobat' }, { status: 404 });
  }
  if (!canManage(session, pressupost.artistaId)) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  if (pressupost.estat === 'SIGNAT') {
    return NextResponse.json(
      { ok: false, error: 'No es pot eliminar un contracte signat' },
      { status: 409 },
    );
  }
  try {
    await prisma.pressupost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pressupostos DELETE] Error:', err);
    return NextResponse.json({ ok: false, error: 'No s’ha pogut eliminar' }, { status: 500 });
  }
}

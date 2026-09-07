import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { pressupostSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.rol !== 'ADMIN' && user.rol !== 'ARTISTA')) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
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

  // Un artista només pot crear pressupostos per a ell mateix.
  const artistaId =
    user.rol === 'ARTISTA'
      ? (user.artistaId ?? null)
      : d.artistaId && d.artistaId.length > 0
        ? d.artistaId
        : null;

  const codi = `P-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const token = randomBytes(24).toString('hex');

  try {
    const pressupost = await prisma.pressupost.create({
      data: {
        codi,
        token,
        estat: 'ESBORRANY',
        artistaId,
        reservaId: d.reservaId && d.reservaId.length > 0 ? d.reservaId : null,
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
        createdBy: user.email ?? null,
      },
    });
    return NextResponse.json({ ok: true, id: pressupost.id }, { status: 201 });
  } catch (err) {
    console.error('[pressupostos POST] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut crear el pressupost' },
      { status: 500 },
    );
  }
}

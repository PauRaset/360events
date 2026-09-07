import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { signaturaSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: { token: string } },
) {
  const pressupost = await prisma.pressupost.findUnique({
    where: { token: params.token },
  });
  if (!pressupost) {
    return NextResponse.json({ ok: false, error: 'No trobat' }, { status: 404 });
  }
  if (pressupost.estat !== 'ENVIAT') {
    return NextResponse.json(
      { ok: false, error: 'Aquest pressupost no es pot signar (ja gestionat o no enviat).' },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cos no vàlid' }, { status: 400 });
  }
  const parsed = signaturaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Dades no vàlides' },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'desconeguda';
  const userAgent = request.headers.get('user-agent') ?? 'desconegut';

  // Empremta d'integritat del document en el moment de la firma.
  const hash = createHash('sha256')
    .update(
      JSON.stringify({
        codi: pressupost.codi,
        clientNom: pressupost.clientNom,
        clientEmail: pressupost.clientEmail,
        importCentims: pressupost.importCentims,
        dataEvent: pressupost.dataEvent.toISOString(),
        concepte: pressupost.concepte,
        condicions: pressupost.condicions,
        signatNom: parsed.data.nom,
      }),
    )
    .digest('hex');

  try {
    await prisma.$transaction(async (tx) => {
      await tx.pressupost.update({
        where: { id: pressupost.id },
        data: {
          estat: 'SIGNAT',
          signatNom: parsed.data.nom,
          signatDni: parsed.data.dni || null,
          signatData: new Date(),
          signatIp: ip,
          signatUserAgent: userAgent,
          signatHash: hash,
        },
      });
      // Bloqueig automàtic del dia a l'agenda de l'artista.
      if (pressupost.artistaId) {
        await tx.disponibilitat.upsert({
          where: {
            artistaId_data: {
              artistaId: pressupost.artistaId,
              data: pressupost.dataEvent,
            },
          },
          update: { estat: 'RESERVAT', nota: `Contracte ${pressupost.codi}` },
          create: {
            artistaId: pressupost.artistaId,
            data: pressupost.dataEvent,
            estat: 'RESERVAT',
            nota: `Contracte ${pressupost.codi}`,
          },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pressupost/signar] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut registrar la firma' },
      { status: 500 },
    );
  }
}

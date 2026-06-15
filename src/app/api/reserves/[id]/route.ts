import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { estatUpdateSchema } from '@/lib/schemas';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Protecció: només amb sessió vàlida.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { ok: false, error: 'No autoritzat' },
      { status: 401 },
    );
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

  const parsed = estatUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Estat no vàlid' },
      { status: 400 },
    );
  }

  try {
    const reserva = await prisma.reserva.update({
      where: { id: params.id },
      data: { estat: parsed.data.estat },
      include: { artista: true },
    });
    return NextResponse.json({ ok: true, reserva });
  } catch (err) {
    console.error('[reserves PATCH] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut actualitzar la reserva' },
      { status: 500 },
    );
  }
}

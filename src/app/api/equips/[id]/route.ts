import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { equipSchema } from '@/lib/schemas';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

  const parsed = equipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dades no vàlides', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const equip = await prisma.equip.update({
      where: { id: params.id },
      data: {
        nom: d.nom,
        categoria: d.categoria,
        descripcio: d.descripcio && d.descripcio.length > 0 ? d.descripcio : null,
        fotos: d.fotos,
        destacat: d.destacat,
        actiu: d.actiu,
        ordre: d.ordre,
      },
    });
    return NextResponse.json({ ok: true, equip });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return NextResponse.json(
        { ok: false, error: 'Equip no trobat' },
        { status: 404 },
      );
    }
    console.error('[equips PATCH] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut actualitzar l’equip' },
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

  try {
    await prisma.equip.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return NextResponse.json(
        { ok: false, error: 'Equip no trobat' },
        { status: 404 },
      );
    }
    console.error('[equips DELETE] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut eliminar l’equip' },
      { status: 500 },
    );
  }
}

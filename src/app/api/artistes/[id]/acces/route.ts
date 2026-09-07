import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { accesSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

/** Crea o actualitza el compte d'accés (login) d'un artista. Només ADMIN. */
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
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

  const parsed = accesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dades no vàlides', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const artista = await prisma.artista.findUnique({ where: { id: params.id } });
  if (!artista) {
    return NextResponse.json({ ok: false, error: 'Artista no trobat' }, { status: 404 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const existent = await prisma.usuari.findUnique({
      where: { artistaId: params.id },
    });
    if (existent) {
      await prisma.usuari.update({
        where: { id: existent.id },
        data: { email, passwordHash, rol: 'ARTISTA' },
      });
    } else {
      await prisma.usuari.create({
        data: { email, passwordHash, rol: 'ARTISTA', artistaId: params.id },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { ok: false, error: 'Aquest correu ja s’utilitza en un altre compte' },
        { status: 409 },
      );
    }
    console.error('[acces POST] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut desar l’accés' },
      { status: 500 },
    );
  }
}

/** Elimina el compte d'accés d'un artista. Només ADMIN. */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (session?.user?.rol !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  try {
    await prisma.usuari.deleteMany({ where: { artistaId: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[acces DELETE] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut eliminar l’accés' },
      { status: 500 },
    );
  }
}

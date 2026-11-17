import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (session?.user?.rol !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  try {
    await prisma.fotoGaleria.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Foto no trobada' }, { status: 404 });
    }
    console.error('[galeria DELETE] Error:', err);
    return NextResponse.json({ ok: false, error: 'No s’ha pogut eliminar' }, { status: 500 });
  }
}

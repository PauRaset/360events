import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
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
      { ok: false, error: 'Aquest pressupost ja no es pot rebutjar.' },
      { status: 409 },
    );
  }
  await prisma.pressupost.update({
    where: { id: pressupost.id },
    data: { estat: 'REBUTJAT' },
  });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { trucaSchema } from '@/lib/schemas';
import { notifyAdminCallback } from '@/lib/notify';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Cos de la petició no vàlid' },
      { status: 400 },
    );
  }

  const parsed = trucaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Introdueix un telèfon vàlid' },
      { status: 400 },
    );
  }

  const { telefon, nom } = parsed.data;
  const result = await notifyAdminCallback(telefon, nom);

  if (result.channel === 'none') {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Ara mateix no podem registrar la sol·licitud. Truca’ns al 687 755 444.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}

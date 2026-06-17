import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { equipSchema } from '@/lib/schemas';

export async function POST(request: Request) {
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
    const equip = await prisma.equip.create({
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
    return NextResponse.json({ ok: true, id: equip.id }, { status: 201 });
  } catch (err) {
    console.error('[equips POST] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut crear l’equip' },
      { status: 500 },
    );
  }
}

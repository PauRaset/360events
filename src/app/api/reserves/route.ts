import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reservaSchema } from '@/lib/schemas';
import { resend, RESEND_FROM, RESEND_TO } from '@/lib/resend';

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

  const parsed = reservaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Dades no vàlides',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const artistaId = d.artistaId && d.artistaId.length > 0 ? d.artistaId : null;

  try {
    const reserva = await prisma.reserva.create({
      data: {
        nom: d.nom,
        telefon: d.telefon,
        email: d.email,
        tipusEvent: d.tipusEvent,
        dataEvent: new Date(d.dataEvent),
        ubicacio: d.ubicacio,
        assistents: d.assistents ?? null,
        missatge: d.missatge && d.missatge.length > 0 ? d.missatge : null,
        servei: d.servei && d.servei.length > 0 ? d.servei : null,
        artistaId,
        // estat = NOVA per defecte
      },
      include: { artista: true },
    });

    // Enviament d'email (només si hi ha RESEND_API_KEY configurada)
    if (resend) {
      try {
        await resend.emails.send({
          from: RESEND_FROM,
          to: RESEND_TO,
          replyTo: d.email,
          subject: `Nova reserva · ${d.tipusEvent} · ${d.nom}`,
          html: buildEmailHtml(reserva),
        });
      } catch (mailErr) {
        // No trenquem el flux si l'email falla: la reserva ja està desada.
        console.error('[reserves] Error enviant email:', mailErr);
      }
    } else {
      console.warn(
        '[reserves] RESEND_API_KEY no configurada: s’omet l’enviament d’email.',
      );
    }

    return NextResponse.json({ ok: true, id: reserva.id }, { status: 201 });
  } catch (err) {
    console.error('[reserves] Error desant la reserva:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut desar la reserva' },
      { status: 500 },
    );
  }
}

function buildEmailHtml(reserva: {
  nom: string;
  telefon: string;
  email: string;
  tipusEvent: string;
  dataEvent: Date;
  ubicacio: string;
  assistents: number | null;
  missatge: string | null;
  servei: string | null;
  artista: { nom: string } | null;
}) {
  const row = (label: string, value: string | number | null) =>
    value !== null && value !== ''
      ? `<tr><td style="padding:6px 12px;color:#8590A6;">${label}</td><td style="padding:6px 12px;color:#0C1122;font-weight:600;">${value}</td></tr>`
      : '';

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#1E7BFF;">Nova sol·licitud de reserva</h2>
    <table style="width:100%;border-collapse:collapse;background:#f5f7fb;border-radius:8px;">
      ${row('Nom', reserva.nom)}
      ${row('Telèfon', reserva.telefon)}
      ${row('Email', reserva.email)}
      ${row('Tipus', reserva.tipusEvent)}
      ${row('Data', reserva.dataEvent.toLocaleDateString('ca-ES'))}
      ${row('Ubicació', reserva.ubicacio)}
      ${row('Assistents', reserva.assistents)}
      ${row('Artista', reserva.artista?.nom ?? null)}
      ${row('Servei', reserva.servei)}
      ${row('Missatge', reserva.missatge)}
    </table>
    <p style="color:#8590A6;font-size:12px;margin-top:16px;">360Events.cat</p>
  </div>`;
}

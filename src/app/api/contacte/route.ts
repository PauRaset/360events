import { NextResponse } from 'next/server';
import { contacteSchema } from '@/lib/schemas';
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

  const parsed = contacteSchema.safeParse(body);
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
  const assumpte = d.assumpte && d.assumpte.length > 0 ? d.assumpte : 'General';

  // El contacte va només per email; no es desa a la base de dades.
  if (!resend) {
    console.warn('[contacte] RESEND_API_KEY no configurada.');
    return NextResponse.json(
      {
        ok: false,
        error:
          'El servei de correu no està disponible ara mateix. Truca’ns al 687 755 444 o escriu a info@360events.cat.',
      },
      { status: 503 },
    );
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: d.email,
      subject: `Contacte web · ${assumpte} · ${d.nom}`,
      html: buildEmailHtml({ ...d, assumpte }),
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[contacte] Error enviant email:', err);
    return NextResponse.json(
      { ok: false, error: 'No s’ha pogut enviar el missatge' },
      { status: 500 },
    );
  }
}

function buildEmailHtml(d: {
  nom: string;
  email: string;
  telefon?: string;
  assumpte: string;
  missatge: string;
}) {
  const row = (label: string, value?: string) =>
    value && value.length > 0
      ? `<tr><td style="padding:6px 12px;color:#8590A6;">${label}</td><td style="padding:6px 12px;color:#0C1122;font-weight:600;">${value}</td></tr>`
      : '';

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#1E7BFF;">Nou missatge de contacte</h2>
    <table style="width:100%;border-collapse:collapse;background:#f5f7fb;border-radius:8px;">
      ${row('Nom', d.nom)}
      ${row('Email', d.email)}
      ${row('Telèfon', d.telefon)}
      ${row('Assumpte', d.assumpte)}
    </table>
    <p style="margin-top:16px;color:#0C1122;white-space:pre-wrap;">${d.missatge}</p>
    <p style="color:#8590A6;font-size:12px;margin-top:16px;">360Events.cat</p>
  </div>`;
}

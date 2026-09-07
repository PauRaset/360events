import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { resend, RESEND_FROM } from '@/lib/resend';
import { formatEuros, formatData } from '@/lib/format';
import { site } from '@/lib/site';
import type { Session } from 'next-auth';

export const runtime = 'nodejs';

function canManage(session: Session | null, artistaId: string | null) {
  const user = session?.user;
  if (!user) return false;
  if (user.rol === 'ADMIN') return true;
  return user.rol === 'ARTISTA' && !!artistaId && user.artistaId === artistaId;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  const pressupost = await prisma.pressupost.findUnique({ where: { id: params.id } });
  if (!pressupost) {
    return NextResponse.json({ ok: false, error: 'No trobat' }, { status: 404 });
  }
  if (!canManage(session, pressupost.artistaId)) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }
  if (pressupost.estat === 'SIGNAT' || pressupost.estat === 'CANCELLAT') {
    return NextResponse.json(
      { ok: false, error: 'Aquest pressupost ja no es pot enviar' },
      { status: 409 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const link = `${baseUrl}/pressupost/${pressupost.token}`;

  await prisma.pressupost.update({
    where: { id: params.id },
    data: { estat: 'ENVIAT' },
  });

  if (resend) {
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to: pressupost.clientEmail,
        replyTo: site.contact.email,
        subject: `Pressupost 360Events · ${pressupost.codi}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="color:#1E7BFF;">Aquí tens el teu pressupost</h2>
            <p>Hola ${pressupost.clientNom},</p>
            <p>T'enviem el pressupost per al teu esdeveniment del
              <strong>${formatData(pressupost.dataEvent)}</strong>.</p>
            <p style="font-size:20px;font-weight:700;color:#0C1122;">
              ${formatEuros(pressupost.importCentims)}</p>
            <p>Pots revisar-lo, acceptar-lo i signar-lo aquí:</p>
            <p><a href="${link}"
              style="display:inline-block;background:#1E7BFF;color:#fff;
              padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;">
              Veure i signar el pressupost</a></p>
            <p style="color:#8590A6;font-size:12px;">${link}</p>
            <p style="color:#8590A6;font-size:12px;">360Events.cat</p>
          </div>`,
      });
    } catch (err) {
      console.error('[pressupostos/enviar] Email error:', err);
      // No trenquem: el pressupost queda ENVIAT i es pot compartir l'enllaç manualment.
    }
  }

  return NextResponse.json({ ok: true, link });
}

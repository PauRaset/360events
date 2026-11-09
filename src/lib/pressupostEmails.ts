import { resend, RESEND_FROM, RESEND_TO } from './resend';
import { prisma } from './prisma';
import { formatEuros, formatData } from './format';
import { site } from './site';

type PressupostNotif = {
  codi: string;
  clientNom: string;
  clientEmail: string;
  importCentims: number;
  dataEvent: Date;
  artistaId: string | null;
  artistaNom?: string | null;
  signatNom?: string | null;
};

const wrap = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">${inner}
   <p style="color:#8590A6;font-size:12px;margin-top:16px;">360Events.cat</p></div>`;

/** Correu de l'artista (compte d'accés), si en té. */
async function artistaEmail(artistaId: string | null): Promise<string | null> {
  if (!artistaId) return null;
  const u = await prisma.usuari.findUnique({
    where: { artistaId },
    select: { email: true },
  });
  return u?.email ?? null;
}

/** Avís a l'artista i l'admin que s'ha enviat un pressupost pendent de firma. */
export async function notifyPressupostEnviat(p: PressupostNotif, link: string) {
  if (!resend) return;
  const to = new Set<string>([RESEND_TO]);
  const ae = await artistaEmail(p.artistaId);
  if (ae) to.add(ae);

  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: Array.from(to),
      subject: `Pressupost enviat · ${p.codi}${p.artistaNom ? ` · ${p.artistaNom}` : ''}`,
      html: wrap(`
        <h2 style="color:#1E7BFF;">Pressupost enviat al client</h2>
        <p>S'ha enviat el pressupost <strong>${p.codi}</strong> a
          <strong>${p.clientNom}</strong>, pendent de la seva firma.</p>
        <p>Data: <strong>${formatData(p.dataEvent)}</strong> · Import:
          <strong>${formatEuros(p.importCentims)}</strong></p>
        <p style="color:#8590A6;font-size:12px;">Enllaç del client: ${link}</p>`),
    });
  } catch (err) {
    console.error('[notifyPressupostEnviat] Error:', err);
  }
}

/** Avís intern (artista + admin) i confirmació al client quan es signa. */
export async function notifyPressupostSignat(p: PressupostNotif) {
  if (!resend) return;

  // 1) Avís intern: artista + admin.
  const to = new Set<string>([RESEND_TO]);
  const ae = await artistaEmail(p.artistaId);
  if (ae) to.add(ae);
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: Array.from(to),
      subject: `✅ Contracte signat · ${p.codi}${p.artistaNom ? ` · ${p.artistaNom}` : ''}`,
      html: wrap(`
        <h2 style="color:#10b981;">Contracte signat! 🎉</h2>
        <p><strong>${p.signatNom ?? p.clientNom}</strong> ha acceptat i signat el
          contracte <strong>${p.codi}</strong>.</p>
        <p>Data de l'esdeveniment: <strong>${formatData(p.dataEvent)}</strong> ·
          Import: <strong>${formatEuros(p.importCentims)}</strong></p>
        <p>La data ha quedat reservada automàticament a l'agenda.</p>`),
    });
  } catch (err) {
    console.error('[notifyPressupostSignat intern] Error:', err);
  }

  // 2) Confirmació al client.
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: p.clientEmail,
      replyTo: site.contact.email,
      subject: `Contracte confirmat · ${p.codi}`,
      html: wrap(`
        <h2 style="color:#1E7BFF;">Contracte confirmat</h2>
        <p>Gràcies, ${p.signatNom ?? p.clientNom}! Hem registrat la teva firma del
          contracte <strong>${p.codi}</strong>.</p>
        <p>Data: <strong>${formatData(p.dataEvent)}</strong> · Import:
          <strong>${formatEuros(p.importCentims)}</strong></p>
        <p>Ens posarem en contacte amb els següents passos. Qualsevol dubte,
          escriu-nos a ${site.contact.email}.</p>`),
    });
  } catch (err) {
    console.error('[notifyPressupostSignat client] Error:', err);
  }
}

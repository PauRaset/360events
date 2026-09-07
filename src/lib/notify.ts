import { resend, RESEND_FROM, RESEND_TO } from './resend';

/** Telèfon de l'admin que ha de rebre l'avís (per defecte, el de 360Events). */
const ADMIN_PHONE = process.env.ADMIN_PHONE ?? '+34687755444';

type NotifyResult = { channel: 'whatsapp' | 'sms' | 'email' | 'none' };

/**
 * Envia un missatge a través de l'API REST de Twilio (SMS o WhatsApp).
 * No usem l'SDK per mantenir la funció lleugera al runtime serverless.
 */
async function sendTwilio(
  from: string,
  to: string,
  bodyText: string,
): Promise<boolean> {
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_TOKEN;
  if (!sid || !token) return false;

  const params = new URLSearchParams({ From: from, To: to, Body: bodyText });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[notify] Twilio error:', res.status, detail);
    return false;
  }
  return true;
}

/**
 * Notifica a l'admin que un client vol que el truquin.
 * Prioritat: WhatsApp (si hi ha sender) → SMS (Twilio) → email (Resend).
 * L'objectiu és que l'admin rebi el NÚMERO del client per trucar-lo ell.
 */
export async function notifyAdminCallback(
  telefon: string,
  nom?: string,
): Promise<NotifyResult> {
  const qui = nom && nom.trim().length > 0 ? ` (${nom.trim()})` : '';
  const text = `📞 360Events · Nova sol·licitud de trucada.\nTruca aquest client${qui}: ${telefon}`;

  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // p. ex. "whatsapp:+14155238886"
  const smsFrom = process.env.TWILIO_NUMBER;

  // 1) WhatsApp
  if (whatsappFrom && (await sendTwilio(whatsappFrom, `whatsapp:${ADMIN_PHONE}`, text))) {
    return { channel: 'whatsapp' };
  }
  // 2) SMS
  if (smsFrom && (await sendTwilio(smsFrom, ADMIN_PHONE, text))) {
    return { channel: 'sms' };
  }
  // 3) Email (fallback que funciona sense Twilio)
  if (resend) {
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to: RESEND_TO,
        subject: `📞 Truca'm · ${telefon}`,
        html: `<p>Nova sol·licitud de trucada des del web.</p>
               <p><strong>Truca aquest client${qui}:</strong>
               <a href="tel:${telefon}">${telefon}</a></p>`,
      });
      return { channel: 'email' };
    } catch (err) {
      console.error('[notify] Email fallback error:', err);
    }
  }

  return { channel: 'none' };
}

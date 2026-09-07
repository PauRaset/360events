import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { site } from './site';
import { formatEuros, formatData } from './format';

export type PressupostPdf = {
  codi: string;
  estat: string;
  clientNom: string;
  clientEmail: string;
  clientTelefon: string | null;
  tipusEvent: string | null;
  dataEvent: Date;
  horaInici: string | null;
  ubicacio: string | null;
  concepte: string;
  condicions: string | null;
  importCentims: number;
  artistaNom?: string | null;
  signatNom: string | null;
  signatDni: string | null;
  signatData: Date | null;
  signatIp: string | null;
  signatHash: string | null;
};

/** Substitueix caràcters no compatibles amb WinAnsi per equivalents segurs. */
function san(text: string): string {
  return text
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[–—]/g, '-')
    .split('')
    .map((c) => (c.codePointAt(0)! > 255 ? '?' : c))
    .join('');
}

export async function generateContractPdf(p: PressupostPdf): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const A4 = { w: 595.28, h: 841.89 };
  const margin = 56;
  const maxW = A4.w - margin * 2;
  const blue = rgb(0.12, 0.48, 1);
  const dark = rgb(0.05, 0.07, 0.1);
  const gray = rgb(0.4, 0.45, 0.5);

  let page: PDFPage = doc.addPage([A4.w, A4.h]);
  let y = A4.h - margin;

  function ensure(space: number) {
    if (y - space < margin) {
      page = doc.addPage([A4.w, A4.h]);
      y = A4.h - margin;
    }
  }

  function wrap(text: string, f: PDFFont, size: number): string[] {
    const out: string[] = [];
    for (const raw of text.split('\n')) {
      const words = raw.split(/\s+/);
      let line = '';
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (f.widthOfTextAtSize(test, size) > maxW && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      out.push(line);
    }
    return out;
  }

  function para(text: string, opts: { size?: number; f?: PDFFont; color?: typeof dark; gap?: number } = {}) {
    const size = opts.size ?? 10.5;
    const f = opts.f ?? font;
    const lh = size + 4;
    for (const line of wrap(san(text), f, size)) {
      ensure(lh);
      page.drawText(line, { x: margin, y, size, font: f, color: opts.color ?? dark });
      y -= lh;
    }
    y -= opts.gap ?? 6;
  }

  function heading(text: string) {
    ensure(24);
    y -= 6;
    page.drawText(san(text), { x: margin, y, size: 12, font: bold, color: blue });
    y -= 18;
  }

  // Capçalera
  page.drawText('CONTRACTE DE PRESTACIÓ DE SERVEIS', {
    x: margin, y, size: 16, font: bold, color: dark,
  });
  y -= 20;
  page.drawText(san(`${site.legalName} · Ref. ${p.codi}`), {
    x: margin, y, size: 10, font, color: gray,
  });
  y -= 24;

  heading('Parts');
  para(`Prestador: ${site.legalName} — ${site.contact.email} — ${site.contact.phone}.`);
  para(
    `Client: ${p.clientNom}${p.clientTelefon ? ` — ${p.clientTelefon}` : ''} — ${p.clientEmail}.`,
    { gap: 10 },
  );

  heading('Detalls de l’esdeveniment');
  if (p.artistaNom) para(`Artista / servei: ${p.artistaNom}`);
  if (p.tipusEvent) para(`Tipus: ${p.tipusEvent}`);
  para(`Data: ${formatData(p.dataEvent)}${p.horaInici ? ` a les ${p.horaInici}` : ''}`);
  if (p.ubicacio) para(`Ubicació: ${p.ubicacio}`, { gap: 10 });

  heading('Objecte del contracte');
  para(p.concepte, { gap: 10 });

  heading('Import');
  para(`Import total: ${formatEuros(p.importCentims)} (IVA inclòs si escau).`, { f: bold, gap: 10 });

  if (p.condicions) {
    heading('Condicions');
    para(p.condicions, { gap: 10 });
  }

  heading('Firma i acceptació');
  if (p.estat === 'SIGNAT' && p.signatNom && p.signatData) {
    para(`Signat electrònicament per: ${p.signatNom}${p.signatDni ? ` (DNI/NIF: ${p.signatDni})` : ''}`);
    para(`Data i hora de firma: ${p.signatData.toISOString()}`);
    if (p.signatIp) para(`IP: ${p.signatIp}`);
    if (p.signatHash) para(`Empremta del document (SHA-256): ${p.signatHash}`, { size: 8, color: gray });
    para(
      'El client declara haver llegit i acceptat les condicions d’aquest contracte. Aquesta firma electrònica té validesa contractual entre les parts.',
      { size: 9, color: gray, gap: 4 },
    );
  } else {
    para('Document pendent de signatura pel client.', { color: gray });
  }

  const bytes = await doc.save();
  return bytes;
}

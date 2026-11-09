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

/** Paleta de marca 360Events (0-1 per a pdf-lib). */
const C = {
  base: rgb(0.02, 0.027, 0.059), // #05070F
  electric: rgb(0.118, 0.482, 1), // #1E7BFF
  electricBright: rgb(0.239, 0.576, 1), // #3D93FF
  silver: rgb(0.784, 0.824, 0.878), // #C8D2E0
  platinum: rgb(0.914, 0.933, 0.969), // #E9EEF7
  textGray: rgb(0.522, 0.565, 0.651), // #8590A6
  ink: rgb(0.08, 0.1, 0.14),
  hair: rgb(0.86, 0.89, 0.93),
  tint: rgb(0.9, 0.95, 1),
  white: rgb(1, 1, 1),
  green: rgb(0.06, 0.6, 0.4),
};

/** Caràcters fora de WinAnsi → equivalents segurs. */
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

  const W = 595.28;
  const H = 841.89;
  const margin = 50;
  const maxW = W - margin * 2;
  const headerH = 104;
  const footerH = 40;
  const bottomLimit = footerH + 24;

  let page: PDFPage = doc.addPage([W, H]);

  const textW = (t: string, f: PDFFont, s: number) => f.widthOfTextAtSize(t, s);

  /* ---------- Capçalera de marca (només 1a pàgina) ---------- */
  function drawHeader(pg: PDFPage) {
    pg.drawRectangle({ x: 0, y: H - headerH, width: W, height: headerH, color: C.base });
    // Línia d'accent elèctrica
    pg.drawRectangle({ x: 0, y: H - headerH, width: W, height: 3, color: C.electric });

    // Logo: cercle amb "360"
    const cx = margin + 15;
    const cy = H - 42;
    pg.drawEllipse({ x: cx, y: cy, xScale: 15, yScale: 15, borderColor: C.electric, borderWidth: 1.5 });
    const t360 = '360';
    pg.drawText(t360, {
      x: cx - textW(t360, bold, 9) / 2,
      y: cy - 3.2,
      size: 9,
      font: bold,
      color: C.white,
    });
    // "EVENTS"
    pg.drawText('EVENTS', { x: cx + 24, y: cy - 6, size: 17, font: bold, color: C.platinum });
    // Tagline
    pg.drawText(san('Espectacle · Música · Llums · Experiència 360°'), {
      x: margin,
      y: H - 74,
      size: 8,
      font,
      color: C.textGray,
    });
    // Dreta: referència + data
    const ref = `Ref. ${p.codi}`;
    pg.drawText(ref, { x: W - margin - textW(ref, bold, 11), y: cy - 2, size: 11, font: bold, color: C.silver });
    const dateStr = san(formatData(new Date()));
    pg.drawText(dateStr, {
      x: W - margin - textW(dateStr, font, 9),
      y: cy - 18,
      size: 9,
      font,
      color: C.textGray,
    });
  }

  /* ---------- Peu de pàgina (totes) ---------- */
  function drawFooter(pg: PDFPage, num: number, total: number) {
    pg.drawRectangle({ x: 0, y: 0, width: W, height: footerH, color: C.base });
    pg.drawRectangle({ x: 0, y: footerH, width: W, height: 2, color: C.electric });
    const info = san(`${site.legalName} · ${site.contact.phone} · ${site.contact.email}`);
    pg.drawText(info, { x: margin, y: 15, size: 8, font, color: C.silver });
    const pag = `Pàgina ${num}/${total}`;
    pg.drawText(san(pag), {
      x: W - margin - textW(san(pag), font, 8),
      y: 15,
      size: 8,
      font,
      color: C.textGray,
    });
  }

  drawHeader(page);
  let y = H - headerH - 30;

  function ensure(space: number) {
    if (y - space < bottomLimit) {
      page = doc.addPage([W, H]);
      y = H - margin;
    }
  }

  function wrap(text: string, f: PDFFont, size: number, width: number): string[] {
    const out: string[] = [];
    for (const raw of text.split('\n')) {
      const words = raw.split(/\s+/);
      let line = '';
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (textW(test, f, size) > width && line) {
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

  function para(
    text: string,
    opts: { size?: number; f?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number; x?: number; width?: number } = {},
  ) {
    const size = opts.size ?? 10;
    const f = opts.f ?? font;
    const x = opts.x ?? margin;
    const width = opts.width ?? maxW;
    const lh = size + 4;
    for (const line of wrap(san(text), f, size, width)) {
      ensure(lh);
      page.drawText(line, { x, y, size, font: f, color: opts.color ?? C.ink });
      y -= lh;
    }
    y -= opts.gap ?? 6;
  }

  function heading(text: string) {
    ensure(26);
    y -= 8;
    // Barra d'accent
    page.drawRectangle({ x: margin, y: y - 1, width: 4, height: 13, color: C.electric });
    page.drawText(san(text), { x: margin + 12, y, size: 12, font: bold, color: C.electric });
    y -= 20;
  }

  /* Fila etiqueta/valor */
  function field(label: string, value: string) {
    ensure(16);
    page.drawText(san(label), { x: margin, y, size: 9.5, font, color: C.textGray });
    const lines = wrap(san(value), bold, 10, maxW - 140);
    page.drawText(lines[0] ?? '', { x: margin + 140, y, size: 10, font: bold, color: C.ink });
    y -= 15;
    for (let i = 1; i < lines.length; i++) {
      ensure(14);
      page.drawText(lines[i], { x: margin + 140, y, size: 10, font: bold, color: C.ink });
      y -= 14;
    }
    y -= 2;
  }

  /* ---------- Títol ---------- */
  page.drawText(san('Contracte de prestació de serveis'), {
    x: margin,
    y,
    size: 18,
    font: bold,
    color: C.ink,
  });
  y -= 10;
  page.drawRectangle({ x: margin, y: y - 2, width: maxW, height: 0.8, color: C.hair });
  y -= 18;

  /* ---------- Parts ---------- */
  heading('Parts');
  field('Prestador', `${site.legalName}`);
  field('Contacte prestador', `${site.contact.phone} · ${site.contact.email}`);
  field('Client', p.clientNom);
  field(
    'Contacte client',
    `${p.clientTelefon ? `${p.clientTelefon} · ` : ''}${p.clientEmail}`,
  );

  /* ---------- Detalls ---------- */
  heading('Detalls de l’esdeveniment');
  if (p.artistaNom) field('Artista / servei', p.artistaNom);
  if (p.tipusEvent) field('Tipus', p.tipusEvent);
  field('Data', `${formatData(p.dataEvent)}${p.horaInici ? ` · ${p.horaInici}` : ''}`);
  if (p.ubicacio) field('Ubicació', p.ubicacio);

  /* ---------- Objecte ---------- */
  heading('Objecte del contracte');
  para(p.concepte, { gap: 12 });

  /* ---------- Import (caixa destacada) ---------- */
  ensure(60);
  const boxH = 46;
  page.drawRectangle({
    x: margin,
    y: y - boxH + 14,
    width: maxW,
    height: boxH,
    color: C.tint,
    borderColor: C.electric,
    borderWidth: 1,
  });
  page.drawText(san('IMPORT TOTAL'), {
    x: margin + 16,
    y: y - 8,
    size: 9,
    font: bold,
    color: C.textGray,
  });
  page.drawText('IVA inclòs si escau', {
    x: margin + 16,
    y: y - 22,
    size: 8,
    font,
    color: C.textGray,
  });
  const amount = formatEuros(p.importCentims);
  page.drawText(amount, {
    x: W - margin - 16 - textW(amount, bold, 20),
    y: y - 18,
    size: 20,
    font: bold,
    color: C.electric,
  });
  y -= boxH + 10;

  /* ---------- Condicions ---------- */
  if (p.condicions) {
    heading('Condicions');
    para(p.condicions, { size: 9.5, color: C.ink, gap: 12 });
  }

  /* ---------- Firma ---------- */
  heading('Firma i acceptació');
  if (p.estat === 'SIGNAT' && p.signatNom && p.signatData) {
    ensure(20);
    page.drawText(san('Contracte signat electrònicament'), {
      x: margin,
      y,
      size: 11,
      font: bold,
      color: C.green,
    });
    y -= 18;
    field('Signat per', `${p.signatNom}${p.signatDni ? ` (${p.signatDni})` : ''}`);
    field('Data i hora', p.signatData.toISOString());
    if (p.signatIp) field('IP', p.signatIp);
    if (p.signatHash) {
      para(`Empremta SHA-256: ${p.signatHash}`, { size: 7.5, color: C.textGray, gap: 4 });
    }
    para(
      'El client declara haver llegit i acceptat les condicions d’aquest contracte. Aquesta firma electrònica té validesa contractual entre les parts.',
      { size: 8.5, color: C.textGray },
    );
  } else {
    para('Document pendent de signatura pel client.', { color: C.textGray });
  }

  /* ---------- Peus a totes les pàgines ---------- */
  const pages = doc.getPages();
  pages.forEach((pg, i) => drawFooter(pg, i + 1, pages.length));

  return doc.save();
}

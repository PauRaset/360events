import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContractPdf } from '@/lib/contractPdf';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { token: string } },
) {
  const p = await prisma.pressupost.findUnique({
    where: { token: params.token },
    include: { artista: true },
  });
  if (!p) {
    return NextResponse.json({ ok: false, error: 'No trobat' }, { status: 404 });
  }
  if (p.estat === 'ESBORRANY' || p.estat === 'CANCELLAT') {
    return NextResponse.json({ ok: false, error: 'No disponible' }, { status: 403 });
  }

  const bytes = await generateContractPdf({
    codi: p.codi,
    estat: p.estat,
    clientNom: p.clientNom,
    clientEmail: p.clientEmail,
    clientTelefon: p.clientTelefon,
    tipusEvent: p.tipusEvent,
    dataEvent: p.dataEvent,
    horaInici: p.horaInici,
    ubicacio: p.ubicacio,
    concepte: p.concepte,
    condicions: p.condicions,
    importCentims: p.importCentims,
    artistaNom: p.artista?.nom ?? null,
    signatNom: p.signatNom,
    signatDni: p.signatDni,
    signatData: p.signatData,
    signatIp: p.signatIp,
    signatHash: p.signatHash,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="contracte-${p.codi}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

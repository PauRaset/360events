import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/auth';

export const runtime = 'nodejs';

/**
 * Diagnòstic temporal: prova una pujada server-to-server a Vercel Blob amb el
 * mateix BLOB_READ_WRITE_TOKEN. Com que no passa pel navegador, no hi ha CORS:
 * si el token o el store fallen, veurem l'error REAL aquí.
 *
 * Visita /api/artistes/blob-test amb sessió iniciada.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'No autoritzat' }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const diag = {
    hasToken: Boolean(token),
    tokenLength: token?.length ?? 0,
    tokenPrefix: token ? token.slice(0, 15) : null,
    storeIdEnv: process.env.BLOB_STORE_ID ?? null,
    storeIdFromToken: token ? token.split('_')[3] ?? null : null,
  };

  try {
    const result = await put(
      'diagnostic/ping.txt',
      `ping ${new Date().toISOString()}`,
      { access: 'public', addRandomSuffix: true },
    );
    return NextResponse.json({ ok: true, diag, url: result.url });
  } catch (err) {
    console.error('[blob-test] ERROR:', err);
    return NextResponse.json(
      {
        ok: false,
        diag,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

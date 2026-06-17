import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/auth';

// Aquesta ruta necessita el runtime de Node (node:crypto + SDK de Blob).
export const runtime = 'nodejs';

/**
 * Genera el token per a la pujada directa (client upload) a Vercel Blob.
 *
 * La protecció es fa dins d'onBeforeGenerateToken (fase iniciada pel client),
 * no a l'inici de la ruta, perquè handleUpload també processa el cos de la
 * petició per a altres fases.
 *
 * El token de Blob (BLOB_READ_WRITE_TOKEN) el llegeix handleUpload
 * automàticament de les variables d'entorn.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  // Diagnòstic (no exposa el secret): presència, longitud i prefix del token.
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  console.log('[artistes/upload] inici', {
    bodyType: (body as { type?: string })?.type,
    hasToken: Boolean(token),
    tokenLength: token?.length ?? 0,
    tokenPrefix: token ? token.slice(0, 15) : null,
  });

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user) {
          throw new Error('No autoritzat: cal iniciar sessió.');
        }
        if (!token) {
          throw new Error(
            'BLOB_READ_WRITE_TOKEN no està configurat a l’entorn d’execució.',
          );
        }
        // No restringim per content-type: alguns navegadors envien les fotos
        // d'iPhone (HEIC) amb un tipus no estàndard o buit, i Blob les
        // rebutjaria amb un 400 (que el navegador mostra com a error de CORS).
        // La pujada ja està protegida per la sessió d'administrador.
        return {
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    // Registra la causa real (amb stack) als Runtime Logs de Vercel.
    console.error('[artistes/upload] ERROR:', err);
    const message = err instanceof Error ? err.message : 'Error de pujada';
    const status = message.includes('No autoritzat') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

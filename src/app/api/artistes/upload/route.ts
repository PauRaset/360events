import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/auth';

/**
 * Genera el token per a la pujada directa (client upload) a Vercel Blob.
 *
 * La protecció es fa dins d'onBeforeGenerateToken (fase iniciada pel client),
 * no a l'inici de la ruta, perquè handleUpload també processa el cos de la
 * petició per a la fase de pujada completada.
 *
 * El token de Blob (BLOB_READ_WRITE_TOKEN) el llegeix handleUpload
 * automàticament de les variables d'entorn.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // 1) Només amb sessió vàlida.
        const session = await auth();
        if (!session?.user) {
          throw new Error('No autoritzat: cal iniciar sessió.');
        }
        // 2) Comprovació explícita que el token està disponible al runtime.
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error(
            'BLOB_READ_WRITE_TOKEN no està configurat a l’entorn d’execució.',
          );
        }
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/avif',
            'image/gif',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 15 * 1024 * 1024,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de pujada';
    // Registra la causa real als logs (Vercel → Functions / local).
    console.error('[artistes/upload] handleUpload ha fallat:', message);
    const status = message.includes('No autoritzat') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

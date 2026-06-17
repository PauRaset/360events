import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/auth';

/**
 * Genera el token per a la pujada directa (client upload) a Vercel Blob.
 * La protecció es fa dins d'onBeforeGenerateToken (fase iniciada pel client),
 * perquè onUploadCompleted l'invoca Vercel servidor-a-servidor sense cookies.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user) {
          throw new Error('No autoritzat');
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
      onUploadCompleted: async () => {
        // Res a fer: la URL la rep el client directament de la pujada.
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error de pujada' },
      { status: 400 },
    );
  }
}

'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { IconClose } from '@/components/ui/Icons';

export function PhotoUploader({
  fotos,
  onChange,
}: {
  fotos: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);

    const nextUrls: string[] = [];
    try {
      for (const file of files) {
        const result = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/artistes/upload',
        });
        nextUrls.push(result.url);
      }
      onChange([...fotos, ...nextUrls]);
    } catch (err) {
      setError(
        err instanceof Error
          ? `No s’ha pogut pujar la imatge (${err.message})`
          : 'No s’ha pogut pujar la imatge',
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function remove(url: string) {
    onChange(fotos.filter((f) => f !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {fotos.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10"
          >
            <Image
              src={url}
              alt="Foto de l’artista"
              fill
              sizes="96px"
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label="Eliminar foto"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-base/80 text-platinum opacity-0 transition-opacity group-hover:opacity-100"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-text-gray transition-colors hover:border-electric/50 hover:text-platinum disabled:opacity-60"
        >
          {uploading ? 'Pujant…' : '+ Afegir'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

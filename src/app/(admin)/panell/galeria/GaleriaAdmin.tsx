'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { IconClose } from '@/components/ui/Icons';

export type FotoItem = { id: string; url: string };

export function GaleriaAdmin({ initial }: { initial: FotoItem[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<FotoItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const result = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        });
        const res = await fetch('/api/galeria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: result.url }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFotos((prev) => [...prev, { id: data.id, url: result.url }]);
      }
    } catch {
      setError('No s’ha pogut pujar alguna foto. Torna-ho a provar.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function remove(id: string) {
    if (!confirm('Eliminar aquesta foto de la galeria?')) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/galeria/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setFotos((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError('No s’ha pogut eliminar la foto.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-primary disabled:opacity-60"
        >
          {uploading ? 'Pujant…' : 'Afegir fotos'}
        </button>
        <span className="text-sm text-text-gray">
          Pots seleccionar-ne diverses alhora (JPG, PNG o WebP).
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {error && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {fotos.length === 0 ? (
        <p className="mt-10 text-center text-text-gray">
          Encara no hi ha fotos. Prem «Afegir fotos» per començar.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {fotos.map((f) => (
            <div
              key={f.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-base"
            >
              <Image
                src={f.url}
                alt="Foto de galeria"
                fill
                sizes="(max-width:640px) 50vw, 25vw"
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => remove(f.id)}
                disabled={deleting === f.id}
                aria-label="Eliminar foto"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-base/80 text-platinum opacity-0 transition-opacity hover:bg-red-500/30 group-hover:opacity-100 disabled:opacity-60"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

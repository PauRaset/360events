'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { artistaSchema } from '@/lib/schemas';
import { slugify } from '@/lib/utils';
import { PhotoUploader } from '../PhotoUploader';
import { IconArrowRight, IconClose } from '@/components/ui/Icons';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';
const errorCls = 'mt-1 text-xs text-red-400';

export type ArtistaFormData = {
  id?: string;
  nom: string;
  slug: string;
  categoria: string;
  descripcio: string;
  riderTecnic: string;
  fotos: string[];
  videos: string[];
  destacat: boolean;
  actiu: boolean;
};

const empty: ArtistaFormData = {
  nom: '',
  slug: '',
  categoria: '',
  descripcio: '',
  riderTecnic: '',
  fotos: [],
  videos: [],
  destacat: false,
  actiu: true,
};

export function ArtistaForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit';
  initial?: ArtistaFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<ArtistaFormData>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ArtistaFormData>(key: K, value: ArtistaFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function onNomChange(value: string) {
    setData((d) => ({
      ...d,
      nom: value,
      slug: slugTouched ? d.slug : slugify(value),
    }));
  }

  function setVideo(i: number, value: string) {
    setData((d) => {
      const videos = [...d.videos];
      videos[i] = value;
      return { ...d, videos };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const payload = {
      ...data,
      videos: data.videos.map((v) => v.trim()).filter((v) => v.length > 0),
    };

    const parsed = artistaSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === 'create' ? '/api/artistes' : `/api/artistes/${data.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (res.status === 409) {
          setErrors((e) => ({ ...e, slug: body?.error ?? 'Slug duplicat' }));
          setSaving(false);
          return;
        }
        throw new Error(body?.error ?? 'Error desconegut');
      }
      router.push('/panell/artistes');
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Hi ha hagut un problema');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className={labelCls}>
            Nom
          </label>
          <input
            id="nom"
            value={data.nom}
            onChange={(e) => onNomChange(e.target.value)}
            className={inputCls}
            placeholder="Nom de l’artista"
          />
          {errors.nom && <p className={errorCls}>{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelCls}>
            Slug <span className="text-text-gray">(URL)</span>
          </label>
          <input
            id="slug"
            value={data.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
            className={inputCls}
            placeholder="nom-artista"
          />
          {errors.slug && <p className={errorCls}>{errors.slug}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="categoria" className={labelCls}>
            Categoria
          </label>
          <input
            id="categoria"
            value={data.categoria}
            onChange={(e) => set('categoria', e.target.value)}
            className={inputCls}
            placeholder="Ex: DJ · Sessions"
          />
          {errors.categoria && <p className={errorCls}>{errors.categoria}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descripcio" className={labelCls}>
            Descripció
          </label>
          <textarea
            id="descripcio"
            rows={4}
            value={data.descripcio}
            onChange={(e) => set('descripcio', e.target.value)}
            className={inputCls}
            placeholder="Explica qui és l’artista…"
          />
          {errors.descripcio && <p className={errorCls}>{errors.descripcio}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="riderTecnic" className={labelCls}>
            Rider tècnic <span className="text-text-gray">(opcional)</span>
          </label>
          <textarea
            id="riderTecnic"
            rows={3}
            value={data.riderTecnic}
            onChange={(e) => set('riderTecnic', e.target.value)}
            className={inputCls}
            placeholder="Necessitats tècniques…"
          />
          {errors.riderTecnic && <p className={errorCls}>{errors.riderTecnic}</p>}
        </div>

        {/* Fotos */}
        <div className="sm:col-span-2">
          <span className={labelCls}>Fotos</span>
          <PhotoUploader
            fotos={data.fotos}
            onChange={(next) => set('fotos', next)}
          />
          {errors.fotos && <p className={errorCls}>{errors.fotos}</p>}
        </div>

        {/* Vídeos */}
        <div className="sm:col-span-2">
          <span className={labelCls}>Vídeos (URLs)</span>
          <div className="space-y-2">
            {data.videos.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={v}
                  onChange={(e) => setVideo(i, e.target.value)}
                  className={inputCls}
                  placeholder="https://www.youtube.com/embed/…"
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      'videos',
                      data.videos.filter((_, idx) => idx !== i),
                    )
                  }
                  aria-label="Eliminar vídeo"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-text-gray hover:text-platinum"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set('videos', [...data.videos, ''])}
            className="mt-2 text-sm font-medium text-electric-bright hover:text-platinum"
          >
            + Afegir vídeo
          </button>
          {errors.videos && <p className={errorCls}>{errors.videos}</p>}
        </div>

        {/* Opcions */}
        <div className="flex items-center gap-3">
          <input
            id="destacat"
            type="checkbox"
            checked={data.destacat}
            onChange={(e) => set('destacat', e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-base/60 accent-electric"
          />
          <label htmlFor="destacat" className="text-sm text-silver">
            Destacat
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="actiu"
            type="checkbox"
            checked={data.actiu}
            onChange={(e) => set('actiu', e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-base/60 accent-electric"
          />
          <label htmlFor="actiu" className="text-sm text-silver">
            Actiu (visible al web)
          </label>
        </div>
      </div>

      {serverError && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="mt-7 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Desant…' : mode === 'create' ? 'Crear artista' : 'Desar canvis'}
          {!saving && <IconArrowRight className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => router.push('/panell/artistes')}
          className="btn-ghost"
        >
          Cancel·lar
        </button>
      </div>
    </form>
  );
}

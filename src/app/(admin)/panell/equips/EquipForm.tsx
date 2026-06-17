'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { equipSchema, CATEGORIES_EQUIP } from '@/lib/schemas';
import { PhotoUploader } from '../PhotoUploader';
import { IconArrowRight } from '@/components/ui/Icons';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';
const errorCls = 'mt-1 text-xs text-red-400';

export type EquipFormData = {
  id?: string;
  nom: string;
  categoria: string;
  descripcio: string;
  fotos: string[];
  destacat: boolean;
  actiu: boolean;
  ordre: number;
};

const empty: EquipFormData = {
  nom: '',
  categoria: '',
  descripcio: '',
  fotos: [],
  destacat: false,
  actiu: true,
  ordre: 0,
};

export function EquipForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit';
  initial?: EquipFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<EquipFormData>(initial ?? empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof EquipFormData>(key: K, value: EquipFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = equipSchema.safeParse(data);
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
      const url = mode === 'create' ? '/api/equips' : `/api/equips/${data.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Error desconegut');
      }
      router.push('/panell/equips');
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
            onChange={(e) => set('nom', e.target.value)}
            className={inputCls}
            placeholder="Ex: Bose L1 Pro"
          />
          {errors.nom && <p className={errorCls}>{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="categoria" className={labelCls}>
            Categoria
          </label>
          <select
            id="categoria"
            value={data.categoria}
            onChange={(e) => set('categoria', e.target.value)}
            className={inputCls}
          >
            <option value="" disabled>
              Tria una categoria
            </option>
            {CATEGORIES_EQUIP.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.categoria && <p className={errorCls}>{errors.categoria}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descripcio" className={labelCls}>
            Descripció <span className="text-text-gray">(opcional)</span>
          </label>
          <textarea
            id="descripcio"
            rows={3}
            value={data.descripcio}
            onChange={(e) => set('descripcio', e.target.value)}
            className={inputCls}
            placeholder="Breu descripció de l’equip…"
          />
          {errors.descripcio && <p className={errorCls}>{errors.descripcio}</p>}
        </div>

        <div className="sm:col-span-2">
          <span className={labelCls}>Fotos</span>
          <PhotoUploader fotos={data.fotos} onChange={(next) => set('fotos', next)} />
          {errors.fotos && <p className={errorCls}>{errors.fotos}</p>}
        </div>

        <div>
          <label htmlFor="ordre" className={labelCls}>
            Ordre <span className="text-text-gray">(menor = primer)</span>
          </label>
          <input
            id="ordre"
            type="number"
            min={0}
            value={data.ordre}
            onChange={(e) => set('ordre', Number(e.target.value))}
            className={inputCls}
          />
          {errors.ordre && <p className={errorCls}>{errors.ordre}</p>}
        </div>

        <div className="flex items-end gap-6 pb-2">
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
          {saving ? 'Desant…' : mode === 'create' ? 'Crear equip' : 'Desar canvis'}
          {!saving && <IconArrowRight className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => router.push('/panell/equips')}
          className="btn-ghost"
        >
          Cancel·lar
        </button>
      </div>
    </form>
  );
}

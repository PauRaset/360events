'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { pressupostSchema } from '@/lib/schemas';
import { IconArrowRight } from '@/components/ui/Icons';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';
const errorCls = 'mt-1 text-xs text-red-400';

export type PressupostFormData = {
  id?: string;
  clientNom: string;
  clientEmail: string;
  clientTelefon: string;
  tipusEvent: string;
  dataEvent: string;
  horaInici: string;
  ubicacio: string;
  concepte: string;
  condicions: string;
  importEuros: string;
  artistaId: string;
};

const empty: PressupostFormData = {
  clientNom: '', clientEmail: '', clientTelefon: '', tipusEvent: '',
  dataEvent: '', horaInici: '', ubicacio: '', concepte: '', condicions: '',
  importEuros: '', artistaId: '',
};

export function PressupostForm({
  mode,
  initial,
  artistes,
}: {
  mode: 'create' | 'edit';
  initial?: PressupostFormData;
  artistes?: { id: string; nom: string }[];
}) {
  const router = useRouter();
  const [data, setData] = useState<PressupostFormData>(initial ?? empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PressupostFormData>(k: K, v: PressupostFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = pressupostSchema.safeParse(data);
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
      const url = mode === 'create' ? '/api/pressupostos' : `/api/pressupostos/${data.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? 'Error desconegut');
      }
      router.push('/panell/pressupostos');
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
          <label htmlFor="clientNom" className={labelCls}>Nom del client</label>
          <input id="clientNom" value={data.clientNom} onChange={(e) => set('clientNom', e.target.value)} className={inputCls} />
          {errors.clientNom && <p className={errorCls}>{errors.clientNom}</p>}
        </div>
        <div>
          <label htmlFor="clientEmail" className={labelCls}>Correu del client</label>
          <input id="clientEmail" type="email" value={data.clientEmail} onChange={(e) => set('clientEmail', e.target.value)} className={inputCls} />
          {errors.clientEmail && <p className={errorCls}>{errors.clientEmail}</p>}
        </div>
        <div>
          <label htmlFor="clientTelefon" className={labelCls}>Telèfon <span className="text-text-gray">(opcional)</span></label>
          <input id="clientTelefon" value={data.clientTelefon} onChange={(e) => set('clientTelefon', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="tipusEvent" className={labelCls}>Tipus d’esdeveniment <span className="text-text-gray">(opcional)</span></label>
          <input id="tipusEvent" value={data.tipusEvent} onChange={(e) => set('tipusEvent', e.target.value)} className={inputCls} placeholder="Ex: Casament" />
        </div>
        <div>
          <label htmlFor="dataEvent" className={labelCls}>Data de l’esdeveniment</label>
          <input id="dataEvent" type="date" value={data.dataEvent} onChange={(e) => set('dataEvent', e.target.value)} className={inputCls} />
          {errors.dataEvent && <p className={errorCls}>{errors.dataEvent}</p>}
        </div>
        <div>
          <label htmlFor="horaInici" className={labelCls}>Hora <span className="text-text-gray">(opcional)</span></label>
          <input id="horaInici" type="time" value={data.horaInici} onChange={(e) => set('horaInici', e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ubicacio" className={labelCls}>Ubicació <span className="text-text-gray">(opcional)</span></label>
          <input id="ubicacio" value={data.ubicacio} onChange={(e) => set('ubicacio', e.target.value)} className={inputCls} />
        </div>

        {artistes && (
          <div className="sm:col-span-2">
            <label htmlFor="artistaId" className={labelCls}>Artista <span className="text-text-gray">(opcional)</span></label>
            <select id="artistaId" value={data.artistaId} onChange={(e) => set('artistaId', e.target.value)} className={inputCls}>
              <option value="">— Cap / genèric —</option>
              {artistes.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="concepte" className={labelCls}>Concepte / proposta</label>
          <textarea id="concepte" rows={4} value={data.concepte} onChange={(e) => set('concepte', e.target.value)} className={inputCls} placeholder="Descriu el servei ofert…" />
          {errors.concepte && <p className={errorCls}>{errors.concepte}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="condicions" className={labelCls}>Condicions <span className="text-text-gray">(opcional)</span></label>
          <textarea id="condicions" rows={3} value={data.condicions} onChange={(e) => set('condicions', e.target.value)} className={inputCls} placeholder="Pagament, cancel·lació, etc." />
        </div>
        <div>
          <label htmlFor="importEuros" className={labelCls}>Import (€)</label>
          <input id="importEuros" type="number" min={0} step="0.01" value={data.importEuros} onChange={(e) => set('importEuros', e.target.value)} className={inputCls} placeholder="0,00" />
          {errors.importEuros && <p className={errorCls}>{errors.importEuros}</p>}
        </div>
      </div>

      {serverError && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{serverError}</p>
      )}

      <div className="mt-7 flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Desant…' : mode === 'create' ? 'Crear pressupost' : 'Desar canvis'}
          {!saving && <IconArrowRight className="h-4 w-4" />}
        </button>
        <button type="button" onClick={() => router.push('/panell/pressupostos')} className="btn-ghost">
          Cancel·lar
        </button>
      </div>
    </form>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SignaturaForm } from '@/components/SignaturaForm';
import { formatEuros, formatData } from '@/lib/format';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'El teu pressupost',
  robots: { index: false, follow: false },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/5 py-2 sm:flex-row sm:justify-between">
      <span className="text-sm text-text-gray">{label}</span>
      <span className="text-sm font-medium text-platinum sm:text-right">{value}</span>
    </div>
  );
}

export default async function PressupostPublicPage({
  params,
}: {
  params: { token: string };
}) {
  const p = await prisma.pressupost.findUnique({
    where: { token: params.token },
    include: { artista: true },
  });
  if (!p) notFound();

  const noDisponible = p.estat === 'ESBORRANY' || p.estat === 'CANCELLAT';

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="container-page relative max-w-3xl pb-24 pt-32">
        <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
          Pressupost · {p.codi}
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
          Contracte de prestació de serveis
        </h1>

        {noDisponible ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-panel/70 p-6 text-text-gray">
            Aquest pressupost no està disponible. Contacta amb nosaltres a{' '}
            {site.contact.email}.
          </p>
        ) : (
          <>
            {/* Document */}
            <div className="mt-8 panel p-6 sm:p-8">
              <Row label="Client" value={p.clientNom} />
              <Row label="Correu" value={p.clientEmail} />
              {p.artista && <Row label="Artista / servei" value={p.artista.nom} />}
              {p.tipusEvent && <Row label="Tipus d’esdeveniment" value={p.tipusEvent} />}
              <Row
                label="Data"
                value={`${formatData(p.dataEvent)}${p.horaInici ? ` · ${p.horaInici}` : ''}`}
              />
              {p.ubicacio && <Row label="Ubicació" value={p.ubicacio} />}

              <div className="mt-4">
                <p className="text-sm text-text-gray">Concepte</p>
                <p className="mt-1 whitespace-pre-wrap text-platinum">{p.concepte}</p>
              </div>

              {p.condicions && (
                <div className="mt-4">
                  <p className="text-sm text-text-gray">Condicions</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-silver">{p.condicions}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-electric/30 bg-electric/10 p-5">
                <span className="text-sm uppercase tracking-wide text-text-gray">Import total</span>
                <span className="font-display text-2xl font-extrabold text-platinum">
                  {formatEuros(p.importCentims)}
                </span>
              </div>
            </div>

            {/* Accions segons estat */}
            {p.estat === 'ENVIAT' && (
              <div className="mt-8">
                <SignaturaForm token={p.token} />
                <a
                  href={`/api/pressupost/${p.token}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-electric-bright hover:text-platinum"
                >
                  Descarregar en PDF
                </a>
              </div>
            )}

            {p.estat === 'SIGNAT' && (
              <div className="mt-8 panel p-6 sm:p-8 text-center">
                <h2 className="font-display text-2xl font-bold text-emerald-300">
                  Contracte signat ✓
                </h2>
                <p className="mx-auto mt-3 max-w-md text-text-gray">
                  Gràcies, {p.signatNom}. Hem registrat la teva acceptació el{' '}
                  {p.signatData ? formatData(p.signatData) : ''}. La data queda
                  reservada. T’enviarem els següents passos per correu.
                </p>
                <a
                  href={`/api/pressupost/${p.token}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6"
                >
                  Descarregar contracte (PDF)
                </a>
              </div>
            )}

            {p.estat === 'REBUTJAT' && (
              <p className="mt-8 rounded-2xl border border-white/10 bg-panel/70 p-6 text-text-gray">
                Has rebutjat aquest pressupost. Si ha estat un error o vols una
                nova proposta, escriu-nos a {site.contact.email}.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

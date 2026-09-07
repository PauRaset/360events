/** Formata cèntims a euros en format català: 150000 → "1.500,00 €". */
export function formatEuros(centims: number): string {
  return new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(centims / 100);
}

/** Formata una data (Date o ISO) en format llegible català. */
export function formatData(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Etiquetes en català per als estats de pressupost. */
export const ESTAT_PRESSUPOST_LABELS: Record<string, string> = {
  ESBORRANY: 'Esborrany',
  ENVIAT: 'Enviat',
  SIGNAT: 'Signat',
  REBUTJAT: 'Rebutjat',
  CANCELLAT: 'Cancel·lat',
};

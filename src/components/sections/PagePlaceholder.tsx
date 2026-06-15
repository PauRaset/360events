import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';

/** Capçalera reutilitzable per a les pàgines encara en construcció. */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-text-gray">{description}</p>
        <span className="mt-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-text-gray">
          Pàgina en construcció
        </span>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/contacte">
            Demana pressupost gratuït
            <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/" variant="ghost">
            Tornar a l’inici
          </Button>
        </div>
      </div>
    </section>
  );
}

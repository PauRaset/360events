import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { IconArrowRight, IconPhone } from '@/components/ui/Icons';
import { site } from '@/lib/site';

/** Banda de crida a l'acció reutilitzable al final de les landings. */
export function CtaBand({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <section className="container-page py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-electric/20 bg-gradient-to-br from-electric-deep/40 via-panel to-base p-8 text-center sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-electric/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-2xl font-extrabold sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-gray">{text}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={href}>
                Demana pressupost
                <IconArrowRight className="h-4 w-4" />
              </Button>
              <Button href={site.contact.phoneHref} variant="ghost">
                <IconPhone className="h-4 w-4" />
                {site.contact.phone}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

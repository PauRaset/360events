import type { SVGProps, ComponentType } from 'react';
import { Reveal } from '@/components/ui/Reveal';

export type Feature = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
};

/** Graella de característiques reutilitzable per a les landings. */
export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((f, i) => (
        <Reveal key={f.title} delay={(i % 3) * 0.08}>
          <div className="panel group h-full p-7 transition-all duration-300 hover:border-electric/40 hover:shadow-glow-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
              <f.Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-platinum">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-gray">
              {f.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

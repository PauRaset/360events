import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Logo "360 EVENTS" — el "360" viu dins d'un cercle amb glow.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="360 Events · inici"
      className={cn('group flex items-center gap-2.5', className)}
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-electric/60 shadow-glow transition-all duration-500 group-hover:shadow-glow-lg" />
        <span className="absolute inset-0 rounded-full bg-electric/10 blur-sm transition group-hover:bg-electric/20" />
        <span className="relative font-display text-[13px] font-extrabold leading-none text-platinum">
          360
        </span>
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-platinum">
        EVENTS
      </span>
    </Link>
  );
}

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
};

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className'>;

type ButtonAsButton = {
  href?: undefined;
  variant?: Variant;
  className?: string;
} & ComponentProps<'button'>;

type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Botó reutilitzable que renderitza com a <Link> o <button>. */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const classes = cn(variants[variant], className);

  if (props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {props.children}
      </Link>
    );
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}

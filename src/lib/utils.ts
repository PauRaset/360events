/**
 * Petites utilitats compartides.
 */

/** Concatena classes condicionalment, filtrant valors falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

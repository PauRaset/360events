/**
 * Petites utilitats compartides.
 */

/** Concatena classes condicionalment, filtrant valors falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Genera un slug net (minúscules, sense accents, separat per guions). */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // treu accents
    .toLowerCase()
    .replace(/[·]/g, '') // punt volat català
    .replace(/[^a-z0-9]+/g, '-') // no alfanumèric -> guió
    .replace(/^-+|-+$/g, ''); // treu guions als extrems
}

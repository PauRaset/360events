import { z } from 'zod';

/** Tipus d'esdeveniment disponibles al formulari de reserva. */
export const TIPUS_EVENT = [
  'Casament',
  'Festa major',
  'Esdeveniment d’empresa',
  'Festa privada',
  'Altres',
] as const;

/**
 * Esquema de validació de la reserva, compartit entre el client
 * (ReservaForm) i el servidor (API /api/reserves).
 */
export const reservaSchema = z.object({
  nom: z
    .string({ required_error: 'Indica’ns el teu nom' })
    .trim()
    .min(2, 'Indica’ns el teu nom i cognoms'),
  telefon: z
    .string({ required_error: 'Necessitem un telèfon de contacte' })
    .trim()
    .min(6, 'Introdueix un telèfon vàlid'),
  email: z
    .string({ required_error: 'Necessitem un correu de contacte' })
    .trim()
    .email('Introdueix un correu electrònic vàlid'),
  tipusEvent: z.enum(TIPUS_EVENT, {
    errorMap: () => ({ message: 'Tria un tipus d’esdeveniment' }),
  }),
  dataEvent: z
    .string({ required_error: 'Indica la data de l’esdeveniment' })
    .min(1, 'Indica la data de l’esdeveniment'),
  ubicacio: z
    .string({ required_error: 'Indica la ubicació' })
    .trim()
    .min(2, 'Indica la ubicació de l’esdeveniment'),
  assistents: z
    .union([z.coerce.number().int().positive(), z.literal('')])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : Number(v))),
  missatge: z.string().trim().max(2000).optional().or(z.literal('')),
  artistaId: z.string().optional().or(z.literal('')),
  servei: z.string().optional().or(z.literal('')),
});

export type ReservaInput = z.infer<typeof reservaSchema>;

/**
 * Esquema de validació del formulari de contacte, compartit entre el client
 * (ContacteForm) i el servidor (API /api/contacte).
 */
export const contacteSchema = z.object({
  nom: z
    .string({ required_error: 'Indica’ns el teu nom' })
    .trim()
    .min(2, 'Indica’ns el teu nom'),
  email: z
    .string({ required_error: 'Necessitem un correu de contacte' })
    .trim()
    .email('Introdueix un correu electrònic vàlid'),
  telefon: z.string().trim().optional().or(z.literal('')),
  assumpte: z.string().trim().optional().or(z.literal('')),
  missatge: z
    .string({ required_error: 'Escriu-nos un missatge' })
    .trim()
    .min(10, 'Explica’ns una mica més (mínim 10 caràcters)')
    .max(3000),
});

export type ContacteInput = z.infer<typeof contacteSchema>;

/** Estats possibles d'una reserva (coincideix amb l'enum EstatReserva de Prisma). */
export const ESTAT_RESERVA = [
  'NOVA',
  'EN_REVISIO',
  'PRESSUPOST_ENVIAT',
  'CONFIRMADA',
  'CANCELLADA',
] as const;

export type EstatReservaValue = (typeof ESTAT_RESERVA)[number];

export const ESTAT_LABELS: Record<EstatReservaValue, string> = {
  NOVA: 'Nova',
  EN_REVISIO: 'En revisió',
  PRESSUPOST_ENVIAT: 'Pressupost enviat',
  CONFIRMADA: 'Confirmada',
  CANCELLADA: 'Cancel·lada',
};

/** Validació del canvi d'estat (API PATCH). */
export const estatUpdateSchema = z.object({
  estat: z.enum(ESTAT_RESERVA, {
    errorMap: () => ({ message: 'Estat no vàlid' }),
  }),
});

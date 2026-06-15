import { Resend } from 'resend';

/**
 * Client de Resend per a l'enviament d'emails.
 * Si no hi ha RESEND_API_KEY configurada, retornem null perquè el flux
 * de reserva no es trenqui en desenvolupament (només s'omet l'email).
 */
const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const RESEND_FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev';
export const RESEND_TO = 'info@360events.cat';

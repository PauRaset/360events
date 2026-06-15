import { site } from '@/lib/site';
import { IconWhatsApp } from './Icons';

/** Botó flotant permanent de WhatsApp amb animació de pols. */
export function WhatsAppButton() {
  return (
    <a
      href={site.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacta'ns per WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/70" />
      <IconWhatsApp className="relative h-7 w-7" />
    </a>
  );
}

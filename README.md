# 360Events.cat

Web corporativa de **360Events.cat** — contractació d’artistes, producció
d’esdeveniments i lloguer d’equips de so i il·luminació a Catalunya.

> Experiència **360°**: espectacle, música i llums per a esdeveniments petits i
> mitjans. Tot el contingut de la web és en **català**.

## 🧱 Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animacions)
- Fonts via `next/font`: **Sora** (display), **Inter** (cos), **Caveat** (accent)
- ESLint + Prettier

## 🚀 Arrencada en local

Requisits: **Node 18.18+** (recomanat Node 20+).

```bash
# 1. Instal·la les dependències
npm install

# 2. (Opcional) Copia les variables d'entorn de mostra
cp .env.example .env.local

# 3. Arrenca el servidor de desenvolupament
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

| Script             | Descripció                                  |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Servidor de desenvolupament                 |
| `npm run build`    | Build de producció                          |
| `npm run start`    | Serveix el build de producció               |
| `npm run lint`     | Comprova el codi amb ESLint                 |
| `npm run format`   | Formata el codi amb Prettier                |
| `npm run db:migrate` | Crea/aplica migracions (dev) amb Prisma   |
| `npm run db:deploy`  | Aplica migracions (producció)             |
| `npm run db:seed`    | Insereix els artistes inicials            |
| `npm run db:studio`  | Obre Prisma Studio                        |

## 🗄️ Base de dades (Prisma + PostgreSQL)

1. Omple `DATABASE_URL` a `.env` (PostgreSQL: Neon, Supabase, Railway…).
2. Aplica l'esquema i carrega les dades inicials:

```bash
npx prisma migrate deploy   # aplica la migració inicial
npm run db:seed             # insereix els 3 artistes
```

> En desenvolupament pots usar `npm run db:migrate` per crear noves migracions.
> Models: `Artista` i `Reserva` (amb l'enum `EstatReserva`). Vegeu
> `prisma/schema.prisma`.

## 🎨 Sistema de disseny

Tokens definits a `tailwind.config.ts` i com a variables CSS a
`src/styles/globals.css`.

| Token            | Valor     | Ús                       |
| ---------------- | --------- | ------------------------ |
| `base`           | `#05070F` | Fons principal           |
| `base-2`         | `#080B16` | Fons secundari           |
| `panel`          | `#0C1122` | Targetes / panells       |
| `electric`       | `#1E7BFF` | Blau elèctric (primari)  |
| `electric-bright`| `#3D93FF` | Blau brillant (accent)   |
| `electric-deep`  | `#0A2A66` | Blau profund             |
| `silver`         | `#C8D2E0` | Text clar                |
| `platinum`       | `#E9EEF7` | Títols                   |
| `text-gray`      | `#8590A6` | Text secundari           |

Estètica d’escenari: fons molt fosc, llums i microinteraccions suaus. Es
respecta `prefers-reduced-motion` i el focus de teclat sempre és visible.

## 📁 Estructura

```
src/
├── app/
│   ├── (web)/            # Lloc públic (Navbar + Footer + WhatsApp)
│   │   ├── page.tsx      # Home
│   │   ├── qui-som/
│   │   ├── artistes/[slug]/
│   │   ├── lloguer-equips/
│   │   ├── casaments/
│   │   ├── esdeveniments-empresa/
│   │   ├── festes-majors/
│   │   ├── galeria/
│   │   ├── blog/
│   │   └── contacte/
│   ├── (admin)/panell/   # Panell (placeholder, fases futures)
│   ├── api/              # Rutes d'API (health check)
│   ├── layout.tsx        # Layout arrel + fonts + metadata
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/               # Navbar, Footer, Button, Logo, Icons, etc.
│   └── sections/         # Seccions de la home
├── lib/                  # Config del lloc, utils, JSON-LD
└── styles/               # globals.css
```

## 🔎 SEO

- `metadata` / `generateMetadata()` per pàgina.
- JSON-LD `LocalBusiness` a la home amb les dades de contacte.
- `robots.ts` i `sitemap.ts` generats automàticament.

## 🔐 Variables d'entorn (futures fases)

Cap d’aquestes variables és necessària per a la Fase 1. Vegeu `.env.example`.

| Variable                        | Fase / ús                         |
| ------------------------------- | --------------------------------- |
| `DATABASE_URL`                  | Base de dades (Prisma)            |
| `RESEND_API_KEY`                | Enviament d'emails                |
| `TWILIO_SID`                    | Trucades / SMS (Twilio)           |
| `TWILIO_TOKEN`                  | Trucades / SMS (Twilio)           |
| `TWILIO_NUMBER`                 | Trucades / SMS (Twilio)           |
| `GOOGLE_CALENDAR_*`             | Sincronització amb Google Calendar|

## 📞 Contacte

- Telèfon: **687 755 444**
- Email: **info@360events.cat**
- Instagram: **@360events.cat**

---

© 360Events.cat

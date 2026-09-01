# PaPK Alumni Digital Network

Premium institutional web experience for professional discovery, shared history, and public-safe storytelling across the PaPK alumni community. The current pilot highlights **ALCANTARA — PaPK 29A** and the public profile of Muhammad Sobri Maulana.

## Stack

- React 19, TypeScript, React Router, and Vite
- Tailwind CSS plus a project-specific responsive design layer
- Framer Motion with reduced-motion support
- Lucide icons and Recharts for letting-level aggregate visualisations
- Static, privacy-reviewed mock data; no authentication or backend is implied

## Folder structure

```text
src/
  main.tsx           application shell, routes, directory, profiles, SEO controller
  ContentPages.tsx   gallery, news, and article routes
  Discovery.tsx      network and curated discovery routes
  LettingDetail.tsx  Alcantara letting experience
  data.ts            public-safe mock alumni records
  content.ts         editorial and gallery content
  index.css          responsive institutional design system
public/
  images/            local illustrative assets (no remote profile tracking)
  robots.txt         crawler policy
  sitemap.xml        initial sitemap, extend during backend migration
```

## Development

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` runs TypeScript project checking before the production Vite build. No ESLint command is configured yet; introduce one with the team rules rather than silently applying an arbitrary preset.

## Vercel deployment

1. Import the repository into Vercel.
2. Keep the detected framework preset as **Vite**.
3. Use `npm run build` and output directory `dist`.
4. Set `VITE_SITE_URL` to the production origin (for example `https://alcantara29a.id`) so runtime canonical and social URLs are absolute.
5. Replace the placeholder domain in `public/robots.txt` and `public/sitemap.xml` if the production domain differs.

`vercel.json` provides SPA history fallback while preserving static files and applies baseline response-security headers.

## Mock-data architecture and privacy

`src/data.ts` is the only public alumni data source. UI-facing compatibility fields are derived from a typed seed rather than duplicated. Records intentionally contain only broad professional context, broad region, education, and approved achievements. Unit details, personal contact details, identifiers, schedules, operational status, precise location, reporting lines, and military operational information must never be added to the public bundle. Images are local illustrative archive artwork—not identity claims.

Browser storage is deliberately unused: filters live in shareable URL parameters, and no profile, search, or personal data is persisted in `localStorage` or `sessionStorage`.

## Future backend migration

1. Move seed records to a reviewed API with separate private and public schemas.
2. Enforce field allowlisting server-side; never depend on client-side redaction.
3. Add consent state, editorial approval, audit logs, role-based access, retention rules, and removal workflows.
4. Generate sitemap entries and server-rendered metadata from approved public records.
5. Store media behind an image pipeline that strips metadata, creates responsive formats, and reserves dimensions to prevent layout shift.
6. Add API schema validation, rate limiting, security monitoring, backups, and documented incident response before accepting real alumni submissions.

## Production notes

Routes are lazy-loaded by feature area. Images use local assets with explicit display geometry and gallery/editorial media are lazy-loaded. Accessibility includes semantic landmarks, keyboard-operable controls, visible focus, skip navigation, descriptive alternatives, live loading status, and reduced-motion behavior. Every new route should receive unique metadata and a sitemap entry.

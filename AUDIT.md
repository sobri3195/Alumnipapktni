# Audit Teknis PaPK Alumni Digital Network

Tanggal audit: 2 September 2026. Cakupan audit adalah source pada branch ini; tidak ada backend, kredensial, atau environment produksi yang tersedia. Prioritas: **P0** kritis, **P1** penting, **P2** peningkatan.

## Ringkasan eksekutif dan checklist implementasi

- [x] **P0 — hardening respons publik:** tambahkan CSP, HSTS, anti-framing, pembatasan permission, MIME sniffing, dan referrer policy pada konfigurasi Vercel. CSP tetap mengizinkan Google Fonts dan empat gambar Unsplash yang memang dipakai saat ini.
- [x] **P0 — supply-chain baseline:** tambahkan `package-lock.json` agar dependency graph reproducible dan dapat diaudit. Endpoint advisory registry menolak `npm audit` dengan HTTP 403 di environment ini, sehingga hasil vulnerability belum dapat diklaim.
- [ ] **P0 — governance sebelum data nyata:** jangan mengganti mock dengan data alumni nyata sebelum ada consent tertulis, allowlist field server-side, autentikasi/RBAC untuk data privat, audit log, retention/removal workflow, dan security review. Client bundle selalu dapat dibaca publik; penyensoran di React bukan kontrol keamanan.
- [ ] **P1 — integritas konten/action:** hubungkan CTA kartu berita beranda, ikon sosial, link sosial profil bernilai `#`, tombol corps/profession, QR placeholder, dan tombol shuffle ke action nyata atau beri status disabled yang eksplisit.
- [ ] **P1 — quality gate:** tambahkan ESLint, unit/integration test untuk filter/routing, serta E2E keyboard dan viewport. Saat ini hanya TypeScript + production build yang menjadi gate.
- [ ] **P1 — aksesibilitas modal:** implementasikan focus trap, initial focus, pengembalian fokus, dan `aria-labelledby`; status hasil direktori juga perlu live region.
- [ ] **P1 — error handling:** tambahkan route-level error boundary serta fallback untuk image/font/clipboard/share failure. Loading state baru tersedia untuk lazy route dan simulasi direktori.
- [ ] **P1 — performance:** pecah Recharts dari route letting atau load chart hanya ketika terlihat; hilangkan font `@import`; lokal-kan/optimalkan foto Unsplash; tetapkan budget CI. Chunk utama ~423 kB dan letting ~398 kB (sebelum gzip).
- [ ] **P2 — discoverability:** lengkapi sitemap untuk seluruh profil dan artikel, metadata route `/alumni`, `/network`, `/explore`, `/about`, dan OG image.
- [ ] **P2 — konsistensi UX:** samakan Bahasa Indonesia/Inggris, label filter, affordance card interaktif, dan navigation mobile yang saat ini hanya memuat subset route.

## 1. Struktur dan arsitektur

SPA Vite + React yang relatif datar: `main.tsx` memuat shell, SEO client-side, sebagian besar halaman, direktori, dan routing; tiga feature module di-lazy-load (`ContentPages`, `Discovery`, `LettingDetail`). `data.ts` adalah model + mock alumni; `content.ts` adalah CMS statis; `index.css` adalah design system tunggal. Struktur sesuai pilot kecil, tetapi `main.tsx` dan CSS monolitik akan menyulitkan ownership/testing ketika berkembang.

Stack: React 19, TypeScript strict, React Router, Framer Motion, Tailwind/PostCSS, Lucide, Recharts, Vite. State hanya React local state dan URL search params; tidak ada global state library. Tidak ada database, API, authentication, server action, analytics, maupun browser storage. Deployment memakai Vercel SPA rewrite.

## 2. Inventaris route dan navigasi

Semua route ditemukan dan dirender: `/`, `/alumni`, `/alumni/:slug`, `/network`, `/explore`, `/letting`, `/letting/:slug`, `/directory`, `/gallery`, `/news`, `/news/:slug`, `/about`, serta wildcard 404. Header desktop dan drawer memuat sembilan route top-level. Footer mengecualikan Beranda. Bottom navigation hanya Home, Directory, Letting, Explore, dan More/About; Network, Alumni, Gallery, dan News tetap dapat dicapai melalui drawer/header/footer.

Routing internal umumnya memakai `Link`/`NavLink`. Pencarian header dan autocomplete masih memakai `window.location.assign`, sehingga melakukan full reload (P2). Hash navigation di letting berfungsi. Sitemap hanya berisi satu dari sepuluh profil dan tidak memuat article detail (P2).

## 3. Audit kontrol dan status fitur

| Area | Status | Temuan |
| --- | --- | --- |
| Header/menu/search | Berfungsi | Drawer, Escape, backdrop, submit, active route; belum ada focus trap/restore. |
| Global search | Berfungsi | Keyboard arrows/Enter/Escape; pencarian memakai serialisasi seluruh object dan tidak memberi pesan no-result. |
| Direktori | Berfungsi | Search, 7 filter, sort, grid/list, reset, URL state, loading skeleton, empty state, mobile drawer; tanpa pagination karena hanya 10 mock record. |
| Profile cards/detail | Sebagian | Navigasi/detail berfungsi; social `#`, QR, dan beberapa CTA adalah placeholder. |
| Network | Berfungsi | Group modes, preview, desktop zoom, mobile list; relasi hanya kesamaan atribut, bukan graph backend. |
| Explore | Sebagian | Tab/category berfungsi; Shuffle menetapkan state yang sama sehingga tidak mengacak hasil. |
| Gallery | Berfungsi | Filter, lightbox, keyboard, swipe, close; modal belum focus-trapped. |
| News/article | Sebagian | Filter, detail, related, share/copy tersedia; share/copy rejection tidak ditangani dan kartu news beranda tidak bernavigasi. |
| Letting | Sebagian | Search anggota, tabs, timeline, gallery, charts; data/statistik hardcoded/derived dari mock dan foto eksternal generik. |
| Footer/social/contact | Mock | Ikon sosial bukan link; email hanya teks. |
| Form/API/pagination | Tidak ada | Tidak ada form pengiriman, mutation, backend, atau pagination yang dapat diaudit. |

Tidak ditemukan duplikasi route yang broken. Redundansi model terdapat pada alias `name/rank/role/city/specialty` yang diturunkan dari field utama; aman tetapi menambah surface dan bundle. Seluruh alumni, artikel, milestones, statistik, dan media merupakan data statis/hardcoded.

## 4. Audit khusus Direktori

Filter mencakup letting, batch, year, corps, profession, region, verified; query, sort, dan view tersimpan di URL sehingga shareable dan tidak menyimpan PII di perangkat. Filter gabungan memakai AND dan hasil disortir deterministik. Desktop sidebar dan mobile drawer menggunakan komponen sama. Loading 650 ms adalah simulasi, bukan network state; tidak ada error state karena tidak ada API. Tidak ada pagination/virtualization; masih aman untuk 10 record tetapi wajib sebelum dataset membesar. Query berubah pada setiap keystroke dan history memakai replace—baik untuk pilot. Parameter tak dikenal diabaikan, dan nilai invalid menghasilkan empty results tanpa crash.

P1: debounce ketika memakai API, validasi URL schema, live announcement jumlah hasil, focus management drawer, pagination server-side, dan jangan pernah mengirim private alumni schema ke client. `unit` saat ini selalu literal “Tidak dipublikasikan”; field sensitif aktual tidak boleh dimasukkan lalu disamarkan di UI.

## 5. Responsive dan accessibility

CSS menyediakan breakpoint mobile/tablet/desktop, grid adaptif, desktop/mobile network, filter drawer, bottom nav, safe-area padding, serta reduced-motion rules. Risiko yang tersisa: toolbar/filter chip horizontal dapat membutuhkan scroll, network desktop bergantung hover/double-click, nama panjang di-truncate, dan belum ada regression screenshot otomatis di 320/768/1440 px.

Positif: Bahasa dokumen `id`, semantic main/nav/header/footer, skip link, label/aria-label pada mayoritas icon button, visible focus styles, alt text, keyboard lightbox, combobox semantics, `aria-live` loading, dan reduced-motion. Kekurangan P1: dialog tidak melakukan focus trap/restore; backdrop berupa button terpisah dapat mengganggu urutan fokus; tab Explore belum memiliki tabpanel/keyboard arrow behavior; status verified mengandalkan title; decorative SVG/icon belum seluruhnya konsisten hidden; hasil/empty direktori tidak diumumkan.

## 6. Loading, error, empty, console, build

Lazy routes memiliki suspense loader; direktori memiliki skeleton dan empty state; letting search memiliki empty copy; invalid profile/article/letting dan wildcard memiliki fallback. Tidak ada error boundary, retry UI, image error fallback, offline state, ataupun API error state. Review statis menemukan potensi unhandled promise rejection pada Web Share/Clipboard ketika permission ditolak. Tidak ditemukan compile error. ESLint dan automated test belum dikonfigurasi.

## 7. Privasi dan keamanan data alumni

Semua isi `data.ts`, termasuk nama, pangkat, korps, profesi, wilayah umum, pendidikan, achievement, status verified, dan tanggal update, dikirim ke setiap browser dan dapat diekstrak dari JavaScript. Tidak ada nomor telepon, email personal, alamat rinci, identitas resmi, jadwal, koordinat, reporting line, atau unit aktual; `unit` sengaja berisi placeholder. Nama Muhammad Sobri Maulana tampak sebagai profil pilot publik sedangkan record lain tampak mock, tetapi source tidak menyimpan bukti consent—verifikasi legal/editorial wajib dilakukan di luar kode.

Risiko terbesar bukan injection saat ini, melainkan kesalahan asumsi bahwa data client dapat disembunyikan. Sebelum backend: pisahkan `PrivateAlumni`/`PublicAlumni`, bentuk DTO publik dengan allowlist di server, require consent + editorial approval, minimalkan lokasi/rank sesuai threat model personel, strip EXIF, rate-limit scraping/API, dan sediakan takedown. CSP yang ditambahkan mengurangi XSS/content injection, tetapi bukan pengganti data governance. Dependency versions masih memakai `latest`/range di manifest; lockfile kini menahan resolusi deployment saat ini.

## 8. Performance dan rekomendasi urutan kerja

Build menghasilkan CSS ~83 kB, entry JS ~423 kB, letting JS ~398 kB, dan feature chunks ~9 kB (ukuran sebelum gzip). Recharts menjadi penyumbang besar pada letting; Framer Motion/Lucide berada di jalur umum. Lazy route sudah baik, SVG lokal kecil, dan gallery lazy-load. Empat foto letting berasal dari Unsplash dan font dari Google, menambah latency/third-party availability/privacy surface.

Urutan implementasi: (1) selesaikan governance/consent P0 sebelum data nyata; (2) pasang test/lint/error boundary dan perbaiki placeholder/dead actions; (3) perbaiki focus management; (4) migrasikan data ke public API allowlist; (5) optimalkan Recharts/font/image dan tambah performance budget; (6) lengkapi SEO/sitemap dan polish konsistensi.

## 9. Verifikasi audit

- `npm run build`: lulus TypeScript strict dan Vite production build.
- `npm audit`: belum terverifikasi karena endpoint advisory registry mengembalikan HTTP 403; ulangi pada CI yang memiliki akses registry penuh.
- Audit statis dilakukan dengan inventaris source, pencarian route/control/network/storage, pemeriksaan konfigurasi, dan ukuran artefak `dist`.
- Belum ada browser automation/Lighthouse/axe di dependency project, sehingga klaim visual, console runtime lintas browser, WCAG contrast, dan Core Web Vitals harus divalidasi pada P1 lewat CI/browser nyata.

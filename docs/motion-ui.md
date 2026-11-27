# Design: Motion layer di atas UI yang ada

Status: menunggu approval
Tanggal: 2026-11-27
Arah: "lebih hidup dan modern" tanpa mengganti identitas visual.

## Tujuan

Menambah lapisan gerak yang konsisten di seluruh aplikasi (home, kartu, rail, header,
bottom nav, 5 overlay) memakai library `motion`. Palet, tipografi, spacing, dan
hierarki halaman tidak diubah.

## Non-tujuan

- Tidak ada redesign layout, section baru, atau perubahan token warna.
- Tidak menambah UI library, icon set, atau font.
- Tidak menganimasikan `<iframe>` player (risiko layout/CPU, dan iframe lintas origin).
- Tidak mengubah routing, fetching, atau state yang ada.

## Keputusan teknis

1. **Dependency**: tambah `motion` (satu-satunya dependency baru), import dari `motion/react`.
   Sudah kompatibel dengan React 19. Alternatif CSS-only ditolak karena butuh exit
   animation dan `layoutId` untuk indikator nav.
2. **Aksesibilitas**: `<MotionConfig reducedMotion="user">` membungkus App. Semua animasi
   transform/opacity otomatis dimatikan saat OS meminta reduced motion; tidak perlu
   guard manual per komponen.
3. **SSR/hydration**: tidak ada animasi yang bergantung pada `Math.random`, `Date.now`,
   atau ukuran window saat render pertama. `initial` hanya opacity/transform.
4. **Satu komponen bantu**: `src/components/Reveal.tsx` — fade + naik 12px, `once: true`,
   durasi 0.4s. Dipakai semua section home (10+ pemakaian, jadi layak jadi file sendiri).

## Perubahan per file

### Baru
- `src/components/Reveal.tsx` — wrapper `whileInView`, hormati reduced motion.

### Shell
- `src/App.tsx`
  - Bungkus root dengan `MotionConfig reducedMotion="user"`.
  - Bungkus `DetailsModal` dan `WatchModal` (yang dirender kondisional) dengan
    `AnimatePresence` supaya exit animation jalan.
  - Bungkus tiap section home dengan `Reveal`.
- `src/components/Header.tsx` — menu mobile pakai `AnimatePresence` (fade + slide 8px)
  menggantikan `animate-in slide-in-from-top`. Perilaku shrink saat scroll tetap CSS.
- `src/components/MobileBottomNav.tsx` — indikator tab aktif pakai `layoutId="nav-pill"`
  (satu pil yang bergeser), icon `whileTap` 0.92.

### Kartu & rail
- `src/components/DonghuaCard.tsx` — `motion.div` dengan `whileHover={{ y: -3 }}` dan
  `whileTap={{ scale: 0.98 }}`; hapus `hover:-translate-y-0.5` (konflik transform).
  Efek zoom poster & perubahan warna tetap CSS.
- `src/components/DonghuaCardSmall.tsx` — `whileTap` 0.98 saja (row list, hover y tidak cocok).
- `src/components/SpotlightHero.tsx` — crossfade + slide 16px antar slide
  (`AnimatePresence` + `key={current.slug}`) untuk poster dan blok konten; tombol
  prev/next & swipe tetap.
- `FeaturedRail`, `OngoingSliderSection`, `LatestUpdatedSection`, `PopularSliderSection`,
  `GenreRailSection`, `ContinueWatchingSection`, `HomeScheduleSection`,
  `HomeGenreShowcase`, `PortalStatsBanner`, `Footer` — dibungkus `Reveal` (satu animasi
  per section, bukan per kartu; 30 kartu × 10 rail × observer terlalu berat di mobile).
  Scroll tombol panah tetap native `scrollBy({behavior:'smooth'})`.

### Overlay
- `SearchModal` — root jadi `motion.div` (fade + scale 0.98→1), internal `AnimatePresence`,
  `if (!isOpen) return null` dihapus (efek sudah menjaga `isOpen`).
- `WatchlistDrawer` — backdrop fade, panel slide dari kanan; exit animation aktif.
- `WeeklySchedule` — fade + scale, exit aktif.
- `DetailsModal` — fade + scale, exit ditangani `AnimatePresence` di App; guard `!slug`
  dihapus karena App hanya merender saat slug ada.
- `WatchModal` — fade saja (halaman penuh, slide terasa berat); guard `!slug` dihapus,
  exit ditangani App. Tombol/tab/daftar episode tidak berubah.

## Perilaku yang harus tetap sama

- Semua handler, state, dan data fetching tidak berubah.
- Klik, keyboard, fokus, dan Escape pada overlay tetap.
- Tidak ada animasi yang menahan interaksi (durasi maksimum 0.4s; overlay 0.2s).
- Layout tidak bergeser permanen: hanya `transform`/`opacity` yang dianimasikan,
  kecuali tinggi header yang sudah ada.

## Verifikasi

1. `npm run lint`
2. `npm run build` (bundle + typecheck produksi)
3. Playwright di `:3100`:
   - desktop 1280 dan mobile 390: screenshot home, detail, watch, search, watchlist.
   - console: tidak ada error baru selain hydration yang sudah ada.
   - ukur `document.documentElement.scrollWidth` tidak bertambah.
   - emulasi `prefers-reduced-motion: reduce`: tidak ada transform tersisa.
4. `git diff` hanya menyentuh file di daftar ini.

## Risiko

- Bundle client bertambah (±30–40 KB gzip untuk `motion/react`). Masih jauh di bawah
  batas Cloudflare Workers.
- Modal yang tadinya mount instan kini punya jeda exit ±0.2s; state parent tidak
  berubah, jadi tidak ada data yang hilang.
- Hydration error yang sudah ada sebelum perubahan ini belum diperbaiki; saya tidak
  mengklaim penyebabnya, hanya memastikan tidak bertambah.

## Urutan kerja

1. Install `motion`, `Reveal`, `MotionConfig`.
2. Overlay (5 file) + App.
3. Kartu, rail, hero, nav.
4. Lint + build + verifikasi browser.
# FIX_LOG — Poster / Cover Tidak Muncul di ZerDonghua

**Tanggal:** 2026-09-07
**Komponen:** `src/components/SafeImage.tsx`, `src/app/api/img/route.ts`, 10 komponen card/section
**Severity:** High (seluruh poster donghua tampil placeholder, bukan cover asli)

---

## Symptom
Poster donghua di halaman utama & semua section muncul sebagai placeholder
(unsplash), bukan cover asli dari `donghub.vip`. Terjadi baik di dev maupun
production (`zerdonghuaa.vercel.app`).

## Root Cause
`donghub.vip` memserving gambar di balik Cloudflare bot-protection yang
**403** pada request yang tidak membawa header `Referer` same-site.

Bukti:
```
curl -A "Mozilla/5.0" https://donghub.vip/.../poster.jpg        → 403
curl -A "Mozilla/5.0" -H "Referer: https://donghub.vip/" ...   → 200
```

Dua lapisan kegagalan sebelumnya:
1. `next/image` (default) → optimizer server-side fetch dari `donghub.vip`
   tanpa Referer → 403 → gambar optimizer gagal.
2. Setelah diganti `<img>` polos, browser fetch langsung dengan
   `Referer: https://zerdonghuaa.vercel.app/` → tetap 403 → `onError`
   fallback ke placeholder.

Penyebab inti = **Cloudflare memblokir request tanpa Referer same-site**,
bukan masalah optimizer semata.

## Fix
Tambah route proxy `/api/img?u=<encoded-url>` yang fetch gambar server-side
sambil menyuntikkan header `Referer: https://<host>/`. `SafeImage` mengarahkan
URL `donghub.vip` melalui proxy ini; placeholder unsplash hanya sisa fallback
terakhir di `onError`.

**File baru:** `src/app/api/img/route.ts`
- Validasi host (allowlist `donghub.vip`, `img/cdn.donghub.vip`, `i0.wp.com`,
  `images.weserv.nl`) agar tidak jadi open proxy.
- `Cache-Control: public, max-age=86400, immutable` → Vercel/Edge cache 1 hari.
- Return `content-type` asli + `Access-Control-Allow-Origin: *`.

**File diubah:** `src/components/SafeImage.tsx`
- `resolveSrc()` membungkus host ter-proxy jadi `/api/img?u=...`.
- `onError` tetap fallback ke unsplash bila proxy gagal.

**10 komponen** (tetap `import { SafeImage as Image }`):
`DonghuaCard, SpotlightHero, FeaturedRail, ContinueWatchingSection,
WeeklySchedule, SearchModal, WatchlistDrawer, HomeScheduleSection,
DetailsModal, ZerDonghuaLogo`.

## Verification
- `npx tsc --noEmit` → clean
- `npx next build` → route `/api/img` muncul, build sukses
- Proxy lokal: `GET /api/img?u=...donghub.vip...` → **200, image/jpeg, 180KB**
  (direct fetch → 403)
- SSR HTML: 37 cover via `/api/img?u=...`, **0** URL `donghub.vip` langsung
- Deploy: `git push origin main` → Vercel auto-build

## Skipped (YAGNI)
- Puppeteer / Playwright / cookie / headless browser untuk bypass Cloudflare
  → overkill; proxy + header Referer sudah cukup. Tambah hanya bila Cloudflare
  naik ke JS-challenge (5xx + captcha), bukan sekadar Referer-check.
- `next/image` optimizer → tidak dipakai karena tidak bisa inject Referer per-request.

## Known Ceiling
`ponytail:` proxy global tanpa rate-limit per-host. Bila traffic tinggi &
Cloudflare throttle, tambah in-memory LRU cache di `route.ts` atau naikkan
`max-age`.

---

# FIX_LOG — Watch Modal streaming section expansion

**Tanggal:** 2026-09-07
**Komponen:** `src/components/WatchModal.tsx`, `src/components/DonghuaCardSmall.tsx`

## Root Cause
Watch modal hanya dapat server-selector + prev/next. Tidak ada rekomendasi, related,
latest, popular, genre, atau footer — terlalu polos; tidak ada info poster-related.

## Fix
- `WatchModal`: lazy-fetch `donghuaApi.getHome()` (memoized) untuk latestRelease,
  donghuaPopular (weekly/monthly/allTime), genres.
- 5 section baru di bottom rail:
  1. **Rekomendasi** (`streamData.recommended`, dari episode API) — poster, horizontal scroll
  2. **Episode Terkait** (`streamData.relatedEpisodes`) — poster kecil, scrollable
  3. **Episode Terbaru** (`homeData.latestRelease`) — list teks tanpa poster (per request)
  4. **Populer** (`donghuaPopular.weekly/monthly/allTime`) — `DonghuaCardSmall` poster kecil
  5. **Genre tags** (`homeData.genres`) — static, informational
- **Footer**: credit + data source.
- `DonghuaCardSmall`: komponen baru, poster 100x140px, pakai `SafeImage`→`/api/img` proxy.

## Verified
- `tsc --noEmit` clean
- API episode (?action=episode) return: recommended 5, relatedEpisodes 1, streams 3 (Dailymotion/Dtube/Okru)
- API home: latestRelease 20, donghuaPopular 10/10/10, genres 26
- Dev server HTTP 200, home page SSR render OK

---

# FIX_LOG — Watch Modal section layout fixes

**Komponen:** `src/components/WatchModal.tsx`, `src/components/DonghuaCardSmall.tsx`

## Root Cause
- Player container pakai `aspect-video` → tinggi terbatas, video pendek.
- Footer di modal simpel (text centre) — diminta sama seperti Home.
- `relatedEpisodes` dari API ada di root `data.relatedEpisodes`, tapi kode baca `streamData?.relatedEpisodes` (undefined) → episode terkait ga muncul.
- `currentMirror` hardcode `playableMirrors[0]` → klik server ganti state tapi iframe ga ikut update.
- Popular sections scroll horizontal → diminta grid vertikal.

## Fixes
- `aspect-video` → `min-h-[50vh] sm:min-h-[60vh]`.
- Footer diganti full layout (grid 4 kolom, navigasi, info, copyright).
- `relatedEpisodes` dipisah ke state sendiri, set saat fetch episode; section pakai state tersebut.
- `currentMirror = allMirrors[selectedMirrorIndex] || playableMirrors[0] || allMirrors[0]`.
- Popular: 3 tab (Weekly/Monthly/All-Time) + list vertikal full-width card.
- Related episodes: layout list vertikal, pakai `ep.title`, `ep.episode`, `ep.postedBy`, `ep.released`.

## Verified
- `npm run build` sukses (type error `Film` → `Play` di footer diperbaiki).
- Server switch: click "Dtube" / "OKRU" → iframe berubah.
- Related episodes muncul setelah fetch.

---

# FIX_LOG — Scraper pindah ke anichin.my

**Tanggal:** 2026-10-31
**Commit:** `b33fe31`
**Komponen:** `server/anichinScraper.ts`, `src/lib/donghuaServer.ts`, `src/app/api/img/route.ts`

## Symptom
Seluruh katalog kosong / gagal fetch dari container: `anichin.cafe` dan semua
domain `anichin.*` lain tidak bisa dijangkau lewat egress proxy (000), padahal
sebelumnya jadi sumber scrape utama.

## Root Cause
Bukan bug kode — domain sumbernya sendiri tidak menjawab dari container.
`https://anichin.my` menjawab 200 lewat proxy yang sama, jadi sumbernya
masih hidup, cuma pindah domain.

## Fix
- `BASE_URL` scraper pindah ke `anichin.my`; allowlist image proxy ikut
  disesuaikan.
- Heading home diterjemahkan ke Indonesia ("Rilisan Terbaru" /
  "Rekomendasi").
- Genre dikumpulkan dari link `/genres/` yang distinct (9 genre; tidak ada
  `ul.genre` di `.my`).
- Title dedupe dijangkarkan ke awal string saja — regex lama memakan angka
  dan huruf di tengah judul ("177" → "17", "Good" → "God").
- Pagination genre diperbaiki (`\\d` → `\d` di regex; genre action sekarang
  43 halaman).

## Verification
- API live: home 18 rekomendasi / 20 latest / 20 popular, detail Renegade
  Immortal 164 episode, episode 164 dengan 5 mirror asli (OK.ru pertama,
  bukan fallback rickroll), search 7 hasil, genre action 10/halaman,
  schedule 7 hari.
- Switch ke `donghub.vip` sempat dicoba lalu dibatalkan (detail/episode-nya
  jatuh ke data statis); `donghubScraper` tetap ada di repo, tidak dipakai.

---

# FIX_LOG — Search, slug series, dan Play dari kartu series

**Tanggal:** 2026-10-31
**Commit:** `91e5069`
**Komponen:** `src/lib/donghuaServer.ts`, `server/anichinScraper.ts`, `src/services/donghuaApi.ts`

## Symptom
Hasil search / genre tidak bisa dibuka: detail jatuh ke fallback statis
palsu (12 episode, cover svg) padahal judulnya ada di katalog.

## Root Cause
Link series di `anichin.my` berbentuk `/series/<slug>/`, tapi ekstraksi
slug hanya memotong prefix `/seri/`. Slug yang terbawa jadi
`series/<slug>`, lalu detail membangun `/seri/series/<slug>/` → 404 →
fallback statis.

## Fix
- Strip prefix `series/` dan `seri/` di tiga tempat: normalisasi card,
  schedule, dan `toSlug` (donghuaServer), detail scraper, dan detail/episode
  client (donghuaApi).
- Tombol Play di kartu series sekarang memutar episode terbaru series itu,
  bukan mirror fallback.
- Query "BTTH" (ada di placeholder search tapi 0 hasil upstream) diperluas
  jadi "Battle Through the Heavens".

## Verification
- Search "soul land" → detail asli (movie, 1 episode).
- Hasil pertama genre → detail 390 episode.
- Search "BTTH" → 7 hasil.
- Episode dengan slug series → Renegade Immortal ep 164 dengan mirror asli.
- Production: search BTTH → 7 hasil dengan bare slug, detail Battle
  Through the Heavens Season 5 → 217 episode.

---

# FIX_LOG — Routing URL detail, stream, dan search

**Tanggal:** 2026-10-31
**Commit:** `fc41e83`
**Komponen:** `src/App.tsx`, `src/app/[...slug]/page.tsx`

## Symptom
Semua view (detail, stream, search) adalah modal di atas `/` tanpa history
entry sendiri. Tombol back HP langsung keluar aplikasi, bukan kembali ke
view sebelumnya.

## Root Cause
Navigasi view tidak pernah menyentuh history browser: tidak ada pushState,
tidak ada URL per view, dan `onClose()` modal dipanggil sebelum navigasi
sehingga App tidak menguasai penutupan.

## Fix
- View dibuka dengan `pushState`; state history membawa `appNav` + `view`.
- Tutup view lewat `history.back()` bila entry-nya dibuat aplikasi, atau
  `replaceState('/')` bila bukan.
- `popstate` merestore view dari URL + `history.state.view` (state menang
  atas pola slug).
- Ketikan search menyinkronkan URL lewat `replaceState` (tidak pernah push),
  jadi satu tap back menutup search.
- Route catch-all `[...slug]` melayani deep link.
- `onClose()` di DetailsModal / WatchModal / SearchModal dihapus supaya
  fungsi navigasi App yang menguasai penutupan.

## Verification
- Lokal: home / detail / stream / search 200 (server curl; browser agent
  tidak bisa membuka localhost karena blok private-address, jadi flow
  klik/back lokal tidak terverifikasi).
- Production setelah deploy (tes browser, 8/8 PASS): detail →
  `/link-click-season-3/`, episode →
  `/link-click-season-3-episode-01-subtitle-indonesia/`, back → detail,
  back → home, ketik search → `/?s=tales%20of%20herding%20gods`, back dari
  search → home, deep link `/tales-of-herding-gods/` buka detail
  (106 episode), tanpa 404.
- Catatan: tes browser pertama (sebelum push) sempat melaporkan perilaku
  lama — itu build lama, bukan bukti kode baru gagal (chunk check
  mengonfirmasi bundle lama masih terlayani saat itu).

---

# FIX_LOG — Dailymotion Forbidden (player geo xid0t)

**Tanggal:** 2026-10-31
**Commit:** `edf5664`
**Komponen:** `src/lib/mirrors.ts`, `src/lib/mirrors.test.ts`

## Symptom
Server Dailymotion [Ads] menampilkan frame hitam bertuliskan "Forbidden":
tidak ada UI player, tidak ada tombol play. Terjadi di ep 01
(`k6AUoMk8t5OzcvBKv8o`) dan ep 105 (`k3uwIc6cJbu3KvLSFzY`) Tales of
Herding Gods. Server lain (OK.ru ep 105, durasi 16:26) jalan, jadi
mekanisme ganti server-nya sendiri tidak rusak.

## Root Cause
Bug di kode sendiri, bukan blokir Dailymotion terhadap situs ini.
Anichin menyajikan Dailymotion sebagai
`geo.dailymotion.com/player/xid0t.html?video=<id>` (player ID `xid0t`
konstan di semua episode, diverifikasi dari opsi `select.mirror` yang
di-decode base64 di `anichinScraper.ts` ~baris 280–290). Tapi
`normalizeMirrors()` menulis ulang semua URL Dailymotion ke
`www.dailymotion.com/embed/video/<id>` dengan asumsi yang salah bahwa
bentuk itu redirect ke player yang sama — bentuk www itulah yang kena
Forbidden.

Yang sudah dicoba dan TIDAK memperbaiki www embed: spoof Referer
(anichin, donghua, tanpa referer — semua 403), fetch manifest dari
metadata API (403 dari container), dan `referrerPolicy="no-referrer"`
(malah memicu `PLAYER_ERR_EMPTY_EMBEDDER`). Proxy / rotasi IP / Playwright
di sisi server juga tidak akan memperbaiki playback sisi klien, karena
video diambil browser pengguna, bukan server.

## Fix
- `normalizeMirrors()` sekarang menulis ulang semua URL Dailymotion ke
  `https://geo.dailymotion.com/player/xid0t.html?video=<id>`.
- `mirrors.test.ts` diperbarui mengikuti bentuk baru.
- `normalizeMirrors` dipakai bersama oleh `donghuaServer.ts` (route server)
  dan `donghuaApi.ts` (client), jadi satu fix menutup kedua jalur.

## Verification
- `node --test src/lib/mirrors.test.ts` 5/5 pass, `tsc --noEmit` clean,
  `npm run build` OK.
- API lokal ep 105 mengembalikan Dailymotion sebagai URL geo xid0t.
- Deploy `edf5664` sempat GAGAL di Workers (bukan karena fix ini — lihat
  entri font di bawah), jadi verifikasi production menunggu deploy
  berikutnya.

---

# FIX_LOG — Font self-hosted (perbaiki gagal deploy Workers)

**Tanggal:** 2026-10-31
**Commit:** `37edf3d`
**Komponen:** `src/app/layout.tsx`, `src/app/fonts/Inter.woff2`, `src/app/fonts/Outfit.woff2`

## Symptom
Deploy `edf5664` di Cloudflare Workers gagal. Build pertama (`bun run
build`, plain `next build`, Next 15.5.25) SUKSES dengan semua route
terdaftar, tapi `npx wrangler deploy` lalu menjalankan migrasi OpenNext
otomatis di lingkungan build (repo tidak punya wrangler.jsonc): membuat
wrangler.jsonc di sana, menginstal @opennextjs/cloudflare 1.20.15,
menulis ulang script package.json, menaikkan Next ke 15.5.28 di lingkungan
itu, lalu rebuild lewat `npx opennextjs-cloudflare build`. Build kedua
inilah yang gagal.

## Root Cause
Build kedua gagal di loader `next/font/google` pada `layout.tsx`:
`TypeError: Cannot read properties of null (reading '1')` di
`loader.js:122:78` — regex ekstensi
`/\.(woff|woff2|eot|ttf|otf)$/` atas URL file Google Fonts yang diambil
saat build tidak bisa di-parse. Fetch Google Fonts saat build rapuh di
lingkungan build Workers; deploy sebelumnya lolos langkah ini karena
keberuntungan/timing, bukan karena konfigurasinya stabil. Setup
double-build + migrate per-deploy juga rapuh, tapi bukan penyebab langsung
gagalnya.

## Fix
- Font Inter + Outfit (subset latin U+0000-00FF, variable, 48KB + 32KB)
  diunduh dari Google Fonts CSS2 API dan di-commit di `src/app/fonts/`.
  Google kini menyajikan satu file variable yang identik untuk semua
  weight (md5-identik antar weight), jadi satu file per family cukup.
- `layout.tsx` pindah dari `next/font/google` ke `next/font/local` dengan
  nama variabel CSS yang sama (`--font-inter`, `--font-outfit`),
  `display: 'swap'`, `weight: '100 900'`. `globals.css` memakai variabel
  yang sama, jadi desain tidak berubah.
- Build Workers tidak lagi fetch font dari Google sama sekali.

## Verification
- `tsc` clean, `npm run build` sukses, font ter-emit ke
  `.next/static/media` (2 file woff2), tidak ada referensi Google Fonts
  tersisa di chunk aplikasi.
- Deploy ulang dari dashboard BERHASIL. Production (sekarang `37edf3d`):
  API ep 105 mengembalikan Dailymotion sebagai URL geo xid0t, HTML home
  tanpa referensi Google Fonts (2 file woff2 lokal ter-load), deep link
  detail `/tales-of-herding-gods/` tetap 200.
- Tes browser production: iframe Dailymotion geo xid0t, UI player
  ter-load (judul, label Dailymotion, preview, tombol play, kontrol), frame
  "Forbidden" HILANG. Playback di browser datacenter tetap error
  ("periksa koneksi internet", timer 0:00) — sama seperti tes anichin.my
  di lingkungan yang sama — dan playback di HP pengguna (IP rumahan)
  dikonfirmasi JALAN. Jadi error datacenter itu blok IP datacenter dari
  Dailymotion, bukan masalah situs.

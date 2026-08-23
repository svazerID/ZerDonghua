# ZerDonghua 🐉

> Platform streaming Donghua (Chinese Anime 3D & 2D) subtitle Indonesia modern, responsif, dan berkinerja tinggi.

---

## 🌟 Fitur Utama

- **🎬 Multi-Server Video Player**:
  - Pilihan mirror server streaming (Dailymotion, Dtube, OKRU, VideoVard, dll.).
  - Navigasi cepat antar episode (Sebelumnya / Selanjutnya / Daftar Episode Lengkap).
  - Mode teater & pengalaman pemutaran video yang imersif.

- **⚡ Rekomendasi & Sorotan Utama (Spotlight Hero)**:
  - Tampilan hero banner interaktif yang ringan dan cepat.
  - Ringkasan sinopsis, genre kultivasi/aksi, status episode, dan akses langsung sekali klik.

- **🔥 Katalog Terlengkap & Update Harian**:
  - **Sedang Tayang (Ongoing Series)**: Slider horizontal & tampilan grid untuk episode terbaru.
  - **Paling Populer**: Tab filter Hari Ini, Minggu Ini, dan Sepanjang Waktu.
  - **Update Episode Terbaru**: Daftar rilis terkini dengan pencarian & filter instan.

- **📅 Jadwal Rilis Mingguan**:
  - Tab jadwal tayang dari Senin hingga Minggu untuk melacak perilisan episode baru.

- **🔍 Pencarian Cepat & Filter Genre**:
  - Modal pencarian instan dengan paginasi dan saran kata kunci populer (Action, Cultivation, Romance, Fantasy, Martial Arts, Reincarnation).
  - Filter katalog berdasarkan puluhan kategori genre donghua.

- **📌 Watchlist & Riwayat Tontonan**:
  - Penyimpanan bookmark donghua favorit secara lokal (*localStorage*).
  - Riwayat tontonan episode terakhir beserta waktu akses (*Continue Watching*).

- **📱 Mobile Native Experience**:
  - *Floating bottom navigation bar* khusus mobile untuk navigasi cepat (Beranda, Cari, Jadwal, Watchlist).
  - Desain adaptif dari layar smartphone, tablet, hingga ultra-wide desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Web Server**: [Express.js](https://expressjs.com/)
- **Scraping & Parser**: [Cheerio](https://cheerio.js.org/) + Fallback Engine
- **Bundler**: [esbuild](https://esbuild.github.io/)

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- **Node.js** v18 atau lebih baru
- **npm** atau **yarn** / **pnpm**

### Instalasi
```bash
# Clone repository
git clone <repository-url>
cd zerdonghua

# Install dependensi
npm install
```

### Menjalankan Mode Pengembangan (Development)
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

### Membangun untuk Produksi (Production Build)
```bash
npm run build
```
Perintah ini akan membuat build statis Vite di folder `dist/` dan mem-bundle backend server ke `dist/server.cjs`.

### Menjalankan Server Produksi
```bash
npm start
```

---

## 📡 Dokumentasi API Backend

Endpoint backend internal terpadu berada di `/api/donghua`:

| Action | Parameter | Deskripsi |
| :--- | :--- | :--- |
| `home` | - | Mengambil data beranda (rekomendasi, rilis terbaru, populer hari ini/minggu/all, donghua ongoing, genre) |
| `schedule` | - | Mengambil jadwal rilis mingguan (Senin - Minggu) |
| `detail` | `slug` (string) | Mengambil detail lengkap series, sinopsis, info rating, produser, dan daftar seluruh episode |
| `episode` | `slug` (string) | Mengambil metadata pemutaran episode, mirror server streaming, iframe embed, dan episode navigasi |
| `search` | `query` (string), `page` (number, opsional) | Mencari judul donghua |
| `genre` | `genre` (string), `page` (number, opsional) | Mengambil daftar donghua berdasarkan genre tertentu |
| `genres` | - | Mengambil daftar semua kategori genre yang tersedia |

---

## 📂 Struktur Proyek

```text
├── index.html                  # Dokumen HTML utama
├── metadata.json               # Konfigurasi metadata aplikasi
├── package.json                # Dependensi & skrip npm
├── server.ts                   # Backend Express server & Vite middleware
├── server/
│   ├── donghubScraper.ts       # Scraping engine & parser
│   └── donghuaFallback.ts      # Data fallback statis offline/cadangan
├── src/
│   ├── main.tsx                # Entry point React
│   ├── App.tsx                 # Root component & state management
│   ├── types.ts                # Definisi TypeScript interfaces
│   ├── index.css               # Global CSS & Tailwind CSS import
│   ├── services/
│   │   └── donghuaApi.ts       # Klien API frontend
│   └── components/
│       ├── Header.tsx              # Navbar atas & navigasi
│       ├── ZerDonghuaLogo.tsx      # Komponen logo vektor & branding
│       ├── MobileBottomNav.tsx     # Floating bottom navigation bar mobile
│       ├── SpotlightHero.tsx       # Hero banner rekomendasi unggulan
│       ├── DonghuaCard.tsx         # Kartu poster donghua interaktif
│       ├── OngoingSliderSection.tsx# Bagian donghua sedang tayang
│       ├── PopularSliderSection.tsx# Bagian donghua terpopuler
│       ├── LatestUpdatedSection.tsx# Bagian episode baru rilis
│       ├── HomeGenreShowcase.tsx   # Eksplorasi genre & kategori
│       ├── HomeScheduleSection.tsx # Preview jadwal tayang di homepage
│       ├── PortalStatsBanner.tsx   # Banner statistik & fitur platform
│       ├── SearchModal.tsx         # Modal pencarian instan
│       ├── WeeklySchedule.tsx      # Modal jadwal mingguan lengkap
│       ├── WatchlistDrawer.tsx     # Drawer bookmark & riwayat nonton
│       ├── DetailsModal.tsx        # Modal rincian donghua & episode picker
│       ├── WatchModal.tsx          # Modal video player multi-server
│       └── Footer.tsx              # Footer aplikasi
└── vite.config.ts              # Konfigurasi Vite
```

---

## 📜 Skrip NPM

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Express dev server dengan Vite middleware (`tsx server.ts`) |
| `npm run build` | Membangun aset frontend dengan Vite & mem-bundle server dengan esbuild |
| `npm start` | Menjalankan server produksi yang sudah di-compile (`node dist/server.cjs`) |
| `npm run lint` | Melakukan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run clean` | Menghapus folder `dist` dan file build sementara |

---

## ⚠️ Disclaimer
Aplikasi ini ditujukan untuk tujuan edukasi dan demonstrasi integrasi antarmuka modern. Semua konten video, gambar, dan media dimiliki oleh pemegang hak cipta masing-masing.

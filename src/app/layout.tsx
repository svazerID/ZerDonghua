import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Self-hosted variable fonts (latin subset, downloaded from Google Fonts).
// Previously these came from next/font/google, which downloads the fonts
// from Google at build time — and that fetch is exactly what broke the
// Workers deploy (next/font loader crashed parsing a font-file URL).
// With local files, the Workers build never touches Google Fonts.
const inter = localFont({
  src: './fonts/Inter.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

const outfit = localFont({
  src: './fonts/Outfit.woff2',
  variable: '--font-outfit',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'ZerDonghua - Streaming Donghua Subtitle Indonesia Terlengkap',
  description:
    'Nonton streaming Donghua (Chinese Anime) 3D dan 2D subtitle Indonesia kualitas HD gratis dengan multi-server player, update tercepat, dan jadwal rilis mingguan.',
  applicationName: 'ZerDonghua',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: {
    title: 'ZerDonghua - Streaming Donghua Subtitle Indonesia',
    description:
      'Nonton streaming Donghua (Chinese Anime) 3D dan 2D subtitle Indonesia kualitas HD gratis dengan multi-server player, update tercepat, dan jadwal rilis mingguan.',
    type: 'website',
    images: ['/icon.png'],
  },
  twitter: { card: 'summary_large_image', images: ['/icon.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#06060b' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const themeInit = `(function(){try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`dark ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-canvas text-ink antialiased selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}

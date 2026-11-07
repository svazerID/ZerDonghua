import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Render metadata in <head> for every user agent. Next 15 streams metadata
  // into <body> for browsers, and Chrome ignores a <link rel="manifest"> there,
  // so the PWA would not be installable. generateMetadata here only parses
  // the slug, so blocking on it costs nothing.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

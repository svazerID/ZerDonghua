// Shared site constants for link previews (Open Graph + Twitter Cards).
// Kept here (not in layout.tsx) so route files can import them without
// pulling in the layout component, fonts, or globals.css.
export const SITE_URL = 'https://donghua.svazer.us.ci';

// Link-preview image shared by every page (OG + Twitter). Hosted on the
// user's upload service (verified: JPEG 1024x559, ~31KB, GET 200) instead
// of /icon.png, so Facebook / WhatsApp / LinkedIn / Discord / X all show
// a proper wide preview card instead of a tiny square icon.
export const OG_IMAGE = 'https://svazer-upload.vercel.app/file/b9a87f15.jpeg';
export const OG_IMAGE_WIDTH = 1024;
export const OG_IMAGE_HEIGHT = 559;

export const SITE_DESCRIPTION =
  'Nonton streaming Donghua (Chinese Anime) 3D dan 2D subtitle Indonesia kualitas HD gratis dengan multi-server player, update tercepat, dan jadwal rilis mingguan.';

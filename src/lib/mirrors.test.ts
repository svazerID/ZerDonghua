// Jalankan: node --test src/lib/mirrors.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeMirrors } from './mirrors.ts';

test('embed src menang atas streamUrl yang terpotong, entity di-decode', () => {
  const [m] = normalizeMirrors([
    {
      name: 'Dailymotion',
      streamUrl: 'https://www.dailymotion.com/embed/video/k6buWu',
      embedCode:
        '<iframe src="https://geo.dailymotion.com/player.html?autoplay=0&amp;video=k6buWuR4fzrDEdIVRL0"></iframe>',
    },
  ]);
  assert.equal(m.streamUrl, 'https://geo.dailymotion.com/player/xid0t.html?video=k6buWuR4fzrDEdIVRL0');
});

test('player geo xid0t dipertahankan, bukan dikanonikalkan ke /embed/video', () => {
  const [m] = normalizeMirrors([
    { name: 'Dailymotion', streamUrl: 'https://geo.dailymotion.com/player/xid0t.html?video=k5RNIHP1L0RBVjF06Vq' },
  ]);
  assert.equal(m.streamUrl, 'https://geo.dailymotion.com/player/xid0t.html?video=k5RNIHP1L0RBVjF06Vq');
});

test('embed www dailymotion ditulis ulang ke player geo xid0t (www kena Forbidden)', () => {
  const [m] = normalizeMirrors([
    { name: 'Dailymotion', streamUrl: 'https://www.dailymotion.com/embed/video/k3uwIc6cJbu3KvLSFzY' },
  ]);
  assert.equal(m.streamUrl, 'https://geo.dailymotion.com/player/xid0t.html?video=k3uwIc6cJbu3KvLSFzY');
});

test('urutkan server: Dailymotion -> Rumble -> OK.ru, sisanya tetap', () => {
  const names = normalizeMirrors([
    { name: 'OK.ru', streamUrl: 'https://ok.ru/videoembed/1' },
    { name: 'Rumble [Setting DNS]', streamUrl: 'https://rumble.com/embed/v1' },
    { name: 'Dailymotion [Ads]', streamUrl: 'https://geo.dailymotion.com/player/xid0t.html?video=k1' },
    { name: 'Drive [Ads]', streamUrl: 'https://drive.google.com/file/d/1/preview' },
    { name: 'Drive 2 [Ads]', streamUrl: 'https://drive.google.com/file/d/2/preview' },
  ]).map((m) => m.name);
  assert.deepEqual(names, [
    'Dailymotion [Ads]',
    'Rumble [Setting DNS]',
    'OK.ru',
    'Drive [Ads]',
    'Drive 2 [Ads]',
  ]);
});

test('Rumble tetap di belakang Dailymotion walau sumber menaruh Rumble dulu', () => {
  const names = normalizeMirrors([
    { name: 'Rumble [Setting DNS]', streamUrl: 'https://rumble.com/embed/v1' },
    { name: 'OK.ru', streamUrl: 'https://ok.ru/videoembed/1' },
    { name: 'Dailymotion [Ads]', streamUrl: 'https://geo.dailymotion.com/player/xid0t.html?video=k1' },
  ]).map((m) => m.name);
  assert.deepEqual(names, ['Dailymotion [Ads]', 'Rumble [Setting DNS]', 'OK.ru']);
});

test('tanpa Dailymotion, urutan relatif lain dibiarkan', () => {
  const names = normalizeMirrors([
    { name: 'OK.ru', streamUrl: 'https://ok.ru/videoembed/1' },
    { name: 'Drive [Ads]', streamUrl: 'https://drive.google.com/file/d/1/preview' },
  ]).map((m) => m.name);
  assert.deepEqual(names, ['OK.ru', 'Drive [Ads]']);
});

test('mirror non-Dailymotion tidak disentuh', () => {
  const out = normalizeMirrors([
    { name: 'Dtube', streamUrl: 'https://play.d.tube/?v=1820f158-34d7-4123-9f10-016506fc29be' },
    { name: 'Okru', streamUrl: 'https://morencius.com/embed/1zdo1hd9outw' },
  ]);
  const byName = (n: string) => out.find((m) => m.name === n);
  assert.equal(byName('Dtube')?.streamUrl, 'https://play.d.tube/?v=1820f158-34d7-4123-9f10-016506fc29be');
  assert.equal(byName('Okru')?.streamUrl, 'https://morencius.com/embed/1zdo1hd9outw');
});

// Regresi: referrerPolicy="no-referrer" membuat http_referer kosong, dan gate
// PV5_BLOCK_EMPTY_EMBEDDER di player Dailymotion membalasnya dengan
// PLAYER_ERR_EMPTY_EMBEDDER ("Video ini tidak dapat diputar di situs ini").
test('iframe player tidak memakai no-referrer', () => {
  const src = readFileSync(new URL('../components/WatchModal.tsx', import.meta.url), 'utf8');
  assert.ok(!/referrerPolicy=["']no-referrer["']/.test(src));
});

import React from 'react';
import { Sparkles, Heart, Shield, Film, Github } from 'lucide-react';
import { DonghuaGenre } from '../types';
import { ZerDonghuaLogo } from './ZerDonghuaLogo';

interface FooterProps {
  genres: DonghuaGenre[];
  onSelectGenre: (genreSlug: string) => void;
  onOpenSchedule: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  genres,
  onSelectGenre,
  onOpenSchedule
}) => {
  return (
    <footer className="mt-16 border-t border-[#ffffff1a] bg-[#06060b] text-slate-400 pt-12 pb-24 md:pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <ZerDonghuaLogo size="lg" />
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Platform portal streaming donghua (Chinese anime) 3D dan 2D subtitle Indonesia terlengkap. Update tercepat setiap hari dengan kualitas video HD & multi-server player.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00a544] font-semibold">
              <Shield className="w-4 h-4" />
              <span>Fast Mirror Servers • Bebas Iklan Mengganggu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#a78bfa] transition-colors cursor-pointer"
                >
                  Spotlight Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('popular');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#a78bfa] transition-colors cursor-pointer"
                >
                  Populer & Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('latest');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#a78bfa] transition-colors cursor-pointer"
                >
                  Update Episode Terbaru
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSchedule}
                  className="hover:text-[#a78bfa] transition-colors cursor-pointer"
                >
                  Jadwal Rilis Mingguan
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Genre Donghua
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {genres.slice(0, 8).map((g) => (
                <button
                  key={g.slug || g.name}
                  onClick={() => onSelectGenre(g.slug)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[#ffffff1a] hover:bg-[#7c3aed]/20 text-slate-300 hover:text-[#a78bfa] border border-[#ffffff1a] transition-colors cursor-pointer"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#ffffff1a] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} ZerDonghua Streaming. Platform Donghua Subtitle Indonesia.
          </p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-[#f05100] fill-[#f05100]" /> untuk pecinta Donghua Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

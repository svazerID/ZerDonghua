import React, { useState, useEffect } from 'react';
import { Search, Bookmark, Calendar, Sparkles, Film, Flame, Menu, X } from 'lucide-react';
import { ZerDonghuaLogo } from './ZerDonghuaLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenSchedule: () => void;
  onSelectGenre: (genre: string) => void;
  bookmarkCount: number;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  onOpenSchedule,
  onSelectGenre,
  bookmarkCount,
  activeSection,
  onNavigateSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06060b]/90 backdrop-blur-md border-b border-[#ffffff1a] shadow-[0_9px_7px_#0000001a] py-3'
          : 'bg-gradient-to-b from-[#06060b]/95 via-[#06060b]/50 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo Branding */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigateSection('spotlight')}
            className="text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#a78bfa66] rounded-2xl"
            title="ZerDonghua Home"
          >
            <ZerDonghuaLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0a0c10] p-1 rounded-2xl border border-[#ffffff1a] backdrop-blur-md">
            <button
              onClick={() => onNavigateSection('spotlight')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'spotlight'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009]'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              Spotlight
            </button>
            <button
              onClick={() => onNavigateSection('popular')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'popular'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009]'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#f05100]" />
              Populer
            </button>
            <button
              onClick={() => onNavigateSection('latest')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'latest'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009]'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#a78bfa]" />
              Update Terbaru
            </button>
            <button
              onClick={onOpenSchedule}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#ffffff1a] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#00a544]" />
              Jadwal Rilis
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0a0c10] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] text-white text-xs sm:text-sm font-medium transition-all shadow-[0_9px_7px_#0000001a] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#a78bfa66]"
          >
            <Search className="w-4 h-4 text-[#a78bfa]" />
            <span className="hidden sm:inline text-slate-400">Cari judul donghua...</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-black/50 text-slate-400 border border-[#ffffff1a] rounded-md">
              Ctrl+K
            </kbd>
          </button>

          {/* Schedule Button (Mobile/Tablet quick icon) */}
          <button
            onClick={onOpenSchedule}
            className="md:hidden p-2.5 rounded-xl bg-[#0a0c10] hover:bg-[#0d1015] border border-[#ffffff1a] text-[#00a544] transition-colors cursor-pointer"
            title="Jadwal Rilis Donghua"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Watchlist / Bookmarks */}
          <button
            id="header-watchlist-btn"
            onClick={onOpenWatchlist}
            className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0a0c10] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] text-white flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#a78bfa66]"
            title="Daftar Simpan & Riwayat"
          >
            <Bookmark className="w-4 h-4 text-[#a78bfa]" />
            <span className="hidden sm:inline">Bookmark</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#7c3aed] text-white">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#0a0c10] hover:bg-[#0d1015] border border-[#ffffff1a] text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c10]/98 backdrop-blur-2xl border-b border-[#ffffff1a] px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              onNavigateSection('spotlight');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#ffffff1a] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#a78bfa]" /> Spotlight Unggulan
          </button>
          <button
            onClick={() => {
              onNavigateSection('popular');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#ffffff1a] flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-[#f05100]" /> Populer Hari Ini
          </button>
          <button
            onClick={() => {
              onNavigateSection('latest');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#ffffff1a] flex items-center gap-2"
          >
            <Film className="w-4 h-4 text-[#a78bfa]" /> Update Episode Terbaru
          </button>
          <button
            onClick={() => {
              onOpenSchedule();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#ffffff1a] flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#00a544]" /> Jadwal Rilis Mingguan
          </button>
        </div>
      )}
    </header>
  );
};

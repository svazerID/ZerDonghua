import React, { useState } from 'react';
import { Shapes, ChevronDown } from 'lucide-react';

interface GenreExploreSectionProps {
  genres: Array<{ name: string; slug: string }>;
  onSelectGenre: (slug: string) => void;
}

const TILE_STYLES = [
  'from-[#7c3aed]/25 border-[#a78bfa66] text-[#c4b5fd]',
  'from-[#0891b2]/25 border-[#22d3ee66] text-[#67e8f9]',
  'from-[#059669]/25 border-[#34d39966] text-[#6ee7b7]',
  'from-[#d97706]/25 border-[#fbbf2466] text-[#fcd34d]',
  'from-[#e11d48]/25 border-[#fb718566] text-[#fda4af]',
  'from-[#4f46e5]/25 border-[#818cf866] text-[#a5b4fc]',
  'from-[#c026d3]/25 border-[#e879f966] text-[#f0abfc]',
  'from-[#2563eb]/25 border-[#60a5fa66] text-[#93c5fd]'
];

const INITIAL_COUNT = 12;

export const GenreExploreSection: React.FC<GenreExploreSectionProps> = ({
  genres,
  onSelectGenre
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!genres || genres.length === 0) return null;

  const visible = expanded ? genres : genres.slice(0, INITIAL_COUNT);

  return (
    <section id="genre-explore">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0">
          <Shapes className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Jelajahi Berdasarkan Genre
          </h2>
          <p className="text-xs text-slate-400">
            Temukan donghua favoritmu dari {genres.length} kategori
          </p>
        </div>
      </div>

      {/* Genre Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {visible.map((g, i) => (
          <button
            key={g.slug}
            onClick={() => onSelectGenre(g.slug)}
            className={`bg-gradient-to-br ${TILE_STYLES[i % TILE_STYLES.length]} to-transparent border rounded-2xl px-3 py-3 sm:py-4 text-left hover:scale-[1.03] active:scale-95 transition-all cursor-pointer`}
          >
            <span className="block text-sm font-bold capitalize truncate">{g.name}</span>
          </button>
        ))}
      </div>

      {/* Expand / Collapse */}
      {genres.length > INITIAL_COUNT && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 border border-[#ffffff1a] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {expanded ? 'Sembunyikan Genre' : `Tampilkan Semua ${genres.length} Genre`}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </section>
  );
};

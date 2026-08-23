import React from 'react';
import { DonghuaGenre } from '../types';
import { Sparkles, Layers } from 'lucide-react';

interface GenreBarProps {
  genres: DonghuaGenre[];
  selectedGenre: string | null;
  onSelectGenre: (genreSlug: string | null) => void;
}

export const GenreBar: React.FC<GenreBarProps> = ({
  genres,
  selectedGenre,
  onSelectGenre
}) => {
  return (
    <div className="w-full py-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectGenre(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer backdrop-blur-xl ${
            selectedGenre === null
              ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
              : 'bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-300 hover:text-white border border-[#ffffff1a]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Genre</span>
        </button>

        {genres.map((g) => {
          const isSelected = selectedGenre === g.slug;
          return (
            <button
              key={g.slug || g.name}
              onClick={() => onSelectGenre(isSelected ? null : g.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer backdrop-blur-xl ${
                isSelected
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-300 hover:text-white border border-[#ffffff1a]'
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

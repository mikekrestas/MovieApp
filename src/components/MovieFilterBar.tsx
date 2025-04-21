import React, { useMemo, useState } from 'react';

interface MovieFilterBarProps {
  genres: string[];
  countries: string[];
  languages: string[];
  directors: string[];
  filter: {
    search: string;
    genres: string[];
    decade: string;
    yearRange: [number, number];
    imdbRating: [number, number];
    runtime: [number, number];
    country: string;
    language: string;
    director: string;
    sort: string;
  };
  decades: string[];
  sortOptions: { value: string; label: string }[];
  onFilterChange: (filter: any) => void;
  onClear: () => void;
}

const MovieFilterBar: React.FC<MovieFilterBarProps> = ({
  genres,
  countries,
  languages,
  directors,
  filter,
  decades,
  sortOptions,
  onFilterChange,
  onClear
}) => {
  const [showMore, setShowMore] = useState(false);
  // Memoize genre options for performance
  const genreOptions = useMemo(() => genres.map(g => ({ value: g, label: g })), [genres]);
  const directorOptions = useMemo(() => directors.map(d => ({ value: d, label: d })), [directors]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 border border-cyan-900/40 shadow-2xl rounded-2xl p-4 mb-8">
      {/* All in one horizontal flex row */}
      <div className="flex flex-wrap items-end gap-6 justify-between">
        <h2 className="text-2xl font-bold text-white drop-shadow">Filter Movies</h2>
        {/* Genres Dropdown */}
        <div className="flex flex-col">
          <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Genres</label>
          <select
            value={filter.genres[0] || ''}
            onChange={e => onFilterChange({ ...filter, genres: [e.target.value] })}
            className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[8.5rem] text-sm shadow"
          >
            <option value="">All Genres</option>
            {genreOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Sort By Dropdown */}
        <div className="flex flex-col">
          <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Sort By</label>
          <select
            value={filter.sort}
            onChange={e => onFilterChange({ ...filter, sort: e.target.value })}
            className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[8.5rem] text-sm shadow"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* More Filters Toggle */}
        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={() => setShowMore(v => !v)}
            className="px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors duration-150"
          >
            {showMore ? 'Hide More Filters' : 'More Filters'}
          </button>
        </div>
        {/* Clear All button aligned right */}
        <div className="flex flex-col justify-end ml-auto">
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow transition-colors duration-150"
          >
            Clear All
          </button>
        </div>
      </div>
      {/* More Filters Section */}
      <div
        className={`transition-all duration-300 overflow-hidden ${showMore ? 'max-h-[900px] opacity-100 mt-4' : 'max-h-0 opacity-0'} bg-gray-900/90 rounded-xl shadow-inner px-4`}
        style={{ pointerEvents: showMore ? 'auto' : 'none' }}
      >
        {showMore && (
          <div className="flex flex-wrap items-center gap-4 py-4">
            {/* Search */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Title</label>
              <input
                type="text"
                placeholder="Search title..."
                value={filter.search}
                onChange={e => onFilterChange({ ...filter, search: e.target.value })}
                className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-36 md:w-52 text-sm shadow"
              />
            </div>
            {/* Decade */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Decade</label>
              <select
                value={filter.decade}
                onChange={e => onFilterChange({ ...filter, decade: e.target.value })}
                className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[8.5rem] text-sm shadow"
              >
                <option value="">All Decades</option>
                {decades.map(dec => (
                  <option key={dec} value={dec}>{dec}</option>
                ))}
              </select>
            </div>
            {/* Year Range - only show if a decade is selected */}
            {filter.decade && (
              <div className="flex flex-col">
                <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Year Range</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={filter.yearRange[0]}
                    onChange={e => onFilterChange({ ...filter, yearRange: [Number(e.target.value), filter.yearRange[1]] })}
                    className="w-14 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                  />
                  <span className="text-cyan-400">-</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={filter.yearRange[1]}
                    onChange={e => onFilterChange({ ...filter, yearRange: [filter.yearRange[0], Number(e.target.value)] })}
                    className="w-14 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                  />
                </div>
              </div>
            )}
            {/* Country */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Country</label>
              <select
                value={filter.country}
                onChange={e => onFilterChange({ ...filter, country: e.target.value })}
                className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[8.5rem] text-sm shadow"
              >
                <option value="">All Countries</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Language */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Language</label>
              <select
                value={filter.language}
                onChange={e => onFilterChange({ ...filter, language: e.target.value })}
                className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[9.5rem] text-sm shadow"
              >
                <option value="">All Languages</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            {/* Director */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Director</label>
              <select
                value={filter.director}
                onChange={e => onFilterChange({ ...filter, director: e.target.value })}
                className="px-3 py-2 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-[9.5rem] text-sm shadow"
              >
                <option value="">All Directors</option>
                {directorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* IMDb Rating Range */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">IMDb Rating</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filter.imdbRating[0]}
                  onChange={e => onFilterChange({ ...filter, imdbRating: [Number(e.target.value), filter.imdbRating[1]] })}
                  className="w-12 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                />
                <span className="text-cyan-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filter.imdbRating[1]}
                  onChange={e => onFilterChange({ ...filter, imdbRating: [filter.imdbRating[0], Number(e.target.value)] })}
                  className="w-12 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                />
              </div>
            </div>
            {/* Runtime Range */}
            <div className="flex flex-col">
              <label className="text-xs text-cyan-300 font-semibold mb-1 ml-1">Runtime (min)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={filter.runtime[0]}
                  onChange={e => onFilterChange({ ...filter, runtime: [Number(e.target.value), filter.runtime[1]] })}
                  className="w-12 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                />
                <span className="text-cyan-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={filter.runtime[1]}
                  onChange={e => onFilterChange({ ...filter, runtime: [filter.runtime[0], Number(e.target.value)] })}
                  className="w-12 px-2 py-1 rounded-lg border border-cyan-400 bg-gray-900/80 text-cyan-200 text-xs shadow"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieFilterBar;

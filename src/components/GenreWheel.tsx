import React, { useState } from 'react';
import { Movie } from '../types/types';

// Hash function to generate a unique color for each genre
function genreColor(genre: string) {
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// Optionally, map genre to emoji/icon
const GENRE_ICONS: Record<string, string> = {
  Action: '💥',
  Adventure: '🗺️',
  Animation: '🎨',
  Comedy: '😂',
  Crime: '🕵️',
  Documentary: '🎬',
  Drama: '🎭',
  Family: '👨‍👩‍👧',
  Fantasy: '🧙',
  History: '📜',
  Horror: '👻',
  Music: '🎵',
  Mystery: '🕵️‍♂️',
  Romance: '❤️',
  Science: '🔬',
  "Science Fiction": '👽',
  TV: '📺',
  Thriller: '🔪',
  War: '⚔️',
  Western: '🤠',
};

interface GenreWheelProps {
  films: Movie[];
}

function getGenreData(films: Movie[]) {
  const genreCount: Record<string, number> = {};
  films.forEach(film => {
    if (film.genre) {
      film.genre.split(',').map(g => g.trim()).forEach(g => {
        if (g) genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }
  });
  const total = films.length;
  let data = Object.entries(genreCount).map(([genre, count]) => ({
    name: genre,
    value: count,
    percent: total ? count / total : 0
  }));
  // Sort by value descending and take top 10
  data = data.sort((a, b) => b.value - a.value).slice(0, 10);
  return data;
}

function getArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  // Convert angles to radians
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return [
    'M', startOuter.x, startOuter.y,
    'A', rOuter, rOuter, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', rInner, rInner, 0, largeArcFlag, 1, endInner.x, endInner.y,
    'Z'
  ].join(' ');
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

const GenreWheel: React.FC<GenreWheelProps> = ({ films }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const data = getGenreData(films);
  const total = films.length;
  const cx = 130, cy = 130, rOuter = 105, rInner = 55; // Thicker donut
  let lastAngle = 0;

  // Precompute all angles, but do not force last slice to 360°
  const angles = data.map(entry => entry.percent * 360);
  let runningAngle = 0;

  // Tooltip handler
  const handleMouseMove = (e: React.MouseEvent, entry: any, idx: number, midAngle: number) => {
    const svg = (e.target as SVGElement).ownerSVGElement;
    if (svg) {
      const rect = svg.getBoundingClientRect();
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 20,
        text: `${entry.name} - ${entry.value}`
      });
    }
    setHoverIdx(idx);
  };
  const handleMouseLeave = () => {
    setTooltip(null);
    setHoverIdx(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-white mb-2">Your Most Watched Genres</h3>
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        <svg width={260} height={260} viewBox="0 0 260 260" style={{ display: 'block' }}>
          {/* Draw donut segments */}
          {data.map((entry, idx) => {
            const angle = angles[idx];
            if (angle < 2) return null; // skip tiny slices
            const startAngle = runningAngle;
            const endAngle = startAngle + angle;
            const midAngle = (startAngle + endAngle) / 2;
            runningAngle = endAngle;
            // Centroid for emoji
            const centroidRadius = (2 * rOuter + rInner) / 3;
            const labelPos = polarToCartesian(cx, cy, centroidRadius, midAngle);
            const icon = GENRE_ICONS[entry.name] || '🎬';
            const arcLength = (Math.PI * (rOuter + rInner) / 2) * (angle / 180);
            const showIcon = arcLength > 18;
            let fontSize = angle > 60 ? 18 : angle > 40 ? 16 : 14;
            return (
              <g key={entry.name}>
                <path
                  d={getArc(cx, cy, hoverIdx === idx ? rOuter + 8 : rOuter, rInner, startAngle, endAngle)}
                  fill={genreColor(entry.name)}
                  stroke="#18181b"
                  strokeWidth={2}
                  style={{ cursor: 'pointer', filter: hoverIdx === idx ? 'brightness(1.2)' : 'none', transition: 'all 0.15s' }}
                  onMouseMove={e => handleMouseMove(e, entry, idx, midAngle)}
                  onMouseLeave={handleMouseLeave}
                />
                {showIcon && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontWeight={600}
                    fill="#fff"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 4px #000a' }}
                  >
                    {icon}
                  </text>
                )}
              </g>
            );
          })}
          {/* Center circle for total */}
          <circle cx={cx} cy={cy} r={rInner - 6} fill="#18181b" />
          <text x={cx} y={cy - 4} textAnchor="middle" className="font-bold text-xl" fill="#06b6d4">{total}</text>
          <text x={cx} y={cy + 18} textAnchor="middle" className="text-xs" fill="#a3a3a3">seen</text>
        </svg>
        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              background: 'rgba(30,41,59,0.95)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 13,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px #0005',
              zIndex: 10
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreWheel;

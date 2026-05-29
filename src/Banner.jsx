import React from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export const BANNER_WIDTH = 1176;
export const BANNER_HEIGHT = 500;

const card = { x: 88, y: 84, w: 1000, h: 292, r: 22 };
const cell = 12;
const gap = 3;
const weeks = 53;
const gridW = weeks * cell + (weeks - 1) * gap;
const gridH = 7 * cell + 6 * gap;
const gridX = card.x + 104;
const gridY = card.y + 112;
const monthY = gridY - 16;
const weekdayX = card.x + 26;
const footerY = gridY + gridH + 42;

/** The exported banner artwork as a single self-contained SVG. */
export function Banner({ grid, theme, handle, year, profilePic }) {
  return (
    <svg
      id="contribution-banner-svg"
      viewBox={`0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}`}
      width={BANNER_WIDTH}
      height={BANNER_HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="avatarClip">
          <circle cx="128" cy="128" r="24" />
        </clipPath>
        <filter id="subtleGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={BANNER_WIDTH} height={BANNER_HEIGHT} fill={theme.bg} />
      <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={card.r} fill={theme.card} stroke={theme.cardStroke} />

      <circle cx="128" cy="128" r="26" fill={theme.avatarBg} stroke={theme.avatarStroke} strokeWidth="2" />
      {profilePic ? (
        <image
          href={profilePic}
          x="104"
          y="104"
          width="48"
          height="48"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#avatarClip)"
        />
      ) : (
        <text x="128" y="136" textAnchor="middle" fontFamily={MONO} fontSize="20">
          👾
        </text>
      )}

      <text
        x="166"
        y="137"
        fill={theme.accent}
        fontFamily={MONO}
        fontSize="28"
        fontWeight="700"
        filter="url(#subtleGlow)"
      >
        {handle}
      </text>

      {MONTHS.map((month, i) => (
        <text key={month} x={gridX + Math.round((i / 12) * gridW)} y={monthY} fill={theme.muted} fontFamily={MONO} fontSize="15">
          {month}
        </text>
      ))}

      <text x={weekdayX} y={gridY + 1 * (cell + gap) + 10} fill={theme.muted} fontFamily={MONO} fontSize="15">Mon</text>
      <text x={weekdayX} y={gridY + 3 * (cell + gap) + 10} fill={theme.muted} fontFamily={MONO} fontSize="15">Wed</text>
      <text x={weekdayX} y={gridY + 5 * (cell + gap) + 10} fill={theme.muted} fontFamily={MONO} fontSize="15">Fri</text>

      {grid.map((row, y) =>
        row.map((value, x) => (
          <rect
            key={`${x}-${y}`}
            x={gridX + x * (cell + gap)}
            y={gridY + y * (cell + gap)}
            width={cell}
            height={cell}
            rx="2"
            fill={theme.levels[value]}
            stroke={value === 0 ? theme.emptyStroke : "none"}
            strokeWidth={value === 0 ? "0.6" : "0"}
          />
        ))
      )}

      <text x={gridX} y={footerY} fill={theme.muted} fontFamily={MONO} fontSize="14">
        ??? contributions in {year}
      </text>

      <text x={gridX + gridW - 230} y={footerY} fill={theme.muted} fontFamily={MONO} fontSize="14">Less</text>
      {[0, 1, 2, 3, 4].map((v, i) => (
        <rect
          key={v}
          x={gridX + gridW - 186 + i * 19}
          y={footerY - 12}
          width="12"
          height="12"
          rx="2"
          fill={theme.levels[v]}
          stroke={v === 0 ? theme.emptyStroke : "none"}
        />
      ))}
      <text x={gridX + gridW - 82} y={footerY} fill={theme.muted} fontFamily={MONO} fontSize="14">More</text>
    </svg>
  );
}

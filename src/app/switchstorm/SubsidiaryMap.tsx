"use client";

import React, { useState } from "react";

export interface SubsidiaryInfo {
  code: string;
  name: string;
  countries: string;
  flag: string;
  x: number;
  y: number;
  views: number;
  posts: number;
  influencers: number;
}

interface SubsidiaryMapProps {
  selectedSubsidiary: string;
  onSelectSubsidiary: (code: string) => void;
  subsidiaryStats: Record<
    string,
    { views: number; posts: number; influencers: number; name: string }
  >;
  totalViews: number;
  totalPosts: number;
}

const PIN_CONFIG: Record<
  string,
  { name: string; countries: string; flag: string; x: number; y: number }
> = {
  SEMAG: {
    name: "Samsung Maghreb",
    countries: "Morocco, Tunisia, Algeria, Libya",
    flag: "🇲🇦",
    x: 105,
    y: 215,
  },
  SEEG: {
    name: "Samsung Egypt",
    countries: "Egypt",
    flag: "🇪🇬",
    x: 420,
    y: 235,
  },
  SETK: {
    name: "Samsung Turkey",
    countries: "Turkey",
    flag: "🇹🇷",
    x: 475,
    y: 105,
  },
  SELV: {
    name: "Samsung Levant",
    countries: "Jordan, Lebanon, Iraq, Syria",
    flag: "🇯🇴",
    x: 508,
    y: 180,
  },
  SEIL: {
    name: "Samsung Israel",
    countries: "Israel",
    flag: "🇮🇱",
    x: 475,
    y: 206,
  },
  SESAR: {
    name: "Samsung Saudi Arabia",
    countries: "Kingdom of Saudi Arabia",
    flag: "🇸🇦",
    x: 565,
    y: 265,
  },
  SGE: {
    name: "Samsung Gulf Electronics",
    countries: "UAE, Qatar, Kuwait, Oman, Bahrain, Yemen",
    flag: "🇦🇪",
    x: 660,
    y: 255,
  },
  SEPAK: {
    name: "Samsung Pakistan",
    countries: "Pakistan",
    flag: "🇵🇰",
    x: 810,
    y: 205,
  },
};

export default function SubsidiaryMap({
  selectedSubsidiary,
  onSelectSubsidiary,
  subsidiaryStats,
  totalViews,
  totalPosts,
}: SubsidiaryMapProps) {
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const formatViews = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toString();
  };

  const activeInfo = selectedSubsidiary !== "All" ? PIN_CONFIG[selectedSubsidiary] : null;
  const activeStats = selectedSubsidiary !== "All" ? subsidiaryStats[selectedSubsidiary] : null;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white shadow-xl overflow-hidden transition-all duration-300">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Geographic Subsidiary Territory Filter
              </h3>
              <span className="hidden sm:inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/20">
                MENA Region
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Click any pin on the map or select a territory tag below to isolate performance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedSubsidiary !== "All" && (
            <button
              onClick={() => onSelectSubsidiary("All")}
              className="flex items-center gap-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
            >
              <span>✕</span>
              <span>Reset to All MENA</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 text-xs font-semibold border border-slate-700 transition-all"
            title={isExpanded ? "Collapse Map" : "Expand Map"}
          >
            <span>{isExpanded ? "Hide Map ▲" : "Show Map ▼"}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG Map Canvas */}
      {isExpanded && (
        <div className="relative w-full bg-[#0a1120] overflow-hidden select-none border-b border-slate-800/80">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:32px_32px]" />

          <svg
            viewBox="0 0 920 380"
            className="w-full h-auto max-h-[340px] sm:max-h-[380px] drop-shadow-md"
            style={{ minHeight: "260px" }}
          >
            <defs>
              {/* Radial Gradients for Active Pins */}
              <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="goldPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </radialGradient>

              {/* Linear Gradient for Sea / Land */}
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="activeLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
            </defs>

            {/* Stylized MENA Geographic Regions & Landmasses */}
            <g id="landmasses" opacity="0.85">
              {/* Maghreb & North Africa (Morocco to Libya) */}
              <path
                d="M 50 170 Q 110 160 180 180 Q 240 170 300 200 L 380 210 L 370 290 Q 260 300 160 280 Q 90 270 50 250 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Egypt */}
              <path
                d="M 380 210 Q 430 205 450 220 L 455 295 L 370 295 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Turkey (Anatolia) */}
              <path
                d="M 420 85 Q 480 75 550 90 L 545 140 Q 470 145 425 125 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Levant (Syria, Lebanon, Jordan, Iraq) */}
              <path
                d="M 460 145 Q 510 140 560 160 L 590 205 L 530 225 L 465 210 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Arabian Peninsula (Saudi Arabia, UAE, Oman, Yemen) */}
              <path
                d="M 490 230 Q 560 215 630 235 L 700 255 Q 720 295 680 340 Q 580 360 510 330 Q 470 290 490 230 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />

              {/* Pakistan & Indus Valley */}
              <path
                d="M 760 150 Q 820 135 850 170 L 845 270 Q 800 290 770 260 L 755 200 Z"
                fill="url(#landGrad)"
                stroke="#334155"
                strokeWidth="1.2"
              />
            </g>

            {/* Water Body Identifiers */}
            <g opacity="0.4" className="text-[9px] uppercase tracking-widest font-mono fill-slate-500">
              <text x="260" y="145">Mediterranean Sea</text>
              <text x="475" y="285">Red Sea</text>
              <text x="635" y="230">Arabian Gulf</text>
              <text x="730" y="340">Arabian Sea</text>
            </g>

            {/* Connecting Hub Arcs from SGE (Dubai HQ) to Regional Subsidiaries */}
            <g stroke="#38bdf8" strokeWidth="0.8" opacity="0.25" strokeDasharray="3,3" fill="none">
              <path d="M 660 255 Q 600 220 565 265" /> {/* SGE -> SESAR */}
              <path d="M 660 255 Q 560 160 508 180" /> {/* SGE -> SELV */}
              <path d="M 660 255 Q 540 180 420 235" /> {/* SGE -> SEEG */}
              <path d="M 660 255 Q 550 120 475 105" /> {/* SGE -> SETK */}
              <path d="M 660 255 Q 730 200 810 205" /> {/* SGE -> SEPAK */}
              <path d="M 660 255 Q 380 120 105 215" /> {/* SGE -> SEMAG */}
            </g>

            {/* Interactive Subsidiary Pins */}
            {Object.entries(PIN_CONFIG).map(([code, pin]) => {
              const isSelected = selectedSubsidiary === code;
              const isHovered = hoveredSub === code;
              const stats = subsidiaryStats[code] || { views: 0, posts: 0, influencers: 0 };
              const viewText = formatViews(stats.views);

              return (
                <g
                  key={code}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => onSelectSubsidiary(isSelected ? "All" : code)}
                  onMouseEnter={() => setHoveredSub(code)}
                  onMouseLeave={() => setHoveredSub(null)}
                >
                  {/* Glowing Radar Pulse for Active / Hovered Pin */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={isSelected ? "32" : "24"}
                      fill={isSelected ? "url(#goldPulse)" : "url(#pulseGlow)"}
                      className="animate-pulse"
                    />
                  )}

                  {/* Pulsing center dot */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? "8" : "5"}
                    fill={isSelected ? "#fbbf24" : "#38bdf8"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />

                  {/* Pin Floating Badge */}
                  <g transform={`translate(${pin.x - 36}, ${pin.y - 34})`}>
                    <rect
                      width="72"
                      height="24"
                      rx="12"
                      fill={isSelected ? "#034EA2" : isHovered ? "#1e293b" : "#0f172a"}
                      stroke={isSelected ? "#fbbf24" : isHovered ? "#38bdf8" : "#334155"}
                      strokeWidth={isSelected ? "2" : "1"}
                      className="transition-colors duration-200 drop-shadow-lg"
                    />
                    <text
                      x="36"
                      y="16"
                      textAnchor="middle"
                      className={`text-[11px] font-bold tracking-tight select-none ${
                        isSelected ? "fill-white font-extrabold" : "fill-slate-200"
                      }`}
                    >
                      {code} <tspan className="text-[9px] font-semibold text-amber-300 fill-amber-300">{viewText}</tspan>
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Interactive Live Tooltip (Overlay when hovering over a pin) */}
          {hoveredSub && PIN_CONFIG[hoveredSub] && (
            <div
              className="absolute pointer-events-none z-30 transition-all duration-200 bg-slate-900/95 backdrop-blur-md border border-blue-400/50 rounded-xl p-3 shadow-2xl text-xs max-w-xs"
              style={{
                left: `${Math.min(Math.max(PIN_CONFIG[hoveredSub].x / 9.2 - 8, 4), 65)}%`,
                top: `${Math.min(Math.max(PIN_CONFIG[hoveredSub].y / 3.8 - 25, 5), 55)}%`,
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>{PIN_CONFIG[hoveredSub].flag}</span>
                  <span>{hoveredSub}</span>
                  <span className="text-xs font-normal text-slate-300">
                    ({PIN_CONFIG[hoveredSub].name})
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                <strong className="text-slate-400">Territory:</strong> {PIN_CONFIG[hoveredSub].countries}
              </p>
              <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Views</div>
                  <div className="font-extrabold text-amber-400 text-xs">
                    {formatViews(subsidiaryStats[hoveredSub]?.views || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Videos</div>
                  <div className="font-bold text-white text-xs">
                    {subsidiaryStats[hoveredSub]?.posts || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Creators</div>
                  <div className="font-bold text-blue-400 text-xs">
                    {subsidiaryStats[hoveredSub]?.influencers || 0}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center text-[10px] text-blue-300 font-semibold">
                Click to filter dashboard for {hoveredSub}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Quick-Selection Territory Tags Row */}
      <div className="p-3 sm:p-4 bg-slate-900/95 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
          Market Filter:
        </span>

        {/* All MENA Tag */}
        <button
          onClick={() => onSelectSubsidiary("All")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            selectedSubsidiary === "All"
              ? "bg-[#034EA2] text-white shadow-md ring-2 ring-blue-400/40"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
          }`}
        >
          <span>🌐</span>
          <span>All MENA</span>
          <span className="text-[10px] opacity-80">({formatViews(totalViews)})</span>
        </button>

        {/* Individual Subsidiary Tags */}
        {Object.entries(PIN_CONFIG).map(([code, pin]) => {
          const isSelected = selectedSubsidiary === code;
          const stats = subsidiaryStats[code];
          const viewText = stats ? formatViews(stats.views) : "0";

          return (
            <button
              key={code}
              onClick={() => onSelectSubsidiary(isSelected ? "All" : code)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-amber-400 text-slate-950 font-extrabold shadow-md ring-2 ring-amber-300"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80"
              }`}
            >
              <span>{pin.flag}</span>
              <span>{code}</span>
              <span className={`text-[10px] ${isSelected ? "text-slate-900 font-bold" : "text-amber-400/90"}`}>
                {viewText}
              </span>
            </button>
          );
        })}

        {/* Undefined Tag */}
        {subsidiaryStats["Undefined"] && (
          <button
            onClick={() => onSelectSubsidiary(selectedSubsidiary === "Undefined" ? "All" : "Undefined")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              selectedSubsidiary === "Undefined"
                ? "bg-slate-700 text-white font-bold ring-2 ring-slate-400"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50"
            }`}
          >
            <span>Undefined ({subsidiaryStats["Undefined"].posts})</span>
          </button>
        )}
      </div>

      {/* 4. Active Filter Indicator Banner */}
      {selectedSubsidiary !== "All" && activeInfo && activeStats && (
        <div className="bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-slate-900 border-t border-blue-500/30 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>Active Territory Filter:</span>
            <strong className="text-white font-bold text-sm flex items-center gap-1.5">
              <span>{activeInfo.flag}</span>
              <span>{selectedSubsidiary} ({activeInfo.name})</span>
            </strong>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">{activeInfo.countries}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-amber-300 font-bold">
              {activeStats.views.toLocaleString()} Unified Views
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-medium">
              {activeStats.posts} Videos ({activeStats.influencers} Creators)
            </span>
            <button
              onClick={() => onSelectSubsidiary("All")}
              className="text-xs text-slate-400 hover:text-white underline ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

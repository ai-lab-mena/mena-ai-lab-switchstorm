"use client";

import React, { useState, useMemo } from "react";

export interface RankedVideo {
  Overall_Rank?: number;
  Rank?: string;
  Scope?: string;
  "Post URL": string;
  "Influencer Name": string;
  Handle: string;
  Subsidiary: string;
  Platform: string;
  "Post Date": string;
  Phase?: string;
  Category?: string;
  "Creator Group": string;
  "Video Views": number;
  "Engagements Total": number;
  "Engagement Rate": number;
  "Engagement Rate %": string;
  Shares: number;
  Saves: number;
  "Thumbnail URL": string | null;
  "Post Title": string;
}

interface ContentShowcaseTabProps {
  allRankedVideos: RankedVideo[];
  topPerformingVideos: RankedVideo[];
  selectedSubsidiary: string;
  onSelectSubsidiary?: (sub: string) => void;
}

export default function ContentShowcaseTab({
  allRankedVideos,
  topPerformingVideos,
  selectedSubsidiary,
  onSelectSubsidiary,
}: ContentShowcaseTabProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>("Overall");
  const [selectedCategory, setSelectedCategory] = useState<string>("Overall");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"top10" | "all">("top10");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Helper for Top 10 by Category
  const getTop10ForCategory = (cat: string) => {
    const list = allRankedVideos || [];
    return list
      .filter((v) => {
        const matchPhase = selectedPhase === "Overall" || v.Phase === selectedPhase;
        const matchCat = cat === "Overall" ? true : v.Category === cat;
        const matchPlatform =
          selectedPlatform === "All" ||
          (v.Platform && v.Platform.toLowerCase() === selectedPlatform.toLowerCase());
        const matchSubsidiary =
          selectedSubsidiary === "All" ||
          (v.Subsidiary && v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());
        return matchPhase && matchCat && matchPlatform && matchSubsidiary;
      })
      .sort((a, b) => (b["Video Views"] || 0) - (a["Video Views"] || 0))
      .slice(0, 10);
  };

  const top10Overall = useMemo(
    () => getTop10ForCategory("Overall"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary]
  );
  const top10Lifestyle = useMemo(
    () => getTop10ForCategory("Lifestyle"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary]
  );
  const top10Techies = useMemo(
    () => getTop10ForCategory("Tech / Crossover"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary]
  );

  // Filtered All Ranked Videos
  const filteredAllVideos = useMemo(() => {
    const list = allRankedVideos || [];
    return list.filter((v) => {
      const matchPhase = selectedPhase === "Overall" || v.Phase === selectedPhase;
      const matchCat = selectedCategory === "Overall" || v.Category === selectedCategory;
      const matchPlatform =
        selectedPlatform === "All" ||
        (v.Platform && v.Platform.toLowerCase() === selectedPlatform.toLowerCase());
      const matchSubsidiary =
        selectedSubsidiary === "All" ||
        (v.Subsidiary && v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (v["Influencer Name"] && v["Influencer Name"].toLowerCase().includes(q)) ||
        (v.Handle && v.Handle.toLowerCase().includes(q)) ||
        (v.Subsidiary && v.Subsidiary.toLowerCase().includes(q)) ||
        (v["Post Title"] && v["Post Title"].toLowerCase().includes(q));

      return matchPhase && matchCat && matchPlatform && matchSubsidiary && matchQuery;
    });
  }, [allRankedVideos, selectedPhase, selectedCategory, selectedPlatform, selectedSubsidiary, searchQuery]);

  const renderVideoCard = (video: RankedVideo, rankNumber: number, sectionPrefix: string) => {
    const isRank1 = rankNumber === 1;
    const isRank2 = rankNumber === 2;
    const isRank3 = rankNumber === 3;
    const cardKey = `${sectionPrefix}-${video["Post URL"]}-${rankNumber}`;

    let thumbUrl = video["Thumbnail URL"];
    if (video.Platform === "YouTube" && video["Post URL"]) {
      const m = video["Post URL"].match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (m) thumbUrl = `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
    } else if (
      video.Platform === "Instagram" ||
      video.Platform === "TikTok" ||
      (thumbUrl &&
        (thumbUrl.includes("instagram.com") ||
          thumbUrl.includes("tiktokcdn") ||
          thumbUrl.includes("fbcdn.net")))
    ) {
      const target = video["Post URL"] || thumbUrl;
      if (target) {
        thumbUrl = `/api/thumbnail?url=${encodeURIComponent(target)}`;
      }
    }

    const hasValidThumb =
      thumbUrl &&
      !brokenImages[cardKey] &&
      typeof thumbUrl === "string" &&
      thumbUrl.length > 3;

    return (
      <div
        key={cardKey}
        className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300"
      >
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          {hasValidThumb ? (
            <img
              src={thumbUrl!}
              alt={video["Influencer Name"]}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => handleImageError(cardKey)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-gradient-to-br from-slate-900 to-slate-800 w-full h-full">
              <span className="text-xs font-semibold text-slate-200">
                {video["Influencer Name"]}
              </span>
            </div>
          )}

          <div
            className={`absolute top-2.5 left-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full font-bold text-xs shadow-md z-10 ${
              isRank1
                ? "bg-amber-400 text-slate-900 border-2 border-white ring-2 ring-amber-400/50"
                : isRank2
                ? "bg-slate-200 text-slate-800 border-2 border-white"
                : isRank3
                ? "bg-amber-700 text-white border-2 border-white"
                : "bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs"
            }`}
          >
            #{rankNumber}
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                video.Platform === "TikTok"
                  ? "bg-black/80 text-cyan-300 border border-cyan-500/40"
                  : video.Platform === "Instagram"
                  ? "bg-gradient-to-r from-purple-900/90 to-pink-900/90 text-pink-200 border border-pink-500/40"
                  : "bg-red-900/90 text-white border border-red-500/40"
              }`}
            >
              {video.Platform}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-bold z-10 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <span className="text-emerald-400 flex items-center gap-1">
              👁️ {formatNumber(video["Video Views"])} views
            </span>
            <span className="text-blue-300">
              {video["Engagement Rate %"]} ER
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-3.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-slate-900 truncate text-xs">
                {video["Influencer Name"]}
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#034EA2] border border-blue-200 shrink-0">
                {video.Subsidiary || "MENA"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
              {video["Post Title"] || "Samsung SwitchStorm campaign post"}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">
              {video["Post Date"]}
            </span>
            <a
              href={video["Post URL"]}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-[#034EA2] hover:underline inline-flex items-center gap-1"
            >
              Watch Video →
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode("top10")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                viewMode === "top10"
                  ? "bg-[#034EA2] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Top 10 Showcase
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                viewMode === "all"
                  ? "bg-[#034EA2] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Ranked Content ({allRankedVideos.length})
            </button>
          </div>

          {/* Phase Filter */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="Overall">All Campaign Flights</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
          </select>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="All">All Platforms</option>
            <option value="TikTok">TikTok Only</option>
            <option value="Instagram">Instagram Only</option>
            <option value="YouTube">YouTube Only</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search creator, handle, sub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* TOP 10 MODE */}
      {viewMode === "top10" ? (
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>🏆</span>
              <span>Top 10 Content Across All Platforms</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Overall.map((video, idx) => renderVideoCard(video, idx + 1, "ov"))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>🎨</span>
              <span>Top 10 Lifestyle Creators (CC, Team Galaxy, Galaxy Circle)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Lifestyle.map((video, idx) => renderVideoCard(video, idx + 1, "ls"))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>⚡</span>
              <span>Top 10 Techies & Crossovers</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Techies.map((video, idx) => renderVideoCard(video, idx + 1, "tc"))}
            </div>
          </div>
        </div>
      ) : (
        /* ALL VIDEOS MODE */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAllVideos.slice(0, visibleCount).map((v, idx) =>
              renderVideoCard(v, idx + 1, "all")
            )}
          </div>

          {visibleCount < filteredAllVideos.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="rounded-xl bg-[#034EA2] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition-all cursor-pointer"
              >
                Load More Content ({visibleCount} of {filteredAllVideos.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

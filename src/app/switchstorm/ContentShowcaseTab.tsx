"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";

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
  Shares?: number;
  Saves?: number;
  Likes?: number;
  Comments?: number;
  "Thumbnail URL": string | null;
  "Post Title": string;
}

export type SortMetric = "views" | "engagements" | "likes" | "comments" | "shares" | "saves";

const SORT_OPTIONS: { id: SortMetric; label: string; shortLabel: string; description: string }[] = [
  { id: "views", label: "Most Video Views", shortLabel: "Views", description: "Highest unified video plays across all platforms" },
  { id: "engagements", label: "Most Engaging", shortLabel: "Engagements", description: "Highest total engagements (Likes + Comments + Shares + Saves)" },
  { id: "likes", label: "Most Liked", shortLabel: "Likes", description: "Highest audience likes and reactions" },
  { id: "comments", label: "Most Commented", shortLabel: "Comments", description: "Highest user conversations and comment volume" },
  { id: "shares", label: "Most Shared", shortLabel: "Shares", description: "Highest organic virality and video shares" },
  { id: "saves", label: "Most Saved", shortLabel: "Saves", description: "Highest user bookmarks and saved posts" },
];

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
  const [sortBy, setSortBy] = useState<SortMetric>("views");
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

  const getMetricValue = (v: RankedVideo, metric: SortMetric): number => {
    switch (metric) {
      case "views":
        return v["Video Views"] || 0;
      case "engagements":
        return v["Engagements Total"] || 0;
      case "likes":
        return v.Likes || 0;
      case "comments":
        return v.Comments || 0;
      case "shares":
        return v.Shares || 0;
      case "saves":
        return v.Saves || 0;
      default:
        return v["Video Views"] || 0;
    }
  };

  // Helper for Top 10 by Category dynamically sorted by active metric
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
      .sort((a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy))
      .slice(0, 10);
  };

  const top10Overall = useMemo(
    () => getTop10ForCategory("Overall"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary, sortBy]
  );
  const top10Lifestyle = useMemo(
    () => getTop10ForCategory("Lifestyle"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary, sortBy]
  );
  const top10Techies = useMemo(
    () => getTop10ForCategory("Tech / Crossover"),
    [allRankedVideos, selectedPhase, selectedPlatform, selectedSubsidiary, sortBy]
  );

  // Filtered All Ranked Videos sorted by active metric
  const filteredAllVideos = useMemo(() => {
    const list = allRankedVideos || [];
    return list
      .filter((v) => {
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
      })
      .sort((a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy));
  }, [allRankedVideos, selectedPhase, selectedCategory, selectedPlatform, selectedSubsidiary, searchQuery, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Most Video Views";

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
        className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-[#034EA2]/50 hover:-translate-y-1 transition-all duration-300"
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

          {/* Rank Badge */}
          <div
            className={`absolute top-2.5 left-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg font-bold text-xs shadow-md z-10 ${
              isRank1
                ? "bg-amber-400 text-slate-950 border border-white/60 font-black"
                : isRank2
                ? "bg-slate-200 text-slate-900 border border-white/60 font-bold"
                : isRank3
                ? "bg-amber-700 text-white border border-white/60 font-bold"
                : "bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs font-semibold"
            }`}
          >
            #{rankNumber}
          </div>

          {/* Platform Badge with Official Vector Logo */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold bg-black/80 text-white border border-white/10 backdrop-blur-md shadow-xs">
              {video.Platform === "TikTok" && (
                <span className="relative h-3 w-3 inline-block">
                  <Image src="/images/platforms/tiktok.svg" alt="TikTok" fill className="object-contain" />
                </span>
              )}
              {video.Platform === "Instagram" && (
                <span className="relative h-3 w-3 inline-block">
                  <Image src="/images/platforms/instagram.svg" alt="Instagram" fill className="object-contain" />
                </span>
              )}
              {video.Platform === "YouTube" && (
                <span className="relative h-3 w-3 inline-block">
                  <Image src="/images/platforms/youtube.svg" alt="YouTube" fill className="object-contain" />
                </span>
              )}
              <span>{video.Platform}</span>
            </span>
          </div>

          {/* Dynamic Highlight Pill on Video Card corresponding to the active sort filter */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-bold z-10 bg-slate-950/85 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-white/10 shadow-sm">
            {sortBy === "views" && (
              <>
                <span className="text-emerald-400 flex items-center gap-1.5 tabular-nums">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatNumber(video["Video Views"])} views
                </span>
                <span className="text-blue-300 font-semibold tabular-nums text-[11px]">
                  {video["Engagement Rate %"]} ER
                </span>
              </>
            )}

            {sortBy === "engagements" && (
              <>
                <span className="text-purple-300 flex items-center gap-1.5 tabular-nums">
                  <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {formatNumber(video["Engagements Total"])} engagements
                </span>
                <span className="text-slate-300 font-normal tabular-nums text-[11px]">
                  {formatNumber(video["Video Views"])} views
                </span>
              </>
            )}

            {sortBy === "likes" && (
              <>
                <span className="text-rose-400 flex items-center gap-1.5 tabular-nums font-bold">
                  <svg className="h-3.5 w-3.5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {formatNumber(video.Likes)} likes
                </span>
                <span className="text-slate-300 font-normal tabular-nums text-[11px]">
                  {formatNumber(video["Video Views"])} views
                </span>
              </>
            )}

            {sortBy === "comments" && (
              <>
                <span className="text-cyan-300 flex items-center gap-1.5 tabular-nums font-bold">
                  <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {formatNumber(video.Comments)} comments
                </span>
                <span className="text-slate-300 font-normal tabular-nums text-[11px]">
                  {formatNumber(video["Video Views"])} views
                </span>
              </>
            )}

            {sortBy === "shares" && (
              <>
                <span className="text-amber-300 flex items-center gap-1.5 tabular-nums font-bold">
                  <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {formatNumber(video.Shares)} shares
                </span>
                <span className="text-slate-300 font-normal tabular-nums text-[11px]">
                  {formatNumber(video["Video Views"])} views
                </span>
              </>
            )}

            {sortBy === "saves" && (
              <>
                <span className="text-indigo-300 flex items-center gap-1.5 tabular-nums font-bold">
                  <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {formatNumber(video.Saves)} saves
                </span>
                <span className="text-slate-300 font-normal tabular-nums text-[11px]">
                  {formatNumber(video["Video Views"])} views
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-3.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-slate-900 truncate text-xs">
                {video["Influencer Name"]}
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#034EA2] border border-blue-200/80 shrink-0">
                {video.Subsidiary || "MENA"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {video["Post Title"] || "Samsung SwitchStorm campaign deliverable"}
            </p>
          </div>

          {/* Quick Metrics Audit Strip */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono tabular-nums">
            <span title="Likes" className="flex items-center gap-0.5">
              <span className="text-rose-500">♥</span> {formatNumber(video.Likes)}
            </span>
            <span title="Comments" className="flex items-center gap-0.5">
              <span className="text-cyan-600">💬</span> {formatNumber(video.Comments)}
            </span>
            <span title="Shares" className="flex items-center gap-0.5">
              <span className="text-amber-600">↗</span> {formatNumber(video.Shares)}
            </span>
            <span title="Saves" className="flex items-center gap-0.5">
              <span className="text-indigo-600">🔖</span> {formatNumber(video.Saves)}
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">
              {video["Post Date"]}
            </span>
            <a
              href={video["Post URL"]}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-[#034EA2] hover:underline inline-flex items-center gap-1 group/link"
            >
              <span>View Post</span>
              <span className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Metric Sort Selector Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-[#034EA2] text-xs">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sort Content By:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SORT_OPTIONS.map((opt) => {
              const isActive = sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  title={opt.description}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#034EA2] text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Secondary Filter Bar (View Mode, Flight, Platform, Search) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode("top10")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                viewMode === "top10"
                  ? "bg-[#034EA2] text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Top 10 Leaders
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                viewMode === "all"
                  ? "bg-[#034EA2] text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Ranked Content ({allRankedVideos.length})
            </button>
          </div>

          {/* Flight Phase Selector */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500 shadow-2xs"
          >
            <option value="Overall">All Campaign Flights</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
          </select>

          {/* Platform Selector */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500 shadow-2xs"
          >
            <option value="All">All Platforms</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search creator, handle, sub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 3. Content Display */}
      {viewMode === "top10" ? (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-amber-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                <span>Top Content Across All Channels</span>
              </h3>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Overall.map((video, idx) => renderVideoCard(video, idx + 1, "ov"))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-purple-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span>Top Lifestyle Deliverables (Team Galaxy, CC, Galaxy Circle)</span>
              </h3>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Lifestyle.map((video, idx) => renderVideoCard(video, idx + 1, "ls"))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-100 text-cyan-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>Top Tech & Crossover Reviewers</span>
              </h3>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {top10Techies.map((video, idx) => renderVideoCard(video, idx + 1, "tc"))}
            </div>
          </div>
        </div>
      ) : (
        /* ALL VIDEOS MODE */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-600">
              Showing {Math.min(visibleCount, filteredAllVideos.length)} of {filteredAllVideos.length} deliverables
            </span>
            <span className="text-xs text-[#034EA2] font-bold">
              Sorted by: {activeSortLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAllVideos.slice(0, visibleCount).map((v, idx) =>
              renderVideoCard(v, idx + 1, "all")
            )}
          </div>

          {visibleCount < filteredAllVideos.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="rounded-xl bg-[#034EA2] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition-all cursor-pointer"
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

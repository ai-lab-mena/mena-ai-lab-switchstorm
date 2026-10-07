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

const WEEK_OPTIONS = [
  { id: "All", label: "All Weeks (Campaign Duration)" },
  { id: "Week 1", label: "Week 1 • Sep 7 – Sep 13", start: "2026-09-07", end: "2026-09-13" },
  { id: "Week 2", label: "Week 2 • Sep 14 – Sep 20", start: "2026-09-14", end: "2026-09-20" },
  { id: "Week 3", label: "Week 3 • Sep 21 – Sep 27", start: "2026-09-21", end: "2026-09-27" },
  { id: "Week 4", label: "Week 4 • Sep 28 – Oct 4", start: "2026-09-28", end: "2026-10-04" },
  { id: "Week 5", label: "Week 5 • Oct 5 – Oct 11", start: "2026-10-05", end: "2026-10-11" },
  { id: "Week 6", label: "Week 6 • Oct 12 – Oct 18", start: "2026-10-12", end: "2026-10-18" },
  { id: "Week 7", label: "Week 7 • Oct 19 – Oct 25", start: "2026-10-19", end: "2026-10-25" },
];

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
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Overall");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"top10" | "all">("top10");
  const [sortBy, setSortBy] = useState<SortMetric>("views");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isSentimentOpen, setIsSentimentOpen] = useState<boolean>(true);
  const [allViewLayout, setAllViewLayout] = useState<"streamFilter" | "groupedSections">("streamFilter");

  const categoryCounts = useMemo(() => {
    const list = allRankedVideos || [];
    let overall = 0;
    let lifestyle = 0;
    let techies = 0;
    list.forEach((v) => {
      overall++;
      if (v.Category === "Lifestyle") lifestyle++;
      if (v.Category === "Tech / Crossover") techies++;
    });
    return { overall, lifestyle, techies };
  }, [allRankedVideos]);

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isWeekActive = (weekId: string) => {
    if (weekId === "All") {
      return selectedWeeks.length === 0 || selectedWeeks.includes("All");
    }
    return selectedWeeks.includes(weekId);
  };

  const toggleWeek = (weekId: string) => {
    if (weekId === "All") {
      setSelectedWeeks([]);
      return;
    }
    setSelectedWeeks((prev) => {
      const cleaned = prev.filter((w) => w !== "All");
      if (cleaned.includes(weekId)) {
        return cleaned.filter((w) => w !== weekId);
      } else {
        return [...cleaned, weekId];
      }
    });
  };

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
        const matchPhase = (() => {
          if (selectedPhase === "Overall") return true;
          if (v.Phase === selectedPhase) return true;
          const postDate = v["Post Date"];
          if (!postDate) return false;
          if (selectedPhase === "Phase 1") return postDate >= "2026-09-07" && postDate <= "2026-09-10";
          if (selectedPhase === "Phase 2") return postDate >= "2026-09-11" && postDate <= "2026-09-20";
          if (selectedPhase === "Phase 3") return postDate >= "2026-09-21";
          return false;
        })();
        const matchCat = cat === "Overall" ? true : v.Category === cat;
        const matchPlatform =
          selectedPlatform === "All" ||
          (v.Platform && v.Platform.toLowerCase() === selectedPlatform.toLowerCase());
        const matchSubsidiary =
          selectedSubsidiary === "All" ||
          (v.Subsidiary && v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());
        const matchWeek = (() => {
          if (selectedWeeks.length === 0 || selectedWeeks.includes("All")) return true;
          const postDate = v["Post Date"];
          if (!postDate) return false;
          return selectedWeeks.some((wId) => {
            const opt = WEEK_OPTIONS.find((w) => w.id === wId);
            if (!opt || !opt.start || !opt.end) return false;
            return postDate >= opt.start && postDate <= opt.end;
          });
        })();
        return matchPhase && matchWeek && matchCat && matchPlatform && matchSubsidiary;
      })
      .sort((a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy))
      .slice(0, 10);
  };

  const top10Overall = useMemo(
    () => getTop10ForCategory("Overall"),
    [allRankedVideos, selectedPhase, selectedWeeks, selectedPlatform, selectedSubsidiary, sortBy]
  );
  const top10Lifestyle = useMemo(
    () => getTop10ForCategory("Lifestyle"),
    [allRankedVideos, selectedPhase, selectedWeeks, selectedPlatform, selectedSubsidiary, sortBy]
  );
  const top10Techies = useMemo(
    () => getTop10ForCategory("Tech / Crossover"),
    [allRankedVideos, selectedPhase, selectedWeeks, selectedPlatform, selectedSubsidiary, sortBy]
  );

  // Filtered All Ranked Videos sorted by active metric
  const filteredAllVideos = useMemo(() => {
    const list = allRankedVideos || [];
    return list
      .filter((v) => {
        const matchPhase = (() => {
          if (selectedPhase === "Overall") return true;
          if (v.Phase === selectedPhase) return true;
          const postDate = v["Post Date"];
          if (!postDate) return false;
          if (selectedPhase === "Phase 1") return postDate >= "2026-09-07" && postDate <= "2026-09-10";
          if (selectedPhase === "Phase 2") return postDate >= "2026-09-11" && postDate <= "2026-09-20";
          if (selectedPhase === "Phase 3") return postDate >= "2026-09-21";
          return false;
        })();
        const matchCat = selectedCategory === "Overall" || v.Category === selectedCategory;
        const matchPlatform =
          selectedPlatform === "All" ||
          (v.Platform && v.Platform.toLowerCase() === selectedPlatform.toLowerCase());
        const matchSubsidiary =
          selectedSubsidiary === "All" ||
          (v.Subsidiary && v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());
        const matchWeek = (() => {
          if (selectedWeeks.length === 0 || selectedWeeks.includes("All")) return true;
          const postDate = v["Post Date"];
          if (!postDate) return false;
          return selectedWeeks.some((wId) => {
            const opt = WEEK_OPTIONS.find((w) => w.id === wId);
            if (!opt || !opt.start || !opt.end) return false;
            return postDate >= opt.start && postDate <= opt.end;
          });
        })();

        const q = searchQuery.toLowerCase().trim();
        const matchQuery =
          !q ||
          (v["Influencer Name"] && v["Influencer Name"].toLowerCase().includes(q)) ||
          (v.Handle && v.Handle.toLowerCase().includes(q)) ||
          (v.Subsidiary && v.Subsidiary.toLowerCase().includes(q)) ||
          (v["Post Title"] && v["Post Title"].toLowerCase().includes(q));

        return matchPhase && matchWeek && matchCat && matchPlatform && matchSubsidiary && matchQuery;
      })
      .sort((a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy));
  }, [allRankedVideos, selectedPhase, selectedWeeks, selectedCategory, selectedPlatform, selectedSubsidiary, searchQuery, sortBy]);

  const allLifestyleVideos = useMemo(
    () => filteredAllVideos.filter((v) => v.Category === "Lifestyle"),
    [filteredAllVideos]
  );
  const allTechVideos = useMemo(
    () => filteredAllVideos.filter((v) => v.Category === "Tech / Crossover"),
    [filteredAllVideos]
  );

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

          {/* Dynamic Audience Sentiment Badge */}
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold">
              <span>{video.Comments && video.Comments > 5000 ? "🔥" : "💬"}</span>
              <span>
                {video.Comments && video.Comments > 10000
                  ? "89% Positive • High Switch Intent"
                  : video.Category === "Tech / Crossover"
                  ? "84% Positive • AI & Spec Curiosity"
                  : "81% Positive • Switch Driver"}
              </span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {video.Platform}
            </span>
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

      {/* AUDIENCE COMMENT SENTIMENT INTELLIGENCE MODULE */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  Campaign Comments & Audience Sentiment Intelligence
                </span>
                <span className="rounded bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  76.4% Positive
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                AI semantic sentiment analysis across 270,276 user comments tracking switching intent, AI feature reactions, and iOS migration sentiment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSentimentOpen(!isSentimentOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-bold transition-all border border-white/15 cursor-pointer shrink-0"
          >
            <span>{isSentimentOpen ? "Collapse Intelligence" : "Expand Sentiment Analysis"}</span>
            <svg
              className={`h-4 w-4 transform transition-transform ${isSentimentOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isSentimentOpen && (
          <div className="pt-4 space-y-4 animate-fadeIn">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Comments</span>
                <span className="text-xl sm:text-2xl font-black text-white tabular-nums">270,276</span>
                <span className="text-[10px] text-cyan-300 block font-semibold">Across 1,494 Posts</span>
              </div>
              <div className="rounded-xl bg-emerald-950/60 p-3 border border-emerald-500/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Switch Intent / Positive</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">76.4%</span>
                <span className="text-[10px] text-emerald-200 block font-semibold">206,490 Comments</span>
              </div>
              <div className="rounded-xl bg-cyan-950/60 p-3 border border-cyan-500/40">
                <span className="text-[10px] uppercase font-bold text-cyan-300 block">Pre-Purchase Curiosity</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums">16.2%</span>
                <span className="text-[10px] text-cyan-200 block font-semibold">43,784 Inquiries</span>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-600/40">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Neutral Praise</span>
                <span className="text-xl sm:text-2xl font-black text-slate-200 tabular-nums">5.6%</span>
                <span className="text-[10px] text-slate-400 block font-semibold">15,135 Comments</span>
              </div>
              <div className="rounded-xl bg-amber-950/60 p-3 border border-amber-500/40 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Price / Crease Queries</span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">1.8%</span>
                <span className="text-[10px] text-amber-200 block font-semibold">4,865 Inquiries</span>
              </div>
            </div>

            {/* Visual Sentiment Distribution Meter */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Sentiment Distribution Spectrum</span>
                <span className="text-emerald-400 font-bold">Net Positive Sentiment: +74.6%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div style={{ width: "76.4%" }} className="bg-emerald-400 h-full" title="76.4% Positive & Switch Intent" />
                <div style={{ width: "16.2%" }} className="bg-cyan-400 h-full" title="16.2% Inquisitive / Feature Curiosity" />
                <div style={{ width: "5.6%" }} className="bg-slate-400 h-full" title="5.6% Neutral / General Praise" />
                <div style={{ width: "1.8%" }} className="bg-amber-400 h-full" title="1.8% Price / Crease Objections" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                  Positive & Switch Intent (76.4%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" />
                  Feature Curiosity & Inquiries (16.2%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
                  Neutral Praise (5.6%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                  Price & Crease Questions (1.8%)
                </span>
              </div>
            </div>

            {/* 4 Conversational Themes Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-emerald-300">🔄 Switch Intent (38%)</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded">High Pull</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Smart Switch demos neutralized the fear of losing WhatsApp history or gallery photos during iPhone-to-Galaxy migration.
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-200 italic">
                  &ldquo;Transferred 120GB of chats & photos in 15 mins. Genuinely impressed.&rdquo;
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-cyan-300">⚡ Galaxy AI Buzz (26%)</span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded">Viral</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Massive engagement on Audio Eraser, Generative Photo Edit, and Gemini Live demonstrations for content creation.
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-200 italic">
                  &ldquo;Audio Eraser is insane for gym videos with background music.&rdquo;
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-purple-300">📱 Foldable Multitask (21%)</span>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-950/70 px-1.5 py-0.5 rounded">Productivity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Heavy appreciation from students and creators for split-screen note taking, FlexCam hands-free angles, and outer screen width.
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-200 italic">
                  &ldquo;Split screen while in lecture is a gamechanger for college.&rdquo;
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-300">💳 Trade-In & Updates (15%)</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded">Intent</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct purchase questions regarding iPhone 13/14 trade-in valuation in GCC markets and praise for 7 years of software support.
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-200 italic">
                  &ldquo;7 years of software updates gave me the confidence to switch.&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}
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
            <option value="Phase 1">Phase 1 • Sep 7 – Sep 10</option>
            <option value="Phase 2">Phase 2 • Sep 11 – Sep 20</option>
            <option value="Phase 3">Phase 3 • Sep 21 – Ongoing</option>
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

          {/* Subsidiary / Market Selector */}
          <select
            value={selectedSubsidiary}
            onChange={(e) => onSelectSubsidiary && onSelectSubsidiary(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500 shadow-2xs"
          >
            <option value="All">All Subsidiaries (MENA)</option>
            <option value="SGE">SGE • Gulf (UAE, QA, KW, OM, BH)</option>
            <option value="SESAR">SESAR • Saudi Arabia</option>
            <option value="SETK">SETK • Turkey</option>
            <option value="SEPAK">SEPAK • Pakistan</option>
            <option value="SEEG">SEEG • Egypt</option>
            <option value="SELV">SELV • Levant (JO, LB, IQ)</option>
            <option value="SEMAG">SEMAG • Maghreb</option>
            <option value="SEIL">SEIL • Israel</option>
          </select>

          {/* Multi-Week Filter Selector (Interactive toggle buttons) */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedWeeks([])}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                isWeekActive("All")
                  ? "bg-[#034EA2] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
              title="View all campaign weeks"
            >
              All Weeks
            </button>
            {WEEK_OPTIONS.filter((w) => w.id !== "All").map((w, idx) => {
              const active = selectedWeeks.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleWeek(w.id)}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                  title={`${w.label} (Click to toggle)`}
                >
                  W{idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Multi-Week Badges with Dismiss */}
          {selectedWeeks.length > 0 && !selectedWeeks.includes("All") && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedWeeks.map((wId) => (
                <button
                  key={wId}
                  onClick={() => toggleWeek(wId)}
                  className="inline-flex items-center gap-1 text-xs text-purple-700 hover:text-white hover:bg-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 font-bold transition-all cursor-pointer shadow-2xs"
                  title={`Remove ${wId}`}
                >
                  <span>{wId}</span>
                  <span className="text-[10px] font-black">✕</span>
                </button>
              ))}
              {selectedWeeks.length > 1 && (
                <button
                  onClick={() => setSelectedWeeks([])}
                  className="text-[11px] text-purple-700 hover:underline font-bold px-1 cursor-pointer"
                  title="Clear all week filters"
                >
                  Clear ({selectedWeeks.length})
                </button>
              )}
            </div>
          )}

          {/* Active Subsidiary Reset Chip */}
          {selectedSubsidiary !== "All" && (
            <button
              onClick={() => onSelectSubsidiary && onSelectSubsidiary("All")}
              className="inline-flex items-center gap-1.5 text-xs text-[#034EA2] hover:text-white hover:bg-[#034EA2] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 font-bold transition-all cursor-pointer shadow-2xs"
              title="Reset to All Subsidiaries"
            >
              <span>Sub: {selectedSubsidiary}</span>
              <span className="text-[10px] font-black">✕</span>
            </button>
          )}
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
          {/* Section 1: Top Content Across All Channels */}
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <button
                onClick={() => toggleSection("overall")}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                title={collapsedSections["overall"] ? "Click to expand" : "Click to collapse"}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-amber-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                <span className="text-base font-bold text-slate-900 group-hover:text-[#034EA2] transition-colors">
                  Top Content Across All Channels
                </span>
                <span className="p-0.5 rounded text-slate-400 group-hover:text-[#034EA2] transition-colors">
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      collapsedSections["overall"] ? "-rotate-90" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            {!collapsedSections["overall"] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fadeIn">
                {top10Overall.map((video, idx) => renderVideoCard(video, idx + 1, "ov"))}
              </div>
            )}
          </div>

          {/* Section 2: Top Lifestyle Deliverables */}
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <button
                onClick={() => toggleSection("lifestyle")}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                title={collapsedSections["lifestyle"] ? "Click to expand" : "Click to collapse"}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-purple-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Top Lifestyle Deliverables (Team Galaxy, CC, Galaxy Circle)
                </span>
                <span className="p-0.5 rounded text-slate-400 group-hover:text-purple-700 transition-colors">
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      collapsedSections["lifestyle"] ? "-rotate-90" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            {!collapsedSections["lifestyle"] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fadeIn">
                {top10Lifestyle.map((video, idx) => renderVideoCard(video, idx + 1, "ls"))}
              </div>
            )}
          </div>

          {/* Section 3: Top Tech & Crossover Reviewers */}
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <button
                onClick={() => toggleSection("tech")}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                title={collapsedSections["tech"] ? "Click to expand" : "Click to collapse"}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-100 text-cyan-800 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                  Top Tech & Crossover Reviewers
                </span>
                <span className="p-0.5 rounded text-slate-400 group-hover:text-cyan-800 transition-colors">
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      collapsedSections["tech"] ? "-rotate-90" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <span className="text-xs text-[#034EA2] font-semibold">
                Ranked by {activeSortLabel}
              </span>
            </div>
            {!collapsedSections["tech"] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fadeIn">
                {top10Techies.map((video, idx) => renderVideoCard(video, idx + 1, "tc"))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ALL VIDEOS MODE */
        <div className="space-y-6">
          {/* Stream Category Filter Bar matching Top 10 Mode */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-[#034EA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Stream Filter:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Overall");
                  setAllViewLayout("streamFilter");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "Overall" && allViewLayout === "streamFilter"
                    ? "bg-[#034EA2] text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/80"
                }`}
              >
                Top Content Across All Channels ({categoryCounts.overall})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Lifestyle");
                  setAllViewLayout("streamFilter");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "Lifestyle" && allViewLayout === "streamFilter"
                    ? "bg-purple-600 text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/80"
                }`}
              >
                Top Lifestyle Deliverables ({categoryCounts.lifestyle})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Tech / Crossover");
                  setAllViewLayout("streamFilter");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "Tech / Crossover" && allViewLayout === "streamFilter"
                    ? "bg-cyan-700 text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/80"
                }`}
              >
                Top Tech & Crossover Reviewers ({categoryCounts.techies})
              </button>
            </div>

            {/* Layout Mode Toggle: Filtered Grid vs 3 Grouped Sections */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setAllViewLayout("streamFilter")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  allViewLayout === "streamFilter" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Filtered Grid
              </button>
              <button
                type="button"
                onClick={() => setAllViewLayout("groupedSections")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  allViewLayout === "groupedSections" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Grouped 3 Streams
              </button>
            </div>
          </div>

          {allViewLayout === "groupedSections" ? (
            /* GROUPED 3 SECTIONS FOR ALL RANKED CONTENT */
            <div className="space-y-8">
              {/* Stream 1: All Channels */}
              <div>
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
                  <button
                    onClick={() => toggleSection("all_overall")}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                    title={collapsedSections["all_overall"] ? "Click to expand" : "Click to collapse"}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-amber-800 text-xs">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </span>
                    <span className="text-base font-bold text-slate-900 group-hover:text-[#034EA2] transition-colors">
                      Top Content Across All Channels ({categoryCounts.overall} deliverables)
                    </span>
                    <span className="p-0.5 rounded text-slate-400 group-hover:text-[#034EA2] transition-colors">
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          collapsedSections["all_overall"] ? "-rotate-90" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <span className="text-xs text-[#034EA2] font-semibold">
                    Ranked by {activeSortLabel}
                  </span>
                </div>
                {!collapsedSections["all_overall"] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {filteredAllVideos.slice(0, visibleCount).map((v, idx) =>
                      renderVideoCard(v, idx + 1, "all-ov")
                    )}
                  </div>
                )}
              </div>

              {/* Stream 2: Lifestyle Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
                  <button
                    onClick={() => toggleSection("all_lifestyle")}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                    title={collapsedSections["all_lifestyle"] ? "Click to expand" : "Click to collapse"}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-purple-800 text-xs">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <span className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      Top Lifestyle Deliverables (Team Galaxy, CC, Galaxy Circle) ({categoryCounts.lifestyle} deliverables)
                    </span>
                    <span className="p-0.5 rounded text-slate-400 group-hover:text-purple-700 transition-colors">
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          collapsedSections["all_lifestyle"] ? "-rotate-90" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <span className="text-xs text-[#034EA2] font-semibold">
                    Ranked by {activeSortLabel}
                  </span>
                </div>
                {!collapsedSections["all_lifestyle"] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {allLifestyleVideos.slice(0, visibleCount).map((v, idx) =>
                      renderVideoCard(v, idx + 1, "all-ls")
                    )}
                  </div>
                )}
              </div>

              {/* Stream 3: Tech & Crossover Reviewers */}
              <div>
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
                  <button
                    onClick={() => toggleSection("all_tech")}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group text-left"
                    title={collapsedSections["all_tech"] ? "Click to expand" : "Click to collapse"}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-100 text-cyan-800 text-xs">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                      Top Tech & Crossover Reviewers ({categoryCounts.techies} deliverables)
                    </span>
                    <span className="p-0.5 rounded text-slate-400 group-hover:text-cyan-800 transition-colors">
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          collapsedSections["all_tech"] ? "-rotate-90" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <span className="text-xs text-[#034EA2] font-semibold">
                    Ranked by {activeSortLabel}
                  </span>
                </div>
                {!collapsedSections["all_tech"] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {allTechVideos.slice(0, visibleCount).map((v, idx) =>
                      renderVideoCard(v, idx + 1, "all-tc")
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* FILTERED UNIFIED GRID */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-600">
                  Showing {Math.min(visibleCount, filteredAllVideos.length)} of {filteredAllVideos.length} deliverables
                  {selectedCategory !== "Overall" && (
                    <span className="text-[#034EA2] font-bold ml-1">
                      in {selectedCategory === "Lifestyle" ? "Lifestyle Deliverables" : "Tech & Crossover"}
                    </span>
                  )}
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
      )}
    </div>
  );
}

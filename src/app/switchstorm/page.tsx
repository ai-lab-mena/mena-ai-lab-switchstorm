"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SubsidiaryMap from "./SubsidiaryMap";
import DataIngestionPanel from "./DataIngestionPanel";

interface GroupKPI {
  Category: string;
  "Creator Group": string;
  "Total Influencers": number;
  "Total Posts": number;
  "Total Potential Reach": number;
  "Total Views": number;
  "Total Engagements": number;
  "Overall ER (Eng / Reach)": number;
  "Overall ER (Eng / Views)": number;
  "Avg Post ER": number;
  "Overall ER (Eng / Reach) %": string;
  "Overall ER (Eng / Views) %": string;
  "Avg Post ER %": string;
}

interface RankedVideo {
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

interface CampaignData {
  run_date: string;
  campaign_kpis_by_group: GroupKPI[];
  top_performing_videos: RankedVideo[];
  all_ranked_videos?: RankedVideo[];
}

export default function SwitchStormDashboard() {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<string>("Overall");
  const [selectedCategory, setSelectedCategory] = useState<string>("Overall");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"groups" | "videos" | "ingestion">("groups");
  const [viewMode, setViewMode] = useState<"top10" | "all">("top10");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/data/latest_summary.json?t=${Date.now()}`);
      if (res.ok) {
        const json: CampaignData = await res.json();
        setData(json);
        setLastRefreshed(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (e) {
      console.error("Failed to load campaign data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const tabParam = p.get("tab");
      if (tabParam === "upload" || tabParam === "ingestion") {
        setActiveTab("ingestion");
      }
    }
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (key: string) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  const overallKPI = data?.campaign_kpis_by_group.find(
    (g) => g["Creator Group"] === "Total MENA (All Influencers)"
  );

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Subsidiary Stats Computation
  const subsidiaryStats = useMemo(() => {
    const list = data?.all_ranked_videos || [];
    const stats: Record<
      string,
      { views: number; posts: number; influencers: number; name: string }
    > = {};

    list.forEach((v) => {
      const s = v.Subsidiary || "Undefined";
      if (!stats[s]) {
        stats[s] = { views: 0, posts: 0, influencers: 0, name: s };
      }
      stats[s].views += v["Video Views"] || 0;
      stats[s].posts += 1;
    });

    const creatorsPerSub: Record<string, Set<string>> = {};
    list.forEach((v) => {
      const s = v.Subsidiary || "Undefined";
      if (!creatorsPerSub[s]) creatorsPerSub[s] = new Set();
      if (v["Influencer Name"]) creatorsPerSub[s].add(v["Influencer Name"]);
    });

    Object.keys(stats).forEach((s) => {
      stats[s].influencers = creatorsPerSub[s]?.size || 0;
    });

    return stats;
  }, [data]);

  // Dynamic Top 10 selector for any category, platform, and subsidiary
  const getTop10ForCategory = (categoryKey: string) => {
    const list = data?.all_ranked_videos || [];
    return list
      .filter((v) => {
        const matchPhase =
          selectedPhase === "Overall" ||
          selectedPhase === "All" ||
          v.Phase === selectedPhase;

        const matchCat =
          categoryKey === "Overall" ? true : v.Category === categoryKey;

        const matchPlatform =
          selectedPlatform === "All" ||
          v.Platform.toLowerCase() === selectedPlatform.toLowerCase();

        const matchSubsidiary =
          selectedSubsidiary === "All" ||
          (v.Subsidiary &&
            v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());

        return matchPhase && matchCat && matchPlatform && matchSubsidiary;
      })
      .slice(0, 10);
  };

  const top10Overall = useMemo(
    () => getTop10ForCategory("Overall"),
    [data, selectedPhase, selectedPlatform, selectedSubsidiary]
  );
  const top10Lifestyle = useMemo(
    () => getTop10ForCategory("Lifestyle"),
    [data, selectedPhase, selectedPlatform, selectedSubsidiary]
  );
  const top10Techies = useMemo(
    () => getTop10ForCategory("Tech / Crossover"),
    [data, selectedPhase, selectedPlatform, selectedSubsidiary]
  );

  // All Videos Ranked by Views (Descending)
  const filteredAllVideos = useMemo(() => {
    const list = data?.all_ranked_videos || [];
    return list.filter((v) => {
      const matchPhase =
        selectedPhase === "Overall" ||
        selectedPhase === "All" ||
        v.Phase === selectedPhase;

      const matchCat =
        selectedCategory === "Overall" ||
        selectedCategory === "All" ||
        v.Category === selectedCategory;

      const matchPlatform =
        selectedPlatform === "All" ||
        v.Platform.toLowerCase() === selectedPlatform.toLowerCase();

      const matchSubsidiary =
        selectedSubsidiary === "All" ||
        (v.Subsidiary &&
          v.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        v["Influencer Name"].toLowerCase().includes(q) ||
        (v.Handle && v.Handle.toLowerCase().includes(q)) ||
        (v.Subsidiary && v.Subsidiary.toLowerCase().includes(q)) ||
        (v["Post Title"] && v["Post Title"].toLowerCase().includes(q));

      return matchPhase && matchCat && matchPlatform && matchSubsidiary && matchQuery;
    });
  }, [data, selectedPhase, selectedCategory, selectedPlatform, selectedSubsidiary, searchQuery]);

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4 px-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="font-semibold tracking-wider text-slate-300">
            Loading SwitchStorm Campaign Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Reusable Video Card Component
  const renderVideoCard = (video: RankedVideo, rankNumber: number, sectionPrefix: string) => {
    const isRank1 = rankNumber === 1;
    const isRank2 = rankNumber === 2;
    const isRank3 = rankNumber === 3;
    const cardKey = `${sectionPrefix}-${video["Post URL"]}-${rankNumber}`;
    
    // Determine the optimal thumbnail URL
    let thumbUrl = video["Thumbnail URL"];

    if (video.Platform === "YouTube" && video["Post URL"]) {
      // YouTube allows direct cross-origin embedding from its public CDN
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
      // Meta (Instagram) and TikTok block direct browser hotlinking via CORP (Cross-Origin-Resource-Policy: same-origin)
      // or expiring tokens. We route them through our server-side API to stream the image bytes cleanly.
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
        className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300"
      >
        {/* Media Thumbnail */}
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
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-800 text-blue-400 mb-2 border border-slate-700 shadow-inner">
                {video.Platform === "Instagram" && (
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
                {video.Platform === "TikTok" && (
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.34 22a6.34 6.34 0 006.33-6.33V9.22a8.16 8.16 0 004.8 1.57V7.33a4.85 4.85 0 01-.88-.64z" />
                  </svg>
                )}
                {video.Platform === "YouTube" && (
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {video["Influencer Name"]}
              </span>
            </div>
          )}

          {/* Hover Play Icon */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Rank Badge */}
          <div
            className={`absolute top-2.5 left-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full font-bold text-xs shadow-md z-10 ${
              isRank1
                ? "bg-amber-400 text-slate-900 border-2 border-white ring-2 ring-amber-400/50"
                : isRank2
                ? "bg-slate-200 text-slate-800 border-2 border-white ring-2 ring-slate-300"
                : isRank3
                ? "bg-amber-700 text-white border-2 border-white ring-2 ring-amber-700/50"
                : "bg-slate-900/85 text-white"
            }`}
          >
            #{rankNumber}
          </div>

          {/* Platform Tag */}
          <div className="absolute top-2.5 right-2.5 rounded-md bg-slate-900/85 px-2 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-sm border border-slate-700 z-10">
            {video.Platform}
          </div>

          {/* Overlay Views & ER */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 sm:p-3 flex justify-between items-end text-white z-10">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block">
                Unified Views
              </span>
              <p className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow">
                {formatNumber(video["Video Views"])}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block">
                ER %
              </span>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 drop-shadow">
                {video["Engagement Rate %"]}
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                {video.Subsidiary}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
                {video["Creator Group"]}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-1">
              {video["Influencer Name"]}
            </h3>
            {video.Handle && (
              <p className="text-[11px] sm:text-xs text-slate-500 mb-1.5">@{video.Handle}</p>
            )}

            {video["Post Title"] && (
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 italic mb-2.5">
                "{video["Post Title"]}"
              </p>
            )}
          </div>

          {/* Stats & Link */}
          <div className="pt-2.5 border-t border-slate-100 mt-1">
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs mb-2.5 text-slate-600">
              <div>
                <span className="text-slate-400 text-[9px] sm:text-[10px] block">Engagements</span>
                <span className="font-semibold text-slate-800">
                  {formatNumber(video["Engagements Total"])}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] sm:text-[10px] block">Published Date</span>
                <span className="font-semibold text-slate-800">{video["Post Date"]}</span>
              </div>
            </div>

            <a
              href={video["Post URL"]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-50 hover:bg-[#034EA2] hover:text-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors border border-slate-200 shadow-xs"
            >
              View Original Post
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* 1. TOP BRAND HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#07132b]/95 backdrop-blur-md text-white shadow-lg">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="relative h-6 w-24 sm:h-7 sm:w-32 shrink-0">
              <Image
                src="/images/samsung_logo_white.png"
                alt="Samsung Logo"
                fill
                priority
                sizes="(max-width: 640px) 96px, 128px"
                className="object-contain object-left"
              />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
            <div>
              <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                <span>SwitchStorm</span>
                <span className="hidden xs:inline">Campaign Dashboard</span>
                <span className="rounded-full bg-blue-500/20 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-blue-400 border border-blue-500/30">
                  Live
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden md:block">
                #iSwitchedtoSamsung · Executive Intelligence & Multi-Phase Content Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right text-[10px] sm:text-xs hidden sm:block">
              <p className="text-slate-400">Snapshot</p>
              <p className="font-medium text-slate-200">
                {data?.run_date || "Live"} • {lastRefreshed || "Synced"}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("ingestion")}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold transition-all shadow-xs ${
                activeTab === "ingestion"
                  ? "bg-purple-600 text-white shadow-purple-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700"
              }`}
              title="Upload new Traackr Excel files"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Data Ingestion</span>
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:bg-blue-500 active:scale-95 transition-all"
            >
              <svg
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 2. ALWAYS-VISIBLE PERMANENT TOP SUMMARY LINE */}
        <div className="border-t border-slate-800 bg-[#0a1835] px-3 py-2 sm:px-6 lg:px-8 shadow-inner">
          <div className="mx-auto max-w-[1600px]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:gap-3 items-center">
              {/* Metric 1 */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/40 sm:bg-transparent p-1.5 sm:p-0 rounded-lg sm:rounded-none sm:border-r sm:border-slate-800/80 sm:pr-2">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
                    Total Reach
                  </span>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight truncate">
                    {formatNumber(overallKPI?.["Total Potential Reach"])}
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/40 sm:bg-transparent p-1.5 sm:p-0 rounded-lg sm:rounded-none sm:border-r sm:border-slate-800/80 sm:pr-2">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                      Total Views
                    </span>
                    <span className="rounded bg-emerald-500/20 px-1 text-[8px] font-semibold text-emerald-300 hidden sm:inline">
                      Unified
                    </span>
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-300 tracking-tight truncate">
                    {formatNumber(overallKPI?.["Total Views"])}
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/40 sm:bg-transparent p-1.5 sm:p-0 rounded-lg sm:rounded-none sm:border-r sm:border-slate-800/80 sm:pr-2">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
                    Engagements
                  </span>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight truncate">
                    {formatNumber(overallKPI?.["Total Engagements"])}
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/40 sm:bg-transparent p-1.5 sm:p-0 rounded-lg sm:rounded-none sm:border-r sm:border-slate-800/80 sm:pr-2">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
                    Overall MENA ER
                  </span>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-amber-300 tracking-tight truncate">
                    {overallKPI?.["Overall ER (Eng / Reach) %"]}
                    <span className="text-[9px] sm:text-[10px] font-normal text-slate-400 ml-1 hidden xs:inline">
                      ({overallKPI?.["Overall ER (Eng / Views) %"]})
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-center gap-2 sm:gap-2.5 bg-slate-900/40 sm:bg-transparent p-1.5 sm:p-0 rounded-lg sm:rounded-none">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
                    Total Volume
                  </span>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight truncate">
                    {overallKPI?.["Total Posts"]}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      posts ({overallKPI?.["Total Influencers"]} creators)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {/* Geographic Subsidiary Map Filter */}
        <SubsidiaryMap
          selectedSubsidiary={selectedSubsidiary}
          onSelectSubsidiary={setSelectedSubsidiary}
          subsidiaryStats={subsidiaryStats}
          totalViews={overallKPI?.["Total Views"] || 201762791}
          totalPosts={overallKPI?.["Total Posts"] || 1340}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-3 sm:pb-4 mb-5 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "groups"
                  ? "bg-[#034EA2] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Creator Groups & KPI Breakdown
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "videos"
                  ? "bg-[#034EA2] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Top Performing Content
            </button>
            <button
              onClick={() => setActiveTab("ingestion")}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "ingestion"
                  ? "bg-[#034EA2] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Data Ingestion
            </button>
          </div>

          {activeTab === "videos" && (
            <div className="flex flex-wrap items-center gap-2">
              {/* VIEW MODE TOGGLE (TOP 10 vs ALL VIDEOS) */}
              <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs font-bold shadow-inner">
                <button
                  onClick={() => setViewMode("top10")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-all ${
                    viewMode === "top10"
                      ? "bg-white text-[#034EA2] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>★</span>
                  <span>Top 10 Showcase</span>
                </button>
                <button
                  onClick={() => setViewMode("all")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-all ${
                    viewMode === "all"
                      ? "bg-[#034EA2] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>View All Ranked ({data?.all_ranked_videos?.length || 887})</span>
                </button>
              </div>

              {/* Phase Filter */}
              <div className="flex items-center rounded-lg bg-white p-1 border border-slate-200 shadow-sm text-xs">
                {["Overall", "Phase 1", "Phase 2", "Phase 3"].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phase)}
                    className={`rounded-md px-2.5 sm:px-3 py-1 font-semibold whitespace-nowrap transition-all ${
                      selectedPhase === phase
                        ? "bg-[#034EA2] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>

              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Platforms</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: TOP PERFORMING CONTENT */}
        {activeTab === "videos" && (
          <div>
            {/* CATEGORY SWITCHER PILLS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Creator Category:
                </span>
                <button
                  onClick={() => setSelectedCategory("Overall")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === "Overall"
                      ? "bg-[#034EA2] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Categories ({viewMode === "top10" ? "Show All Categories" : "Overall"})
                </button>
                <button
                  onClick={() => setSelectedCategory("Lifestyle")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === "Lifestyle"
                      ? "bg-purple-700 text-white shadow-xs"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                  }`}
                >
                  <span>Lifestyle Only (CC, GT, GC)</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("Tech / Crossover")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === "Tech / Crossover"
                      ? "bg-cyan-700 text-white shadow-xs"
                      : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200"
                  }`}
                >
                  <span>Techies & Crossovers Only</span>
                </button>
              </div>

              {/* Search box if in "All Videos" mode */}
              {viewMode === "all" && (
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creator, handle, sub..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* MODE A: TOP 10 SHOWCASE (STACKED TOP 10 SECTIONS) */}
            {viewMode === "top10" ? (
              <div className="space-y-10">
                {/* 1. OVERALL TOP 10 SECTION */}
                {(selectedCategory === "Overall" || selectedCategory === "All") && (
                  <div>
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400 text-slate-900 text-xs shadow-xs">
                            🏆
                          </span>
                          <span>
                            Top 10 Content {selectedPlatform !== "All" ? `on ${selectedPlatform}` : ""}{" "}
                            {selectedSubsidiary !== "All" ? `in ${selectedSubsidiary}` : "Across All Platforms"}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#034EA2]">
                            {selectedSubsidiary !== "All" ? `${selectedSubsidiary} Market` : "Overall MENA (All Creators)"}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedPhase === "Overall"
                            ? "Entire Campaign Window (Sep 07 – Sep 28)"
                            : `${selectedPhase} Timeline`}{" "}
                          • Highest unified video views
                        </p>
                      </div>
                    </div>

                    {top10Overall.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {top10Overall.map((video, idx) =>
                          renderVideoCard(video, idx + 1, "ov")
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white p-8 text-center border border-slate-200 text-slate-500 text-xs">
                        No videos found matching the selected platform and phase.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. LIFESTYLE INFLUENCERS TOP 10 (CC, GT, GC) */}
                {(selectedCategory === "Overall" || selectedCategory === "Lifestyle") && (
                  <div>
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-white text-xs shadow-xs">
                            🎨
                          </span>
                          <span>
                            Top 10 Lifestyle Creators {selectedPlatform !== "All" ? `on ${selectedPlatform}` : ""}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Content Creators, Galaxy Team, Galaxy Circle
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedPhase === "Overall"
                            ? "Entire Campaign Window (Sep 07 – Sep 28)"
                            : `${selectedPhase} Timeline`}{" "}
                          • Lifestyle influencer performance
                        </p>
                      </div>
                    </div>

                    {top10Lifestyle.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {top10Lifestyle.map((video, idx) =>
                          renderVideoCard(video, idx + 1, "ls")
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white p-8 text-center border border-slate-200 text-slate-500 text-xs">
                        No lifestyle videos found on {selectedPlatform} for {selectedPhase}.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TECHIES & CROSSOVERS TOP 10 */}
                {(selectedCategory === "Overall" || selectedCategory === "Tech / Crossover") && (
                  <div>
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-600 text-white text-xs shadow-xs">
                            ⚡
                          </span>
                          <span>
                            Top 10 Tech & Crossover Creators {selectedPlatform !== "All" ? `on ${selectedPlatform}` : ""}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                            Tech Influencers & Crossovers
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedPhase === "Overall"
                            ? "Entire Campaign Window (Sep 07 – Sep 28)"
                            : `${selectedPhase} Timeline`}{" "}
                          • Tech & spec comparison content
                        </p>
                      </div>
                    </div>

                    {top10Techies.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {top10Techies.map((video, idx) =>
                          renderVideoCard(video, idx + 1, "tc")
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white p-8 text-center border border-slate-200 text-slate-500 text-xs">
                        No techie videos found on {selectedPlatform} for {selectedPhase}.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* MODE B: VIEW ALL VIDEOS (RANKED MOST TO LEAST VIEWED) */
              <div>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Complete Video Ranking</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#034EA2]">
                        {selectedCategory === "Overall"
                          ? "All Categories"
                          : selectedCategory === "Lifestyle"
                          ? "Lifestyle (CC, GT, GC)"
                          : "Techies & Crossovers"}
                      </span>
                      <span className="text-xs font-normal text-slate-500">
                        ({filteredAllVideos.length} videos ranked from most to least viewed)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedPhase === "Overall" && "Entire Campaign Window (Sep 07 – Sep 28)"}
                      {selectedPhase === "Phase 1" && "Phase 1: Launch Phase (Sep 07 – Sep 10)"}
                      {selectedPhase === "Phase 2" && "Phase 2: Momentum Phase (Sep 11 – Sep 20)"}
                      {selectedPhase === "Phase 3" && "Phase 3: Active Ongoing Phase (Sep 21 – Sep 28)"}
                      {selectedPlatform !== "All" && ` • Filtered by ${selectedPlatform}`}
                    </p>
                  </div>
                </div>

                {filteredAllVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredAllVideos.slice(0, visibleCount).map((video, idx) => {
                      const rankNum = video.Overall_Rank || idx + 1;
                      return renderVideoCard(video, rankNum, "all");
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl bg-white p-12 text-center border border-slate-200 text-slate-500 text-xs">
                    No videos found matching your filters and search query.
                  </div>
                )}

                {/* Load More Button */}
                {visibleCount < filteredAllVideos.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="rounded-xl bg-[#034EA2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3 shadow-md hover:shadow-lg transition-all"
                    >
                      Load More Videos ({filteredAllVideos.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATOR GROUPS & PERFORMANCE BREAKDOWN */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Performance by Creator Segment & Category
                </h2>
                <p className="text-xs text-slate-500">
                  Detailed macro breakdown comparing Tech & Crossover, Lifestyle, and Undefined influencers.
                </p>
              </div>
            </div>

            {/* Comprehensive Table */}
            <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                  <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 font-semibold sticky left-0 bg-[#034EA2] z-10 shadow-r">
                        Creator Segment
                      </th>
                      <th className="px-2 sm:px-3 py-3 text-right font-semibold">Creators</th>
                      <th className="px-2 sm:px-3 py-3 text-right font-semibold">Posts</th>
                      <th className="px-3 sm:px-4 py-3 text-right font-semibold">Total Reach</th>
                      <th className="px-3 sm:px-4 py-3 text-right font-semibold">Total Views</th>
                      <th className="px-3 sm:px-4 py-3 text-right font-semibold">Engagements</th>
                      <th className="px-2 sm:px-3 py-3 text-right font-semibold">ER (Reach)</th>
                      <th className="px-2 sm:px-3 py-3 text-right font-semibold">ER (Views)</th>
                      <th className="px-2 sm:px-3 py-3 text-right font-semibold">Avg Post ER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.campaign_kpis_by_group.map((row, idx) => {
                      const isTotal = row["Creator Group"].includes("Total MENA");
                      const isSubtotal = row["Creator Group"].startsWith("Total ");
                      const isChild = row["Creator Group"].startsWith("  - ");

                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isTotal
                              ? "bg-blue-50/80 font-bold text-[#034EA2]"
                              : isSubtotal
                              ? "bg-slate-50 font-semibold text-slate-900"
                              : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td
                            className={`px-3 sm:px-4 py-3 sticky left-0 z-10 ${
                              isTotal
                                ? "bg-blue-50 font-bold text-[#034EA2]"
                                : isSubtotal
                                ? "bg-slate-50 font-semibold text-slate-900"
                                : "bg-white text-slate-700"
                            } ${isChild ? "pl-6 sm:pl-8 text-slate-600" : ""}`}
                          >
                            {row["Creator Group"]}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-right font-medium">
                            {row["Total Influencers"]}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-right font-medium">{row["Total Posts"]}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-medium">
                            {formatNumber(row["Total Potential Reach"])}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-bold text-slate-900">
                            {formatNumber(row["Total Views"])}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-medium">
                            {formatNumber(row["Total Engagements"])}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-right font-semibold text-amber-700">
                            {row["Overall ER (Eng / Reach) %"]}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-right font-semibold text-emerald-700">
                            {row["Overall ER (Eng / Views) %"]}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-right text-slate-500">
                            {row["Avg Post ER %"]}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Insights Cards */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Category Views Distribution</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Lifestyle vs. Techies vs. Undefined contribution to 138.5M views
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Lifestyle Creators (Team Galaxy & Creators)</span>
                      <span>106.5M Views (76.8%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "76.8%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Tech & Crossover Creators</span>
                      <span>23.5M Views (17.0%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: "17.0%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Undefined / Unmatched Creators</span>
                      <span>8.5M Views (6.2%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: "6.2%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Engagement Velocity & Rates</h3>
                <p className="text-xs text-slate-500 mb-4">Overall Engagement Rate comparisons across groups</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="p-2.5 sm:p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase block">
                      Lifestyle ER
                    </span>
                    <p className="text-base sm:text-lg font-bold text-blue-900">1.16%</p>
                    <span className="text-[8px] sm:text-[9px] text-blue-500">2.63% by Views</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-cyan-50 border border-cyan-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-cyan-700 uppercase block">
                      Techies ER
                    </span>
                    <p className="text-base sm:text-lg font-bold text-cyan-900">0.43%</p>
                    <span className="text-[8px] sm:text-[9px] text-cyan-600">2.30% by Views</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase block">
                      Galaxy Team
                    </span>
                    <p className="text-base sm:text-lg font-bold text-emerald-900">1.41%</p>
                    <span className="text-[8px] sm:text-[9px] text-emerald-600">Top Category</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA INGESTION & LOCAL SYNC (SUB-PAGE) */}
        {activeTab === "ingestion" && (
          <div className="space-y-6">
            <DataIngestionPanel />
          </div>
        )}
      </main>
    </div>
  );
}

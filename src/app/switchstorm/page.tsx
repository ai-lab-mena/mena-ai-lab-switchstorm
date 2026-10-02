"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SubsidiaryMap from "./SubsidiaryMap";

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
  "Post URL": string;
  "Influencer Name": string;
  Handle: string;
  Subsidiary: string;
  Platform: string;
  "Video Views": number;
  "Engagements Total": number;
  "Engagement Rate %": string;
  "Thumbnail URL": string | null;
}

interface CampaignData {
  run_date: string;
  campaign_kpis_by_group: GroupKPI[];
  top_performing_videos: RankedVideo[];
  all_ranked_videos?: RankedVideo[];
}

export default function SwitchStormExecutiveHub() {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>("All");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const overallKPI = data?.campaign_kpis_by_group.find(
    (g) => g["Creator Group"] === "Total MENA (All Influencers)"
  );

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Subsidiary statistics for the map
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

  const activeSubParam = selectedSubsidiary !== "All" ? `?sub=${encodeURIComponent(selectedSubsidiary)}` : "";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. EXECUTIVE TITLE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative h-7 w-24">
                <Image
                  src="/images/samsung_logo_white.png"
                  alt="Samsung Logo"
                  fill
                  priority
                  sizes="96px"
                  className="object-contain object-left"
                />
              </div>
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30">
                SwitchStorm Intelligence Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Samsung MENA Regional Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-platform performance analytics, subsidiary targets, device allocations, and content showcase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                Updated: {lastRefreshed}
              </span>
            )}
            <Link
              href="/switchstorm/upload"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#034EA2] hover:bg-blue-600 text-white px-4 py-2 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>📤 Upload Data</span>
            </Link>
          </div>
        </div>

        {/* Macro Scorecard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Creators</span>
            <div className="text-lg font-black text-white mt-0.5">297</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Posts</span>
            <div className="text-lg font-black text-white mt-0.5">1,340</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Potential Reach</span>
            <div className="text-lg font-black text-blue-400 mt-0.5">512.8M</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unified Views</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">201.8M</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Engagements</span>
            <div className="text-lg font-black text-purple-400 mt-0.5">4.96M</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Overall ER</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">2.46%</div>
          </div>
        </div>
      </div>

      {/* 2. REAL GEOGRAPHIC MAP SECTION */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🗺️</span>
              <span>Interactive MENA Subsidiary Map</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any market pin or territory to focus regional performance and pre-filter all sub-pages.
            </p>
          </div>

          {selectedSubsidiary !== "All" && (
            <button
              onClick={() => setSelectedSubsidiary("All")}
              className="text-xs font-bold text-[#034EA2] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>✕ Clear Filter ({selectedSubsidiary})</span>
            </button>
          )}
        </div>

        <SubsidiaryMap
          selectedSubsidiary={selectedSubsidiary}
          onSelectSubsidiary={setSelectedSubsidiary}
          subsidiaryStats={subsidiaryStats}
          totalViews={overallKPI ? overallKPI["Total Views"] : 201800000}
          totalPosts={overallKPI ? overallKPI["Total Posts"] : 1340}
        />
      </div>

      {/* 3. SUB-PAGE NAVIGATION PORTAL CARDS (REQUESTED CORE FEATURE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>⚡</span>
              <span>Explore Campaign Intelligence Modules</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select a specialized intelligence module below.
              {selectedSubsidiary !== "All" && (
                <span className="text-[#034EA2] font-semibold ml-1">
                  (Pre-filtered for {selectedSubsidiary} market)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Creator Groups & Regional KPIs */}
          <Link
            href={`/switchstorm/kpis${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#034EA2] border border-blue-200 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-xl">📊</span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-full">
                  KPI Breakdown
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#034EA2] transition-colors">
                Creator Groups & KPIs
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Comprehensive performance matrix across Tech, Crossover, Lifestyle, and Advocate tiers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#034EA2]">
              <span>Explore Group KPIs</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Top Performing Content Showcase */}
          <Link
            href={`/switchstorm/content${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-xl">🎬</span>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
                  784 Videos Ranked
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Top Performing Content
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dynamic Top 10 Showcase, local media thumbnails, video view leaderboards, and deep engagement analytics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>View Video Showcase</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Techies Targets & Devices */}
          <Link
            href={`/switchstorm/techies${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-cyan-400 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-xl">📱</span>
                </div>
                <span className="text-[11px] font-bold text-cyan-800 bg-cyan-100/60 px-2.5 py-1 rounded-full">
                  Hardware Tracking
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Techies Targets & Devices
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Galaxy S26 Ultra vs. Z Fold8 hardware scorecards, target vs. actual pacing, and 77 tech reviewers matrix.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
              <span>Open Hardware Intelligence</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Lifestyle Targets & Creators */}
          <Link
            href={`/switchstorm/lifestyle${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-xl">⭐</span>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100/60 px-2.5 py-1 rounded-full">
                  220 Creators
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Lifestyle Targets & Creators
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Weekly flighting pacing (Weeks 1 to 4), Team Galaxy vs. Content Creators fulfillment, and 220 creator phase links.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Open Lifestyle Intelligence</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 5: Data Ingestion Portal */}
          <Link
            href="/switchstorm/upload"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-xl">📤</span>
                </div>
                <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                  Data Pipeline
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                Campaign Data Ingestion
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Upload raw Traackr deliverables to update 1_InputData and auto-trigger the backend data pipeline.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>Launch Ingestion Portal</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

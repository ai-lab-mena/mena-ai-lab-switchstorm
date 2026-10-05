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
  subsidiary_stats?: Record<string, { views: number; posts: number; influencers: number; name: string }>;
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

  // Subsidiary statistics for the map (directly from verified data model across ALL 1,605 posts)
  const subsidiaryStats = useMemo(() => {
    if (data?.subsidiary_stats && Object.keys(data.subsidiary_stats).length > 0) {
      return data.subsidiary_stats;
    }

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
                SwitchStorm Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Samsung MENA Regional Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Performance metrics, subsidiary targets, device seeding distribution, and content leaderboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                Updated: {lastRefreshed}
              </span>
            )}
          </div>
        </div>

        {/* Macro Scorecard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Creators</span>
            <div className="text-lg font-black text-white mt-0.5 tabular-nums">
              {overallKPI ? overallKPI["Total Influencers"] : "319"}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Deliverables</span>
            <div className="text-lg font-black text-white mt-0.5 tabular-nums">
              {overallKPI ? overallKPI["Total Posts"].toLocaleString() : "1,605"}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Potential Reach</span>
            <div className="text-lg font-black text-blue-400 mt-0.5 tabular-nums">
              {overallKPI ? formatNumber(overallKPI["Total Potential Reach"]) : "624.2M"}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unified Views</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5 tabular-nums">
              {overallKPI ? formatNumber(overallKPI["Total Views"]) : "236.7M"}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Engagements</span>
            <div className="text-lg font-black text-purple-400 mt-0.5 tabular-nums">
              {overallKPI ? formatNumber(overallKPI["Total Engagements"]) : "5.72M"}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Overall ER</span>
            <div className="text-lg font-black text-amber-400 mt-0.5 tabular-nums">
              {overallKPI ? overallKPI["Overall ER (Eng / Views) %"] : "2.42%"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL GEOGRAPHIC MAP SECTION */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#034EA2]/10 text-[#034EA2] border border-[#034EA2]/20">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </span>
              <span>Regional Market Distribution</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any market pin or territory to focus regional performance and pre-filter all sub-pages.
            </p>
          </div>

          {selectedSubsidiary !== "All" && (
            <button
              onClick={() => setSelectedSubsidiary("All")}
              className="text-xs font-semibold text-[#034EA2] hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
            >
              <span>✕ Clear Filter ({selectedSubsidiary})</span>
            </button>
          )}
        </div>

        <SubsidiaryMap
          selectedSubsidiary={selectedSubsidiary}
          onSelectSubsidiary={setSelectedSubsidiary}
          subsidiaryStats={subsidiaryStats}
          totalViews={overallKPI ? overallKPI["Total Views"] : 236730380}
          totalPosts={overallKPI ? overallKPI["Total Posts"] : 1605}
        />
      </div>

      {/* 3. SUB-PAGE NAVIGATION PORTAL CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </span>
              <span>Campaign Intelligence Modules</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a specialized intelligence module to review deep-dive metrics.
              {selectedSubsidiary !== "All" && (
                <span className="text-[#034EA2] font-semibold ml-1">
                  (Pre-filtered for {selectedSubsidiary} market)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Creator Groups & Regional KPIs */}
          <Link
            href={`/switchstorm/kpis${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-[#034EA2]/50 hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#034EA2] border border-blue-200/70 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Performance Matrix
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#034EA2] transition-colors">
                Creator Groups & KPIs
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Consolidated performance metrics across Tech, Crossover, Lifestyle, and Advocate tiers with cross-platform ER.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#034EA2]">
              <span>Explore Group KPIs</span>
              <span className="transform group-hover:translate-x-1 transition-transform text-sm">→</span>
            </div>
          </Link>

          {/* Card 2: Top Performing Content Showcase */}
          <Link
            href={`/switchstorm/content${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-amber-400/60 hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Top Videos
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Top Performing Content
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dynamic Top 10 Showcase, local media thumbnails, video view leaderboards, and deep engagement analytics.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>View Video Showcase</span>
              <span className="transform group-hover:translate-x-1 transition-transform text-sm">→</span>
            </div>
          </Link>

          {/* Card 3: Techies Targets & Devices */}
          <Link
            href={`/switchstorm/techies${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-cyan-400/60 hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200/70 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Hardware Seeding
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                Tech Deliverables & Devices
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Galaxy S26 Ultra vs. Z Fold8 hardware scorecards, target vs. actual pacing, and 77 tech reviewers matrix.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-800">
              <span>Open Hardware Tracking</span>
              <span className="transform group-hover:translate-x-1 transition-transform text-sm">→</span>
            </div>
          </Link>

          {/* Card 4: Lifestyle Targets & Creators */}
          <Link
            href={`/switchstorm/lifestyle${activeSubParam}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-purple-400/60 hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  220 Creators
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Lifestyle Deliverables
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Weekly flighting pacing (Weeks 1 to 4), Team Galaxy vs. Content Creators fulfillment, and 220 creator phase links.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Open Lifestyle Tracking</span>
              <span className="transform group-hover:translate-x-1 transition-transform text-sm">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

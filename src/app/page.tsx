"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface CampaignData {
  run_date: string;
  campaign_kpis_by_group: Array<{
    "Creator Group": string;
    "Total Influencers": number;
    "Total Posts": number;
    "Total Potential Reach": number;
    "Total Views": number;
    "Total Engagements": number;
    "Overall ER (Eng / Reach) %": string;
    "Overall ER (Eng / Views) %": string;
  }>;
}

export default function HomePortal() {
  const [data, setData] = useState<CampaignData | null>(null);

  useEffect(() => {
    fetch(`/data/latest_summary.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Portal data load error:", err));
  }, []);

  const overall = data?.campaign_kpis_by_group.find(
    (g) => g["Creator Group"] === "Total MENA (All Influencers)"
  );

  const formatNumber = (num: number | undefined) => {
    if (!num) return "—";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* 1. TOP HERO HEADER */}
      <section className="bg-gradient-to-br from-[#07132b] via-[#0a1b3f] to-[#042055] text-white border-b border-slate-800 shadow-xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative h-7 w-28 sm:w-36">
                  <Image
                    src="/images/samsung_logo_white.png"
                    alt="Samsung Logo"
                    fill
                    priority
                    sizes="144px"
                    className="object-contain object-left"
                  />
                </div>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/30">
                  MENA Marketing AI Lab
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Marketing Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Centralized hub for automated data pipelines, creator performance intelligence,
                and real-time executive dashboards across all Samsung MENA markets.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0">
              <div className="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/10 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                  Active Projects
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">1 Live</span>
                <span className="text-[10px] text-slate-300 block">3 In Roadmap</span>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/10 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                  Pipeline Status
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[10px] text-slate-300 block">Automated & Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTAL BODY */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 space-y-10">
        {/* ACTIVE PROJECT SHOWCASE: SWITCHSTORM */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Active Campaign Dashboards</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h2>
              <p className="text-xs text-slate-500">Live, interactive reporting applications with automated batch data sync.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 group">
            {/* Top Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#034EA2] via-[#0070D2] to-[#00A9E0]"></div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#034EA2] border border-blue-200">
                      Featured Project
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Production Live
                    </span>
                    <span className="text-xs text-slate-400">Updated {data?.run_date || "Daily"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#034EA2] transition-colors">
                    SwitchStorm Campaign Intelligence Dashboard
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    Executive multi-market intelligence tracking the #iSwitchedToSamsung campaign across 8 MENA subsidiaries.
                    Features real video thumbnails, automated deep-engagement ranking, and phase-by-phase performance across
                    Techies and Lifestyle creators.
                  </p>

                  {/* Metrics Pill Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Reach</span>
                      <span className="text-base sm:text-lg font-bold text-slate-900">
                        {formatNumber(overall?.["Total Potential Reach"])}
                      </span>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Unified Views</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-600">
                        {formatNumber(overall?.["Total Views"])}
                      </span>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Engagements</span>
                      <span className="text-base sm:text-lg font-bold text-purple-700">
                        {formatNumber(overall?.["Total Engagements"])}
                      </span>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Tracked Posts</span>
                      <span className="text-base sm:text-lg font-bold text-[#034EA2]">
                        {overall?.["Total Posts"] || 969}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Launch CTA */}
                <div className="shrink-0 flex flex-col items-stretch sm:items-center justify-center">
                  <Link
                    href="/switchstorm"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#034EA2] hover:bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-center"
                  >
                    <span>Launch SwitchStorm Dashboard</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <span className="text-[10px] text-slate-400 mt-2 text-center">Direct Route: /switchstorm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LAB ROADMAP / FUTURE INITIATIVES */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Upcoming AI Lab Projects & Capabilities
            </h2>
            <p className="text-xs text-slate-500">Scheduled modules expanding the Samsung MENA marketing technology suite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Project 1 */}
            <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#034EA2]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    Phase 2 Roadmap
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Creator Performance & ROI Predictor
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Machine learning model estimating post views, engagement lift, and audience conversion affinity before influencer contracting.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Machine Learning</span>
                <span className="font-semibold text-slate-500">Coming Soon</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    Phase 2 Roadmap
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  MENA Social Sentiment & Competitive Radar
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time sentiment and market voice tracking comparing Galaxy devices against competing flagships across GCC and Levant.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>NLP Intelligence</span>
                <span className="font-semibold text-slate-500">Coming Soon</span>
              </div>
            </div>

            {/* Project 3 */}
            <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    Phase 3 Roadmap
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Creative Video Hook Evaluator
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Computer vision analyzing video thumbnails, opening hooks, and visual retention cues to optimize content guidelines.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Computer Vision</span>
                <span className="font-semibold text-slate-500">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

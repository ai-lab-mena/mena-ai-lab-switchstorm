"use client";

import React, { useState, useMemo } from "react";
import {
  STATIC_LIFESTYLE_WEEKLY_PACING,
  STATIC_LIFESTYLE_SUBSIDIARY_TARGETS,
  STATIC_LIFESTYLE_CREATOR_MATRIX,
  STATIC_LIFESTYLE_TIER_SCORECARD,
} from "./lifestyleData";

export interface TierScorecard {
  Tier: string;
  Target_Plan: number;
  Live_Delivered: number;
  Pending: number;
  Completion_Rate: string;
  Description: string;
}

export interface WeeklyPacing {
  Week: string;
  Total_Plan: number;
  Total_Live: number;
  Total_Pending: number;
  TeamGalaxy: { Plan: number; Live: number; Pending: number };
  ContentCreators: { Plan: number; Live: number; Pending: number };
  GalaxyCircle: { Plan: number; Live: number; Pending: number };
  Completion_Rate: string;
}

export interface LifestyleSubTarget {
  Subsidiary: string;
  Market: string;
  Plan: number;
  Live: number;
  Pending: number;
  TeamGalaxy: { Plan: number; Live: number };
  ContentCreators: { Plan: number; Live: number };
  GalaxyCircle: { Plan: number; Live: number };
  Completion_Rate: string;
  Status: string;
}

export interface PhasePost {
  URL: string;
  Platform: string;
  Date: string;
  Views: number;
  Engagements: number;
}

export interface LifestyleCreator {
  Name: string;
  Handle: string;
  Subsidiary: string | number;
  Total_Posts: number;
  Total_Views: number;
  Total_Engagements: number;
  Week_1?: PhasePost | null;
  Week_2?: PhasePost | null;
  Week_3?: PhasePost | null;
  Week_4?: PhasePost | null;
  Phase_1?: PhasePost | null;
  Phase_2?: PhasePost | null;
  Phase_3?: PhasePost | null;
}

interface LifestyleIntelligenceTabProps {
  tierScorecard: TierScorecard[];
  weeklyPacing: WeeklyPacing[];
  subsidiaryTargets: LifestyleSubTarget[];
  creatorMatrix: LifestyleCreator[];
  selectedSubsidiary: string;
  onSelectSubsidiary: (sub: string) => void;
}

export default function LifestyleIntelligenceTab({
  tierScorecard,
  weeklyPacing,
  subsidiaryTargets,
  creatorMatrix,
  selectedSubsidiary,
  onSelectSubsidiary,
}: LifestyleIntelligenceTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const resolvedTiers =
    tierScorecard && tierScorecard.length > 0
      ? tierScorecard
      : STATIC_LIFESTYLE_TIER_SCORECARD;

  const resolvedPacing =
    weeklyPacing && weeklyPacing.length > 0
      ? weeklyPacing
      : STATIC_LIFESTYLE_WEEKLY_PACING;

  const resolvedTargets =
    subsidiaryTargets && subsidiaryTargets.length > 0
      ? subsidiaryTargets
      : STATIC_LIFESTYLE_SUBSIDIARY_TARGETS;

  const resolvedCreators =
    creatorMatrix && creatorMatrix.length > 0
      ? creatorMatrix
      : STATIC_LIFESTYLE_CREATOR_MATRIX;

  const formatShort = (val: number | undefined) => {
    if (!val) return "0";
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toString();
  };

  // Filtered Creators Matrix
  const filteredCreators = useMemo(() => {
    return resolvedCreators.filter((c) => {
      const matchSub =
        selectedSubsidiary === "All" ||
        (c.Subsidiary && String(c.Subsidiary).toUpperCase() === selectedSubsidiary.toUpperCase());

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(c.Name).toLowerCase().includes(q) ||
        String(c.Handle).toLowerCase().includes(q) ||
        String(c.Subsidiary).toLowerCase().includes(q);

      return matchSub && matchQuery;
    });
  }, [resolvedCreators, selectedSubsidiary, searchQuery]);

  // Filtered Targets
  const filteredTargets = useMemo(() => {
    if (selectedSubsidiary === "All") return resolvedTargets;
    return resolvedTargets.filter((t) => {
      const cleanSub = t.Subsidiary.toUpperCase();
      const targetSub = selectedSubsidiary.toUpperCase();
      return cleanSub === targetSub || cleanSub.includes(targetSub);
    });
  }, [resolvedTargets, selectedSubsidiary]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TIER ALLOCATION SCORECARD */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600/10 text-purple-700 border border-purple-600/20">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              <span>Lifestyle Tier Target vs. Actual Delivery</span>
            </h3>
            <p className="text-xs text-slate-500">
              Contracted campaign deliverables tracking from master agency tracker across Team Galaxy, Content Creators, and Galaxy Circle.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Overall Delivery:</span>
            <span className="font-extrabold text-emerald-700">474 / 560 Live (84.6%)</span>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tierScorecard.map((tier) => {
            const isTG = tier.Tier.includes("Team Galaxy");
            const isCC = tier.Tier.includes("Content Creators");

            return (
              <div
                key={tier.Tier}
                className="rounded-2xl p-5 border bg-white border-slate-200 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      isTG
                        ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                        : isCC
                        ? "bg-blue-500/10 text-blue-700 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                    }`}
                  >
                    {tier.Tier}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {tier.Completion_Rate} Delivered
                  </span>
                </div>

                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {tier.Live_Delivered}{" "}
                    <span className="text-sm font-semibold text-slate-400">
                      / {tier.Target_Plan} Planned
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tier.Description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">
                      Pending Deliverables
                    </span>
                    <span className="font-bold text-amber-600">
                      {tier.Pending} Posts Remaining
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTG ? "bg-purple-600" : isCC ? "bg-blue-600" : "bg-emerald-600"
                      }`}
                      style={{ width: tier.Completion_Rate }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. WEEKLY PACING TIMELINE (WEEKS 1 - 4) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-slate-700 text-xs">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <span>Weekly Flighting & Rollout Schedule (Weeks 1 – 4)</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Weekly planned vs. live deliverables pacing across the 4 flight phases of the campaign.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weeklyPacing.map((w) => {
            const isW4 = w.Week.includes("4");
            return (
              <div
                key={w.Week}
                className={`p-3.5 rounded-xl border ${
                  isW4
                    ? "bg-amber-50/50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">{w.Week}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {w.Week.includes("1")
                        ? "Sep 7 – Sep 13"
                        : w.Week.includes("2")
                        ? "Sep 14 – Sep 20"
                        : w.Week.includes("3")
                        ? "Sep 21 – Sep 27"
                        : "Sep 28 – Oct 4"}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      parseFloat(w.Completion_Rate) >= 90
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {w.Completion_Rate}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-800 mb-1">
                  {w.Total_Live}{" "}
                  <span className="text-xs font-semibold text-slate-400">
                    / {w.Total_Plan} Posts
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60">
                  <div>TG: {w.TeamGalaxy.Live}/{w.TeamGalaxy.Plan}</div>
                  <div>CC: {w.ContentCreators.Live}/{w.ContentCreators.Plan}</div>
                  {w.GalaxyCircle.Plan > 0 && (
                    <div>GC: {w.GalaxyCircle.Live}/{w.GalaxyCircle.Plan}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TARGET VS ACTUAL DELIVERABLES TABLE (BY SUBSIDIARY) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-emerald-800 text-xs">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>Lifestyle Subsidiary Progress (Target vs. Actual)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Deliverables fulfillment across SGE, SESAR, SETK, SEPAK, SEEG, SELV, SEMAG, and SEIL.
            </p>
          </div>

          {selectedSubsidiary !== "All" && (
            <button
              onClick={() => onSelectSubsidiary("All")}
              className="text-xs text-[#034EA2] hover:underline font-semibold cursor-pointer"
            >
              Clear Territory Filter ({selectedSubsidiary})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[800px]">
            <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold">Subsidiary / Market</th>
                <th className="px-3 py-3 text-center font-semibold">Target Plan</th>
                <th className="px-3 py-3 text-center font-semibold">Live Delivered</th>
                <th className="px-3 py-3 text-center font-semibold">Pending</th>
                <th className="px-3 py-3 text-center font-semibold">Completion %</th>
                <th className="px-3 py-3 text-center font-semibold">Team Galaxy</th>
                <th className="px-3 py-3 text-center font-semibold">Content Creators</th>
                <th className="px-3 py-3 text-center font-semibold">Galaxy Circle</th>
                <th className="px-3 py-3 text-center font-semibold">Pacing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTargets.map((row) => (
                <tr key={row.Subsidiary} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 sm:px-4 py-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 text-[#034EA2] px-2 py-0.5 text-xs font-extrabold">
                        {row.Subsidiary}
                      </span>
                      <span className="text-slate-600 font-medium">{row.Market}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-800 tabular-nums">
                    {row.Plan}
                  </td>
                  <td className="px-3 py-3 text-center font-extrabold text-emerald-700 tabular-nums">
                    {row.Live}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-amber-600 tabular-nums">
                    {row.Pending}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block font-extrabold px-2 py-0.5 rounded text-[11px] tabular-nums ${
                        parseFloat(row.Completion_Rate) >= 90
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : parseFloat(row.Completion_Rate) >= 70
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {row.Completion_Rate}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 tabular-nums">
                    {row.TeamGalaxy.Live} / {row.TeamGalaxy.Plan}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 tabular-nums">
                    {row.ContentCreators.Live} / {row.ContentCreators.Plan}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 tabular-nums">
                    {row.GalaxyCircle.Live} / {row.GalaxyCircle.Plan}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        row.Status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.Status === "On Track"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {row.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LIFESTYLE CREATOR DELIVERABLE MATRIX & PHASE POST LINKS */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-purple-700 text-xs">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </span>
              <span>Lifestyle Creators Deliverable Matrix & Phase Post Links</span>
            </h3>
            <p className="text-xs text-slate-500">
              Catalog of all 220 lifestyle creators with direct clickable permalinks for each phase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search creator, handle, subsidiary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-64 shadow-2xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[950px]">
            <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold">Creator & Handle</th>
                <th className="px-2 py-3 text-center font-semibold">Sub</th>
                <th className="px-3 py-3 text-center font-semibold">Deliverables</th>
                <th className="px-3 py-3 text-right font-semibold">Total Views</th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Week 1 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 7 – Sep 13</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Week 2 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 14 – Sep 20</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Week 3 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 21 – Sep 27</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Week 4 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 28 – Oct 4+</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCreators.map((c) => (
                <tr key={c.Name} className="hover:bg-slate-50/80 transition-colors">
                  {/* Creator */}
                  <td className="px-3 sm:px-4 py-3 font-semibold text-slate-900">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{c.Name}</span>
                      <span className="text-[11px] text-slate-400">@{c.Handle}</span>
                    </div>
                  </td>

                  {/* Sub */}
                  <td className="px-2 py-3 text-center">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-800 text-[10px]">
                      {c.Subsidiary}
                    </span>
                  </td>

                  {/* Total Posts */}
                  <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">
                    {c.Total_Posts} Posts
                  </td>

                  {/* Total Views */}
                  <td className="px-3 py-3 text-right font-extrabold text-slate-900 tabular-nums">
                    {c.Total_Views.toLocaleString()}
                  </td>

                  {/* Week 1 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Week_1 ? (
                      <a
                        href={c.Week_1.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#034EA2] px-2.5 py-1 text-[11px] font-semibold border border-blue-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Week_1.Platform} • ${c.Week_1.Views.toLocaleString()} views`}
                      >
                        <span>Week 1</span>
                        <span className="text-[10px] text-blue-600 font-normal">({formatShort(c.Week_1.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>

                  {/* Week 2 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Week_2 ? (
                      <a
                        href={c.Week_2.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 px-2.5 py-1 text-[11px] font-semibold border border-purple-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Week_2.Platform} • ${c.Week_2.Views.toLocaleString()} views`}
                      >
                        <span>Week 2</span>
                        <span className="text-[10px] text-purple-600 font-normal">({formatShort(c.Week_2.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>

                  {/* Week 3 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Week_3 ? (
                      <a
                        href={c.Week_3.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-700 px-2.5 py-1 text-[11px] font-semibold border border-pink-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Week_3.Platform} • ${c.Week_3.Views.toLocaleString()} views`}
                      >
                        <span>Week 3</span>
                        <span className="text-[10px] text-pink-600 font-normal">({formatShort(c.Week_3.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>

                  {/* Week 4 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Week_4 ? (
                      <a
                        href={c.Week_4.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 text-[11px] font-semibold border border-amber-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Week_4.Platform} • ${c.Week_4.Views.toLocaleString()} views (Flight W4 & ongoing)`}
                      >
                        <span>Week 4</span>
                        <span className="text-[10px] text-amber-700 font-normal">({formatShort(c.Week_4.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import ExecutiveEmailModal from "./ExecutiveEmailModal";
import {
  STATIC_TECHIES_DEVICE_SUMMARY,
  STATIC_TECHIES_INFLUENCER_MATRIX,
  STATIC_TECHIES_TARGETS_SUMMARY,
} from "./techiesData";

export interface DeviceSummary {
  Device: string;
  Creators_Count: number;
  Total_Posts: number;
  Total_Views: number;
  Total_Engagements: number;
  ER_Percent: string;
}

export interface PhasePost {
  URL: string;
  Platform: string;
  Date: string;
  Views: number;
  Engagements: number;
}

export interface TechieCreator {
  Name: string;
  Handle: string;
  Subsidiary: string;
  Device: string;
  Tier: string;
  Total_Posts: number;
  Total_Views: number;
  Phase_1: PhasePost | null;
  Phase_2: PhasePost | null;
  Phase_3: PhasePost | null;
}

export interface TargetActual {
  Subsidiary: string;
  Market: string;
  Profiles_Planned: number;
  Post_1: { Plan: number; Live: number; Completion: string };
  Post_2: { Plan: number; Live: number; WIP?: number; Completion: string };
  Post_3: { Plan: number; Live: number; WIP?: number; Completion: string };
  Status: string;
  Notes: string;
}

interface TechiesIntelligenceTabProps {
  deviceSummary: DeviceSummary[];
  influencerMatrix: TechieCreator[];
  targetsVsActual: TargetActual[];
  selectedSubsidiary: string;
  onSelectSubsidiary: (sub: string) => void;
}

export default function TechiesIntelligenceTab({
  deviceSummary,
  influencerMatrix,
  targetsVsActual,
  selectedSubsidiary,
  onSelectSubsidiary,
}: TechiesIntelligenceTabProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const resolvedDevices =
    deviceSummary && deviceSummary.length > 0
      ? deviceSummary
      : STATIC_TECHIES_DEVICE_SUMMARY;

  const resolvedCreators =
    influencerMatrix && influencerMatrix.length > 0
      ? influencerMatrix
      : STATIC_TECHIES_INFLUENCER_MATRIX;

  const resolvedTargets =
    targetsVsActual && targetsVsActual.length > 0
      ? targetsVsActual
      : STATIC_TECHIES_TARGETS_SUMMARY;

  const formatNumber = (val: number | undefined) => {
    if (!val) return "0";
    return val.toLocaleString();
  };

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

      const matchDev =
        selectedDevice === "All" ||
        String(c.Device).toLowerCase() === selectedDevice.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(c.Name).toLowerCase().includes(q) ||
        String(c.Handle).toLowerCase().includes(q) ||
        String(c.Subsidiary).toLowerCase().includes(q);

      return matchSub && matchDev && matchQuery;
    });
  }, [resolvedCreators, selectedSubsidiary, selectedDevice, searchQuery]);

  // Filtered Targets
  const filteredTargets = useMemo(() => {
    if (selectedSubsidiary === "All") return resolvedTargets;
    return resolvedTargets.filter(
      (t) => t.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase()
    );
  }, [resolvedTargets, selectedSubsidiary]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. DEVICE ALLOCATION & IMPACT SCORECARD */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600/10 text-cyan-700 border border-cyan-600/20">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <span>Techies Device Allocation & Performance Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">
              Contracted hardware seeding mapping from master Techies roster (Galaxy S26 Ultra vs. Z Fold8 Series).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Device:</span>
            <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-bold shadow-inner">
              {["All", "Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Fold8 Ultra"].map(
                (dev) => (
                  <button
                    key={dev}
                    onClick={() => setSelectedDevice(dev)}
                    className={`rounded-md px-2.5 py-1 transition-all ${
                      selectedDevice === dev
                        ? "bg-white text-cyan-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {dev === "All" ? "All Devices" : dev.replace("Galaxy ", "")}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Device Scorecard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {deviceSummary.map((dev) => {
            const isS26 = dev.Device.includes("S26");
            const isFoldUltra = dev.Device.includes("Ultra") && !isS26;
            const isFold8 = !isS26 && !isFoldUltra;
            const isSelected = selectedDevice === dev.Device;

            return (
              <div
                key={dev.Device}
                onClick={() =>
                  setSelectedDevice(selectedDevice === dev.Device ? "All" : dev.Device)
                }
                className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                  isSelected
                    ? "bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 text-white border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg"
                    : "bg-white border-slate-200 hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                        : isS26
                        ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        : isFoldUltra
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                    }`}
                  >
                    {dev.Device}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? "text-cyan-200" : "text-slate-400"}`}>
                    {dev.Creators_Count} Creators
                  </span>
                </div>

                <div className="mb-3">
                  <div
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isSelected ? "text-white" : "text-slate-900 group-hover:text-cyan-600"
                    }`}
                  >
                    {formatShort(dev.Total_Views)}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      isSelected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {dev.Total_Views.toLocaleString()} Total Views
                  </div>
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 pt-3 border-t text-xs ${
                    isSelected ? "border-slate-800" : "border-slate-100"
                  }`}
                >
                  <div>
                    <span
                      className={`block text-[10px] uppercase font-bold ${
                        isSelected ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      Deliverables
                    </span>
                    <span
                      className={`font-bold ${
                        isSelected ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {dev.Total_Posts} Posts
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block text-[10px] uppercase font-bold ${
                        isSelected ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      Avg Post ER
                    </span>
                    <span
                      className={`font-bold ${
                        isSelected ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      {dev.ER_Percent}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. EXECUTIVE ESCALATION COMMAND BAR */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#034EA2]/95 to-slate-900 p-4 sm:p-5 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-300 border border-white/15 shadow-inner shrink-0">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Executive Action Dispatch Center
              </span>
              <span className="rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                Samsung Knox Mail
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated escalation brief summarizing delayed and WIP deliverables across SETK, SEMAG, SELV, and SEIL for leadership review.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 text-xs font-extrabold transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0 border border-white/20 active:scale-98 group"
        >
          <svg className="h-4 w-4 text-[#034EA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Open Knox Mail Briefing</span>
          <span className="rounded-md bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">
            4 Escalations
          </span>
        </button>
      </div>

      {/* 3. TARGET VS ACTUAL DELIVERABLES TABLE (FROM TragetvsActual_Techies.xlsx) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-emerald-800 text-xs">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>Techies Target vs. Actual Campaign Progress</span>
            </h3>
            <p className="text-xs text-slate-500">
              Audit status by subsidiary across Post 1 (Teasing), Post 2 (Momentum), and Post 3 (Ongoing).
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
                <th className="px-3 py-3 text-center font-semibold">Planned Profiles</th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Post #1 Status</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 7 – Sep 10</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Post #2 Status</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 11 – Sep 20</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Post #3 Status</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 21 – Sep 28</div>
                </th>
                <th className="px-3 py-3 text-center font-semibold">Pacing</th>
                <th className="px-4 py-3 font-semibold">Agency Action Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTargets.map((row) => {
                const isCompleted = row.Status === "Completed";
                const isActionReq = row.Status === "Action Required";
                const isDelayed = row.Status === "Delayed";

                return (
                  <tr key={row.Subsidiary} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 sm:px-4 py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-100 text-[#034EA2] px-2 py-0.5 text-xs font-extrabold">
                          {row.Subsidiary}
                        </span>
                        <span className="text-slate-600 font-medium">{row.Market}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-800">
                      {row.Profiles_Planned}
                    </td>

                    {/* Post 1 */}
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span>✓ {row.Post_1.Live}/{row.Post_1.Plan}</span>
                        <span className="text-[10px] opacity-75">({row.Post_1.Completion})</span>
                      </div>
                    </td>

                    {/* Post 2 */}
                    <td className="px-3 py-3 text-center">
                      <div
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border ${
                          row.Post_2.Completion === "100%"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        <span>{row.Post_2.Live}/{row.Post_2.Plan}</span>
                        <span className="text-[10px] opacity-75">({row.Post_2.Completion})</span>
                      </div>
                    </td>

                    {/* Post 3 */}
                    <td className="px-3 py-3 text-center">
                      <div
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border ${
                          row.Post_3.Completion === "100%"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : isDelayed
                            ? "text-slate-500 bg-slate-100 border-slate-200"
                            : "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        <span>{row.Post_3.Live}/{row.Post_3.Plan}</span>
                        <span className="text-[10px] opacity-75">({row.Post_3.Completion})</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isActionReq
                            ? "bg-rose-100 text-rose-800"
                            : isDelayed
                            ? "bg-slate-200 text-slate-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {row.Status}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3 text-slate-500 font-medium text-[11px]">
                      {row.Notes || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. INFLUENCER DETAIL MATRIX WITH PHASE POST URLS */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-[#034EA2] text-xs">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </span>
              <span>Tech Creators Deliverable Matrix & Phase Post Links</span>
            </h3>
            <p className="text-xs text-slate-500">
              Complete catalog of all 77 tech reviewers with mapped hardware and direct clickable permalinks for each phase.
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
          <table className="w-full text-left text-xs text-slate-700 min-w-[900px]">
            <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold">Creator & Handle</th>
                <th className="px-2 py-3 text-center font-semibold">Sub</th>
                <th className="px-3 py-3 font-semibold">Assigned Device</th>
                <th className="px-3 py-3 text-right font-semibold">Total Views</th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Phase 1 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 7 – Sep 10</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Phase 2 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 11 – Sep 20</div>
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">
                  <div>Phase 3 Post</div>
                  <div className="text-[9px] font-normal text-blue-100 opacity-90 mt-0.5 normal-case">Sep 21 – Sep 28</div>
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

                  {/* Device */}
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        c.Device.includes("S26")
                          ? "bg-blue-100 text-blue-800"
                          : c.Device.includes("Ultra")
                          ? "bg-amber-100 text-amber-900"
                          : "bg-purple-100 text-purple-900"
                      }`}
                    >
                      {c.Device}
                    </span>
                  </td>

                  {/* Total Views */}
                  <td className="px-3 py-3 text-right font-extrabold text-slate-900 tabular-nums">
                    {c.Total_Views.toLocaleString()}
                  </td>

                  {/* Phase 1 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Phase_1 ? (
                      <a
                        href={c.Phase_1.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#034EA2] px-2.5 py-1 text-[11px] font-semibold border border-blue-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Phase_1.Platform} • ${c.Phase_1.Views.toLocaleString()} views`}
                      >
                        <span>Phase 1</span>
                        <span className="text-[10px] text-blue-600 font-normal">({formatShort(c.Phase_1.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>

                  {/* Phase 2 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Phase_2 ? (
                      <a
                        href={c.Phase_2.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 text-[11px] font-semibold border border-indigo-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Phase_2.Platform} • ${c.Phase_2.Views.toLocaleString()} views`}
                      >
                        <span>Phase 2</span>
                        <span className="text-[10px] text-indigo-600 font-normal">({formatShort(c.Phase_2.Views)})</span>
                        <span className="text-[9px] transform group-hover/p:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 font-mono">—</span>
                    )}
                  </td>

                  {/* Phase 3 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Phase_3 ? (
                      <a
                        href={c.Phase_3.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 px-2.5 py-1 text-[11px] font-semibold border border-purple-200/80 transition-colors shadow-2xs group/p"
                        title={`${c.Phase_3.Platform} • ${c.Phase_3.Views.toLocaleString()} views`}
                      >
                        <span>Phase 3</span>
                        <span className="text-[10px] text-purple-600 font-normal">({formatShort(c.Phase_3.Views)})</span>
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

      {/* Executive Email Escalation Dispatch Modal */}
      <ExecutiveEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        streamFilter="Tech Reviewers"
      />
    </div>
  );
}

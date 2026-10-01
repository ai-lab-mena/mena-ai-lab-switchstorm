"use client";

import React, { useState, useMemo } from "react";

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
    return influencerMatrix.filter((c) => {
      const matchSub =
        selectedSubsidiary === "All" ||
        (c.Subsidiary && c.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase());

      const matchDev =
        selectedDevice === "All" ||
        c.Device.toLowerCase() === selectedDevice.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.Name.toLowerCase().includes(q) ||
        c.Handle.toLowerCase().includes(q) ||
        c.Subsidiary.toLowerCase().includes(q);

      return matchSub && matchDev && matchQuery;
    });
  }, [influencerMatrix, selectedSubsidiary, selectedDevice, searchQuery]);

  // Filtered Targets
  const filteredTargets = useMemo(() => {
    if (selectedSubsidiary === "All") return targetsVsActual;
    return targetsVsActual.filter(
      (t) => t.Subsidiary.toUpperCase() === selectedSubsidiary.toUpperCase()
    );
  }, [targetsVsActual, selectedSubsidiary]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. DEVICE ALLOCATION & IMPACT SCORECARD */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-600 text-white text-xs shadow-xs">
                📱
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

            return (
              <div
                key={dev.Device}
                onClick={() =>
                  setSelectedDevice(selectedDevice === dev.Device ? "All" : dev.Device)
                }
                className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                  selectedDevice === dev.Device
                    ? "bg-gradient-to-br from-cyan-900 to-slate-900 text-white border-cyan-400 ring-2 ring-cyan-400/30"
                    : "bg-white border-slate-200 hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      isS26
                        ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        : isFoldUltra
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                    }`}
                  >
                    {dev.Device}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {dev.Creators_Count} Creators
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-cyan-600">
                    {formatShort(dev.Total_Views)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {dev.Total_Views.toLocaleString()} Total Views
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Deliverables
                    </span>
                    <span className="font-bold text-slate-800">{dev.Total_Posts} Posts</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Avg Post ER
                    </span>
                    <span className="font-bold text-emerald-600">{dev.ER_Percent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TARGET VS ACTUAL DELIVERABLES TABLE (FROM TragetvsActual_Techies.xlsx) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-white text-[10px]">
                🎯
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
              className="text-xs text-[#034EA2] hover:underline font-semibold"
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
                <th className="px-3 py-3 text-center font-semibold">Post #1 Status</th>
                <th className="px-3 py-3 text-center font-semibold">Post #2 Status</th>
                <th className="px-3 py-3 text-center font-semibold">Post #3 Status</th>
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
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-600 text-white text-[10px]">
                🔗
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
                <th className="px-3 py-3 text-center font-semibold">Phase 1 Post</th>
                <th className="px-3 py-3 text-center font-semibold">Phase 2 Post</th>
                <th className="px-3 py-3 text-center font-semibold">Phase 3 Post</th>
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
                  <td className="px-3 py-3 text-right font-extrabold text-slate-900">
                    {c.Total_Views.toLocaleString()}
                  </td>

                  {/* Phase 1 Deliverable Link */}
                  <td className="px-3 py-3 text-center">
                    {c.Phase_1 ? (
                      <a
                        href={c.Phase_1.URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-blue-50 hover:bg-blue-100 text-[#034EA2] px-2 py-1 text-[11px] font-bold border border-blue-200 transition-colors shadow-2xs"
                        title={`${c.Phase_1.Platform} • ${c.Phase_1.Views.toLocaleString()} views`}
                      >
                        <span>🔗 P1</span>
                        <span className="text-[9px] text-blue-600">({formatShort(c.Phase_1.Views)})</span>
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
                        className="inline-flex items-center gap-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 text-[11px] font-bold border border-indigo-200 transition-colors shadow-2xs"
                        title={`${c.Phase_2.Platform} • ${c.Phase_2.Views.toLocaleString()} views`}
                      >
                        <span>🔗 P2</span>
                        <span className="text-[9px] text-indigo-600">({formatShort(c.Phase_2.Views)})</span>
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
                        className="inline-flex items-center gap-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 text-[11px] font-bold border border-purple-200 transition-colors shadow-2xs"
                        title={`${c.Phase_3.Platform} • ${c.Phase_3.Views.toLocaleString()} views`}
                      >
                        <span>🔗 P3</span>
                        <span className="text-[9px] text-purple-600">({formatShort(c.Phase_3.Views)})</span>
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

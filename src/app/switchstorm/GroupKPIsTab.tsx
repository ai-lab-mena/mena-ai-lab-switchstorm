"use client";

import React from "react";

export interface GroupKPI {
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

interface GroupKPIsTabProps {
  kpis: GroupKPI[];
  selectedSubsidiary?: string;
}

export default function GroupKPIsTab({ kpis, selectedSubsidiary }: GroupKPIsTabProps) {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#034EA2]/10 text-[#034EA2] border border-[#034EA2]/20">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span>Creator Groups & Cross-Platform Metrics</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Performance breakdown across Tech, Crossover, Lifestyle, and Advocate tiers.
            </p>
          </div>
          {selectedSubsidiary && selectedSubsidiary !== "All" && (
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-[#034EA2] rounded-full border border-blue-200/80 self-start sm:self-auto">
              Territory: {selectedSubsidiary}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[720px]">
            <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold">Creator Category</th>
                <th className="px-3 py-3 text-center font-semibold">Influencers</th>
                <th className="px-3 py-3 text-center font-semibold">Deliverables</th>
                <th className="px-3 py-3 text-right font-semibold">
                  <span title="Cumulative follower reach across unique creators">
                    Potential Reach
                  </span>
                </th>
                <th className="px-3 py-3 text-right font-semibold">
                  <span title="Cross-platform video plays across TikTok, Instagram, and YouTube">
                    Unified Views
                  </span>
                </th>
                <th className="px-3 py-3 text-right font-semibold">
                  <span title="Sum of Likes, Comments, Shares, and Saves">
                    Engagements
                  </span>
                </th>
                <th className="px-3 py-3 text-center font-semibold">
                  <span title="Total Engagements ÷ Potential Reach">
                    ER (Reach)
                  </span>
                </th>
                <th className="px-3 py-3 text-center font-semibold">
                  <span title="Total Engagements ÷ Total Views">
                    ER (Views)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kpis.map((row, idx) => {
                const isTotal = row["Creator Group"].includes("Total MENA");
                const isSubtotal = row["Creator Group"].startsWith("Total ");
                const isChild = row["Creator Group"].startsWith("  - ");

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isTotal
                        ? "bg-blue-50/80 font-bold text-slate-900 border-t-2 border-b-2 border-blue-200/80"
                        : isSubtotal
                        ? "bg-slate-50/90 font-bold text-slate-800"
                        : isChild
                        ? "hover:bg-slate-50/60 text-slate-600 pl-4"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className={`px-3 sm:px-4 py-3 ${isChild ? "pl-8 text-slate-500 font-medium" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        {isTotal && (
                          <span className="rounded bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 uppercase">
                            MENA
                          </span>
                        )}
                        {isSubtotal && !isTotal && (
                          <svg className="h-3 w-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        <span>{row["Creator Group"].replace("  - ", "")}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-semibold tabular-nums">
                      {row["Total Influencers"]}
                    </td>
                    <td className="px-3 py-3 text-center font-semibold tabular-nums">
                      {row["Total Posts"]}
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">
                      {formatNumber(row["Total Potential Reach"])}
                    </td>
                    <td className="px-3 py-3 text-right font-extrabold text-slate-900 font-mono tabular-nums">
                      {formatNumber(row["Total Views"])}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                      {formatNumber(row["Total Engagements"])}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {row["Overall ER (Eng / Reach) %"]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block font-extrabold px-2 py-0.5 rounded text-[11px] tabular-nums ${
                          parseFloat(row["Overall ER (Eng / Views) %"]) > 2.5
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {row["Overall ER (Eng / Views) %"]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

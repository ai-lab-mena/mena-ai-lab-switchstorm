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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#034EA2] text-white text-xs shadow-xs">
                📊
              </span>
              <span>Creator Groups & Cross-Platform Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">
              Macro campaign performance across Tech, Crossover, Lifestyle, and Advocate tiers.
            </p>
          </div>
          {selectedSubsidiary && selectedSubsidiary !== "All" && (
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-[#034EA2] rounded-full border border-blue-200">
              Territory: {selectedSubsidiary}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
            <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-semibold">Creator Group</th>
                <th className="px-3 py-3 text-center font-semibold">Influencers</th>
                <th className="px-3 py-3 text-center font-semibold">Total Posts</th>
                <th className="px-3 py-3 text-right font-semibold">Potential Reach</th>
                <th className="px-3 py-3 text-right font-semibold">Total Views</th>
                <th className="px-3 py-3 text-right font-semibold">Engagements</th>
                <th className="px-3 py-3 text-center font-semibold">ER (Reach)</th>
                <th className="px-3 py-3 text-center font-semibold">ER (Views)</th>
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
                        ? "bg-blue-50/80 font-bold text-slate-900 border-t-2 border-b-2 border-blue-200"
                        : isSubtotal
                        ? "bg-slate-50/90 font-bold text-slate-800"
                        : isChild
                        ? "hover:bg-slate-50/60 text-slate-600 pl-4"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className={`px-3 sm:px-4 py-3 ${isChild ? "pl-8 text-slate-500 font-medium" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        {isTotal && <span className="text-blue-600 font-extrabold">★</span>}
                        {isSubtotal && !isTotal && <span className="text-slate-400">↳</span>}
                        <span>{row["Creator Group"].replace("  - ", "")}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-semibold">
                      {row["Total Influencers"]}
                    </td>
                    <td className="px-3 py-3 text-center font-semibold">
                      {row["Total Posts"]}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {formatNumber(row["Total Potential Reach"])}
                    </td>
                    <td className="px-3 py-3 text-right font-extrabold text-slate-900 font-mono">
                      {formatNumber(row["Total Views"])}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-700 font-semibold">
                      {formatNumber(row["Total Engagements"])}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-semibold text-slate-700">
                        {row["Overall ER (Eng / Reach) %"]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block font-extrabold px-2 py-0.5 rounded text-[11px] ${
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

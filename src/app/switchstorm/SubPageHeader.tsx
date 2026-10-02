"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubPageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  selectedSubsidiary?: string;
}

export default function SubPageHeader({
  title,
  subtitle,
  badge,
  selectedSubsidiary,
}: SubPageHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "🗺️ Map & Command Center", href: "/switchstorm" },
    { label: "📊 Creator Groups & KPIs", href: "/switchstorm/kpis" },
    { label: "🎬 Content Showcase", href: "/switchstorm/content" },
    { label: "📱 Techies Targets & Devices", href: "/switchstorm/techies" },
    { label: "⭐ Lifestyle Targets & Creators", href: "/switchstorm/lifestyle" },
    { label: "📤 Data Ingestion", href: "/switchstorm/upload" },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Top Breadcrumb & Return to Map */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
          <Link
            href="/switchstorm"
            className="hover:text-[#034EA2] transition-colors flex items-center gap-1 font-bold text-slate-700"
          >
            <span>← Regional Map Hub</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#034EA2] font-semibold truncate">{title}</span>
        </div>

        {selectedSubsidiary && selectedSubsidiary !== "All" && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Territory Filter:</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold text-[#034EA2] border border-blue-200">
              {selectedSubsidiary}
            </span>
          </div>
        )}
      </div>

      {/* Title & Description Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {title}
            </h1>
            {badge && (
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">{subtitle}</p>
        </div>

        {/* Quick jump back to map button */}
        <Link
          href="/switchstorm"
          className="self-start md:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
        >
          <span>🗺️ Back to Map</span>
        </Link>
      </div>

      {/* Sub-Page Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3.5 py-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#034EA2] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

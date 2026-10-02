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
    {
      label: "Overview & Map",
      href: "/switchstorm",
      tooltip: "Regional map and executive summary",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      label: "Groups & KPIs",
      href: "/switchstorm/kpis",
      tooltip: "Macro metrics by creator category",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Content Performance",
      href: "/switchstorm/content",
      tooltip: "Video ranking leaderboards and media previews",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Tech Deliverables",
      href: "/switchstorm/techies",
      tooltip: "Hardware tracking and reviewer delivery status",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Lifestyle Deliverables",
      href: "/switchstorm/lifestyle",
      tooltip: "Weekly pacing and ambassador fulfillment matrix",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Data Ingestion",
      href: "/switchstorm/upload",
      tooltip: "Upload new Traackr spreadsheets and refresh data",
      icon: (
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
  ];

  return (
    <header className="mb-6 space-y-4">
      {/* Top Breadcrumb & Return to Map */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate" aria-label="Breadcrumb">
          <Link
            href="/switchstorm"
            className="hover:text-[#034EA2] transition-colors flex items-center gap-1.5 font-bold text-slate-700 group"
          >
            <svg className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Regional Overview</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#034EA2] font-semibold truncate">{title}</span>
        </nav>

        {selectedSubsidiary && selectedSubsidiary !== "All" && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Active Territory:</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold text-[#034EA2] border border-blue-200/80">
              {selectedSubsidiary}
            </span>
          </div>
        )}
      </div>

      {/* Title & Description Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {badge && (
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{subtitle}</p>
        </div>

        <Link
          href="/switchstorm"
          className="self-start md:self-auto inline-flex items-center gap-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 px-3.5 py-2 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Return to Map</span>
        </Link>
      </div>

      {/* Sub-Page Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`rounded-lg px-3.5 py-2 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#034EA2] text-white shadow-2xs font-bold"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>

              {/* Tooltip on Hover */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30">
                <div className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg whitespace-nowrap border border-slate-800">
                  {item.tooltip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isSwitchStorm = pathname.startsWith("/switchstorm");
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* MOBILE TOP BAR WITH HAMBURGER */}
      <div className="lg:hidden flex items-center justify-between bg-[#07132b] text-white px-4 py-3 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="relative h-6 w-24">
            <Image
              src="/images/samsung_logo_white.png"
              alt="Samsung Logo"
              fill
              priority
              sizes="96px"
              className="object-contain object-left"
            />
          </div>
          <span className="text-xs font-bold text-blue-400 border-l border-slate-700 pl-2">AI Lab MENA</span>
        </div>

        <Link
          href="/switchstorm"
          className="rounded-lg bg-[#034EA2] px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <span>SwitchStorm</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </Link>
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-[#07132b] text-white border-r border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-slate-800/80 flex items-center shrink-0 h-16 transition-all ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-6 w-24 shrink-0">
                <Image
                  src="/images/samsung_logo_white.png"
                  alt="Samsung Logo"
                  fill
                  priority
                  sizes="96px"
                  className="object-contain object-left"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
                  AI Lab MENA
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Marketing Intel</span>
              </div>
            </Link>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-4 w-4 transform transition-transform ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Group */}
          <div>
            {!isCollapsed && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 block mb-2">
                Platform
              </span>
            )}
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isHome
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                title="AI Lab Portal Hub"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!isCollapsed && <span>AI Lab Portal Hub</span>}
              </Link>
            </nav>
          </div>

          {/* Active Projects */}
          <div>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Campaign Projects
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              </div>
            )}
            <nav className="space-y-1">
              {/* SwitchStorm Dashboard Link */}
              <Link
                href="/switchstorm"
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isSwitchStorm
                    ? "bg-[#034EA2] text-white shadow-md border border-blue-400/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                title="SwitchStorm Dashboard"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    isSwitchStorm ? "bg-blue-500 text-white" : "bg-slate-800 text-blue-400 group-hover:bg-slate-700"
                  }`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  {!isCollapsed && (
                    <div className="truncate">
                      <span className="block font-bold truncate">SwitchStorm</span>
                      <span className="text-[10px] text-slate-400 block font-normal">Campaign Analytics</span>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                )}
              </Link>

              {/* Data Ingestion Link */}
              <Link
                href="/switchstorm/upload"
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  pathname === "/switchstorm/upload"
                    ? "bg-[#034EA2] text-white shadow-md border border-blue-400/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                title="Data Ingestion Sub-Page"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    pathname === "/switchstorm/upload" ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  {!isCollapsed && (
                    <div className="truncate">
                      <span className="block font-medium truncate">Data Ingestion</span>
                      <span className="text-[10px] text-slate-500 block font-normal">Upload Excel Files</span>
                    </div>
                  )}
                </div>
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-slate-800/80 bg-[#061025] shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1">
              <span className="truncate">Samsung MENA DX</span>
              <span className="font-semibold text-blue-400">2026</span>
            </div>
          ) : (
            <div className="flex justify-center text-[10px] text-slate-500 font-bold">DX</div>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

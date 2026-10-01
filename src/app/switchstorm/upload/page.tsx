"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import DataIngestionPanel from "../DataIngestionPanel";

export default function SwitchStormUploadSubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. SwitchStorm Sub-Page Header */}
      <header className="border-b border-slate-800 bg-[#07132b] px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/switchstorm" className="relative h-6 w-24 shrink-0 hover:opacity-90 transition-opacity">
              <Image
                src="/images/samsung_logo_white.png"
                alt="Samsung Logo"
                fill
                priority
                sizes="96px"
                className="object-contain object-left"
              />
            </Link>

            <div className="border-l border-slate-700 pl-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/switchstorm"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  SwitchStorm
                </Link>
                <span className="text-xs text-slate-600">/</span>
                <span className="text-xs font-bold text-white">Data Ingestion</span>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/20">
                  Sub-Page
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                SwitchStorm Campaign Ingestion & Synchronization
              </h1>
            </div>
          </div>

          <Link
            href="/switchstorm"
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 border border-slate-700 shadow-xs"
          >
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Sub-Page Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-8">
        <DataIngestionPanel />
      </main>
    </div>
  );
}

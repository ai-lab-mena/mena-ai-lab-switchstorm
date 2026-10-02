"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SubPageHeader from "../SubPageHeader";
import TechiesIntelligenceTab from "../TechiesIntelligenceTab";
import {
  STATIC_TECHIES_DEVICE_SUMMARY,
  STATIC_TECHIES_INFLUENCER_MATRIX,
  STATIC_TECHIES_TARGETS_SUMMARY,
} from "../techiesData";

function TechiesPageContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get("sub") || "All";
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>(subParam);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <SubPageHeader
        title="Techies Targets & Device Intelligence"
        subtitle="Hardware allocation across Galaxy S26 Ultra vs. Z Fold8, subsidiary pacing tables, and creator delivery matrix with clickable phase permalinks."
        badge="Hardware & Reviewer Intelligence"
        selectedSubsidiary={selectedSubsidiary}
      />

      <TechiesIntelligenceTab
        deviceSummary={STATIC_TECHIES_DEVICE_SUMMARY}
        influencerMatrix={STATIC_TECHIES_INFLUENCER_MATRIX}
        targetsVsActual={STATIC_TECHIES_TARGETS_SUMMARY}
        selectedSubsidiary={selectedSubsidiary}
        onSelectSubsidiary={setSelectedSubsidiary}
      />
    </div>
  );
}

export default function SwitchStormTechiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center text-slate-400">Loading Techies Intelligence...</div>}>
      <TechiesPageContent />
    </Suspense>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SubPageHeader from "../SubPageHeader";
import LifestyleIntelligenceTab from "../LifestyleIntelligenceTab";
import {
  STATIC_LIFESTYLE_WEEKLY_PACING,
  STATIC_LIFESTYLE_SUBSIDIARY_TARGETS,
  STATIC_LIFESTYLE_CREATOR_MATRIX,
  STATIC_LIFESTYLE_TIER_SCORECARD,
} from "../lifestyleData";

function LifestylePageContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get("sub") || "All";
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>(subParam);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <SubPageHeader
        title="Lifestyle Targets & Creators Intelligence"
        subtitle="Weekly flighting pacing (Weeks 1 to 4), tier fulfillment tracking, and 220 lifestyle creators matrix with direct clickable post permalinks."
        badge="Ambassador & Creator Intelligence"
        selectedSubsidiary={selectedSubsidiary}
      />

      <LifestyleIntelligenceTab
        tierScorecard={STATIC_LIFESTYLE_TIER_SCORECARD}
        weeklyPacing={STATIC_LIFESTYLE_WEEKLY_PACING}
        subsidiaryTargets={STATIC_LIFESTYLE_SUBSIDIARY_TARGETS}
        creatorMatrix={STATIC_LIFESTYLE_CREATOR_MATRIX}
        selectedSubsidiary={selectedSubsidiary}
        onSelectSubsidiary={setSelectedSubsidiary}
      />
    </div>
  );
}

export default function SwitchStormLifestylePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center text-slate-400">Loading Lifestyle Intelligence...</div>}>
      <LifestylePageContent />
    </Suspense>
  );
}

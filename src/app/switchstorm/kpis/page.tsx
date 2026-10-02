"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SubPageHeader from "../SubPageHeader";
import GroupKPIsTab, { GroupKPI } from "../GroupKPIsTab";

function KPIsPageContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get("sub") || "All";

  const [kpis, setKpis] = useState<GroupKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>(subParam);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/data/latest_summary.json?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          setKpis(json.campaign_kpis_by_group || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <SubPageHeader
        title="Creator Groups & Regional KPIs"
        subtitle="Macro performance breakdown, unified reach, total views, engagements, and engagement rate metrics across all creator tiers."
        badge="Cross-Platform Intelligence"
        selectedSubsidiary={selectedSubsidiary}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#034EA2] border-t-transparent" />
        </div>
      ) : (
        <GroupKPIsTab kpis={kpis} selectedSubsidiary={selectedSubsidiary} />
      )}
    </div>
  );
}

export default function SwitchStormKPIsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center text-slate-400">Loading KPIs...</div>}>
      <KPIsPageContent />
    </Suspense>
  );
}

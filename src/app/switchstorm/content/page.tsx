"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SubPageHeader from "../SubPageHeader";
import ContentShowcaseTab, { RankedVideo } from "../ContentShowcaseTab";

function ContentPageContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get("sub") || "All";

  const [allVideos, setAllVideos] = useState<RankedVideo[]>([]);
  const [topVideos, setTopVideos] = useState<RankedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>(subParam);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/data/latest_summary.json?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          setAllVideos(json.all_ranked_videos || []);
          setTopVideos(json.top_performing_videos || []);
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
        title="Top Performing Content Showcase"
        subtitle="Dynamic ranking across all 784 campaign videos with local media thumbnails, video view metrics, and deep engagement rates."
        badge="Video Intelligence"
        selectedSubsidiary={selectedSubsidiary}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#034EA2] border-t-transparent" />
        </div>
      ) : (
        <ContentShowcaseTab
          allRankedVideos={allVideos}
          topPerformingVideos={topVideos}
          selectedSubsidiary={selectedSubsidiary}
          onSelectSubsidiary={setSelectedSubsidiary}
        />
      )}
    </div>
  );
}

export default function SwitchStormContentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center text-slate-400">Loading Content Showcase...</div>}>
      <ContentPageContent />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";

export interface ActionItemRecord {
  id: string;
  subsidiary: string;
  market: string;
  stream: "Tech Reviewers" | "Lifestyle Creators";
  phaseOrWeek: string;
  status: "Action Required" | "Delayed" | "Under Review";
  bottleneck: string;
  actionItem: string;
  ownerName: string;
  ownerRole: string;
  ownerEmail: string;
  priority: "High" | "Critical" | "Medium";
}

export const SOURCED_ACTION_ITEMS: ActionItemRecord[] = [
  {
    id: "act-setk-tech",
    subsidiary: "SETK",
    market: "Turkey",
    stream: "Tech Reviewers",
    phaseOrWeek: "Phase 3 (Post 3)",
    status: "Action Required",
    bottleneck: "Agency Tracker Note: 'W40'. Phase 3 delivery at 30.8% (4 live of 13 planned, 9 WIP).",
    actionItem: "Follow up on 9 WIP deliverables shifted to W40 in agency tracker.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SETK Marketing PIC Placeholder]",
    ownerEmail: "[setk.pic.placeholder@samsung.com]",
    priority: "Critical",
  },
  {
    id: "act-semag-tech",
    subsidiary: "SEMAG",
    market: "Maghreb (Morocco, Algeria, Tunisia)",
    stream: "Tech Reviewers",
    phaseOrWeek: "Phase 3 (Post 3)",
    status: "Action Required",
    bottleneck: "Agency Tracker Note: 'W40'. Phase 3 delivery at 50.0% (4 live of 8 planned, 4 WIP).",
    actionItem: "Follow up on 4 WIP deliverables shifted to W40 in agency tracker.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SEMAG Marketing PIC Placeholder]",
    ownerEmail: "[semag.pic.placeholder@samsung.com]",
    priority: "High",
  },
  {
    id: "act-selv-tech",
    subsidiary: "SELV",
    market: "Levant (Jordan, Lebanon, Iraq)",
    stream: "Tech Reviewers",
    phaseOrWeek: "Phase 2 & 3",
    status: "Action Required",
    bottleneck: "Agency Tracker Note: 'Please confirm ETA'. Post 2: 6/8 live (2 WIP), Post 3: 2/8 live (6 WIP).",
    actionItem: "Confirm delivery ETA with agency for 8 pending deliverables.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SELV Operations PIC Placeholder]",
    ownerEmail: "[selv.pic.placeholder@samsung.com]",
    priority: "Critical",
  },
  {
    id: "act-seil-tech",
    subsidiary: "SEIL",
    market: "Israel",
    stream: "Tech Reviewers",
    phaseOrWeek: "Phase 1 - 3",
    status: "Delayed",
    bottleneck: "Agency Tracker Note: '*Delayed due to holiday period'. Post 1: 3/7, Post 2: 1/7, Post 3: 0/7 (7 WIP).",
    actionItem: "Review and confirm revised post-holiday delivery timeline.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SEIL Marketing PIC Placeholder]",
    ownerEmail: "[seil.pic.placeholder@samsung.com]",
    priority: "High",
  },
  {
    id: "act-sge-tech",
    subsidiary: "SGE",
    market: "Gulf (UAE, QA, KW, OM, BH)",
    stream: "Tech Reviewers",
    phaseOrWeek: "Phase 3 (Post 3)",
    status: "Under Review",
    bottleneck: "Agency Tracker Note: 'W40'. Phase 3 delivery at 75.0% (9 live of 12 planned, 3 WIP).",
    actionItem: "Follow up on 3 WIP deliverables shifted to W40 in agency tracker.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SGE Marcom PIC Placeholder]",
    ownerEmail: "[sge.pic.placeholder@samsung.com]",
    priority: "Medium",
  },
  {
    id: "act-sesar-life",
    subsidiary: "SESAR",
    market: "Saudi Arabia",
    stream: "Lifestyle Creators",
    phaseOrWeek: "Week 4 & 5",
    status: "Action Required",
    bottleneck: "Tracker Pacing: 41 deliverables pending in Week 4 (5 live of 46 planned) + 22 queued in Week 5.",
    actionItem: "Track upcoming Week 4 pending and Week 5 planned deliveries with local agency hub.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SESAR Marcom PIC Placeholder]",
    ownerEmail: "[sesar.pic.placeholder@samsung.com]",
    priority: "High",
  },
  {
    id: "act-sepak-life",
    subsidiary: "SEPAK",
    market: "Pakistan",
    stream: "Lifestyle Creators",
    phaseOrWeek: "Week 4 & 5",
    status: "Action Required",
    bottleneck: "Tracker Pacing: 10 deliverables pending in Week 4 (22 live of 32 planned) + 32 queued in Week 5.",
    actionItem: "Track upcoming Week 4 pending and Week 5 planned deliveries with local agency hub.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SEPAK Marcom PIC Placeholder]",
    ownerEmail: "[sepak.pic.placeholder@samsung.com]",
    priority: "Medium",
  },
  {
    id: "act-sge-life",
    subsidiary: "SGE",
    market: "Gulf (UAE, QA, KW, OM, BH)",
    stream: "Lifestyle Creators",
    phaseOrWeek: "Week 4 & 5",
    status: "Action Required",
    bottleneck: "Tracker Pacing: 7 deliverables pending in Week 4 (6 live of 13 planned) + 13 queued in Week 5.",
    actionItem: "Track upcoming Week 4 pending and Week 5 planned deliveries with local agency hub.",
    ownerName: "[PIC Name Placeholder]",
    ownerRole: "[SGE Marcom PIC Placeholder]",
    ownerEmail: "[sge.pic.placeholder@samsung.com]",
    priority: "Medium",
  },
];

interface ExecutiveEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamFilter?: "All" | "Tech Reviewers" | "Lifestyle Creators";
}

export default function ExecutiveEmailModal({
  isOpen,
  onClose,
  streamFilter = "All",
}: ExecutiveEmailModalProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "table">("visual");
  const [selectedItems, setSelectedItems] = useState<string[]>(
    SOURCED_ACTION_ITEMS.map((item) => item.id)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = SOURCED_ACTION_ITEMS.filter((item) => {
    if (streamFilter === "All") return true;
    return item.stream === streamFilter;
  });

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredItems.map((i) => i.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const activeItems = filteredItems.filter((i) => selectedItems.includes(i.id));

  // Generate plain text for email body
  const generatePlainText = () => {
    let text = `SAMSUNG ELECTRONICS MENA - CAMPAIGN ESCALATION BRIEFING\n`;
    text += `Target: SwitchStorm Integrated Campaign Deliverables\n`;
    text += `Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}\n\n`;
    text += `============================================================\n`;
    text += `1. THE WHY (The Momentum & Strategic Stakes)\n`;
    text += `============================================================\n`;
    text += `- Total Views Generated: 246,122,394 views across MENA\n`;
    text += `- Total Engagements: 5,804,652 interactions (2.36% engagement rate)\n`;
    text += `- Total Live Deliverables: 1,441 posts from 329 unique creators\n`;
    text += `- The Stakes: Resolving current pending deliverables unlocks an estimated ~25M+ additional high-value impressions before campaign flight ends.\n\n`;
    text += `============================================================\n`;
    text += `2. THE WHAT (Deliverables Requiring Follow-Up)\n`;
    text += `============================================================\n\n`;

    activeItems.forEach((item, idx) => {
      text += `${idx + 1}. [${item.priority.toUpperCase()}] ${item.subsidiary} (${item.market}) - ${item.stream}\n`;
      text += `   Flight: ${item.phaseOrWeek}\n`;
      text += `   Tracker Sourced Note: ${item.bottleneck}\n`;
      text += `   Recommended Action: ${item.actionItem}\n`;
      text += `   Owner PIC: ${item.ownerName} (${item.ownerRole}) <${item.ownerEmail}>\n\n`;
    });

    text += `============================================================\n`;
    text += `3. THE HOW (Leadership Action Playbook)\n`;
    text += `============================================================\n`;
    text += `Step 1: Expedite W40 shifted reviews (SETK, SEMAG, SGE) to confirm publishing.\n`;
    text += `Step 2: Review and confirm revised post-holiday delivery schedule for SEIL.\n`;
    text += `Step 3: Track upcoming Week 4 pending and Week 5 planned deliveries for SESAR and SEPAK.\n\n`;
    text += `------------------------------------------------------------\n`;
    text += `Data Sourced Directly from Master Trackers (TragetvsActual_Techies.xlsx & TargetvsActual_Lifestyle_updated.xlsx).\n`;
    text += `Generated via Samsung Marketing Intelligence Platform (Marketing AI Lab).\n`;
    return text;
  };

  // Generate complete, rich, visual HTML email layout with Why, What, and How blocks
  const generateVisualHTML = () => {
    let rowsHtml = activeItems
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px; font-weight: bold; color: #0F172A; font-family: Arial, sans-serif; font-size: 12px;">
          ${item.subsidiary} <br/><span style="font-size: 11px; font-weight: normal; color: #64748B;">${item.market}</span>
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #334155;">
          <strong>${item.stream}</strong><br/><span style="font-size: 11px; color: #64748B;">${item.phaseOrWeek}</span>
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">
          <span style="background-color: ${
            item.priority === "Critical" ? "#FEE2E2" : "#FEF3C7"
          }; color: ${
          item.priority === "Critical" ? "#991B1B" : "#92400E"
        }; padding: 3px 8px; border-radius: 4px; display: inline-block;">
            ${item.priority}
          </span>
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #1E293B; max-width: 260px;">
          ${item.bottleneck}
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #034EA2; font-weight: bold; max-width: 280px;">
          ${item.actionItem}
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #0F172A;">
          <strong>${item.ownerName}</strong><br/>
          <span style="font-size: 11px; color: #64748B;">${item.ownerRole}</span><br/>
          <span style="font-size: 11px; color: #2563EB;">${item.ownerEmail}</span>
        </td>
      </tr>
    `
      )
      .join("");

    return `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto; color: #0F172A; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <!-- Header Banner -->
        <div style="background-color: #034EA2; padding: 24px; color: #FFFFFF;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  Samsung Electronics MENA
                </span>
                <h1 style="margin: 8px 0 4px 0; font-size: 22px; font-weight: 800; color: #FFFFFF;">
                  SwitchStorm 2026 • Executive Campaign Briefing
                </h1>
                <p style="margin: 0; font-size: 13px; color: #BFDBFE;">
                  Action Item Escalation Report & Regional Delivery Roadmap
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- 4 Hero Impact Metrics (THE WHY) -->
        <div style="padding: 16px 20px; background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Total Views</span>
                <span style="font-size: 20px; font-weight: 900; color: #059669; display: block; margin-top: 2px;">246.1M</span>
              </td>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Engagements</span>
                <span style="font-size: 20px; font-weight: 900; color: #7C3AED; display: block; margin-top: 2px;">5.80M</span>
              </td>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Creators Live</span>
                <span style="font-size: 20px; font-weight: 900; color: #034EA2; display: block; margin-top: 2px;">329</span>
              </td>
              <td style="padding: 10px; width: 25%;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Open Action Items</span>
                <span style="font-size: 20px; font-weight: 900; color: #D97706; display: block; margin-top: 2px;">${activeItems.length}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Content Body -->
        <div style="padding: 24px;">
          <!-- 1. THE WHY -->
          <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #CBD5E1;">
            <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              1. THE WHY • Strategic Momentum & Campaign Stakes
            </h2>
            <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0 0 12px 0;">
              The SwitchStorm campaign has achieved massive regional velocity, surpassing <strong>246.1M views</strong> and <strong>5.8M engagements</strong> at a high <strong>2.36% engagement rate</strong>. Resolving the remaining ${activeItems.length} priority follow-ups unlocks an estimated <strong>25M+ additional organic views</strong> before final campaign flighting concludes.
            </p>
            <table style="width: 100%; border-collapse: collapse; background-color: #F1F5F9; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px; font-size: 12px; color: #1E293B;">
                  <strong>Creative Benchmark Spotlight:</strong> Ata Yaşat (@atayasat) delivered <strong>366,559 likes</strong> (#1 Most Liked in campaign) and Amtul Baweja (@patangeer) surpassed <strong>8.8M views</strong> (#1 Most Viewed), proving that ensuring 100% deliverable execution yields massive customer consideration.
                </td>
              </tr>
            </table>
          </div>

          <!-- 2. THE WHAT -->
          <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #CBD5E1;">
            <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              2. THE WHAT • Sourced Deliverable Action Items
            </h2>
            <p style="font-size: 12px; color: #64748B; margin: 0 0 12px 0;">
              All items below are pulled directly from master agency trackers (TragetvsActual_Techies.xlsx & TargetvsActual_Lifestyle_updated.xlsx).
            </p>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; text-align: left;">
              <thead>
                <tr style="background-color: #034EA2; color: #FFFFFF;">
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Sub</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Stream & Flight</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Priority</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Tracker Sourced Note</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Recommended Action</th>
                  <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Owner PIC</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <!-- 3. THE HOW -->
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              3. THE HOW • Leadership Action Playbook
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; background-color: #EFF6FF; border-left: 4px solid #034EA2; margin-bottom: 6px; font-size: 12px; color: #1E3A8A;">
                  <strong>Action 1 (Techies W40 Shifts):</strong> Follow up on 9 WIP reviews in SETK, 4 in SEMAG, and 3 in SGE to lock down final posting schedules.
                </td>
              </tr>
              <tr><td style="height: 6px;"></td></tr>
              <tr>
                <td style="padding: 8px 12px; background-color: #EFF6FF; border-left: 4px solid #034EA2; margin-bottom: 6px; font-size: 12px; color: #1E3A8A;">
                  <strong>Action 2 (Regional Holiday Delay):</strong> Review and approve revised flight schedule for SEIL following holiday hiatus.
                </td>
              </tr>
              <tr><td style="height: 6px;"></td></tr>
              <tr>
                <td style="padding: 8px 12px; background-color: #EFF6FF; border-left: 4px solid #034EA2; font-size: 12px; color: #1E3A8A;">
                  <strong>Action 3 (Lifestyle Flight W4/W5):</strong> Coordinate with Riyadh and Pakistan agency hubs to fast-track remaining Week 4 deliverables and launch Week 5 planned flighting.
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 14px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8;">
          Samsung Electronics MENA • Marketing AI Lab • Prepared for Leadership Review • Knox Ready
        </div>
      </div>
    `;
  };

  const copyVisualToClipboard = async () => {
    try {
      const htmlText = generateVisualHTML();
      const plainText = generatePlainText();

      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        const blobHtml = new Blob([htmlText], { type: "text/html" });
        const blobPlain = new Blob([plainText], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blobHtml,
            "text/plain": blobPlain,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return true;
    } catch {
      await navigator.clipboard.writeText(generatePlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return true;
    }
  };

  const handleSimulateDispatch = () => {
    setIsSending(true);
    setDispatchStatus(null);
    setTimeout(() => {
      setIsSending(false);
      setDispatchStatus(
        `✓ Executive briefing prepared for ${activeItems.length} Sourced Action Items at ${new Date().toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )} (Samsung Knox Portal format).`
      );
      setTimeout(() => setDispatchStatus(null), 7000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* 1. MODAL HEADER & TABS */}
        <div className="px-5 py-4 bg-[#034EA2] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Executive Campaign Action Briefing</span>
                <span className="rounded bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  Knox Ready
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Visual briefing with WHY, WHAT & HOW for Samsung MENA Leadership & Regional PICs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Switcher */}
            <div className="flex rounded-lg bg-black/20 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("visual")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "visual"
                    ? "bg-white text-[#034EA2] font-bold shadow-xs"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                Visual Briefing (Why, What, How)
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "table"
                    ? "bg-white text-[#034EA2] font-bold shadow-xs"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                Action Table
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-2"
              title="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. RECIPIENT & FILTER BAR */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 text-slate-600">
            <div>
              <span className="font-bold text-slate-900">TO: </span>
              <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                [leadership.email.placeholder@samsung.com]
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-900">CC: </span>
              <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                [steering.committee.placeholder@samsung.com]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Items:</span>
            <button
              onClick={selectAll}
              className="text-[#034EA2] hover:underline font-bold cursor-pointer"
            >
              All ({filteredItems.length})
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={deselectAll}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              None
            </button>
          </div>
        </div>

        {/* Dispatch Notification Banner */}
        {dispatchStatus && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 flex items-center justify-between text-xs text-emerald-800 font-semibold animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{dispatchStatus}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-mono">Knox Desktop Mail</span>
          </div>
        )}

        {/* 3. MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-100/50">
          {activeTab === "visual" ? (
            /* VISUAL EXECUTIVE BRIEFING (WHY • WHAT • HOW) */
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
              {/* Hero Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded bg-blue-50 text-[#034EA2] font-black text-[10px] uppercase tracking-wider px-2 py-0.5 border border-blue-200/60">
                    Samsung Electronics MENA
                  </span>
                  <span className="rounded bg-slate-100 text-slate-600 font-semibold text-[10px] px-2 py-0.5">
                    Marketing AI Lab
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  SwitchStorm 2026: Executive Deliverables Briefing
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  High-impact escalation briefing detailing campaign momentum, priority gaps, and immediate PIC follow-up items.
                </p>
              </div>

              {/* 4 Macro Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Views</span>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">246.1M</div>
                  <span className="text-[10px] text-slate-500">Across 8 Subsidiaries</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engagements</span>
                  <div className="text-xl font-black text-purple-700 mt-0.5">5.80M</div>
                  <span className="text-[10px] text-slate-500">2.36% Regional ER</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Creators</span>
                  <div className="text-xl font-black text-[#034EA2] mt-0.5">329</div>
                  <span className="text-[10px] text-slate-500">1,441 Posts Active</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Actions</span>
                  <div className="text-xl font-black text-amber-700 mt-0.5">{activeItems.length} Items</div>
                  <span className="text-[10px] text-slate-500">Require Follow-Up</span>
                </div>
              </div>

              {/* 1. THE WHY */}
              <div className="rounded-xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30 p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#034EA2] text-white font-black text-xs">
                    1
                  </span>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    THE WHY • Strategic Momentum & High Stakes
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  The SwitchStorm campaign is delivering record-setting organic engagement across MENA. Live deliverables are converting at an average of <strong>170,000+ views</strong> per video. Ensuring that all remaining deliverables cross the finish line unlocks an estimated <strong>25M+ additional consumer impressions</strong> before campaign conclusion.
                </p>

                {/* Creator Impact Benchmarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-blue-200/60">
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-purple-700 uppercase">#1 Most Liked Benchmark</span>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">Ata Yaşat (@atayasat)</div>
                    <div className="text-emerald-700 font-extrabold text-sm">366,559 Likes</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Proves unprecedented customer engagement with Galaxy Z Flip8 & Fold8.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">#1 Most Viewed Benchmark</span>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">Amtul Baweja (@patangeer)</div>
                    <div className="text-[#034EA2] font-extrabold text-sm">8,800,000 Views</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Demonstrates massive viral reach across lifestyle & crossover audiences.</p>
                  </div>
                </div>
              </div>

              {/* 2. THE WHAT */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600 text-white font-black text-xs">
                      2
                    </span>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      THE WHAT • Deliverables Requiring Executive Follow-Up
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Sourced from TragetvsActual_Techies & TargetvsActual_Lifestyle
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#034EA2] text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 font-bold">Sub</th>
                        <th className="px-3 py-2.5 font-bold">Stream & Flight</th>
                        <th className="px-2 py-2.5 text-center font-bold">Priority</th>
                        <th className="px-3 py-2.5 font-bold">Tracker Sourced Note</th>
                        <th className="px-3 py-2.5 font-bold">Action Item</th>
                        <th className="px-3 py-2.5 font-bold">Owner PIC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2.5 font-extrabold text-slate-900">{item.subsidiary}</td>
                          <td className="px-3 py-2.5 text-slate-700 font-semibold">{item.stream} <span className="text-[10px] text-slate-400 block">{item.phaseOrWeek}</span></td>
                          <td className="px-2 py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.priority === "Critical" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 max-w-[200px]">{item.bottleneck}</td>
                          <td className="px-3 py-2.5 font-bold text-[#034EA2] max-w-[220px]">{item.actionItem}</td>
                          <td className="px-3 py-2.5 text-slate-600 font-medium">
                            <span className="block font-bold text-slate-800">{item.ownerName}</span>
                            <span className="block text-[10px] text-slate-400">{item.ownerRole}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. THE HOW */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
                    3
                  </span>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    THE HOW • Leadership Action Playbook
                  </h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                    <span className="font-bold text-[#034EA2] shrink-0">Step 1:</span>
                    <div>
                      <strong className="text-slate-900">Expedite W40 Shifted Reviews:</strong>
                      <span className="text-slate-600 ml-1">Follow up with SETK (9 WIP), SEMAG (4 WIP), and SGE (3 WIP) agency leads to enforce immediate publishing confirmation.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                    <span className="font-bold text-[#034EA2] shrink-0">Step 2:</span>
                    <div>
                      <strong className="text-slate-900">Authorize Post-Holiday Flight:</strong>
                      <span className="text-slate-600 ml-1">Approve revised publishing schedule for SEIL following the holiday period to capture remaining Phase 1-3 deliverables.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                    <span className="font-bold text-[#034EA2] shrink-0">Step 3:</span>
                    <div>
                      <strong className="text-slate-900">Unlock Lifestyle Week 4/5 Flight:</strong>
                      <span className="text-slate-600 ml-1">Coordinate with Riyadh (SESAR) and Pakistan (SEPAK) agency hubs to clear creator drafts for Week 4 and roll into Week 5 allocations.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TABULAR EDIT & SELECTION MATRIX */
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs text-slate-700 min-w-[850px]">
                <thead className="bg-slate-100/90 text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="w-8 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                        onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                        className="rounded border-slate-300 text-[#034EA2] focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 font-bold">Subsidiary</th>
                    <th className="px-3 py-3 font-bold">Campaign Stream</th>
                    <th className="px-2 py-3 text-center font-bold">Priority</th>
                    <th className="px-3 py-3 font-bold">Tracker Sourced Note</th>
                    <th className="px-3 py-3 font-bold">Recommended Action</th>
                    <th className="px-3 py-3 font-bold">Owner PIC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredItems.map((item) => {
                    const isChecked = selectedItems.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleSelect(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isChecked ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-slate-50 opacity-60"
                        }`}
                      >
                        <td className="px-3 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(item.id)}
                            className="rounded border-slate-300 text-[#034EA2] focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3.5 font-extrabold text-slate-900">{item.subsidiary} <span className="text-[11px] text-slate-400 font-normal block">{item.market}</span></td>
                        <td className="px-3 py-3.5 font-bold text-slate-800">{item.stream} <span className="text-[10px] text-slate-500 block font-normal">{item.phaseOrWeek}</span></td>
                        <td className="px-2 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.priority === "Critical" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-700 max-w-[220px]">{item.bottleneck}</td>
                        <td className="px-3 py-3.5 font-semibold text-[#034EA2] max-w-[260px] bg-blue-50/70 p-2 rounded">{item.actionItem}</td>
                        <td className="px-3 py-3.5 text-slate-700 whitespace-nowrap">
                          <span className="font-bold block">{item.ownerName}</span>
                          <span className="text-[10px] text-slate-400 block">{item.ownerRole}</span>
                          <span className="text-[10px] text-blue-600 font-mono block">{item.ownerEmail}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. MODAL FOOTER & ACTION BUTTONS */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            <span>Selected for dispatch: </span>
            <span className="font-bold text-slate-900">{activeItems.length} of {filteredItems.length} items</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Full Visual HTML Button */}
            <button
              onClick={copyVisualToClipboard}
              disabled={activeItems.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#034EA2] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-40"
              title="Copies the entire visual email layout (Why, What, How + KPI cards) to paste directly into Samsung Knox Webmail"
            >
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copied ? "✓ Copied Visual Email!" : "Copy Visual Email for Knox"}</span>
            </button>

            {/* Knox Dispatch Simulation */}
            <button
              onClick={handleSimulateDispatch}
              disabled={activeItems.length === 0 || isSending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-slate-200 px-3.5 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-40"
            >
              {isSending ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing Knox Dispatch...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Knox Relay Dispatch (Demo)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

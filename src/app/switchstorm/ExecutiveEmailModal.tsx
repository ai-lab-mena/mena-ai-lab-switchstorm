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
  ownerInitials: string;
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    ownerInitials: "PIC",
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
    text += `EXECUTIVE DELIVERABLES REQUIRING LEADERSHIP FOLLOW-UP:\n`;
    text += `------------------------------------------------------------\n\n`;

    activeItems.forEach((item, idx) => {
      text += `${idx + 1}. [${item.priority.toUpperCase()}] ${item.subsidiary} (${item.market}) - ${item.stream}\n`;
      text += `   Flight: ${item.phaseOrWeek}\n`;
      text += `   Tracker Sourced Note: ${item.bottleneck}\n`;
      text += `   Recommended Action: ${item.actionItem}\n`;
      text += `   Owner PIC: ${item.ownerName} (${item.ownerRole}) <${item.ownerEmail}>\n\n`;
    });

    text += `------------------------------------------------------------\n`;
    text += `Data Sourced Directly from Master Tracker (TragetvsActual_Techies.xlsx & TargetvsActual_Lifestyle_updated.xlsx).\n`;
    text += `Generated automatically via Samsung Marketing Intelligence Platform (Marketing AI Lab).\n`;
    return text;
  };

  // Generate HTML for clipboard rich-text paste into Knox Webmail / Outlook
  const generateHTMLTable = () => {
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
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 11px; color: #DC2626; font-weight: bold;">
          <span style="background-color: ${
            item.priority === "Critical" ? "#FEE2E2" : "#FEF3C7"
          }; color: ${
          item.priority === "Critical" ? "#991B1B" : "#92400E"
        }; padding: 3px 8px; border-radius: 4px; display: inline-block;">
            ${item.priority}
          </span>
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #1E293B; max-width: 280px;">
          ${item.bottleneck}
        </td>
        <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 12px; color: #034EA2; font-weight: bold; max-width: 320px;">
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
      <div style="font-family: Arial, sans-serif; font-size: 12px; color: #0F172A;">
        <h3 style="color: #034EA2; margin-bottom: 4px; font-size: 16px;">Samsung Electronics MENA | Executive Campaign Action Briefing</h3>
        <p style="color: #64748B; font-size: 12px; margin-top: 0; margin-bottom: 12px;">Sourced directly from campaign tracking spreadsheets. Prepared for Samsung MENA Leadership & Subsidiary PICs.</p>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; text-align: left;">
          <thead>
            <tr style="background-color: #034EA2; color: #FFFFFF;">
              <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Subsidiary</th>
              <th style="padding: 10px; font-size: 11px; text-transform: uppercase;">Stream</th>
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
        <p style="color: #94A3B8; font-size: 10px; margin-top: 10px;">Generated automatically via Samsung Marketing Intelligence Hub (AI MENA Lab).</p>
      </div>
    `;
  };

  const copyTableToClipboard = async () => {
    try {
      const htmlText = generateHTMLTable();
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

  // Open in Knox: Copies rich table and launches Knox mailto protocol / webmail
  const handleOpenInKnox = async () => {
    await copyTableToClipboard();
    const subject = encodeURIComponent(
      "[ACTION REQUIRED] Samsung MENA SwitchStorm - Campaign Deliverable Escalation Briefing"
    );
    const body = encodeURIComponent(generatePlainText());

    // Launch default Knox mail client / mailto protocol handler
    window.location.href = `mailto:[leadership.recipient.placeholder@samsung.com]?subject=${subject}&body=${body}`;

    setDispatchStatus(
      "✓ Formatted executive table copied to clipboard! Ready to paste (Ctrl+V) into your Knox Mail message."
    );
    setTimeout(() => setDispatchStatus(null), 8000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. MODAL HEADER */}
        <div className="px-5 py-4 bg-[#034EA2] text-white flex items-center justify-between shrink-0">
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
                Sourced directly from campaign tracking spreadsheets for Samsung MENA Leadership & Regional PICs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. RECIPIENT & FILTER BAR */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 text-slate-600">
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
            <span className="text-slate-500 font-medium">Select:</span>
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
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-semibold animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{dispatchStatus}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-mono">Knox Desktop Mail</span>
          </div>
        )}

        {/* 3. EXECUTIVE ESCALATION TABLE (SCROLLABLE BODY) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700 min-w-[850px]">
              <thead className="bg-slate-100/90 text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="w-8 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredItems.length > 0 &&
                        selectedItems.length === filteredItems.length
                      }
                      onChange={(e) =>
                        e.target.checked ? selectAll() : deselectAll()
                      }
                      className="rounded border-slate-300 text-[#034EA2] focus:ring-blue-500"
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
                      <td
                        className="px-3 py-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-slate-300 text-[#034EA2] focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Subsidiary */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {item.subsidiary}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.market}
                          </span>
                        </div>
                      </td>

                      {/* Stream */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-xs">
                            {item.stream}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.phaseOrWeek}
                          </span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-2 py-3.5 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            item.priority === "Critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : item.priority === "High"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      {/* Bottleneck (Sourced Note) */}
                      <td className="px-3 py-3.5 max-w-[240px]">
                        <p className="text-xs text-slate-700 leading-snug">
                          {item.bottleneck}
                        </p>
                      </td>

                      {/* Action Item */}
                      <td className="px-3 py-3.5 max-w-[280px]">
                        <p className="text-xs font-semibold text-[#034EA2] leading-snug bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                          {item.actionItem}
                        </p>
                      </td>

                      {/* Owner PIC Placeholder */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-extrabold text-[10px] shadow-xs border border-slate-300 shrink-0">
                            PIC
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-xs leading-none">
                              {item.ownerName}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 leading-none">
                              {item.ownerRole}
                            </span>
                            <span className="text-[10px] text-blue-600 font-mono mt-0.5 leading-none">
                              {item.ownerEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. MODAL FOOTER & ACTION BUTTONS */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            <span>Selected for briefing: </span>
            <span className="font-bold text-slate-900">{activeItems.length} of {filteredItems.length} items</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Knox Formatted Table Button */}
            <button
              onClick={copyTableToClipboard}
              disabled={activeItems.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-40"
              title="Copies rich HTML table ready to paste directly into Samsung Knox Webmail"
            >
              <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copied ? "✓ Copied for Knox!" : "Copy Table for Knox"}</span>
            </button>

            {/* Open in Knox Button */}
            <button
              onClick={handleOpenInKnox}
              disabled={activeItems.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#034EA2] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-40"
              title="Copies formatted table and opens Samsung Knox Mail client"
            >
              <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Open in Knox Mail</span>
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

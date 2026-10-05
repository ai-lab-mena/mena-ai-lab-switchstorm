"use client";

import React, { useState } from "react";

interface PlatformShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlatformShowcaseModal({
  isOpen,
  onClose,
}: PlatformShowcaseModalProps) {
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate plain text version for email clients
  const generatePlainText = () => {
    return `SAMSUNG ELECTRONICS MENA • MARKETING INTELLIGENCE HUB
INTRODUCING: ai-lab-mena.com - REGIONAL MARKETING INTELLIGENCE PLATFORM
================================================================================

Dear Leadership & Marketing Team,

We are excited to announce the launch of our unified digital intelligence platform:
>> https://www.ai-lab-mena.com <<

--------------------------------------------------------------------------------
1. THE WHY • The Strategic Need for Automated Consolidated Datasheets
--------------------------------------------------------------------------------
Previously, campaign tracking across our 8 subsidiaries was paralyzed by manual
fragmentation: disparate spreadsheets from different agencies, conflicting formulas,
and static PowerPoint decks that took days to compile.

We wanted an Automated Consolidated Datasheet—a single, unified source of truth
that ingests, cleans, deduplicates, and models every creator deliverable automatically.

Why Automation? We anchored this initiative on three non-negotiable strategic pillars:

• ⚡ EFFICIENCY (Instant Time-to-Insight):
  Eliminates 15–20 hours of manual spreadsheet compilation every week. The automated
  pipeline runs in under 30 seconds, turning raw Traackr exports into live executive
  dashboards instantaneously.

• 🎯 ACCURACY (Zero-Error Single Source of Truth):
  Human copy-paste errors and formula discrepancies are completely removed. The pipeline
  standardizes metrics across platforms, enforces verified subsidiary mapping, and
  guarantees 100% mathematical consistency across all 8 markets.

• 📈 SCALABILITY (Enterprise Campaign Architecture):
  Built upon an institutional star-schema data model (switchstorm.db) that effortlessly
  scales across future flagship product launches, expanding creator tiers, and new regional initiatives.

--------------------------------------------------------------------------------
2. THE WHAT • Core Capabilities Built on the Platform
--------------------------------------------------------------------------------
The platform provides a comprehensive suite of executive intelligence tools:

1. Interactive MENA Subsidiary Map (8 Markets)
   - Live geospatial telemetry across SEPAK, SESAR, SGE, SEEG, SETK, SEIL, SEMAG, and SELV.
   - Dynamic sorting from highest view volume (SEPAK: 75.3M) to emerging markets.
   - 1-click territory filtering that syncs across the entire platform.

2. Multi-Metric Content Showcase & Dynamic Leaderboards
   - Instant re-ranking across 6 critical dimensions: Most Views, Most Engaging,
     Most Liked, Most Commented, Most Shared, and Most Saved.
   - Hero creative spotlight (e.g. Ata Yaşat with 366.5K likes, Amtul Baweja with 8.8M views).
   - Dedicated weekly flight filtering from Week 1 to Week 5 (Monday to Sunday).
   - Official platform badges (TikTok, Instagram, YouTube) with direct permalinks.

3. Creator Groups & Deep Engagement KPIs
   - Institutional cross-platform analytics across Tech Reviewers, Crossovers,
     Team Galaxy Ambassadors, and Content Creators.
   - Advanced metrics: Potential Reach, Unified Views, ER (Reach), and ER (Views).

4. Hardware Seeding & Tech Reviewer Intelligence
   - Real-time device scorecard tracking Galaxy S26 Ultra vs. Galaxy Z Fold8 Series impact.
   - 3-Phase audit pacing (Phase 1: Sep 7-10, Phase 2: Sep 11-20, Phase 3: Sep 21+).
   - 1-click link validation catalog for all 77 contracted tech reviewers.

5. Lifestyle Flight Delivery & Tier Matrix
   - Weekly pacing tracker across all 5 flight weeks (Sep 7 to Oct 11).
   - Contracted tier fulfillment for Team Galaxy, Content Creators, and Galaxy Circle.
   - Direct deliverable link directory covering all 254 lifestyle creators.

6. Automated Knox Executive Escalation Engine
   - 1-click generation of executive action briefings for senior leadership.
   - Exact bottleneck notes sourced directly from master agency spreadsheets.
   - Native "Open in Knox Mail" integration for immediate team follow-up.

7. Enterprise Security & Dual Deployment
   - Live Production Cloud: https://www.ai-lab-mena.com (McAfee proxy-safe).
   - 100% Offline Standalone LAN: Runs locally inside Samsung SVPN (http://liana-s01:3000).
   - Secure role-based authentication gate.

--------------------------------------------------------------------------------
3. THE HOW • How to Access & Next Steps
--------------------------------------------------------------------------------
- Live Production URL: https://www.ai-lab-mena.com
- Internal LAN URL:   http://liana-s01:3000 (Local SVPN network)
- Access Gate:        Role-based executive sign-in

Recommended Leadership Actions:
1. Review regional subsidiary rankings and deliverable completion rates.
2. Drill down into Techies and Lifestyle pacing to review WIP bottlenecks.
3. Utilize the Knox Briefing tool to dispatch action items directly to local PICs.

Marketing AI Lab • Samsung Electronics MENA
`;
  };

  // Generate full visual HTML email layout with Why, What, and How blocks for Knox Mail / Outlook
  const generateVisualHTML = () => {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 820px; margin: 0 auto; color: #0F172A; background-color: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 12px; overflow: hidden;">
        <!-- Brand Header Banner -->
        <div style="background-color: #034EA2; padding: 28px 24px; color: #FFFFFF;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  Samsung Electronics MENA • Marketing AI Lab
                </span>
                <h1 style="margin: 10px 0 6px 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                  Introducing: ai-lab-mena.com
                </h1>
                <p style="margin: 0; font-size: 14px; color: #BFDBFE;">
                  Automated Consolidated Marketing Intelligence & Regional Campaign Command Center
                </p>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <a href="https://www.ai-lab-mena.com" style="background-color: #F59E0B; color: #0F172A; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block;">
                  Launch Portal ↗
                </a>
              </td>
            </tr>
          </table>
        </div>

        <!-- 4 Hero Campaign Metric Cards -->
        <div style="padding: 16px 20px; background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Total Unified Views</span>
                <span style="font-size: 22px; font-weight: 900; color: #059669; display: block; margin-top: 2px;">246.1M</span>
                <span style="font-size: 10px; color: #94A3B8;">Across 8 Subsidiaries</span>
              </td>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Total Engagements</span>
                <span style="font-size: 22px; font-weight: 900; color: #7C3AED; display: block; margin-top: 2px;">5.80M</span>
                <span style="font-size: 10px; color: #94A3B8;">2.36% Regional ER</span>
              </td>
              <td style="padding: 10px; width: 25%; border-right: 1px solid #E2E8F0;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Creators Live</span>
                <span style="font-size: 22px; font-weight: 900; color: #034EA2; display: block; margin-top: 2px;">329</span>
                <span style="font-size: 10px; color: #94A3B8;">1,441 Active Posts</span>
              </td>
              <td style="padding: 10px; width: 25%;">
                <span style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; display: block;">Connected Markets</span>
                <span style="font-size: 22px; font-weight: 900; color: #D97706; display: block; margin-top: 2px;">8 Subs</span>
                <span style="font-size: 10px; color: #94A3B8;">Real-Time Map</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body Container -->
        <div style="padding: 24px;">

          <!-- 1. THE WHY (The Strategic Pillars: Efficiency, Accuracy, Scalability) -->
          <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #CBD5E1;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
              <tr>
                <td style="width: 28px; vertical-align: top;">
                  <div style="background-color: #034EA2; color: #FFFFFF; font-weight: 900; font-size: 13px; width: 22px; height: 22px; border-radius: 6px; text-align: center; line-height: 22px;">1</div>
                </td>
                <td>
                  <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    THE WHY • Automated Consolidated Datasheets: Efficiency, Accuracy & Scalability
                  </h2>
                </td>
              </tr>
            </table>

            <p style="font-size: 13px; line-height: 1.6; color: #334155; margin: 0 0 12px 0;">
              Previously, regional campaign monitoring was held back by fragmented agency spreadsheets, manual copy-pasting, and delayed retrospective reporting. We set out to build an <strong>Automated Consolidated Datasheet</strong>—a unified engine that cleans, models, and delivers campaign telemetry automatically.
            </p>

            <!-- 3 Pillars Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
              <tr>
                <td style="width: 33.3%; padding: 6px; vertical-align: top;">
                  <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 12px; height: 100%;">
                    <strong style="color: #166534; font-size: 12px; display: block; margin-bottom: 3px;">⚡ 1. EFFICIENCY</strong>
                    <span style="font-size: 11px; color: #374151; line-height: 1.4; display: block;">
                      Cuts 15–20 hours of weekly manual compilation to under 30 seconds. Instant updates from raw agency files.
                    </span>
                  </div>
                </td>
                <td style="width: 33.3%; padding: 6px; vertical-align: top;">
                  <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px; height: 100%;">
                    <strong style="color: #1E40AF; font-size: 12px; display: block; margin-bottom: 3px;">🎯 2. ACCURACY</strong>
                    <span style="font-size: 11px; color: #374151; line-height: 1.4; display: block;">
                      Eliminates human error, formula mismatches, and duplicates. Ensures 100% verified mathematical consistency across all 8 markets.
                    </span>
                  </div>
                </td>
                <td style="width: 33.3%; padding: 6px; vertical-align: top;">
                  <div style="background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 8px; padding: 12px; height: 100%;">
                    <strong style="color: #6B21A8; font-size: 12px; display: block; margin-bottom: 3px;">📈 3. SCALABILITY</strong>
                    <span style="font-size: 11px; color: #374151; line-height: 1.4; display: block;">
                      Institutional star-schema database architecture that effortlessly expands for future flagship launches and regional campaigns.
                    </span>
                  </div>
                </td>
              </tr>
            </table>

            <p style="font-size: 13px; line-height: 1.6; color: #334155; margin: 0;">
              <strong>The Result:</strong> <strong>ai-lab-mena.com</strong> replaces static decks with living, real-time intelligence accessible 24/7 by regional leadership and subsidiary marketing teams.
            </p>
          </div>

          <!-- 2. THE WHAT -->
          <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #CBD5E1;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
              <tr>
                <td style="width: 28px; vertical-align: top;">
                  <div style="background-color: #034EA2; color: #FFFFFF; font-weight: 900; font-size: 13px; width: 22px; height: 22px; border-radius: 6px; text-align: center; line-height: 22px;">2</div>
                </td>
                <td>
                  <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    THE WHAT • 6 Powerful Capabilities Built for Leadership
                  </h2>
                </td>
              </tr>
            </table>

            <!-- Capabilities Grid -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <!-- Feature 1 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #034EA2; font-size: 13px; display: block; margin-bottom: 4px;">
                      📍 Interactive Territory Map
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      Real-time visibility across all 8 MENA subsidiaries (SEPAK, SESAR, SGE, SEEG, SETK, SEIL, SEMAG, SELV) with dynamic view volume ranking and 1-click filter propagation.
                    </span>
                  </div>
                </td>
                <!-- Feature 2 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #7C3AED; font-size: 13px; display: block; margin-bottom: 4px;">
                      🏆 6-Metric Content Showcase
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      Dynamic leaderboards ranked by Video Views, Total Engagements, Likes, Comments, Shares, or Saves. Features weekly flight filters (Weeks 1 to 5) and collapsible tier sections.
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- Feature 3 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #059669; font-size: 13px; display: block; margin-bottom: 4px;">
                      📱 Hardware Seeding Intelligence
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      Dedicated device scorecards tracking Galaxy S26 Ultra vs. Z Fold8 impact, 3-Phase pacing audits, and 1-click link verification for all 77 contracted tech reviewers.
                    </span>
                  </div>
                </td>
                <!-- Feature 4 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #D97706; font-size: 13px; display: block; margin-bottom: 4px;">
                      🎯 Lifestyle Tier Fulfillment Matrix
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      Delivery tracking across Team Galaxy, Content Creators, and Galaxy Circle. Catalogs all 254 lifestyle creators with clickable live post permalinks.
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- Feature 5 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #DC2626; font-size: 13px; display: block; margin-bottom: 4px;">
                      ✉️ Knox Executive Escalation Tool
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      1-click generation of executive action briefings with exact notes sourced directly from master trackers, ready to paste or launch directly in Samsung Knox Mail.
                    </span>
                  </div>
                </td>
                <!-- Feature 6 -->
                <td style="width: 50%; padding: 8px; vertical-align: top;">
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; height: 100%;">
                    <strong style="color: #0284C7; font-size: 13px; display: block; margin-bottom: 4px;">
                      🔒 Dual Cloud & Samsung LAN Deployment
                    </strong>
                    <span style="font-size: 12px; color: #475569; line-height: 1.5; display: block;">
                      Accessible anywhere via public cloud (ai-lab-mena.com) or offline on internal Samsung SVPN LAN (http://liana-s01:3000) with McAfee proxy compliance.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- 3. THE HOW -->
          <div style="margin-bottom: 12px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
              <tr>
                <td style="width: 28px; vertical-align: top;">
                  <div style="background-color: #034EA2; color: #FFFFFF; font-weight: 900; font-size: 13px; width: 22px; height: 22px; border-radius: 6px; text-align: center; line-height: 22px;">3</div>
                </td>
                <td>
                  <h2 style="font-size: 15px; font-weight: 800; color: #034EA2; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    THE HOW • Access Details & Executive Action Plan
                  </h2>
                </td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; margin-bottom: 14px;">
              <tr>
                <td style="padding: 16px;">
                  <table style="width: 100%; font-size: 13px; color: #1E3A8A;">
                    <tr>
                      <td style="width: 140px; font-weight: bold; padding: 4px 0;">Live Production URL:</td>
                      <td style="padding: 4px 0;"><a href="https://www.ai-lab-mena.com" style="color: #034EA2; font-weight: bold; text-decoration: underline;">https://www.ai-lab-mena.com</a></td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 4px 0;">Internal LAN URL:</td>
                      <td style="padding: 4px 0; font-family: monospace; color: #0F172A;">http://liana-s01:3000 (Internal SVPN)</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 4px 0;">Authentication Gate:</td>
                      <td style="padding: 4px 0; color: #0F172A;">Role-based executive login enabled</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <div style="font-size: 12px; color: #475569; line-height: 1.6;">
              <strong>Recommended Immediate Steps:</strong><br/>
              1. <strong>Explore Regional Telemetry:</strong> Review subsidiary rankings and verify creator post coverage.<br/>
              2. <strong>Audit Deliverable Pacing:</strong> Identify open WIP items in SETK, SEMAG, SELV, and SEIL.<br/>
              3. <strong>Mobilize Action:</strong> Utilize the Knox Executive Briefing tool to follow up directly with local PICs.
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 16px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8;">
          Samsung Electronics MENA • Marketing AI Lab • Marketing Intelligence Platform • Knox Ready
        </div>
      </div>
    `;
  };

  const copyRichHTMLToClipboard = async () => {
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
    } catch {
      await navigator.clipboard.writeText(generatePlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenInKnox = async () => {
    await copyRichHTMLToClipboard();
    const subject = encodeURIComponent(
      "[EXECUTIVE ANNOUNCEMENT] Introducing ai-lab-mena.com - Samsung MENA Marketing Intelligence Hub"
    );
    const body = encodeURIComponent(generatePlainText());

    window.location.href = `mailto:[leadership.recipient.placeholder@samsung.com]?subject=${subject}&body=${body}`;

    setDispatchStatus(
      "✓ Visual platform briefing copied to clipboard! Paste (Ctrl+V) directly into your Knox Mail message."
    );
    setTimeout(() => setDispatchStatus(null), 8000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#034EA2] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Executive Platform Showcase Email</span>
                <span className="rounded bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  ai-lab-mena.com
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Visual executive announcement with WHY, WHAT & HOW for Samsung MENA Leadership
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

        {/* Scrollable Email Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            {/* Header Block */}
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
                Introducing: ai-lab-mena.com
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Regional Marketing Intelligence Hub & Executive Campaign Command Center
              </p>
            </div>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Views</span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">246.1M</div>
                <span className="text-[10px] text-slate-500">Unified Across MENA</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engagements</span>
                <div className="text-xl font-black text-purple-700 mt-0.5">5.80M</div>
                <span className="text-[10px] text-slate-500">2.36% Regional ER</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creators Live</span>
                <div className="text-xl font-black text-[#034EA2] mt-0.5">329</div>
                <span className="text-[10px] text-slate-500">1,441 Posts Active</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Covered Markets</span>
                <div className="text-xl font-black text-amber-700 mt-0.5">8 Subs</div>
                <span className="text-[10px] text-slate-500">Interactive Map</span>
              </div>
            </div>

            {/* 1. THE WHY (The Strategic Pillars: Efficiency, Accuracy, Scalability) */}
            <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#034EA2] text-white font-black text-xs">
                  1
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  THE WHY • The Strategic Pillars: Efficiency, Accuracy & Scalability
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                Tracking large-scale multi-subsidiary marketing campaigns traditionally meant juggling dozens of disconnected Excel workbooks, waiting days for static PowerPoint agency presentations, and dealing with conflicting metric reports. We set out to engineer an <strong>Automated Consolidated Datasheet</strong> anchored on three strategic principles:
              </p>

              {/* 3 Pillars Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  <strong className="text-emerald-800 text-xs block mb-1">⚡ 1. EFFICIENCY</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Eliminates 15–20 hours of manual spreadsheet compilation every week. The automated pipeline ingests raw Traackr exports in under 30 seconds.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs">
                  <strong className="text-blue-800 text-xs block mb-1">🎯 2. ACCURACY</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Zero human copy-paste errors. Automated deduplication, standardized engagement formulas, and 100% mathematical consistency across all 8 markets.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200 shadow-2xs">
                  <strong className="text-purple-800 text-xs block mb-1">📈 3. SCALABILITY</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Built upon an institutional star-schema data architecture that seamlessly expands for future flagship launches and regional marketing campaigns.
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs text-slate-800">
                <strong>The Result:</strong> <strong>ai-lab-mena.com</strong> replaces static decks with living, real-time intelligence accessible 24/7 on both the live cloud and our secure offline Samsung SVPN LAN.
              </div>
            </div>

            {/* 2. THE WHAT */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white font-black text-xs">
                  2
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  THE WHAT • Core Capabilities Built on the Platform
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#034EA2] block mb-1">📍 Interactive MENA Territory Map</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Geospatial telemetry across all 8 subsidiaries with dynamic view volume ranking from Pakistan (75.3M) to Maghreb, with 1-click filter propagation.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-purple-700 block mb-1">🏆 6-Metric Content Showcase</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Dynamic sorting across Views, Engagements, Likes, Comments, Shares, and Saves, with weekly flight filters (Weeks 1 to 5) and collapsible tier sections.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-emerald-700 block mb-1">📱 Hardware Seeding & Tech Reviews</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Live hardware scorecard tracking Galaxy S26 Ultra vs. Z Fold8, 3-phase delivery pacing audits, and 1-click link verification for all 77 tech reviewers.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-amber-700 block mb-1">🎯 Lifestyle Tier Fulfillment Matrix</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Weekly delivery tracking across Team Galaxy, Content Creators, and Galaxy Circle with clickable permalinks for all 254 lifestyle creators.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-rose-700 block mb-1">✉️ Knox Executive Escalation Tool</strong>
                  <p className="text-slate-600 leading-relaxed">
                    1-click generation of executive action briefings with exact notes sourced directly from master trackers, ready to paste or launch directly in Samsung Knox Mail.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-cyan-700 block mb-1">🔒 Dual Cloud & Samsung LAN Deployment</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Accessible anywhere via public cloud (ai-lab-mena.com) or offline on internal Samsung SVPN LAN (http://liana-s01:3000) with McAfee proxy compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. THE HOW */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
                  3
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  THE HOW • How to Access & Next Steps
                </h4>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 mb-3 text-xs space-y-1">
                <div><span className="font-bold text-slate-900">Live Production Portal: </span><a href="https://www.ai-lab-mena.com" target="_blank" rel="noreferrer" className="text-[#034EA2] font-bold underline">https://www.ai-lab-mena.com</a></div>
                <div><span className="font-bold text-slate-900">Internal Samsung LAN: </span><span className="font-mono text-slate-600">http://liana-s01:3000</span></div>
                <div><span className="font-bold text-slate-900">Authentication: </span><span className="text-slate-600">Enterprise role-based credentials enabled</span></div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>1. <strong>Explore Regional Telemetry:</strong> Log in to review the macro map and subsidiary rankings.</div>
                <div>2. <strong>Audit Deliverables:</strong> Verify influencer hardware allocations and live post permalinks.</div>
                <div>3. <strong>Mobilize Follow-ups:</strong> Use the Knox Briefing tool to follow up on pending deliveries.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            Formatted for Samsung Knox Webmail & Microsoft Outlook
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Rich HTML Button */}
            <button
              onClick={copyRichHTMLToClipboard}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Copies the entire visual platform email to paste directly into Samsung Knox Mail"
            >
              <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copied ? "✓ Copied Visual Email!" : "Copy Visual Email for Knox"}</span>
            </button>

            {/* Open in Knox Mail Button */}
            <button
              onClick={handleOpenInKnox}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#034EA2] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Copies formatted email and launches Samsung Knox Mail"
            >
              <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Open in Knox Mail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

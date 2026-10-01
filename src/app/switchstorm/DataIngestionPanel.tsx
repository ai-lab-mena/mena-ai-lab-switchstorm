"use client";

import React, { useState } from "react";

export default function DataIngestionPanel() {
  const [pin, setPin] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");

  const [lifestyleFile, setLifestyleFile] = useState<File | null>(null);
  const [techFile, setTechFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().toLowerCase() === "samsung2026") {
      setIsAuthorized(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Access denied.");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lifestyleFile && !techFile) {
      setUploadError("Please select at least one file to upload (Stream A Lifestyle or Stream B Tech).");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading files & executing campaign pipeline on backend...");
    setUploadError("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("pin", pin);
    if (lifestyleFile) formData.append("streamA", lifestyleFile);
    if (techFile) formData.append("streamB", techFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setUploadError(
          "Corporate proxy blocked external upload. Please access via the local Samsung LAN IP (http://111.101.35.171:3000/switchstorm/upload) to upload directly without proxy interference."
        );
        setUploadStatus("");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed. Please check the selected files.");
        setUploadStatus("");
        return;
      }

      setUploadResult(data);
      setUploadStatus("Files ingested & database refreshed successfully!");
      setLifestyleFile(null);
      setTechFile(null);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "An unexpected error occurred during upload.");
      setUploadStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#034EA2]/20 text-[#034EA2] border border-[#034EA2]/40 shadow-inner">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Campaign Data Ingestion Portal</span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                LAN Connected
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload raw Traackr deliverables to save directly into campaign folders and auto-trigger the data pipeline.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-start sm:self-auto text-xs text-slate-400 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          {isCollapsed ? "Expand Uploader ▼" : "Collapse ▲"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="pt-4">
          {!isAuthorized ? (
            /* PIN Gate */
            <div className="max-w-md mx-auto my-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-xl text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2.5 mx-auto">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">
                Campaign Ingestion Security
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Enter the authorized campaign PIN to access the spreadsheet uploader.
              </p>

              <form onSubmit={handleVerifyPin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Access PIN"
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors text-center"
                  />
                  {pinError && <p className="text-xs text-rose-400 mt-1">{pinError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#034EA2] hover:bg-blue-600 text-white font-bold py-2 text-xs shadow-md transition-all cursor-pointer"
                >
                  Verify & Access Uploader
                </button>
              </form>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              {/* Stream A & Stream B Upload Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STREAM A: Lifestyle & Team Galaxy */}
                <div className="rounded-xl bg-slate-950/70 border border-purple-500/20 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                        Stream A • Lifestyle
                      </span>
                      {lifestyleFile && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          ✓ Selected ({(lifestyleFile.size / 1024).toFixed(0)} KB)
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      Lifestyle & Team Galaxy Export
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Expected file: <code className="text-purple-300">traackr-export-samsung___-switch_sto-posts.xlsx</code>
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-purple-400 rounded-xl p-4 text-center transition-colors cursor-pointer relative bg-slate-900/60">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => e.target.files && setLifestyleFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <svg className="h-7 w-7 text-purple-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-200">
                        {lifestyleFile ? lifestyleFile.name : "Click or drag Stream A (Lifestyle) Excel here"}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">XLSX spreadsheet up to 5MB</span>
                    </div>
                  </div>
                </div>

                {/* STREAM B: Tech & Crossover */}
                <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                        Stream B • Tech & Crossover
                      </span>
                      {techFile && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          ✓ Selected ({(techFile.size / 1024).toFixed(0)} KB)
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      Techies & Crossover Export
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Expected file: <code className="text-cyan-300">traackr-export-samsung___-switching_-posts.xlsx</code>
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-4 text-center transition-colors cursor-pointer relative bg-slate-900/60">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => e.target.files && setTechFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <svg className="h-7 w-7 text-cyan-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-200">
                        {techFile ? techFile.name : "Click or drag Stream B (Techies) Excel here"}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">XLSX spreadsheet up to 5MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Notice Box */}
              {uploadError && (
                <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-rose-400 font-bold text-sm">⚠️</span>
                  <div>
                    <span className="font-bold text-white block">Upload Notice:</span>
                    <span>{uploadError}</span>
                  </div>
                </div>
              )}

              {/* Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {uploadStatus || "Upload saves directly to campaign input folders and triggers the backend pipeline."}
                </span>

                <button
                  type="submit"
                  disabled={isUploading || (!lifestyleFile && !techFile)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isUploading || (!lifestyleFile && !techFile)
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-[#034EA2] hover:bg-blue-600 text-white shadow-blue-500/25"
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Processing & Executing Pipeline...
                    </span>
                  ) : (
                    "🚀 Upload & Execute Campaign Pipeline"
                  )}
                </button>
              </div>

              {/* Results Audit Card */}
              {uploadResult && (
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/30 p-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                      ✓
                    </span>
                    <span>{uploadResult.message}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-2">
                    {uploadResult.summary?.streamA && (
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="font-bold text-purple-400 mb-0.5">
                          {uploadResult.summary.streamA.stream}: {uploadResult.summary.streamA.fileName}
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          {uploadResult.summary.streamA.rowCount.toLocaleString()} rows • {uploadResult.summary.streamA.columns} columns ({uploadResult.summary.streamA.sizeKB} KB)
                        </div>
                      </div>
                    )}

                    {uploadResult.summary?.streamB && (
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="font-bold text-cyan-400 mb-0.5">
                          {uploadResult.summary.streamB.stream}: {uploadResult.summary.streamB.fileName}
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          {uploadResult.summary.streamB.rowCount.toLocaleString()} rows • {uploadResult.summary.streamB.columns} columns ({uploadResult.summary.streamB.sizeKB} KB)
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadResult.pipeline?.status && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-md font-mono border border-slate-800">
                      <span className="text-emerald-400 font-bold">Status:</span> {uploadResult.pipeline.status}
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";

export default function DataIngestionPanel() {
  const [pin, setPin] = useState("samsung2026");
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState("");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [lifestyleFile, setLifestyleFile] = useState<File | null>(null); // Stream A
  const [techFile, setTechFile] = useState<File | null>(null); // Stream B

  const [localDirHandle, setLocalDirHandle] = useState<any>(null);
  const [localDirName, setLocalDirName] = useState<string>("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<any>(null);

  // 1. PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === "samsung2026") {
      setIsPinVerified(true);
      setPinError("");
    } else {
      setPinError("Invalid Access PIN. Contact AI Lab admin.");
    }
  };

  // 2. Select Local Folder (Desktop / Project folder) via File System Access API
  const handleSelectLocalFolder = async () => {
    try {
      if ("showDirectoryPicker" in window) {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: "readwrite",
        });
        setLocalDirHandle(dirHandle);
        setLocalDirName(dirHandle.name);
      } else {
        alert(
          "Your current browser does not support direct folder access. Files will be saved via standard download prompt instead."
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Folder picker error:", err);
      }
    }
  };

  // 3. Save files to chosen local folder
  const saveToLocalFolder = async (file: File, filename: string) => {
    if (!localDirHandle) return false;
    try {
      const fileHandle = await localDirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      return true;
    } catch (err) {
      console.error(`Failed to save ${filename} locally:`, err);
      return false;
    }
  };

  // 4. Download fallback
  const triggerBrowserDownload = (file: File, filename: string) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 5. Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lifestyleFile && !techFile) {
      alert("Please select at least one stream file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading deliverables to cloud server...");

    try {
      const formData = new FormData();
      formData.append("pin", pin);
      if (lifestyleFile) formData.append("streamA", lifestyleFile);
      if (techFile) formData.append("streamB", techFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadResult(data);
      setUploadStatus("Deliverables uploaded and validated successfully!");

      // Save locally if directory handle is available
      if (localDirHandle) {
        if (lifestyleFile) {
          await saveToLocalFolder(lifestyleFile, "traackr-export-samsung___-switch_sto-posts.xlsx");
        }
        if (techFile) {
          await saveToLocalFolder(techFile, "traackr-export-samsung___-switching_-posts.xlsx");
        }
      }
    } catch (err: any) {
      alert("Error uploading files: " + err.message);
      setUploadStatus("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-4 sm:p-6 shadow-xl mb-6 transition-all duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>SwitchStorm Data Ingestion Portal</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Sub-Page
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload Traackr exports to refresh campaign figures and sync to your local Desktop.
            </p>
          </div>
        </div>

        {/* Header Right Actions & Small Collapse Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isPinVerified && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <span>●</span>
              <span>Active</span>
            </div>
          )}

          {/* Small Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-xs"
            title={isCollapsed ? "Expand Data Ingestion" : "Collapse Data Ingestion"}
          >
            <span>{isCollapsed ? "Show Uploader ▼" : "Hide Uploader ▲"}</span>
          </button>
        </div>
      </div>

      {isCollapsed ? (
        /* Collapsed Minimal Strip */
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Uploader collapsed. Stream A (Lifestyle) and Stream B (Techies) ready to ingest.</span>
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer ml-2"
          >
            Expand Uploader
          </button>
        </div>
      ) : !isPinVerified ? (
        /* Security Gate */
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
                    Stream B • Techies
                  </span>
                  {techFile && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      ✓ Selected ({(techFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-0.5">
                  Tech & Crossover Export
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

          {/* Local Folder / Desktop Auto-Sync */}
          <div className="rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 border border-blue-500/20 p-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">
                    Auto-Save to Local Desktop / Project Folder
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    {localDirName
                      ? `Linked Directory: ${localDirName} (Files will be written directly)`
                      : "Connect your local folder so uploaded files save directly to your computer."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectLocalFolder}
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {localDirName ? "Change Folder" : "📂 Select Local Folder"}
                </button>

                {(lifestyleFile || techFile) && !localDirName && (
                  <button
                    type="button"
                    onClick={() => {
                      if (lifestyleFile) triggerBrowserDownload(lifestyleFile, lifestyleFile.name);
                      if (techFile) triggerBrowserDownload(techFile, techFile.name);
                    }}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-3 py-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    ⬇️ Save to Desktop
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-xs text-slate-400">
              {uploadStatus || "Ready to ingest and sync campaign files"}
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
              {isUploading ? "Processing..." : "🚀 Upload & Ingest Data"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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

              {localDirName && (
                <p className="text-[11px] text-emerald-300 mt-2.5">
                  📁 Files written directly into local directory: <strong>{localDirName}</strong>
                </p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

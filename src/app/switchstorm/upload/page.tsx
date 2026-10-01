"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UploadPage() {
  const [pin, setPin] = useState("samsung2026");
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState("");

  const [minaFile, setMinaFile] = useState<File | null>(null);
  const [sachaFile, setSachaFile] = useState<File | null>(null);

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
    if (!minaFile && !sachaFile) {
      alert("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading files to cloud server...");

    try {
      const formData = new FormData();
      formData.append("pin", pin);
      if (minaFile) formData.append("minaFile", minaFile);
      if (sachaFile) formData.append("sachaFile", sachaFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadResult(data);
      setUploadStatus("Files uploaded and validated successfully!");

      // Save locally if directory handle is available
      if (localDirHandle) {
        if (minaFile) {
          await saveToLocalFolder(minaFile, "traackr-export-samsung___-switching_-posts.xlsx");
        }
        if (sachaFile) {
          await saveToLocalFolder(sachaFile, "traackr-export-samsung___-switch_sto-posts.xlsx");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#07132b] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/switchstorm" className="relative h-6 w-24 shrink-0">
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
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              SwitchStorm Data Ingestion Portal
            </h1>
            <p className="text-[11px] text-slate-400">
              Upload Traackr exports to update campaign intelligence
            </p>
          </div>
        </div>

        <Link
          href="/switchstorm"
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 border border-slate-700"
        >
          <span>← Back to Dashboard</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8">
        {!isPinVerified ? (
          /* Security Gate */
          <div className="max-w-md mx-auto mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white text-center mb-1">
              Authorized Ingestion Access
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              Enter the authorized campaign PIN to access the Excel uploader.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Access PIN"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                />
                {pinError && <p className="text-xs text-rose-400 mt-1">{pinError}</p>}
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#034EA2] hover:bg-blue-600 text-white font-bold py-2.5 text-sm shadow-md transition-all cursor-pointer"
              >
                Verify & Continue
              </button>
            </form>
          </div>
        ) : (
          /* Upload Dashboard */
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* Step 1: File Upload Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* File A: Mina (Tech & Crossovers) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      Stream A • Techies
                    </span>
                    {minaFile && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        ✓ Selected ({(minaFile.size / 1024).toFixed(0)} KB)
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Tech & Crossover Export (Mina)
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Expected: <code className="text-slate-300">traackr-export-samsung___-switching_-posts.xlsx</code>
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 text-center transition-colors cursor-pointer relative bg-slate-950/40">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => e.target.files && setMinaFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-200">
                      {minaFile ? minaFile.name : "Click or drag Mina Excel file here"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">XLSX spreadsheet up to 5MB</span>
                  </div>
                </div>
              </div>

              {/* File B: Sacha (Lifestyle) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-500/20">
                      Stream B • Lifestyle
                    </span>
                    {sachaFile && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        ✓ Selected ({(sachaFile.size / 1024).toFixed(0)} KB)
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Lifestyle Export (Sacha)
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Expected: <code className="text-slate-300">traackr-export-samsung___-switch_sto-posts.xlsx</code>
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-4 text-center transition-colors cursor-pointer relative bg-slate-950/40">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => e.target.files && setSachaFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-200">
                      {sachaFile ? sachaFile.name : "Click or drag Sacha Excel file here"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">XLSX spreadsheet up to 5MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Local Folder Sync Configuration (File System Access) */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 p-5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Local Folder / Desktop Auto-Sync
                    </h4>
                    <p className="text-xs text-slate-400">
                      {localDirName
                        ? `Linked Folder: ${localDirName} (Files will be written directly)`
                        : "Connect your Desktop or local project folder so uploads save directly to your computer."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectLocalFolder}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 transition-all cursor-pointer shadow-xs"
                  >
                    {localDirName ? "Change Folder" : "📂 Select Local Folder"}
                  </button>

                  {/* Fallback download buttons if user wants quick direct save */}
                  {(minaFile || sachaFile) && !localDirName && (
                    <button
                      type="button"
                      onClick={() => {
                        if (minaFile) triggerBrowserDownload(minaFile, minaFile.name);
                        if (sachaFile) triggerBrowserDownload(sachaFile, sachaFile.name);
                      }}
                      className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-3 py-2 border border-slate-700 transition-all cursor-pointer"
                    >
                      ⬇️ Save to Desktop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Action Button */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-400">
                {uploadStatus || "Ready to upload and process files"}
              </span>

              <button
                type="submit"
                disabled={isUploading || (!minaFile && !sachaFile)}
                className={`rounded-xl px-6 py-3 text-sm font-bold transition-all shadow-lg cursor-pointer ${
                  isUploading || (!minaFile && !sachaFile)
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-[#034EA2] hover:bg-blue-600 text-white shadow-blue-500/25"
                }`}
              >
                {isUploading ? "Processing..." : "🚀 Upload & Ingest Data"}
              </button>
            </div>

            {/* Validation Results Card */}
            {uploadResult && (
              <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-5 mt-6 animate-fadeIn">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    ✓
                  </span>
                  <span>{uploadResult.message}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {uploadResult.summary?.mina && (
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-bold text-cyan-400 mb-1">
                        Techies File: {uploadResult.summary.mina.fileName}
                      </div>
                      <div className="text-slate-300">
                        {uploadResult.summary.mina.rowCount.toLocaleString()} rows • {uploadResult.summary.mina.columns} columns ({uploadResult.summary.mina.sizeKB} KB)
                      </div>
                    </div>
                  )}

                  {uploadResult.summary?.sacha && (
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-bold text-purple-400 mb-1">
                        Lifestyle File: {uploadResult.summary.sacha.fileName}
                      </div>
                      <div className="text-slate-300">
                        {uploadResult.summary.sacha.rowCount.toLocaleString()} rows • {uploadResult.summary.sacha.columns} columns ({uploadResult.summary.sacha.sizeKB} KB)
                      </div>
                    </div>
                  )}
                </div>

                {localDirName && (
                  <p className="text-xs text-emerald-300 mt-3">
                    📁 Files were also written directly into your local directory: <strong>{localDirName}</strong>
                  </p>
                )}
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

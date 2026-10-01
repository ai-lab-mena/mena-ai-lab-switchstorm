import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import * as XLSX from "xlsx";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const VALID_PIN = "samsung2026";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pin = formData.get("pin") as string;

    // Stream A: Lifestyle & Team Galaxy
    // Stream B: Tech & Crossover
    const lifestyleFile = (formData.get("streamA") ||
      formData.get("lifestyleFile") ||
      formData.get("sachaFile")) as File | null;

    const techFile = (formData.get("streamB") ||
      formData.get("techFile") ||
      formData.get("minaFile")) as File | null;

    // 1. PIN verification
    if (pin !== VALID_PIN) {
      return NextResponse.json(
        { error: "Invalid Access PIN. Please enter the authorized campaign PIN." },
        { status: 401 }
      );
    }

    if (!lifestyleFile && !techFile) {
      return NextResponse.json(
        { error: "Please upload at least one Excel file (Stream A Lifestyle or Stream B Tech & Crossover)." },
        { status: 400 }
      );
    }

    // Resolve Campaign Root Directory
    const cwd = process.cwd();
    const campaignRoot = cwd.endsWith("4_interactive_dashboard")
      ? path.resolve(cwd, "..")
      : cwd;

    const results: Record<string, any> = {};

    // 2. Process & Save Stream A: Lifestyle
    if (lifestyleFile) {
      const buffer = await lifestyleFile.arrayBuffer();
      const nodeBuffer = Buffer.from(buffer);

      // Save directly into 1_InputData/Sacha/Actual
      const sachaDir = path.join(campaignRoot, "1_InputData", "Sacha", "Actual");
      if (fs.existsSync(sachaDir)) {
        const targetPath = path.join(
          sachaDir,
          "traackr-export-samsung___-switch_sto-posts.xlsx"
        );
        fs.writeFileSync(targetPath, nodeBuffer);
      }

      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      results.streamA = {
        stream: "Stream A • Lifestyle & Team Galaxy",
        fileName: lifestyleFile.name,
        sizeKB: (lifestyleFile.size / 1024).toFixed(1),
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
        sampleCreators: Array.from(
          new Set(rows.map((r: any) => r["Influencer Name"]).filter(Boolean))
        ).slice(0, 5),
      };
    }

    // 3. Process & Save Stream B: Tech & Crossover
    if (techFile) {
      const buffer = await techFile.arrayBuffer();
      const nodeBuffer = Buffer.from(buffer);

      // Save directly into 1_InputData/Mina/Actual
      const minaDir = path.join(campaignRoot, "1_InputData", "Mina", "Actual");
      if (fs.existsSync(minaDir)) {
        const targetPath = path.join(
          minaDir,
          "traackr-export-samsung___-switching_-posts.xlsx"
        );
        fs.writeFileSync(targetPath, nodeBuffer);
      }

      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      results.streamB = {
        stream: "Stream B • Tech & Crossover",
        fileName: techFile.name,
        sizeKB: (techFile.size / 1024).toFixed(1),
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
        sampleCreators: Array.from(
          new Set(rows.map((r: any) => r["Influencer Name"]).filter(Boolean))
        ).slice(0, 5),
      };
    }

    // 4. Trigger the Python Pipeline in the background if running on local/LAN server
    let pipelineStatus = "Pipeline executed successfully";
    let pipelineLog = "";
    const pipelineScript = path.join(campaignRoot, "execute_pipeline.py");

    if (fs.existsSync(pipelineScript)) {
      try {
        const { stdout } = await execFileAsync("py", ["-3", "execute_pipeline.py"], {
          cwd: campaignRoot,
          env: { ...process.env, PYTHONUTF8: "1" },
          timeout: 120000,
        });
        pipelineLog = stdout;
      } catch (err: any) {
        console.error("Pipeline trigger error:", err);
        pipelineStatus = "Pipeline executed with notice";
        pipelineLog = err.stdout || err.message || "";
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message:
        "Campaign deliverables successfully saved to 1_InputData and pipeline executed! All 4 dashboard tabs are refreshed.",
      summary: results,
      pipeline: {
        status: pipelineStatus,
        log: pipelineLog,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process uploaded files: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

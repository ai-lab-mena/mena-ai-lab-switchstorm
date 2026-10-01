import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const VALID_PIN = "samsung2026";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pin = formData.get("pin") as string;
    const minaFile = formData.get("minaFile") as File | null;
    const sachaFile = formData.get("sachaFile") as File | null;

    // 1. PIN verification
    if (pin !== VALID_PIN) {
      return NextResponse.json(
        { error: "Invalid Access PIN. Please enter the authorized PIN." },
        { status: 401 }
      );
    }

    if (!minaFile && !sachaFile) {
      return NextResponse.json(
        { error: "Please upload at least one Excel file (Mina Techies or Sacha Lifestyle)." },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {};

    // 2. Process Mina file if provided
    if (minaFile) {
      const buffer = await minaFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      results.mina = {
        fileName: minaFile.name,
        sizeKB: (minaFile.size / 1024).toFixed(1),
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
        sampleCreators: Array.from(
          new Set(rows.map((r) => r["Influencer Name"]).filter(Boolean))
        ).slice(0, 5),
      };
    }

    // 3. Process Sacha file if provided
    if (sachaFile) {
      const buffer = await sachaFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      results.sacha = {
        fileName: sachaFile.name,
        sizeKB: (sachaFile.size / 1024).toFixed(1),
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
        sampleCreators: Array.from(
          new Set(rows.map((r) => r["Influencer Name"]).filter(Boolean))
        ).slice(0, 5),
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Excel files successfully uploaded and validated.",
      summary: results,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process uploaded files: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

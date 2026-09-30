import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // 1. YouTube handling
  const ytMatch = targetUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    return NextResponse.redirect(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }

  // 2. Instagram handling
  const igMatch = targetUrl.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/);
  if (igMatch) {
    return NextResponse.redirect(`https://www.instagram.com/p/${igMatch[1]}/media/?size=l`, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }

  // 3. TikTok handling via cloud oEmbed
  if (targetUrl.includes("tiktok.com")) {
    try {
      let httpsUrl = targetUrl.replace("http://", "https://");
      if (httpsUrl.startsWith("https://tiktok.com/")) {
        httpsUrl = httpsUrl.replace("https://tiktok.com/", "https://www.tiktok.com/");
      }

      const oembedApi = `https://www.tiktok.com/oembed?url=${encodeURIComponent(httpsUrl)}`;
      const res = await fetch(oembedApi, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.thumbnail_url) {
          return NextResponse.redirect(json.thumbnail_url, {
            status: 302,
            headers: {
              "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
            },
          });
        }
      }
    } catch {
      // Fallback below
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}

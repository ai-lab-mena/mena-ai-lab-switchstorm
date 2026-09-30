import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // 1. YouTube - direct CDN redirect (YouTube allows cross-origin embedding)
  const ytMatch = targetUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    return NextResponse.redirect(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }

  let imageUrl: string | null = null;

  // 2. Direct CDN or image link passed
  if (
    targetUrl.startsWith("http") &&
    (targetUrl.includes(".jpg") ||
      targetUrl.includes(".jpeg") ||
      targetUrl.includes(".png") ||
      targetUrl.includes(".webp") ||
      targetUrl.includes("tiktokcdn") ||
      targetUrl.includes("fbcdn.net"))
  ) {
    imageUrl = targetUrl;
  }

  // 3. Instagram Post or Reel
  if (!imageUrl && targetUrl.includes("instagram.com")) {
    const igMatch = targetUrl.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/);
    if (igMatch) {
      imageUrl = `https://www.instagram.com/p/${igMatch[1]}/media/?size=l`;
    }
  }

  // 4. TikTok Video Post
  if (!imageUrl && targetUrl.includes("tiktok.com")) {
    try {
      let cleanUrl = targetUrl.startsWith("http://")
        ? targetUrl.replace("http://", "https://")
        : targetUrl;
      if (cleanUrl.startsWith("https://tiktok.com/")) {
        cleanUrl = cleanUrl.replace("https://tiktok.com/", "https://www.tiktok.com/");
      }

      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
        {
          headers: { "User-Agent": USER_AGENT },
          next: { revalidate: 86400 },
        }
      );

      if (oembedRes.ok) {
        const json = await oembedRes.json();
        if (json.thumbnail_url) {
          imageUrl = json.thumbnail_url;
        }
      }
    } catch (e) {
      console.error("TikTok oembed error:", e);
    }
  }

  // 5. Proxy and stream image bytes to bypass browser CORP (Cross-Origin-Resource-Policy)
  if (imageUrl) {
    try {
      const imgRes = await fetch(imageUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        redirect: "follow",
      });

      if (imgRes.ok) {
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";
        const buffer = await imgRes.arrayBuffer();

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control":
              "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
            "Access-Control-Allow-Origin": "*",
            "Cross-Origin-Resource-Policy": "cross-origin",
          },
        });
      }
    } catch (e) {
      console.error("Failed to proxy image:", e);
    }
  }

  return new NextResponse("Thumbnail Not Available", { status: 404 });
}

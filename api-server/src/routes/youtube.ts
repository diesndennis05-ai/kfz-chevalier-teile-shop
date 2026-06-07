import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

let cachedChannelId: string | null = null;
let cachedVideos: YoutubeVideo[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export interface YoutubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
  url: string;
}

async function getChannelId(): Promise<string | null> {
  if (cachedChannelId) return cachedChannelId;
  try {
    const res = await fetch("https://www.youtube.com/@ChevSache", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KFZ-Chevalier-Bot/1.0)",
        "Accept-Language": "de-DE,de;q=0.9",
      },
    });
    const html = await res.text();
    // Extract channel ID from the page HTML
    const match = html.match(/"externalId":"(UC[a-zA-Z0-9_-]+)"/);
    if (match?.[1]) {
      cachedChannelId = match[1];
      logger.info({ channelId: cachedChannelId }, "Resolved YouTube channel ID");
      return cachedChannelId;
    }
    // Fallback: try another pattern
    const match2 = html.match(/channel\/(UC[a-zA-Z0-9_-]+)/);
    if (match2?.[1]) {
      cachedChannelId = match2[1];
      return cachedChannelId;
    }
    return null;
  } catch (err) {
    logger.error({ err }, "Failed to resolve YouTube channel ID");
    return null;
  }
}

async function fetchVideos(): Promise<YoutubeVideo[]> {
  if (cachedVideos && Date.now() < cacheExpiry) return cachedVideos;

  const channelId = await getChannelId();
  if (!channelId) return [];

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(rssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; KFZ-Chevalier-Bot/1.0)" },
  });

  if (!res.ok) {
    logger.error({ status: res.status, rssUrl }, "YouTube RSS fetch failed");
    return [];
  }

  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1);
  const videos: YoutubeVideo[] = entries.map((entry) => {
    const videoId = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) ?? [])[1] ?? "";
    const title = (entry.match(/<title>([^<]+)<\/title>/) ?? [])[1] ?? "";
    const published = (entry.match(/<published>([^<]+)<\/published>/) ?? [])[1] ?? "";
    const thumbnail = (entry.match(/url="([^"]+)"[^>]*\/>/) ?? [])[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const description = (entry.match(/<media:description>([^<]*)<\/media:description>/) ?? [])[1] ?? "";

    return {
      id: videoId,
      title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      published,
      thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      description: description.replace(/&amp;/g, "&").replace(/&lt;/g, "<").slice(0, 200),
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }).filter(v => v.id);

  cachedVideos = videos;
  cacheExpiry = Date.now() + CACHE_TTL_MS;
  return videos;
}

router.get("/youtube/videos", async (req, res) => {
  try {
    const videos = await fetchVideos();
    res.json({ videos, channelUrl: "https://www.youtube.com/@ChevSache" });
  } catch (err) {
    req.log.error({ err }, "YouTube videos endpoint failed");
    res.status(500).json({ error: "Konnte YouTube-Videos nicht laden" });
  }
});

export default router;

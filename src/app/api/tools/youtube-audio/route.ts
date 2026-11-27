import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSec } = checkRateLimit(`yt-audio:${ip}`, 15, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Vui lòng thử lại sau ${retryAfterSec} giây.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawUrl = String(body?.url || '').trim();
    const videoId = extractYoutubeId(rawUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Đường dẫn YouTube không hợp lệ. Vui lòng dán link dạng youtube.com/watch?v=... hoặc youtu.be/...' },
        { status: 400 }
      );
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 1. Fetch verified public metadata via YouTube oEmbed
    let title = `YouTube Video (${videoId})`;
    let authorName = '';
    let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (oembedRes.ok) {
        const meta = await oembedRes.json();
        title = meta.title || title;
        authorName = meta.author_name || '';
        thumbnailUrl = meta.thumbnail_url || thumbnailUrl;
      }
    } catch (err) {
      console.warn('[youtube-audio] oEmbed lookup failed:', err);
    }

    // 2. If a self-hosted audio extraction worker (e.g. Cobalt / yt-dlp API) is configured, call it
    const workerUrl = process.env.YOUTUBE_AUDIO_API_URL;
    if (workerUrl) {
      try {
        const workerRes = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            url: canonicalUrl,
            downloadMode: 'audio',
            audioFormat: 'mp3',
            audioBitrate: '192',
          }),
          signal: AbortSignal.timeout(20000),
        });

        if (workerRes.ok) {
          const workerData = await workerRes.json();
          const downloadUrl = workerData.url || workerData.downloadUrl || null;
          if (downloadUrl) {
            return NextResponse.json({
              videoId,
              title,
              authorName,
              thumbnailUrl,
              directDownloadAvailable: true,
              downloadUrl,
            });
          }
        }
      } catch (err) {
        console.error('[youtube-audio] Worker call failed:', err);
      }
    }

    // 3. Return verified YouTube metadata & HD thumbnails cleanly
    return NextResponse.json({
      videoId,
      title,
      authorName,
      thumbnailUrl,
      directDownloadAvailable: false,
    });
  } catch (error) {
    console.error('[youtube-audio] Error:', error);
    return NextResponse.json(
      { error: 'Không thể kiểm tra đường dẫn YouTube lúc này.' },
      { status: 500 }
    );
  }
}

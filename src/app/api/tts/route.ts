import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tl = searchParams.get('tl') || 'vi';
    let q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ error: 'Text parameter "q" is required' }, { status: 400 });
    }

    // Safety truncate to 190 characters to stay within Google Translate's 200 char hard limit
    if (q.length > 190) {
      q = q.substring(0, 190);
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${encodeURIComponent(q)}`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!response.ok) {
      console.error(`Google TTS request failed with status: ${response.status}`);
      return NextResponse.json({ error: 'Failed to fetch TTS from Google' }, { status: 502 });
    }

    // Get the audio array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Return the audio buffer directly as audio/mpeg with caching
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

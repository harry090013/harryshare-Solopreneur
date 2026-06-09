import { NextRequest, NextResponse } from 'next/server';

// Escape XML helper for SSML
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

async function tryAzureTts(text: string, lang: string): Promise<Response | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'southeastasia';

  if (!key || key.trim() === '') {
    return null;
  }

  // Voice mappings (Neural voices for high quality)
  const voiceName = lang === 'en' ? 'en-US-JennyNeural' : 'vi-VN-HoaiMyNeural';
  const xmlLang = lang === 'en' ? 'en-US' : 'vi-VN';

  // Prepare SSML wrapper
  const ssml = `<speak version='1.0' xml:lang='${xmlLang}'><voice name='${voiceName}'>${escapeXml(text)}</voice></speak>`;

  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'HarryShareTTS'
    },
    body: ssml
  });

  if (!response.ok) {
    console.error(`Azure TTS failed: ${response.status} ${await response.text()}`);
    return null;
  }

  return response;
}

async function tryOpenAiTts(text: string, lang: string): Promise<Response | null> {
  const key = process.env.OPENAI_API_KEY;

  if (!key || key.trim() === '') {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'alloy', // Warm and neutral voice
      response_format: 'mp3'
    })
  });

  if (!response.ok) {
    console.error(`OpenAI TTS failed: ${response.status} ${await response.text()}`);
    return null;
  }

  return response;
}

async function getGoogleTts(text: string, lang: string): Promise<Response> {
  // Safety truncate to 190 characters to stay within Google Translate's 200 char limit
  const truncated = text.substring(0, 190);
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(truncated)}`;

  return fetch(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tl = searchParams.get('tl') || 'vi';
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ error: 'Text parameter "q" is required' }, { status: 400 });
    }

    // 1. Try Microsoft Azure Speech Service (Primary)
    try {
      const azureResponse = await tryAzureTts(q, tl);
      if (azureResponse) {
        const arrayBuffer = await azureResponse.arrayBuffer();
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
    } catch (azureErr) {
      console.error('Error invoking Azure Neural TTS, triggering fallback chain:', azureErr);
    }

    // 2. Try OpenAI TTS (Secondary fallback)
    try {
      const openAiResponse = await tryOpenAiTts(q, tl);
      if (openAiResponse) {
        const arrayBuffer = await openAiResponse.arrayBuffer();
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
    } catch (openAiErr) {
      console.error('Error invoking OpenAI TTS, triggering fallback chain:', openAiErr);
    }

    // 3. Try Google Translate TTS (Unlimited, free default fallback)
    const googleResponse = await getGoogleTts(q, tl);
    if (!googleResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch speech audio from all engines' }, { status: 502 });
    }

    const arrayBuffer = await googleResponse.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });

  } catch (error: any) {
    console.error('TTS handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const maxDuration = 60;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB safe limit for Vercel Serverless Functions
const ALLOWED_MIME_PREFIXES = ['audio/', 'video/mp4', 'video/webm', 'application/octet-stream'];

function cleanSrtOutput(raw: string): string {
  return raw
    .replace(/^```(?:srt|subrip|text)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function srtToPlainText(srt: string): string {
  return srt
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (/^\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(trimmed)) return false;
      return true;
    })
    .join('\n');
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSec } = checkRateLimit(`audio-to-srt:${ip}`, 6, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Bạn thao tác hơi nhanh, vui lòng thử lại sau ${retryAfterSec} giây nhé.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const language = String(formData.get('language') || 'vi').trim();
    const mode = String(formData.get('mode') || 'lyrics').trim(); // 'lyrics' | 'subtitle'

    if (!file) {
      return NextResponse.json({ error: 'Vui lòng chọn một tệp âm thanh (MP3, WAV, M4A, OGG).' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Tệp âm thanh vượt quá giới hạn 4MB của máy chủ miễn phí. Bạn có thể cắt ngắn tệp hoặc dùng trình đồng bộ SRT thủ công ngay bên dưới.' },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'audio/mpeg';
    if (!ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix))) {
      return NextResponse.json({ error: 'Định dạng tệp không phải âm thanh hợp lệ.' }, { status: 400 });
    }

    // 1. Prefer OpenAI Whisper if OPENAI_API_KEY is configured
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      const whisperForm = new FormData();
      whisperForm.append('file', file, file.name || 'audio.mp3');
      whisperForm.append('model', 'whisper-1');
      whisperForm.append('response_format', 'srt');
      if (language && language !== 'auto') {
        whisperForm.append('language', language);
      }

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiKey}`,
        },
        body: whisperForm,
      });

      if (res.ok) {
        const srt = cleanSrtOutput(await res.text());
        return NextResponse.json({
          srt,
          plainText: srtToPlainText(srt),
          provider: 'OpenAI Whisper',
        });
      }
      console.error('[audio-to-srt] OpenAI Whisper error:', res.status, await res.text());
    }

    // 2. Use Gemini 2.5 Flash multimodal audio transcription
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'Hệ thống AI tách lời hiện chưa được cấu hình API Key. Bạn vẫn có thể dùng chế độ đồng bộ SRT thủ công miễn phí ngay trên trình duyệt.' },
        { status: 503 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    const langInstruction =
      language === 'vi'
        ? 'Tiếng Việt (giữ đúng dấu tiếng Việt chuẩn xác)'
        : language === 'en'
          ? 'Tiếng Anh (English)'
          : 'ngôn ngữ gốc trong bản thu';

    const modeInstruction =
      mode === 'lyrics'
        ? 'Đây là bài hát / bản thu âm có lời ca. Hãy tách từng câu hát rõ ràng thành phụ đề bài hát (lyrics).'
        : 'Đây là bản thu giọng nói / bài giảng / hội thoại. Hãy chép lại chính xác từng câu nói thành phụ đề.';

    const prompt = `${modeInstruction}
Ngôn ngữ chính: ${langInstruction}.
Yêu cầu định dạng ĐẦU RA DUY NHẤT là chuẩn SubRip (.srt), KHÔNG giải thích thêm, KHÔNG bọc trong markdown:
1
00:00:00,000 --> 00:00:04,200
Nội dung câu thứ nhất

2
00:00:04,200 --> 00:00:08,500
Nội dung câu thứ hai

Lưu ý: Mốc thời gian HH:MM:SS,mmm phải bám sát thời điểm thực tế trong âm thanh, ngắt câu tự nhiên (mỗi đoạn 1-2 dòng ngắn dễ đọc).`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType === 'application/octet-stream' ? 'audio/mpeg' : mimeType,
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('[audio-to-srt] Gemini API error:', geminiRes.status, errBody);
      return NextResponse.json(
        { error: 'Không thể xử lý âm thanh qua AI lúc này. Vui lòng thử lại với tệp ngắn hơn hoặc dùng trình tạo SRT thủ công bên dưới.' },
        { status: 502 }
      );
    }

    const geminiJson = await geminiRes.json();
    const rawText: string =
      geminiJson?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || '')
        .join('\n') || '';

    const srt = cleanSrtOutput(rawText);
    if (!srt) {
      return NextResponse.json(
        { error: 'AI không nhận diện được giọng nói/lời hát rõ ràng trong tệp âm thanh này.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      srt,
      plainText: srtToPlainText(srt),
      provider: 'Gemini AI Audio',
    });
  } catch (error) {
    console.error('[audio-to-srt] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tách phụ đề SRT. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

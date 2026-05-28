import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import dns from 'dns/promises';

// Helper to filter bad words and spam content (Vietnamese & English)
function isSpamOrBadContent(name: string, subject: string, message: string): boolean {
  const fields = [name, subject, message];
  
  const normalizedFields = fields.map(f => 
    (f || '').toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese accents
  );

  // Swear words and spam keywords (without accents)
  const spamKeywords = [
    'cut', 'dit', 'lon', 'cac', 'dcm', 'an cut', 'chich', 'dam', 'buoi', 'cuc', 'ancut',
    'casino', 'co bac', 'xo so', 'lo de', 'viagra', 'sex', 'danh bac', 'phim sex', 'phim 18',
    'mua ban dam', 'gai goi'
  ];

  return normalizedFields.some(field => {
    return spamKeywords.some(keyword => {
      if (keyword.includes(' ')) {
        return field.includes(keyword);
      }
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(field);
    });
  });
}

// Helper to verify if the email domain is valid and not disposable
async function verifyEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;

    const disposableDomains = [
      'yopmail.com', 'tempmail.com', '10minutemail.com', 'mailinator.com',
      'guerrillamail.com', 'dispostable.com', 'getairmail.com', 'throwawaymail.com',
      'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com', 'guerrillamail.net',
      'guerrillamail.org', 'guerrillamail.biz', 'pokemail.net', 'yopmail.fr', 'yopmail.net'
    ];

    if (disposableDomains.includes(domain.toLowerCase())) {
      return false;
    }

    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return false;
    }
    // Fallback to true if DNS lookup fails due to temporary network issues
    return true;
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message, website } = await request.json();

    // 1. HONEYPOT CHECK (Silent Drop / Shadow Ban)
    // If the invisible 'website' field is filled, we pretend success but do not save to DB
    if (website && website.trim() !== '') {
      console.warn('Honeypot field filled by bot. Performing Silent Drop.');
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // 2. REQUIRED FIELDS VALIDATION
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    // 3. EMAIL FORMAT VALIDATION
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Địa chỉ email không hợp lệ.' },
        { status: 400 }
      );
    }

    // 4. DNS MX LOOKUP AND DISPOSABLE EMAIL CHECK
    const isRealEmail = await verifyEmailDomain(email);
    if (!isRealEmail) {
      return NextResponse.json(
        { error: 'Địa chỉ email không tồn tại hoặc không thể nhận thư. Vui lòng nhập email thật.' },
        { status: 400 }
      );
    }

    // 5. PROFANITY & SPAM FILTER CHECK (Silent Drop / Shadow Ban)
    if (isSpamOrBadContent(name, subject, message)) {
      console.warn(`Spam or bad words detected from ${email}. Performing Silent Drop.`);
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // 6. SAVE TO POSTGRESQL (Normal flow for clean messages)
    await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

import React from 'react';
import type { Metadata } from 'next';
import LienHeClient from './LienHeClient';

export const metadata: Metadata = {
  title: 'Liên hệ & Kết nối | HarryShare.vn',
  description: 'Gửi tin nhắn, đặt câu hỏi hoặc đề xuất hợp tác trực tiếp với Harry (Quang Hiếu). Mình luôn chào đón những cơ hội kết nối ý nghĩa.',
  alternates: {
    canonical: '/lien-he',
  },
  openGraph: {
    title: 'Liên hệ & Kết nối | HarryShare.vn',
    description: 'Gửi tin nhắn, đặt câu hỏi hoặc đề xuất hợp tác trực tiếp với Harry (Quang Hiếu).',
    url: 'https://harryshare.vn/lien-he',
  },
};

export default function ContactPage() {
  return <LienHeClient />;
}

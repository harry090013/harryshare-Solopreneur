import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

export async function GET() {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const headers = ['title', 'slug', 'description', 'content', 'coverImage', 'readTime', 'published', 'categorySlug'];
    const sampleRow = [
      'Bài viết mẫu 1',
      'bai-viet-mau-1',
      'Mô tả ngắn gọn về bài viết mẫu số 1.',
      '# Tiêu đề bài viết mẫu\n\nNội dung Markdown ở đây. Có thể xuống dòng bình thường.',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      '5',
      'true',
      'tu-duy-san-pham'
    ];

    // Combine headers and sample row. Excel requires UTF-8 BOM (\uFEFF) to display Vietnamese accents correctly
    const csvContent = '\uFEFF' + [
      headers.join(','),
      sampleRow.map(val => `"${val.replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="posts_import_template.csv"'
      }
    });
  } catch (error) {
    console.error('Template export error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

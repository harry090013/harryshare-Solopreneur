import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  // Strip UTF-8 BOM if present
  let cleanText = text;
  if (cleanText.startsWith('\uFEFF')) {
    cleanText = cleanText.substring(1);
  }

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell);
        cell = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell);
        result.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }
  
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    result.push(row);
  }
  
  return result;
}

export async function POST(request: Request) {
  try {
    const auth = await checkAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp tải lên.' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json({ error: 'Tệp CSV không có dữ liệu hoặc chỉ có dòng tiêu đề.' }, { status: 400 });
    }

    const rawHeaders = rows[0];
    const headers = rawHeaders.map(h => h.trim().toLowerCase());

    const titleIdx = headers.indexOf('title');
    const slugIdx = headers.indexOf('slug');
    const descIdx = headers.indexOf('description');
    const contentIdx = headers.indexOf('content');
    const coverIdx = headers.indexOf('coverimage');
    const readTimeIdx = headers.indexOf('readtime');
    const publishedIdx = headers.indexOf('published');
    const categorySlugIdx = headers.indexOf('categoryslug');

    const missingHeaders: string[] = [];
    if (titleIdx === -1) missingHeaders.push('title');
    if (slugIdx === -1) missingHeaders.push('slug');
    if (descIdx === -1) missingHeaders.push('description');
    if (contentIdx === -1) missingHeaders.push('content');
    if (categorySlugIdx === -1) missingHeaders.push('categoryslug');

    if (missingHeaders.length > 0) {
      return NextResponse.json({
        error: `Tệp CSV thiếu các cột bắt buộc: ${missingHeaders.join(', ')}.`
      }, { status: 400 });
    }

    // Cache categories & existing slugs to minimize database queries
    const categories = await db.category.findMany({
      where: { type: 'post' }
    });
    const categoryMap = new Map(categories.map(c => [c.slug.trim().toLowerCase(), c.id]));

    const existingPosts = await db.post.findMany({
      select: { slug: true }
    });
    const dbSlugs = new Set(existingPosts.map(p => p.slug.trim().toLowerCase()));
    
    const csvSlugs = new Set<string>();
    const errors: string[] = [];
    const postsToCreate: any[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows (e.g. trailing newlines)
      if (row.length === 0 || (row.length === 1 && row[0].trim() === '')) {
        continue;
      }

      const rowNum = i + 1;
      const title = row[titleIdx]?.trim();
      const slug = row[slugIdx]?.trim();
      const description = row[descIdx]?.trim();
      const content = row[contentIdx]?.trim();
      const categorySlug = row[categorySlugIdx]?.trim();

      const coverImage = coverIdx !== -1 ? row[coverIdx]?.trim() : '';
      const readTimeVal = readTimeIdx !== -1 ? row[readTimeIdx]?.trim() : '';
      const publishedVal = publishedIdx !== -1 ? row[publishedIdx]?.trim().toLowerCase() : '';

      // Check required fields
      if (!title) errors.push(`Dòng ${rowNum}: Thiếu tiêu đề (title).`);
      if (!slug) errors.push(`Dòng ${rowNum}: Thiếu đường dẫn tĩnh (slug).`);
      if (!description) errors.push(`Dòng ${rowNum}: Thiếu mô tả (description).`);
      if (!content) errors.push(`Dòng ${rowNum}: Thiếu nội dung (content).`);
      if (!categorySlug) errors.push(`Dòng ${rowNum}: Thiếu danh mục (categorySlug).`);

      if (!title || !slug || !description || !content || !categorySlug) {
        continue;
      }

      const slugKey = slug.toLowerCase();
      // Check duplicate slug in CSV
      if (csvSlugs.has(slugKey)) {
        errors.push(`Dòng ${rowNum}: Đường dẫn tĩnh (slug) "${slug}" bị trùng lặp trong tệp tin.`);
      } else {
        csvSlugs.add(slugKey);
      }

      // Check duplicate slug in DB
      if (dbSlugs.has(slugKey)) {
        errors.push(`Dòng ${rowNum}: Đường dẫn tĩnh (slug) "${slug}" đã tồn tại trên hệ thống.`);
      }

      // Check category existence
      const catKey = categorySlug.toLowerCase();
      if (!categoryMap.has(catKey)) {
        errors.push(`Dòng ${rowNum}: Danh mục bài viết với slug "${categorySlug}" không tồn tại.`);
      }

      if (errors.length > 0) {
        continue;
      }

      let readTime = parseInt(readTimeVal) || 5;
      if (readTime < 1) readTime = 5;

      const published = publishedVal === 'true';

      postsToCreate.push({
        title,
        slug,
        description,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime,
        published,
        categoryId: categoryMap.get(catKey)!,
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (postsToCreate.length === 0) {
      return NextResponse.json({ error: 'Không có dữ liệu bài viết hợp lệ để nhập.' }, { status: 400 });
    }

    // Insert in transaction
    const result = await db.post.createMany({
      data: postsToCreate
    });

    return NextResponse.json({
      success: true,
      message: `Đã nhập thành công ${result.count} bài viết.`
    });
  } catch (error) {
    console.error('Import CSV error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi nhập dữ liệu từ CSV.' }, { status: 500 });
  }
}

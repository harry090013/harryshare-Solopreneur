import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, resourceId } = await request.json();

    if (!email || !resourceId) {
      return NextResponse.json(
        { error: 'Vui lòng điền email và chọn tài nguyên tải xuống.' },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Định dạng email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Verify ProjectResource exists and is a freebie
    const resource = await db.projectResource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Tài nguyên này không tồn tại.' },
        { status: 404 }
      );
    }

    if (resource.type !== 'freebie') {
      return NextResponse.json(
        { error: 'Tài nguyên được chọn không phải là tài liệu tải miễn phí.' },
        { status: 400 }
      );
    }

    if (!resource.downloadUrl) {
      return NextResponse.json(
        { error: 'Link tải của tài nguyên này hiện đang được cập nhật, vui lòng quay lại sau.' },
        { status: 400 }
      );
    }

    // Find if Subscriber exists in newsletter table
    const existing = await db.newsletter.findUnique({
      where: { email }
    });

    if (!existing) {
      // Save subscriber with email
      await db.newsletter.create({
        data: {
          email,
        }
      });
    }

    // SMTP check note: Since no SMTP configuration details exist in the local workspace (.env / env variables),
    // we return the download URL directly to the user so they can access it on the success modal.
    return NextResponse.json({
      success: true,
      downloadUrl: resource.downloadUrl,
      message: 'Nhận tài liệu thành công!'
    });
  } catch (error) {
    console.error('Download processing error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý yêu cầu tải tài liệu.' },
      { status: 500 }
    );
  }
}

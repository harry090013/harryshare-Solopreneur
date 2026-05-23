import React from 'react';
import { db } from '@/lib/db';
import CommentsClient from './CommentsClient';

export const revalidate = 0;

export default async function AdminCommentsPage() {
  let comments: any[] = [];

  try {
    comments = await db.comment.findMany({
      include: {
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err) {
    console.error('Database query failed in admin comments page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <CommentsClient initialComments={comments} />
    </div>
  );
}

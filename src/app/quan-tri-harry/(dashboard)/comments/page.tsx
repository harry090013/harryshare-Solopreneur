import React from 'react';
import { db } from '@/lib/db';
import CommentsClient from './CommentsClient';

export const revalidate = 0;

export default async function AdminCommentsPage() {
  let comments: any[] = [];
  let categories: any[] = [];

  try {
    const [dbComments, dbCategories] = await Promise.all([
      db.comment.findMany({
        include: {
          post: {
            select: {
              title: true,
              slug: true,
              categoryId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.category.findMany({
        where: { type: 'post' }
      })
    ]);

    if (dbComments) comments = dbComments;
    if (dbCategories) categories = dbCategories;
  } catch (err) {
    console.error('Database query failed in admin comments page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <CommentsClient initialComments={comments} categories={categories} />
    </div>
  );
}

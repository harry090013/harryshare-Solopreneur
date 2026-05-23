import React from 'react';
import { db } from '@/lib/db';
import MediaClient from './MediaClient';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  // Fetch existing media list from db on load
  const mediaItems = await db.media.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedMedia = mediaItems.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    size: m.size,
    createdAt: m.createdAt.toISOString(),
    url: `/api/media/${m.id}`
  }));

  return <MediaClient initialMedia={formattedMedia} />;
}

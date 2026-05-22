import React from 'react';
import { db } from '@/lib/db';
import OrdersClient from './OrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    orders = await db.productOrder.findMany({
      include: {
        product: {
          select: {
            title: true,
            slug: true,
            price: true,
            image: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err) {
    console.error('Database query failed in admin orders page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <OrdersClient initialOrders={orders} />
    </div>
  );
}

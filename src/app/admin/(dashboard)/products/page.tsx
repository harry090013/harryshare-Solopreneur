import React from 'react';
import { db } from '@/lib/db';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [productsResult, categoriesResult] = await Promise.all([
      db.product.findMany({
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.category.findMany({
        where: { type: 'product' },
        orderBy: { name: 'asc' }
      })
    ]);

    products = productsResult;
    categories = categoriesResult;
  } catch (err) {
    console.error('Database query failed in admin products page:', err);
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <ProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const fallbackCategories = [
  { id: 'cat-1', name: 'Pakaian', slug: 'pakaian', sortOrder: 1 },
  { id: 'cat-2', name: 'Sepatu', slug: 'sepatu', sortOrder: 2 },
  { id: 'cat-3', name: 'Aksesoris', slug: 'aksesoris', sortOrder: 3 },
  { id: 'cat-4', name: 'Tas', slug: 'tas', sortOrder: 4 },
  { id: 'cat-5', name: 'Elektronik', slug: 'elektronik', sortOrder: 5 },
  { id: 'cat-6', name: 'Lainnya', slug: 'lainnya', sortOrder: 6 },
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { 
        status: 'ACTIVE',
        slug: { in: ['pakaian', 'sepatu', 'aksesoris', 'tas', 'elektronik', 'lainnya'] }
      },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ 
      categories: categories.length > 0 ? categories : fallbackCategories 
    });
  } catch (error) {
    console.warn('Categories DB error, serving fallback categories:', error);
    return NextResponse.json({ categories: fallbackCategories });
  }
}

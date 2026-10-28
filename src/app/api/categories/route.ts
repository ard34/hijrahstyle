import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Categories error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: error?.message || String(error),
      code: error?.code,
      hasDbUrl: Boolean(process.env.DATABASE_URL),
      dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) : null,
    }, { status: 500 });
  }
}

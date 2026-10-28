import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Silakan login' }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Silakan login' }, { status: 401 });

    const body = await request.json();
    const { label, recipientName, phone, fullAddress, province, city, district, postalCode, isDefault } = body;

    if (!recipientName || !phone || !fullAddress || !province || !city || !district || !postalCode) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const count = await prisma.address.count({ where: { userId: session.userId } });

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        recipientName,
        phone,
        addressDetail: fullAddress || '',
        province,
        city,
        district,
        postalCode,
        isDefault: count === 0 ? true : Boolean(isDefault),
      },
    });

    return NextResponse.json({ message: 'Alamat berhasil ditambahkan', address }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

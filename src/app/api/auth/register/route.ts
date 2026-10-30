import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, confirmPassword } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Konfirmasi password tidak cocok' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    // Create empty cart
    await prisma.cart.create({ data: { userId: user.id } });

    // Generate JWT token & set cookie for immediate login
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Registrasi berhasil',
      user,
    }, { status: 201 });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const formatRupiah = formatPrice;


export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HS-${timestamp}-${random}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Dibayar', color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Diproses', color: 'bg-indigo-100 text-indigo-800' },
  PACKED: { label: 'Dikemas', color: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: 'Dikirim', color: 'bg-cyan-100 text-cyan-800' },
  DELIVERED: { label: 'Diterima', color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  PAYMENT_FAILED: { label: 'Pembayaran Gagal', color: 'bg-red-100 text-red-800' },
  EXPIRED: { label: 'Kedaluwarsa', color: 'bg-gray-100 text-gray-800' },
  REFUNDED: { label: 'Direfund', color: 'bg-orange-100 text-orange-800' },
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Gagal', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Kedaluwarsa', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Direfund', color: 'bg-orange-100 text-orange-800' },
};

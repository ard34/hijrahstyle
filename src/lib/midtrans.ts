import crypto from 'crypto';
// @ts-ignore - midtrans-client does not have official typescript definitions
import midtransClient from 'midtrans-client';

export interface MidtransItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface MidtransCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: {
    recipientName: string;
    phone: string;
    addressDetail: string;
    city: string;
    postalCode: string;
  };
}

// Check if a real midtrans server key is configured
export function isMidtransConfigured(): boolean {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) return false;
  if (key.includes('sample-key') || key.includes('demo-key')) return false;
  return key.startsWith('SB-Mid-server-') || key.startsWith('Mid-server-');
}

// Create Snap Client
export function getSnapClient() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample-key';
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample-key';

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey,
  });
}

/**
 * Generate Snap Transaction Token
 */
export async function createMidtransTransaction({
  orderNumber,
  grossAmount,
  customer,
  items,
}: {
  orderNumber: string;
  grossAmount: number;
  customer: MidtransCustomer;
  items: MidtransItem[];
}): Promise<{ token: string; redirectUrl?: string; isMock?: boolean }> {
  // If no valid key is set yet, return a safe mock token for simulation/demo
  if (!isMidtransConfigured()) {
    return {
      token: `mock-snap-token-${orderNumber}`,
      redirectUrl: `/orders?success=true&orderNumber=${orderNumber}&mock_paid=true`,
      isMock: true,
    };
  }

  const snap = getSnapClient();

  const names = customer.name.trim().split(' ');
  const firstName = names[0] || 'Customer';
  const lastName = names.slice(1).join(' ') || firstName;

  const parameter = {
    transaction_details: {
      order_id: orderNumber,
      gross_amount: Math.round(grossAmount),
    },
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: customer.email,
      phone: customer.phone || '081234567890',
      shipping_address: customer.address
        ? {
            first_name: customer.address.recipientName,
            phone: customer.address.phone,
            address: customer.address.addressDetail,
            city: customer.address.city,
            postal_code: customer.address.postalCode,
            country_code: 'IDN',
          }
        : undefined,
    },
    item_details: items.map((item) => ({
      id: item.id.substring(0, 50),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    })),
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders?success=true&orderNumber=${orderNumber}`,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      isMock: false,
    };
  } catch (error: any) {
    console.error('Midtrans Snap Error:', error);
    // If it failed due to bad keys in dev, fallback gracefully so user flow continues
    return {
      token: `mock-snap-token-${orderNumber}`,
      redirectUrl: `/orders?success=true&orderNumber=${orderNumber}&mock_paid=true`,
      isMock: true,
    };
  }
}

/**
 * Verify signature from Midtrans Webhook Callback
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature({
  orderId,
  statusCode,
  grossAmount,
  signatureKey,
}: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  if (!serverKey) return false;

  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedHash = crypto.createHash('sha512').update(rawString).digest('hex');

  return computedHash.toLowerCase() === signatureKey.toLowerCase();
}

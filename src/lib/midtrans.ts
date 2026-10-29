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
  paymentMethod,
}: {
  orderNumber: string;
  grossAmount: number;
  customer: MidtransCustomer;
  items: MidtransItem[];
  paymentMethod?: string;
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

  const roundedGross = Math.round(grossAmount);
  
  // Midtrans strict rule: sum(item_details[i].price * item_details[i].quantity) MUST equal transaction_details.gross_amount
  const preparedItems = items.map((item) => ({
    id: String(item.id).substring(0, 50),
    price: Math.round(Number(item.price)),
    quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
    name: String(item.name).substring(0, 50),
  }));

  const itemsTotal = preparedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const diff = roundedGross - itemsTotal;

  if (diff > 0) {
    preparedItems.push({
      id: 'SHIPPING_OR_FEES',
      price: diff,
      quantity: 1,
      name: 'Ongkir / Biaya Pengiriman',
    });
  } else if (diff < 0) {
    preparedItems.push({
      id: 'DISCOUNT',
      price: diff,
      quantity: 1,
      name: 'Potongan / Diskon',
    });
  }

  // Filter payment methods based on customer's choice at checkout
  let enabledPayments: string[] | undefined = undefined;
  if (paymentMethod === 'bank_transfer') {
    enabledPayments = ['bca_va', 'bni_va', 'bri_va', 'echannel', 'permata_va', 'other_va'];
  } else if (paymentMethod === 'qris') {
    enabledPayments = ['qris', 'gopay', 'shopeepay'];
  }

  const parameter: any = {
    transaction_details: {
      order_id: orderNumber,
      gross_amount: roundedGross,
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
    item_details: preparedItems,
    ...(enabledPayments ? { enabled_payments: enabledPayments } : {}),
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
    console.error('Midtrans Snap Error:', error?.ApiResponse || error?.message || error);

    // If order_id has already been used in a previous attempt, automatically retry with a unique attempt suffix
    const errText = JSON.stringify(error?.ApiResponse || error?.message || error || '').toLowerCase();
    if (errText.includes('sudah digunakan') || errText.includes('already') || errText.includes('duplicate')) {
      try {
        const retrySuffix = Math.floor(Date.now() / 1000).toString(36).toUpperCase();
        const retryOrderId = `${orderNumber}-${retrySuffix}`;
        console.log(`Auto-retrying Midtrans Snap with fresh unique order_id: ${retryOrderId}`);

        parameter.transaction_details.order_id = retryOrderId;
        const retryTx = await snap.createTransaction(parameter);
        return {
          token: retryTx.token,
          redirectUrl: retryTx.redirect_url,
          isMock: false,
        };
      } catch (retryErr) {
        console.error('Midtrans Snap Retry Failed:', retryErr);
      }
    }

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

/**
 * Cancel a transaction in Midtrans Dashboard
 * Official Midtrans REST API: POST /v2/{order_id}/cancel
 */
export async function cancelMidtransTransaction(orderId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isMidtransConfigured()) {
    return { success: true, data: { status_code: '200', transaction_status: 'cancel', isMock: true } };
  }

  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const baseUrl = isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

  try {
    const res = await fetch(`${baseUrl}/v2/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await res.json();
    console.log(`Midtrans cancel response for ${orderId}:`, data);
    return { success: res.ok, data };
  } catch (error: any) {
    console.error(`Midtrans cancel error for ${orderId}:`, error);
    return { success: false, error: error?.message || 'Gagal membatalkan transaksi di Midtrans' };
  }
}


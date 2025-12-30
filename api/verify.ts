
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

const HASH_SALT = process.env.HASH_SALT || "rt_default_salt_2024";

async function hashIdentifier(id: string): Promise<string> {
  const normalized = id.toLowerCase().trim();
  const msgBuffer = new TextEncoder().encode(normalized + HASH_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkOrigin(req: Request) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  
  if (process.env.NODE_ENV === 'production' && origin && host) {
    try {
      const originHost = new URL(origin).host.replace(/^www\./, '');
      const cleanHost = host.replace(/^www\./, '');
      if (originHost !== cleanHost) return false;
    } catch (e) {
      return false;
    }
  }
  return true;
}

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const text = orderId + "|" + paymentId;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureData = encoder.encode(text);
  const hmac = await crypto.subtle.sign("HMAC", key, signatureData);
  const digest = Array.from(new Uint8Array(hmac))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return digest === signature;
}

/**
 * Fallback: Verify payment by fetching status directly from Razorpay API
 */
async function verifyPaymentStatus(paymentId: string, keyId: string, keySecret: string): Promise<boolean> {
  const auth = btoa(`${keyId}:${keySecret}`);
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (!response.ok) return false;
    const data = await response.json();
    // Payment is valid if it is captured or authorized (awaiting capture)
    return data.status === 'captured' || data.status === 'authorized';
  } catch (e) {
    return false;
  }
}

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  
  if (!checkOrigin(req)) {
    return new Response(JSON.stringify({ error: 'Security: Domain verification failed.' }), { status: 403, headers: securityHeaders });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !keyId) {
    return new Response(JSON.stringify({ error: 'Gateway configuration missing on server.' }), { status: 500, headers: securityHeaders });
  }

  try {
    const payload = await req.json();
    const { identifier, paymentId, orderId, signature, packageType } = payload;
    
    if (!identifier || !paymentId) {
      return new Response(JSON.stringify({ error: 'Missing payment details.' }), { status: 400, headers: securityHeaders });
    }

    let isVerified = false;

    // 1. Try HMAC Signature verification if all pieces are present
    if (orderId && signature) {
      isVerified = await verifyRazorpaySignature(orderId, paymentId, signature, keySecret);
    } 
    
    // 2. Fallback: Verify via Razorpay API (Necessary for Simple Checkout/Test Mode without Orders)
    if (!isVerified) {
      isVerified = await verifyPaymentStatus(paymentId, keyId, keySecret);
    }

    if (!isVerified) {
      return new Response(JSON.stringify({ error: 'Razorpay could not confirm this payment.' }), { status: 403, headers: securityHeaders });
    }

    const secureId = await hashIdentifier(identifier);
    
    // Set credits (3 attempts as per the Package requirements)
    await kv.set(`paid_v2_${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      packageType
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: securityHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Internal server error during verification." }), { status: 500, headers: securityHeaders });
  }
}

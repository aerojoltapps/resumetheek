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
      const originHost = new URL(origin).host;
      if (originHost !== host) return false;
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

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if (!checkOrigin(req)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: securityHeaders });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return new Response(JSON.stringify({ error: 'Gateway configuration error' }), { status: 500, headers: securityHeaders });

  try {
    const payload = await req.json();
    const { identifier, paymentId, orderId, signature, packageType } = payload;
    
    if (!identifier || !paymentId || !orderId || !signature) {
      return new Response(JSON.stringify({ error: 'Incomplete data' }), { status: 400, headers: securityHeaders });
    }

    const isValid = await verifyRazorpaySignature(orderId, paymentId, signature, keySecret);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Security verification failed' }), { status: 403, headers: securityHeaders });
    }

    const secureId = await hashIdentifier(identifier);
    
    await kv.set(`paid_v2_${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      packageType
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: securityHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Internal verification error" }), { status: 500, headers: securityHeaders });
  }
}
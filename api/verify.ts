
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

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const text = orderId.trim() + "|" + paymentId.trim();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.trim());
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
  return digest === signature.trim();
}

/**
 * Fallback: Verify payment by fetching status directly from Razorpay API
 */
async function verifyPaymentStatus(paymentId: string, keyId: string, keySecret: string): Promise<{verified: boolean, error?: string}> {
  try {
    const pid = paymentId.trim();
    const kid = keyId.trim();
    const ksec = keySecret.trim();
    
    const auth = btoa(kid + ":" + ksec);
    
    const response = await fetch(`https://api.razorpay.com/v1/payments/${pid}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        verified: false, 
        error: data.error?.description || `Razorpay API error: ${response.status}` 
      };
    }

    // Accept both captured and authorized status
    const isValid = data.status === 'captured' || data.status === 'authorized';
    return { 
      verified: isValid, 
      error: isValid ? undefined : `Payment status is '${data.status}', expected 'captured' or 'authorized'.` 
    };
  } catch (e) {
    return { verified: false, error: "Failed to connect to Razorpay verification service." };
  }
}

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: securityHeaders });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !keyId) {
    return new Response(JSON.stringify({ error: 'Gateway keys are missing in the server environment configuration.' }), { status: 500, headers: securityHeaders });
  }

  try {
    const payload = await req.json();
    const { identifier, paymentId, orderId, signature, packageType } = payload;
    
    if (!identifier || !paymentId) {
      return new Response(JSON.stringify({ error: 'Incomplete payment information received.' }), { status: 400, headers: securityHeaders });
    }

    let isVerified = false;
    let verificationError = '';

    // 1. Try HMAC Signature verification if pieces are present (Secure method)
    if (orderId && signature) {
      isVerified = await verifyRazorpaySignature(orderId, paymentId, signature, keySecret);
      if (!isVerified) verificationError = 'Signature mismatch.';
    } 
    
    // 2. Fallback: Verify via Razorpay API (Necessary for simple payments/test mode/missing signatures)
    if (!isVerified) {
      const apiCheck = await verifyPaymentStatus(paymentId, keyId, keySecret);
      isVerified = apiCheck.verified;
      if (!isVerified) verificationError = apiCheck.error || 'Razorpay API verification failed.';
    }

    if (!isVerified) {
      return new Response(JSON.stringify({ 
        error: `Security Check Failed: ${verificationError}` 
      }), { status: 403, headers: securityHeaders });
    }

    const secureId = await hashIdentifier(identifier);
    
    // Set credits (3 attempts)
    await kv.set(`paid_v2_${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      packageType
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: securityHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "An unexpected error occurred during verification." }), { status: 500, headers: securityHeaders });
  }
}

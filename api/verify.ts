
import { kv } from "@vercel/kv";

// Switching to nodejs runtime for more robust outbound networking
export const config = {
  runtime: 'nodejs',
};

const HASH_SALT = process.env.HASH_SALT || "rt_default_salt_2024";

/**
 * Sanitizes keys by removing whitespace and potential surrounding quotes
 */
const cleanKey = (key: string | undefined) => {
  if (!key) return "";
  return key.trim().replace(/^["'](.+)["']$/, '$1');
};

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
  return digest === signature.trim();
}

/**
 * Fallback: Verify payment by fetching status directly from Razorpay API
 */
async function verifyPaymentStatus(paymentId: string, keyId: string, keySecret: string): Promise<{verified: boolean, error?: string}> {
  try {
    const pid = paymentId.trim();
    const kid = cleanKey(keyId);
    const ksec = cleanKey(keySecret);
    
    const auth = btoa(`${kid}:${ksec}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/payments/${pid}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'ResumeTheek-Verifier'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        verified: false, 
        error: `Razorpay API returned ${response.status}: ${errorData.error?.description || 'Access Denied'}` 
      };
    }

    const data = await response.json();
    const isValid = data.status === 'captured' || data.status === 'authorized';
    
    return { 
      verified: isValid, 
      error: isValid ? undefined : `Payment is in '${data.status}' state. Expected 'captured' or 'authorized'.` 
    };
  } catch (e: any) {
    return { 
      verified: false, 
      error: `Network Error: ${e.message || "Could not reach Razorpay servers."}` 
    };
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !keyId) {
    return res.status(500).json({ error: 'Gateway keys are missing in the server environment.' });
  }

  try {
    const { identifier, paymentId, orderId, signature, packageType } = req.body;
    
    if (!identifier || !paymentId) {
      return res.status(400).json({ error: 'Incomplete payment information received.' });
    }

    let isVerified = false;
    let verificationError = '';

    if (orderId && signature) {
      isVerified = await verifyRazorpaySignature(orderId, paymentId, signature, cleanKey(keySecret));
      if (!isVerified) verificationError = 'Signature verification mismatch.';
    } 
    
    if (!isVerified) {
      const apiCheck = await verifyPaymentStatus(paymentId, keyId, keySecret);
      isVerified = apiCheck.verified;
      if (!isVerified) verificationError = apiCheck.error || 'Razorpay API verification failed.';
    }

    if (!isVerified) {
      return res.status(403).json({ 
        error: `Security Check Failed: ${verificationError}` 
      });
    }

    const secureId = await hashIdentifier(identifier);
    await kv.set(`paid_v2_${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      packageType
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: "An unexpected error occurred during the verification process." });
  }
}

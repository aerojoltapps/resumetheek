
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  // Check for KV environment variables
  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  const hasOnlyRedis = process.env.REDIS_URL && !hasKV;

  if (!hasKV) {
    const errorMsg = hasOnlyRedis 
      ? 'Error: You linked a "Redis" database instead of a "KV" database. Please go to Vercel Storage, create a "KV" database, and connect it to this project.'
      : 'Error: Vercel KV is not configured. Please go to the Storage tab in Vercel and create/link a KV database.';
    
    return new Response(JSON.stringify({ error: errorMsg }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { identifier, paymentId, packageType } = await req.json();
    
    if (!identifier || !paymentId) {
      return new Response(JSON.stringify({ error: 'Invalid payment data' }), { status: 400 });
    }

    // Store the payment record in Vercel KV
    await kv.set(`paid_${identifier}`, {
      paymentId,
      packageType,
      verifiedAt: new Date().toISOString(),
      credits: 3 
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to verify payment" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

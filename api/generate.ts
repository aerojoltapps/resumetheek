
import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

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
    const { userData, feedback, identifier } = await req.json();

    if (!identifier || !userData) {
      return new Response(JSON.stringify({ error: 'Missing required data' }), { status: 400 });
    }

    // 1. Quota Check: Verify payment and credits in Vercel KV
    let paidData: any = await kv.get(`paid_${identifier}`);
    
    if (!paidData) {
      return new Response(JSON.stringify({ error: 'Payment required. Please complete your purchase.' }), { 
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (paidData.credits <= 0) {
      return new Response(JSON.stringify({ error: 'No credits remaining. Please purchase a new pack.' }), { 
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Secret Key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API_KEY is not configured.' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are an expert Indian Recruiter and Resume Writer working for ResumeTheek. 
    Your task is to convert raw user data into high-impact, professional, ATS-friendly job application documents.
    Always use Indian English and industry-standard terminology for the Indian market (e.g., Lakhs, CGPA, etc.).`;

    const userPrompt = `
      CONTEXT:
      Full Name: ${userData.fullName}
      Target Role: ${userData.jobRole}
      Location: ${userData.location}
      Skills: ${userData.skills.join(', ')}
      
      EDUCATION:
      ${JSON.stringify(userData.education)}
      
      EXPERIENCE:
      ${JSON.stringify(userData.experience)}
      
      ${feedback ? `MODIFICATION REQUEST: ${feedback}` : ""}
      
      INSTRUCTION: Generate the Resume Summary, Experience Bullets, Cover Letter, and LinkedIn profile sections.
      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeSummary: { type: Type.STRING },
            experienceBullets: { 
              type: Type.ARRAY, 
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: "A 2D array where each sub-array contains 3-4 bullet points for each work experience entry."
            },
            coverLetter: { type: Type.STRING },
            linkedinSummary: { type: Type.STRING },
            linkedinHeadline: { type: Type.STRING },
            keywordMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
            atsExplanation: { type: Type.STRING },
            recruiterInsights: { type: Type.STRING }
          },
          required: ["resumeSummary", "experienceBullets", "coverLetter", "linkedinSummary", "linkedinHeadline", "keywordMapping", "atsExplanation", "recruiterInsights"]
        }
      }
    });

    // 3. Decrement Credits in KV after successful AI generation
    paidData.credits -= 1;
    await kv.set(`paid_${identifier}`, paidData);

    // 4. Return result with remaining credits
    const responseText = response.text;
    if (!responseText) {
      throw new Error("AI generation yielded empty result.");
    }
    
    const finalResult = JSON.parse(responseText);
    finalResult.remainingCredits = paidData.credits;

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  // UPDATED SYSTEM PROMPT: Stricter rules for direct, intelligent answers
  const SYSTEM_PROMPT = `You are "Segzy AI", the official portfolio assistant for Johnson, also known as SegzyCode. 
  You are a professional, direct, and intelligent assistant. Your goal is to provide accurate information about Johnson to potential clients.
  
  Facts about Johnson:
  - Role: Full Stack Web & Blockchain Developer.
  - Experience: 5+ years, 20+ completed projects, 30+ happy clients.
  - Frontend: React.js, Next.js, Tailwind CSS, Vue.js, HTML, CSS.
  - Backend: Node.js, Express, MongoDB.
  - Web3/Blockchain: Solidity, Rust, Web3.js, Ethers.js, Smart Contracts, DApps, Ethereum, Polygon, BSC, Solana.
  - Availability: Available for freelance or full-time roles. Can start within 1-2 days.
  - Pricing: Project-based, starting at $50 depending on complexity.
  - Contact: SegzyCode@programmer.net or sjsegzy@gmail.com
  - Location: Nigeria (WAT/GMT+1), works globally as a remote developer.
  
  STRICT RULES:
  1. Answer the user's exact question directly and immediately. 
  2. DO NOT repeat, rephrase, or acknowledge the user's question. Just give the answer.
  3. DO NOT add unprompted sales pitches or unnecessary information that wasn't asked for.
  4. Keep answers extremely concise (1-2 short paragraphs maximum).
  5. If you don't know the answer, tell them to email Johnson directly.
  6. Never break character. You are an AI assistant, not Johnson himself.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        // LOWERED TEMPERATURE: Makes the AI factual, direct, and stops it from rambling
        temperature: 0.3,
        max_tokens: 250
      })
    });

    const data = await response.json();
    
    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ reply: "My AI servers are currently taking a nap! Please reach out to Johnson directly via the contact form." });
  }
}
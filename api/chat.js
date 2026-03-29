export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  // THE "GOLDILOCKS" SYSTEM PROMPT: Friendly, helpful, but stays on track.
  const SYSTEM_PROMPT = `You are "Segzy AI", the official portfolio assistant for Johnson (also known as SegzyCode). 
  Your personality is warm, enthusiastic, friendly, and highly professional. You act as a welcoming host to potential clients visiting Johnson's portfolio.
  
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
  
  CRITICAL RULES:
  1. Be conversational and helpful, but answer the question immediately.
  2. NEVER repeat or rephrase the user's question back to them. (e.g., if they ask "What is his price?", do not say "You are asking about his price. His price is...")
  3. Tailor your answer strictly to what the user asked. Do not list all his skills if they only asked about his availability.
  4. Keep answers punchy and easy to read (1-3 short paragraphs maximum).
  5. If a user asks something outside of these facts, politely tell them you are just a portfolio bot and suggest they email Johnson directly.
  6. Never break character.`;

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
        // TEMPERATURE 0.6: The perfect balance between friendly/chatty and staying on-topic.
        temperature: 0.6,
        max_tokens: 250
      })
    });

    const data = await response.json();
    
    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ reply: "My AI servers are currently taking a little break! Please reach out to Johnson directly via the contact form." });
  }
}
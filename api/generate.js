export const config = { runtime: "nodejs" }; // ✅ fixed for Vercel

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const bodyText = await req.text();
    const { userId, query, payer_name, payer_ref, file_url, amount } = JSON.parse(bodyText || "{}");

    if (!userId || !query) return res.status(400).json({ error: "Missing userId or query" });

    // 1️⃣ Insert payment submission if provided
    if (payer_name && payer_ref && file_url && amount) {
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          user_id: userId,
          payer_name,
          payer_ref,
          file_url,
          amount,
          status: "pending",
        },
      ]);
      if (paymentError) return res.status(500).json({ error: paymentError.message });
    }

    // 2️⃣ Fetch user profile to check subscription
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (profileError) return res.status(500).json({ error: profileError.message });

    const now = new Date();
    if (profile.subscription_status !== "active" || new Date(profile.subscription_expires_at) < now) {
      return res.status(403).json({ error: "Subscription expired or not approved yet" });
    }

    // 3️⃣ Call Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "API key missing" });

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: `${query}\nFocus: Pakistani law and cite pakistancode.gov.pk.` }] },
          ],
        }),
      }
    );

    const data = await apiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No legal data found.";

    // 4️⃣ Save chat
    const { error: chatError } = await supabase.from("chats").insert([
      { user_id: userId, prompt: query, response: reply },
    ]);
    if (chatError) console.error("Chat save error:", chatError.message);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Backend error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

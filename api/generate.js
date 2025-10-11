export const config = { runtime: "nodejs18.x" };
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const bodyText = await req.text();
    const { query, userId, name, accountNumber, screenshotUrl } = JSON.parse(bodyText || "{}");

    if (!query) return res.status(400).json({ error: "No query provided" });
    if (!userId || !name || !accountNumber || !screenshotUrl)
      return res.status(400).json({ error: "Incomplete payment info" });

    // Insert payment submission
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        user_id: userId,
        screenshot_url: screenshotUrl,
        payment_date: new Date().toISOString(),
        approval_status: false,
      },
    ]);
    if (paymentError) return res.status(500).json({ error: paymentError.message });

    // Check if user is approved and subscription valid
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (userError) return res.status(500).json({ error: userError.message });

    const today = new Date();
    if (!userData.paid_status || new Date(userData.end_date) < today)
      return res.status(403).json({ error: "Subscription expired or not approved yet" });

    // Call Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "API key missing" });

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: `${query}\nFocus: Pakistani law and cite pakistancode.gov.pk.` }] }
          ]
        }),
      }
    );

    const data = await apiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No legal data found.";

    return res.status(200).json({ reply, paymentStatus: userData.paid_status });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

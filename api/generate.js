// Force Node runtime
export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Use modern Node 18+ way to parse JSON body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", err => reject(err));
    });

    const { query } = JSON.parse(body || "{}");

    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not set" });
    }

    // Call Gemini API
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${query}\nFocus: Pakistani law and cite pakistancode.gov.pk where relevant.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await apiResponse.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No legal data found.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

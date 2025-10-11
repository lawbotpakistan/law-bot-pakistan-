// api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    await new Promise(resolve => req.on("end", resolve));
    const { query } = JSON.parse(body || "{}");

    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    query +
                    "\nFocus on Pakistani law and cite pakistancode.gov.pk when possible.",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No legal data found.";
    return res.status(200).json({ reply: answer });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

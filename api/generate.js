// Force Node runtime so we can use req, res properly
export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Parse the body safely
    let body = "";
    req.on("data", chunk => (body += chunk));
    await new Promise(resolve => req.on("end", resolve));
    const { query } = JSON.parse(body || "{}");

    if (!query) {
      res.status(400).json({ error: "No query provided" });
      return;
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No legal data found.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

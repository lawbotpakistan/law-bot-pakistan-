export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data || "{}")));
      req.on("error", reject);
    });

    const { query } = body;
    if (!query) return res.status(400).json({ error: "No query provided" });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        GEMINI_API_KEY,
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
                    "\nFocus: Pakistani law. Include citations from pakistancode.gov.pk when relevant.",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await r.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No legal data found.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

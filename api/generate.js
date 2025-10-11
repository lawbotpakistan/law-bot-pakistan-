export default async function handler(req, res) {
  try {
    const { userPrompt } = await req.json();

    // ---- ADD YOUR KEYS HERE ----
    const GEMINI_API_KEY = "AIzaSyDsddoK5OU0qyhQK8AColdDpQXWnznOS3M";
    const SUPABASE_URL = "https://iyakobcjerlwvcjvttwh.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5YWtvYmNqZXJsd3ZjanZ0dHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzU3OTEsImV4cCI6MjA3NTUxMTc5MX0.IwGfznq8fXhm5QEC7qAhndgKnDX2oWzxODEAmXyx7G8";
    // -----------------------------

    // Call Gemini API (replace with your actual API logic)
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Provide legal information from Pakistan Law Site only: ${userPrompt}` }] }]
      })
    });

const { query } = req.body;

    res.status(200).json({
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.",
      sources: ["https://pakistanlawsite.com"]
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
}

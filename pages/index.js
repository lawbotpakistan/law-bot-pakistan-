import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askLawBot = async () => {
    if (!query.trim()) return alert("Please enter your question.");
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.reply || "No response from AI.");

    } catch (err) {
      setResponse("💥 Server error, please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f6fa",
      minHeight: "100vh",
      padding: "40px",
      textAlign: "center"
    }}>
      <h1>⚖️ LawBot Pakistan</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Get instant legal help, documents, and video resources.
      </p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your legal question here..."
        rows="4"
        cols="60"
        style={{ padding: "10px", fontSize: "16px", borderRadius: "8px" }}
      />
      <br />
      <button
        onClick={askLawBot}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          marginTop: "10px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask LawBot"}
      </button>

      {response && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            marginTop: "30px",
            borderRadius: "10px",
            maxWidth: "700px",
            margin: "30px auto",
            textAlign: "left",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Answer:</h3>
          <p>{response}</p>
          <hr />
          <p><b>📄 Related Legal Docs:</b> <a href="https://pakistanlawsite.com" target="_blank" rel="noreferrer">PakistanLawSite</a></p>
          <p><b>🎥 Related Videos:</b> <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " Pakistan law")}`} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
        </div>
      )}
    </div>
  );
}

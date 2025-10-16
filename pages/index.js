export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "40px", textAlign: "center" }}>
      <h1>⚖️ LawBot Pakistan</h1>
      <p>Get instant legal help, documents, and video resources.</p>

      <textarea
        id="userQuery"
        rows="4"
        cols="50"
        placeholder="Type your question here..."
        style={{ padding: "10px", width: "80%", borderRadius: "8px" }}
      ></textarea>
      <br />
      <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => askLawBot()}
      >
        Ask LawBot
      </button>

      <p id="responseBox" style={{ marginTop: "20px" }}>Answer will appear here...</p>

      <p>
        📄 Related Legal Docs:{" "}
        <a href="https://www.pakistanlawsite.com/" target="_blank" rel="noopener noreferrer">
          PakistanLawSite
        </a>
      </p>

      <p>
        🎥 Related Videos:{" "}
        <a
          href="https://www.youtube.com/results?search_query=pakistan+law+explanation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      </p>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            async function askLawBot() {
              const query = document.getElementById('userQuery').value.trim();
              const responseBox = document.getElementById('responseBox');
              if (!query) {
                responseBox.textContent = '⚠️ Please type a question first.';
                return;
              }
              responseBox.textContent = '⏳ Thinking... please wait.';
              try {
                const res = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ query })
                });
                const data = await res.json();
                responseBox.textContent = data.reply || '⚠️ No response from AI.';
              } catch (err) {
                console.error(err);
                responseBox.textContent = '💥 Server error, please try again later.';
              }
            }
          `,
        }}
      />
    </div>
  );
}

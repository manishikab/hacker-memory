import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [recentEntries, setRecentEntries] = useState([]);
  const [recentThemes, setRecentThemes] = useState([]);

  useEffect(() => {
    refreshSidebar();
  }, []);

  const refreshSidebar = async () => {
    try {
      const entries = await fetch("http://localhost:8000/recent-memories").then(r => r.json());
      const themes = await fetch("http://localhost:8000/recent-themes").then(r => r.json());

      setRecentEntries(entries || []);
      setRecentThemes(themes || []);
    } catch (err) {
      console.error("Failed to fetch sidebar data:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.result) {
        setResponse(data.result);
        refreshSidebar(); // update sidebar after memory consolidation
      } else if (data.error) {
        setResponse("Error: " + data.error);
      }
    } catch (err) {
      setResponse("Error: " + err.message);
    }

    setLoading(false);
    setQuery("");
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🧠 Recent Memories</h2>
        <ul>
          {recentEntries.length === 0 && <li>No memories yet</li>}
          {recentEntries.map((entry, idx) => {
            const text = entry.title || entry.text || "Untitled";
            const date = entry.date || entry.created_at || "";
            return (
              <li key={idx} className="clickable" onClick={() => setQuery(text)}>
                <strong>{text.length > 50 ? text.slice(0, 50) + "…" : text}</strong>
                <span className="entry-type">{date}</span>
              </li>
            );
          })}
        </ul>

        <h2>🔁 Recurring Patterns</h2>
        <div className="themes">
          {recentThemes.length === 0 && (
            <span className="muted">No patterns detected yet</span>
          )}
          {recentThemes.map((theme, idx) => {
            const label = theme.label || theme.text || "Pattern";
            return (
              <span key={idx} className="theme-chip">
                {label}
              </span>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <nav className="navbar">
          <div className="logo">{">_"}</div>
          <div className="nav-links">
            <a href="Notes">Notes</a>
            <a href="LeetCode">LeetCode</a>
            <a href="Bugs">Bugs</a>
          </div>
        </nav>

        <h1>Cache Overflow</h1>
        <p>Your second brain for all your hacking knowledge.</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Ask something like: 'Have I seen this bug before?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">{loading ? "Thinking..." : "Ask AI"}</button>
        </form>

        {response && (
          <div className="response-box">
            <h3>AI Answer</h3>
            <p>{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;

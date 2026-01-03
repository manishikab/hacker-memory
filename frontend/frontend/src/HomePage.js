import React, { useState } from 'react';
import './HomePage.css';

const recentEntries = [
  { title: "can we pull from gemini?", date: "2026-01-02" },
  { title: "fix date overflow", date: "2026-01-01" },
  { title: "test", date: "2025-12-30" },
];

const recentThemes = [
  "also pull from gemini",
  "test",
  "test",
  "something else below this?"
];

function HomePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(""); // store AI response
  const [loading, setLoading] = useState(false);

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
      if (data.result) setResponse(data.result);
      else if (data.error) setResponse("Error: " + data.error);
    } catch (err) {
      setResponse("Error: " + err.message);
    }

    setLoading(false);
    setQuery("");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Recent Entries</h2>
        <ul>
          {recentEntries.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.title}</strong>
              <span>{entry.date}</span>
            </li>
          ))}
        </ul>

        <h2>Recent Themes</h2>
        <ul>
          {recentThemes.map((theme, idx) => (
            <li key={idx}>{theme}</li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <nav className="navbar">
          <div className="logo"> >_ </div>
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
            <h3>AI Answer:</h3>
            <p>{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;

import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [recentEntries, setRecentEntries] = useState([]); // memories
  const [recentPatterns, setRecentPatterns] = useState([]); // AI insights

  // Fetch sidebar data on mount
  useEffect(() => {
    refreshSidebar();
  }, []);

  const refreshSidebar = async () => {
    try {
      const entriesRes = await fetch("http://localhost:8000/recent-memories");
      const entriesData = await entriesRes.json();
      setRecentEntries(entriesData);

      const patternsRes = await fetch("http://localhost:8000/recent-patterns");
      const patternsData = await patternsRes.json();
      setRecentPatterns(patternsData);
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
        <h2>Recent Memories</h2>
        <ul>
          {recentEntries.length === 0 && <li>No memories yet</li>}
          {recentEntries.map((entry, idx) => (
            <li
            
            >
              {entry.summary}
            </li>
          ))}
        </ul>

        <h2> Your Patterns + Tips</h2>
        <ul>
          {recentPatterns.length === 0 && <li>No patterns yet</li>}
          {recentPatterns.map((pattern, idx) => (
            <li
             
            >
              {pattern.summary}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
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
            <h3>AI Answer:</h3>
            <p>{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;

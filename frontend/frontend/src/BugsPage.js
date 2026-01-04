import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Bug from "./Bug"; 
import "./BugsPage.css";

export default function BugsPage({ bugs, onSubmit, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleBugSubmit = async (e) => {
    e.preventDefault();

    await handleShow();
    await handleMemory();

    setTitle("");
    setContent("");
    formRef.current.reset();
  };

  const handleShow = async () => {
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    await fetch("http://localhost:8000/bugs/add/", {
      method: "POST",
      body: formData   });
    }

  const handleMemory = async () => {
    
    await fetch("http://localhost:8000/memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `Bug: ${title}\n${content}` })
  });

    setTitle("");
    setContent("");
    formRef.current.reset();
  };

  return (
    <div>
      <div className="nav-bar">
        <Link to="/home" className="nav-tab active">Home</Link>
        <Link to="/notes" className="nav-tab">Notes</Link>
        <Link to="/leetcode" className="nav-tab">Leetcode</Link>
      </div>

      <h1>Past Bugs</h1>

      <div className="bug-list">
        <div className="bug-card">
          <h2>Create bug</h2>

          <form ref={formRef} onSubmit={handleBugSubmit}>
            <div className="bug-meta">
              <label>Title or Number</label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="bug-meta">
              <label>Content</label>
              <textarea
                name="content"
                placeholder="Describe the bug in detail…"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit">Create bug</button>
          </form>
        </div>
      </div>

      <div className="bug-list">
        <h2>Bugs</h2>
        {bugs.map((a) => (
          <Bug
            key={a.id}
            id={a.id}
            bug_number={a.id}
            title={a.title}
            content={a.content}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
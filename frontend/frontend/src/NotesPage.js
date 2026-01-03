import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Note from "./Note"; // your Note component

export default function NotesPage({ notes, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // in case notes in undef
  const safeNotes = notes || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8000/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Note: ${title}\n${content}`,
          type: "note"
        })
      });

      
      if (onDelete) onDelete(); 

      // Reset form
      setTitle("");
      setContent("");
      formRef.current.reset();
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  return (
    <div>
      <div className="nav-bar">
        <Link to="/home" className="nav-tab">Home</Link>
        <Link to="/bugs" className="nav-tab">Bugs</Link>
        <Link to="/leetcode" className="nav-tab">Leetcode</Link>
      </div>

      <h1>Notes</h1>

      <div className="note-card">
        <h2>Create a Note</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="note-meta">
            <label>Title</label>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="note-meta">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Write your note here…"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button type="submit">Add Note</button>
        </form>
      </div>

      <div className="note-list">
        <h2>Saved Notes</h2>
        {safeNotes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          safeNotes.map((n) => (
            <Note
              key={n._id}
              title={n.title}
              content={n.content}
              created_at={n.created_at}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

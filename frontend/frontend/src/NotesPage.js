import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Note from "./Note";

export default function NotesPage({ notes, onSubmit, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(e);
    
    try {
      const res = await fetch("http://localhost:8000/notes/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment if using auth:
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <div className="nav-bar">
        <Link to="/home" className="nav-tab active">Home</Link>
        <Link to="/bugs" className="nav-tab">Bugs</Link>
        <Link to="/leetcode" className="nav-tab">Leetcode</Link>
      </div>

      <h1>Past Notes</h1>

      {/* Create Note */}
      <div className="note-list">
        <div className="note-card">
          <h2>Create Note</h2>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="note-meta">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="note-meta">
              <label>Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit">Create Note</button>
          </form>
        </div>
      </div>

      {/* Notes List */}
      <div className="note-list">
        <h2>Notes</h2>

        {notes.map((note) => (
          <Note
            key={note._id}
            id={note._id}
            title={note.title}
            content={note.content}
            created_at={note.created_at}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

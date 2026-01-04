import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Note from "./Note";

export default function NotesPage({ notes, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    await fetch("http://localhost:8000/notes/add/", {
      method: "POST",
      body: formData
    });

    setTitle("");
    setContent("");
    formRef.current.reset();
    }
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
      {/* Navigation */}
      <div className="nav-bar">
        <Link to="/home" className="nav-tab">Home</Link>
        <Link to="/bugs" className="nav-tab">Bugs</Link>
        <Link to="/leetcode" className="nav-tab">Leetcode</Link>
      </div>

      <h1>Past Notes</h1>

      {/* Create Note */}
      <div className="note-list">
        <div className="note-card">
          <h2>Create Note</h2>

          <form ref={formRef} onSubmit={handleNotesSubmit}>
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
            key={note.id}
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

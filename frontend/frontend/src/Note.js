import React from "react";

export default function Note({ content, title, created_at, onDelete }) {
  return (
    <div className="note-item">
      <div className="note-header">
        <h3 className="note-title">Note: {title}</h3>
      </div>

      <div className="note-meta-info">
        Created: {created_at}
      </div>

      <div className="note-content">
        {content}
      </div>

      <button
        className="note-delete-btn"
        onClick={() => onDelete(title)}
      >
        Delete
      </button>
    </div>
  );
}

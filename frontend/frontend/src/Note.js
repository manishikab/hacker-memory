import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Note({ content, title, created_at, onDelete}) {
  return (
  <div className="note-card">
    <div className="note">
      <p>Note: {title}</p>
      <div className="note-meta">
        <span>Created: {created_at}</span>
        <span>Content: {content}</span>
      </div>

      <div className="assignment-buttons">
        <button onClick={() => onDelete(title)}>
          Delete
        </button>
      </div>
    </div>
  </div>
  );
}
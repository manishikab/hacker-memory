import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Bug({ id, content, title, created_at, onDelete}) {
  return (
  <div className="bug-card">
    <div className="bug">
    <p className="bug-title">Bug: {title}</p>
      <div className="bug-meta">
        <span>Created: {created_at}</span>
        <span>Content: {content}</span>
      </div>

      
      <button className="delete-btn" onClick={() => onDelete(id)}>
  Delete
</button>
      </div>
    </div>

  );
}

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function App() {
  const [bugs, setBugs] = useState([]);
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("/bugs/")
    .then(res => res.json())
    .then(data => setBugs(data.bugs));

    fetch("/leetcode/")
    .then(res => res.json())
    .then(data => setProblems(data.problems));

  fetch("/notes/")
    .then(res => res.json())
    .then(data => setNotes(data.notes));

    fetch("/")
    .then(res => res.json())
    .then(data => setStats(data));
  }, [location.key]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("/bugs/add/", {
      method: "POST",
      body: formData
    }).then(() => {
      fetch("/bugs/")
        .then(res => res.json())
        .then(data => setBugs(data.bugs));
    })
  }

  function handleDelete(title) {
    fetch(`/bugs/${title}`, {
      method: "DELETE"
    }).then(() => {
      setBugs(bugs.filter(a => a.title !== title));
    });
  }

  return (
    
      <Routes>
        <Route path="/" element={<HomePage data={stats} />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/bugs" element={<BugsPage bugs={bugs} onDelete={handleDelete} />} />
        <Route path="/leetcode" element={<LeetCodePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    
  );
}


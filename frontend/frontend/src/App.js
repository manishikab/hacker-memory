import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import NotesPage from "./NotesPage";
import BugsPage from "./BugsPage";
import LeetCodePage from "./LeetCodePage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";

export default function App() {
  const [bugs, setBugs] = useState([]);
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({});

  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8000/bugs/")
    .then(res => res.json())
    .then(data => {
      console.log("Bugs received from backend:", data)
      setBugs(data.bugs)
    });

    fetch("http://localhost:8000/leetcode/")
    .then(res => res.json())
    .then(data => setProblems(data.problems));

  fetch("http://localhost:8000/notes/")
    .then(res => res.json())
    .then(data => setNotes(data.notes));

    fetch("http://localhost:8000/home/")
    .then(res => res.json())
    .then(data => setStats(data));
  }, [location.key]);

  

  function handleDelete(id) {
    fetch(`http://localhost:8000/bugs/${id}`, {
      method: "DELETE"
    }).then(() => {
      setBugs(bugs.filter(a => a.id !== id));
    });
  }

  return (
    
      <Routes>
        <Route path="/home" element={<HomePage data={stats} />} />
        <Route path="/notes" element={<NotesPage notes={notes} onDelete={handleDelete}/>} />
        
        <Route path="/leetcode" element={<LeetCodePage problems={problems} onDelete={handleDelete} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        <Route path="/bugs" element={<BugsPage bugs={bugs} onDelete={handleDelete} />} />
      </Routes>
    
  );
}


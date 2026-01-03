import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function App() {
  
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/bugs" element={<BugsPage />} />
        <Route path="/leetcode" element={<LeetCodePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    
  );
}


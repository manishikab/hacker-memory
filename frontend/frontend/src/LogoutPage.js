import React from "react";
import { Link } from "react-router-dom";

export default function LogoutPage() {
  const handleLogout = () => {
    window.location.href = "http://localhost:8000/logout";
  };

  return (
    
    <div className="page">
        
      <div className="card">
        <div className="nav-bar">
            <Link to="/home" className="nav-tab active">Home Page</Link>
            <Link to="/notes" className="nav-tab">Notes</Link>
            <Link to="/leetcode" className="nav-tab">Leetcode</Link>
            <Link to="/bugs" className="nav-tab">Bugs</Link>
        </div>
        <h1 className="title">Logout</h1>


        <button onClick={handleLogout} className="logoutButton">
          Sign out
        </button>

        
      </div>
    </div>
  );
}
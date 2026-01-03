import React from "react";


export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Project Name</h1>
        <p className="subtitle">
          Project description goes here.
        </p>

        <button onClick={handleLogin} className="loginButton">
          Sign in
        </button>
      </div>
    </div>
  );
}
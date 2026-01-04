import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage({ data }) {
  const [bugs, setBugs] = useState([]);
  const [newBug, setNewBug] = useState("");
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);



  const handleSendMessage = () => {
    if (chat.trim()) {
      setMessages([...messages, { text: chat, sender: "user" }]);
      setChat("");
    }
  };

  return (
    <div className="dashboard">
      <div className="nav-bar">
        <Link to="/bugs" className="nav-tab active">Bugs</Link>
        <Link to="/notes" className="nav-tab">Notes</Link>
        <Link to="/leetcode" className="nav-tab">Leetcode</Link>
      </div>
      <h1>Hacker Life, Simplified</h1>

      <div className="sections">
        <div className="section">★ Bugs: {data.bugs}</div>
        <div className="section">★ Notes: {data.notes}</div>
        <div className="section">★ Leetcode problems completed: {data.leetcode}</div>
      </div>

      <div className="chat">
        <h2>Chat with your AI Assistant!</h2>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={chat}
            onChange={(e) => setChat(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
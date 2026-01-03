import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function LeetcodePage({ problems, onSubmit, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();


    await fetch("http://localhost:8000/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `Leetcode Problem:
        Title: ${title}
        Difficulty: ${difficulty}
        Description: ${description}
        Solution: ${solution}`
        })
    });

    setTitle("");
    setDifficulty("Easy");
    setDescription("");
    setSolution("");
    formRef.current.reset();
  };

  return (
    <div>
      <div className="nav-bar">
        <Link to="/home" className="nav-tab">Home</Link>
        <Link to="/notes" className="nav-tab">Notes</Link>
        <Link to="/bugs" className="nav-tab">Bugs</Link>
      </div>

      <h1>Leetcode Tracker</h1>

      <div className="problem-list">
        <div className="problem-card">
          <h2>Add Leetcode Problem</h2>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="problem-meta">
              <label>Title</label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="problem-meta">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="problem-meta">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe the problem or your approach…"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="problem-meta">
              <label>Solution</label>
              <textarea
                name="solution"
                placeholder="Describe the solution or add an image"
                rows={4}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              />
            </div>

            <button type="submit">Add Problem</button>
          </form>
        </div>
      </div>
{/*  
      <div className="problem-list">
        <h2>Saved Problems</h2>
        {problems.map((p) => (
          <LeetcodeProblem
            key={p._id}
            problem_id={p._id}
            title={p.title}
            difficulty={p.difficulty}
            description={p.description}
            onDelete={onDelete}
          />
        ))}
      </div>
      */}
    </div>
  );
}
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LeetCode from "./LeetCode"

export default function LeetcodePage({ problems, onDelete }) {
  const formRef = useRef();

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("")

  const handleLeetCodeSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("difficulty", difficulty);
    formData.append("description", description);
    formData.append("solution", solution);


    await fetch("http://localhost:8000/leetcode/add/", {
      method: "POST",
      body: formData
    });

    setTitle("");
    setDifficulty("Easy");
    setSolution("")
    setDescription("");
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

          <form ref={formRef} onSubmit={handleLeetCodeSubmit}>
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
 
      <div className="problem-list">
        <h2>Saved Problems</h2>
        {Array.isArray(problems) && problems.map((p) => (
          <LeetCode
            key={p.id}
            problem_id={p.id}
            title={p.title}
            difficulty={p.difficulty}
            description={p.description}
            solution={p.solution}
            onDelete={onDelete}
          />
        ))}
      </div>
     
    </div>
  );
}
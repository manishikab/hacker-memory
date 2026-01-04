import React from "react";

export default function LeetCodeProblem({
  problem_id,
  title,
  difficulty,
  description,
  solution,
  onDelete
}) {
  return (
    <div className="problem-card saved-problem">
      <div className="problem-header">
        <h3>{title}</h3>
        <span className={`difficulty-tag ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>

      <p className="problem-description">{description}</p>
      <p className="problem-solution">{solution}</p>

      <button
        className="delete-btn"
        onClick={() => onDelete(problem_id)}
      >
        Delete
      </button>
    </div>
  );
}
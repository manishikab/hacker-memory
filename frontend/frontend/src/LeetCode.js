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
        <h3 className="problem-title">{title}</h3>

        <span className={`difficulty-tag difficulty-${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>

      <div className="problem-body">
        <p className="problem-description">
          <strong>Description:</strong> {description}
        </p>

        <p className="problem-solution">
          <strong>Solution:</strong> {solution}
        </p>
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(problem_id)}
      >
        Delete
      </button>
    </div>
  );
}

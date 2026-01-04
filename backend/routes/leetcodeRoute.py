from fastapi import APIRouter, Form
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LeetCodeProblem(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    solution: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = []
    embedding: Optional[List[float]]
    created_at: Optional[datetime] = None


router = APIRouter(prefix="/leetcode", tags=["leetcode"])

@router.get("/")
def get_leetcode_problems():
    print("GET /leetcode/ route hit") 
    print("RAW DOCS:", list(memories.find({"type": "leetcode"})))
    docs = memories.find({"type": "leetcode"})
    problems = []

    for doc in docs:
        problem = LeetCodeProblem(
            id=str(doc["_id"]),
            title=doc.get("title"),
            difficulty=doc.get("difficulty"),
            description=doc.get("description"),
            solution=doc.get("solution"),
            type=doc.get("type"),
            tags=doc.get("tags", []),
            embedding=doc.get("embedding", []),
            created_at=doc.get("created_at")
        )
        problems.append(problem)

    return {"problems": [p.dict() for p in problems]}

@router.post("/add/")
def add_leetcode_problem(
    title: str = Form(...),
    difficulty: str = Form(...),
    description: str = Form(...),
    solution: str = Form(...)
    ):

    problem = LeetCodeProblem(
        title=title,
        difficulty=difficulty,
        description=description,
        solution=solution,
        type="leetcode",
        tags=["leetcode"],
        embedding=[],
        created_at=datetime.utcnow()
    )
    problem_dict = problem.dict(exclude={"id"}) 
    memories.insert_one(problem_dict)
    return {"status": "problem added"}



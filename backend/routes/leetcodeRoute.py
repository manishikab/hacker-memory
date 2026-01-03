from fastapi import APIRouter, Form
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LeetCodeProblem(BaseModel):
    content: str
    title: Optional[str] = None
    tags: Optional[List[str]] = []
    embedding: Optional[List[float]]


router = APIRouter(prefix="/leetcode", tags=["leetcode"])

@router.get("/")
def get_leetcode_problems():
    leetcode_problems = [LeetCodeProblem(**doc) for doc in memories.find({"type": "leetcode"})]
    return {"leetcode_problems": leetcode_problems}

@router.post("/add/")
def add_leetcode_problem(
    title: str = Form(...),
    content: str = Form(...),
    ):

    problem = LeetCodeProblem(
        title=title,
        content=content,
        tags=["leetcode"],
        embedding=[],
        created_at=datetime.utcnow()
    )
    problem_dict = problem.dict()
    memories.insert_one(problem_dict)
    return {"status": "problem added"}
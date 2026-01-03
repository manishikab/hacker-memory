from fastapi import APIRouter, Form, HTTPException
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Bug(BaseModel):
    content: str
    title: Optional[str] = None
    tags: Optional[List[str]] = []
    embedding: Optional[List[float]]


router = APIRouter(prefix="/bugs", tags=["bugs"])

@router.get("/")
def get_bugs():
    bugs = [Bug(**doc) for doc in memories.find({"type": "bug"})]
    return {"bugs": bugs}

@router.post("/add/")
def add_bug(
    title: str = Form(...),
    content: str = Form(...),
    ):

    bug = Bug(
        title=title,
        content=content,
        tags=["bug"],
        embedding=[],
        created_at=datetime.utcnow()
    )
    bug_dict = bug.dict()
    memories.insert_one(bug_dict)
    return {"status": "bug added"}

@router.delete("/{bug_id}")
def delete_bug(bug_id: str):
    result = memories.delete_one({"_id": bug_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bug not found")
    return {"status": "bug deleted"}

@router.put("/{bug_id}")
def update_bug(bug_id: str, bug: Bug):
    result = memories.update_one(
        {"_id": bug_id},
        {"$set": bug.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bug not found")
    return {"status": "bug updated"}


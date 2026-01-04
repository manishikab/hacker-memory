from fastapi import APIRouter, Form, HTTPException
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class Bug(BaseModel):
    id: Optional[str] = None 
    content: str
    title: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = []
    embedding: Optional[List[float]] = []
    created_at: Optional[datetime] = None

router = APIRouter(prefix="/bugs", tags=["bugs"])

@router.get("/")
def get_bugs():
    
    docs = memories.find({"type": "bug"})
    
    bugs = []

    for doc in docs:
        bug = Bug(
            id=str(doc["_id"]),   # convert ObjectId → string
            title=doc.get("title"),
            content=doc.get("content"),
            type=doc.get("type"),
            tags=doc.get("tags", []),
            embedding=doc.get("embedding", []),
            created_at=doc.get("created_at")
        )
        bugs.append(bug)

    return {"bugs": [b.dict() for b in bugs]}



@router.post("/add/")
def add_bug(
    title: str = Form(...),
    content: str = Form(...),
    ):

    bug = Bug(
        title=title,
        content=content,
        type="bug",
        tags=["bug"],
        embedding=[],
        created_at=datetime.utcnow()
    )
    bug_dict = bug.dict(exclude={"id"})
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


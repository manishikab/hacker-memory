from fastapi import APIRouter, Form
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Notes(BaseModel):
    content: str
    title: Optional[str] = None
    tags: Optional[List[str]] = []
    embedding: Optional[List[float]]


router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/")
def get_notes():
    notes = [Notes(**doc) for doc in memories.find({"type": "notes"})]
    return {"notes": notes}

@router.post("/add/")
def add_notes(
    title: str = Form(...),
    content: str = Form(...),
    ):

    notes = Notes(
        title=title,
        content=content,
        tags=["notes"],
        embedding=[],
        created_at=datetime.utcnow()
    )
    notes_dict = notes.dict()
    memories.insert_one(notes_dict)
    return {"status": "notes added"}
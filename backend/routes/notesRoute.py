from fastapi import APIRouter, Form
from db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Notes(BaseModel):
    id: Optional[str] = None 
    content: str
    title: Optional[str] = None
    type: Optional[str] = None
    class_name: Optional[str] = None

    tags: Optional[List[str]] = []
    embedding: Optional[List[float]]
    created_at: Optional[datetime] = None
    ai: Optional[bool] = False


router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/")
def get_notes():
    print("GET /notes/ route hit") 
    print("RAW DOCS:", list(memories.find({"type": "notes"})))
    docs = memories.find({"type": "notes"})
    notes = []

    for doc in docs:
        note = Notes(
            id=str(doc["_id"]),
            title=doc.get("title"),
            content=doc.get("content"),
            class_name=doc.get("class_name"),
            type=doc.get("type"),
            tags=doc.get("tags", []),
            embedding=doc.get("embedding", []),
            created_at=doc.get("created_at")
        )
        notes.append(note)

    return {"notes": [n.dict() for n in notes]}   


@router.post("/add/")
def add_notes(
    title: str = Form(...),
    content: str = Form(...),
    class_name: str = Form(...),
    ):

    notes = Notes(
        title=title,
        type="notes",
        content=content,
        class_name=class_name,

        tags=["notes"],
        embedding=[],
        created_at=datetime.utcnow(),
        ai=False
    )
    notes_dict = notes.dict(exclude={"id"}) 
    memories.insert_one(notes_dict)
    return {"status": "notes added"}
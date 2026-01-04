from fastapi import APIRouter, Form
from db import memories

router = APIRouter(prefix="/classes", tags=["classes"])

@router.get("/")
def get_classes():
    docs = memories.find({"type": "class"})
    return {"classes": [d["class_name"] for d in docs]}

@router.post("/add/")
def add_class(name: str = Form(...)):
    memories.insert_one({
        "type": "class",
        "class_name": name
    })
    return {"status": "class added"}

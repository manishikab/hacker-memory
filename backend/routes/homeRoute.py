from fastapi import APIRouter, Form
from db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/home", tags=["home"])
@router.get("/")
def get_stats():
    bug_count = memories.count_documents({"type": "bug"})
    notes_count = memories.count_documents({"type": "notes"})
    leetcode_count = memories.count_documents({"type": "leetcode"})

    return {
        "bugs": bug_count,
        "notes": notes_count,
        "leetcode": leetcode_count
    }

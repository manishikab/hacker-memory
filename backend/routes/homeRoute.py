from fastapi import APIRouter, Form
from backend.db import memories
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/home", tags=["home"])
@router.get("/")
def get_stats():
    bug_count = memories.count_documents({"type": "bug"})
    leetcode_count = memories.count_documents({"type": "leetcode"})

    return {
        "bugs": bug_count,
        "leetcode": leetcode_count
    }

#need to connect the ai part
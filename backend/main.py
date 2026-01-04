from dotenv import load_dotenv
import os

from fastapi import FastAPI
from pydantic import BaseModel
from backend.gemini import get_embedding, analyze
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.bugRoute import router as bugs_router
from backend.routes.homeRoute import router as home_router
from backend.routes.leetcodeRoute import router as leetcode_router
from backend.routes.notesRoute import router as notes_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(bugs_router)
app.include_router(home_router)
app.include_router(leetcode_router)
app.include_router(notes_router)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.hacker_memory
collection = db.memories  # your collection for embeddings


class QueryRequest(BaseModel):
    query: str


@app.post("/analyze")
def analyze_query(q: QueryRequest):
    try:
        # 1️⃣ Get embedding vector
        embedding_vector = get_embedding(q.query)

        # 2️⃣ Perform vector search in MongoDB
        # Make sure your index is on the "embedding" field
        pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": embedding_vector,
                    "path": "embedding",
                    "index": "embedding_vector_index",
                    "numCandidates": 10,
                    "limit": 3
                }
            }
        ]
        results = list(collection.aggregate(pipeline))

        # 3️⃣ Extract past memories from search results
        memories = [doc["text"] for doc in results]

        # 4️⃣ Call analyze
        analysis = analyze(q.query, memories)

        return {"result": analysis}

    except Exception as e:
        return {"error": str(e)}

class MemoryRequest(BaseModel):
    content: str

@app.post("/memory")
def add_memory(m: MemoryRequest):
    try:
        embedding_vector = get_embedding(m.content)
        doc = {
            "text": m.content,
            "embedding": embedding_vector
        }
        collection.insert_one(doc)
        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}

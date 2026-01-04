from dotenv import load_dotenv
import os

from fastapi import FastAPI
from pydantic import BaseModel
from gemini import get_embedding, analyze, summarize_text
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from routes.bugRoute import router as bugs_router
from routes.homeRoute import router as home_router
from routes.leetcodeRoute import router as leetcode_router
from routes.notesRoute import router as notes_router
from routes.classesRoute import router as class_router

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
app.include_router(class_router)


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

        # save new insights
        if analysis.startswith("INSIGHT:"):
            insight_text = analysis.replace("INSIGHT:", "").strip()

            summary = summarize_text(insight_text)
            collection.insert_one({
                "text": insight_text,
                "type": "pattern",
                "summary": summary,
                "source_query": q.query,
                "embedding": get_embedding(insight_text),
            })

        return {"result": analysis}

    except Exception as e:
        return {"error": str(e)}

class MemoryRequest(BaseModel):
    content: str
    type: str | None = None


@app.post("/memory")
def add_memory(m: MemoryRequest):
    try:
        embedding_vector = get_embedding(m.content)

        # generate summary using Gemini
        summary = summarize_text(m.content)

        doc = {
            "text": m.content,
            "summary": summary,  # NEW FIELD
            "type": m.type or "generic",
            "embedding": embedding_vector,
            "ai": True
        }

        collection.insert_one(doc)
        return {"status": "success", "summary": summary}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"FastAPI is running!"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React app
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recent-memories")
def recent_memories():
    """
    Returns the most recent memories (type=memory) only, with safe summary fallback.
    """
    docs = collection.find(
            {"ai": True, "type": {"$ne": "pattern"}},  # FIXED FILTER
            {"text": 1, "summary": 1, "type": 1}
        ).sort("created_at", -1).limit(6)
    result = []
    for d in docs:
        text = d.get("text") or "Untitled memory"
        summary = d.get("summary") or text[:50]  # safe fallback
        result.append({
            "text": text,
            "summary": summary,
            "type": "memory"
        })
    return result



@app.get("/recent-patterns")
def recent_patterns():
    """
    Returns recent AI insights (type=pattern) only, using summaries.
    """
    docs = collection.find({"type": "pattern"}, {"text": 1, "summary": 1, "type": 1}) \
                     .sort("created_at", -1) \
                     .limit(6)

    result = []
    for d in docs:
        text = d.get("text") or "Insight"
        summary = d.get("summary") or text[:50]
        result.append({
            "text": text,
            "summary": summary,
            "type": "pattern"
        })
    return result

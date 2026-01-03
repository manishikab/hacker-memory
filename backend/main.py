from dotenv import load_dotenv
import os

from fastapi import FastAPI
from pydantic import BaseModel
from gemini import get_embedding, analyze
from pymongo import MongoClient

load_dotenv()

app = FastAPI()

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

            collection.insert_one({
                "text": insight_text,
                "type": "pattern",
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
        doc = {
            "text": m.content,
            "type": m.type or "generic",
            "embedding": embedding_vector
        }
        collection.insert_one(doc)
        return {"status": "success"}
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
def recent_memories(limit: int = 5):
    docs = (
        collection
        .find({}, {"text": 1, "type": 1, "_id": 0})
        .sort("_id", -1)
        .limit(limit)
    )

    return list(docs)

@app.get("/recent-themes")
def recent_themes(limit: int = 5):
    docs = (
        collection
        .find({ "type": "pattern" }, {"text": 1, "_id": 0})
        .sort("_id", -1)
        .limit(limit)
    )

    return list(docs)
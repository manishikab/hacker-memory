import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

EMBED_MODEL = "models/embedding-001"
TEXT_MODEL = "models/gemini-1.5-flash"

# return embedding vector for similarity comparisons (store in db)
def get_embedding(text: str) -> list[float]:
    result = genai.embed_content(
        model=EMBED_MODEL,
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]

def analyze(query: str, memories: list[str]) -> str:
    prompt = f"""
You are analyzing a hacker's past experiences.

Past experiences:
{chr(10).join(memories)}

Current issue:
{query}

Answer the question and identify any repeated mistake or pattern.
"""
    model = genai.GenerativeModel(TEXT_MODEL)
    response = model.generate_content(prompt)
    return response.text
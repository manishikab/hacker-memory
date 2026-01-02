import os
from dotenv import load_dotenv
from google.genai import Client, types

load_dotenv()

client = Client(api_key=os.getenv("GEMINI_API_KEY"))

EMBED_MODEL = "models/gemini-embedding-001"
TEXT_MODEL = "models/gemini-2.5-flash"


from google.genai import types

from google.genai import types

def get_embedding(text: str) -> list[float]:
    """
    Return a plain list of floats for the embedding vector using the new Gemini SDK.
    """
    response = client.models.embed_content(
        model=EMBED_MODEL,
        contents=[text]  # note: contents should be a list
    )

    # response.embeddings is a list of ContentEmbedding objects
    embedding_obj = response.embeddings[0]

    if isinstance(embedding_obj, types.ContentEmbedding):
        return embedding_obj.values  # plain float list
    else:
        raise ValueError(f"Cannot extract embedding vector from {type(embedding_obj)}")


def analyze(query: str, memories: list[str]) -> str:
    prompt = f"""
You are analyzing a hacker's past experiences.

Past experiences:
{chr(10).join(memories)}

Current issue:
{query}

Answer the question and identify any repeated mistake or pattern.
"""
    # correct text generation call
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt
    )
    return response.text
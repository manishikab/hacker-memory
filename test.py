import os
from google.genai import Client
from dotenv import load_dotenv

load_dotenv()
client = Client(api_key=os.getenv("GEMINI_API_KEY"))

# Models
EMBED_MODEL = "models/gemini-embedding-001"
TEXT_MODEL = "models/gemini-2.5-flash"

text = "I always forget to commit my changes."

# Embeddings
emb_resp = client.models.embed_content(
    model=EMBED_MODEL,
    contents=text
)
print("Embedding length:", len(emb_resp.embeddings))
print("Embedding sample:", emb_resp.embeddings[:5])

# Text generation
prompt = "Explain why forgetting commits often is a bad habit."
gen_resp = client.models.generate_content(
    model=TEXT_MODEL,
    contents=prompt
)
print("Generated text:", gen_resp.text)

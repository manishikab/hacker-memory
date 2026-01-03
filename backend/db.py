from dotenv import load_dotenv
from pymongo import MongoClient, errors
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print("MONGO_URI =", MONGO_URI)  # TEMP DEBUG LINE

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # <-- will throw if connection/auth fails
except errors.ServerSelectionTimeoutError as err:
    print("MongoDB connection failed:", err)
    raise

db = client["hacker_memory"]
memories = db["memories"]
We've always been fascinated by how hackers learn from experience: the cycle of trying, failing, forgetting, and trying again. Traditional notes apps let you record information, but they don’t reflect how your brain actually remembers and forgets over time. We wanted to build a system that actively tracks learning patterns, surfaces past mistakes, and helps prevent repeated errors.

The inspiration came from the workflow of many hackers: how often we'd hit a bug we'd solved before, or forget an API nuance we thought we had mastered. We realized a “smart memory” for hackers could turn past mistakes into future insights, making learning more efficient.

Cache Overflow is a smart memory system for hackers. It tracks not just what you’ve learned, but how you've learned. By entering entries for notes, leetcode questions, and encountered bugs, our AI system carefully tracks any patterns. Through a chatbox system, users can ask questions, and our AI answers based on past patterns. This generates meta-insights like “Which mistakes cost me the most time?” or “What knowledge am I underusing?", helping you learn faster and avoid repeating the same pitfalls.

We used FastAPI for the backend, creating a system that logs entries into MongoDB. We incorporated Gemini to provide a space for hackers to ask their questions and get relevant answers, including if this is a repeating pattern or an already encountered solution for the hacker.


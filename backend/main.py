# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resources, quizzes, users, leaderboard, ai, search

app = FastAPI()

# Allow requests from your React dev server (usually http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resources.router)
app.include_router(quizzes.router)
app.include_router(users.router)
app.include_router(leaderboard.router)
app.include_router(ai.router)
app.include_router(search.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Aprevail API"}
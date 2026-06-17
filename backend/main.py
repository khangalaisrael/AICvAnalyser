import os
import sys

# Ensure services/ is on the path so routers and middleware can import from it
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import analyse, candidates

app = FastAPI(title="TalentScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse.router, tags=["Analysis"])
app.include_router(candidates.router, tags=["Candidates"])


@app.get("/health")
async def health():
    return {"status": "ok"}

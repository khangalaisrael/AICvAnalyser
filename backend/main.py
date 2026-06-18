import os
import sys

# Ensure services/ is on the path so routers and middleware can import from it
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import analyse, candidates, rewrite

app = FastAPI(title="TalentScan API", version="1.0.0")

def _get_origins() -> list[str]:
    origins = ["http://localhost:3000"]
    frontend_url = os.getenv("FRONTEND_URL", "")
    if frontend_url:
        origins.append(frontend_url)
    return origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_origins(),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse.router, tags=["Analysis"])
app.include_router(candidates.router, tags=["Candidates"])
app.include_router(rewrite.router)


@app.get("/health")
async def health():
    return {"status": "ok"}

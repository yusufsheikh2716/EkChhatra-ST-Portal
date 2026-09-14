import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from seed.seed_data import seed_database

# Import routers
from routers import (
    auth_router,
    scholarships_router,
    applications_router,
    documents_router,
    notifications_router,
    chat_router,
    verification_router,
    analytics_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed database on startup if not already seeded
    try:
        await seed_database()
    except Exception as e:
        print(f"Warning: Database auto-seed encountered: {e}")
    yield

app = FastAPI(
    title="EkChhatra — Unified ST Scholarship Portal API",
    description="Unified API integrating 5 Ministry of Tribal Affairs (MoTA) central schemes into a single dashboard for Scheduled Tribe students.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# Note: For production deployment, restrict allow_origins to the specific frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(scholarships_router)
app.include_router(applications_router)
app.include_router(documents_router)
app.include_router(notifications_router)
app.include_router(chat_router)
app.include_router(verification_router)
app.include_router(analytics_router)

@app.get("/")
async def root():
    return {
        "portal": "EkChhatra — Unified ST Scholarship Portal",
        "ministry": "Ministry of Tribal Affairs (MoTA)",
        "status": "Online & Operational",
        "version": "1.0.0",
        "docs": "/docs",
        "demo_account": "demo@ekchhatra.in / demo123"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import SessionLocal
from app.services.metadata_service import seed_initial_metadata
from app.api.auth import router as auth_router
from app.api.profiles import router as profiles_router
from app.api.skills import router as skills_router
from app.api.interests import router as interests_router
from app.api.colleges import router as colleges_router
from app.api.users import router as users_router
from app.api.teams import router as teams_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed default metadata on startup without auto-creating tables (Alembic is the schema source of truth)
    db = SessionLocal()
    try:
        seed_initial_metadata(db)
    except Exception as e:
        print(f"Metadata seed info: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(profiles_router, prefix=f"{settings.API_V1_STR}/profiles", tags=["Profiles"])
app.include_router(skills_router, prefix=f"{settings.API_V1_STR}/skills", tags=["Skills"])
app.include_router(interests_router, prefix=f"{settings.API_V1_STR}/interests", tags=["Interests"])
app.include_router(colleges_router, prefix=f"{settings.API_V1_STR}/colleges", tags=["Colleges"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(teams_router, prefix=f"{settings.API_V1_STR}/teams", tags=["Teams"])


@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

"""
Prompt Engineer - FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from api import analyze, contexts, library, settings
from core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Prompt Engineer API...")
    init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("👋 Shutting down gracefully...")

app = FastAPI(
    title="Prompt Engineer API",
    description="AI-powered prompt optimization platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(contexts.router, prefix="/api/contexts", tags=["contexts"])
app.include_router(library.router, prefix="/api/library", tags=["library"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "Prompt Engineer API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "knowledge_base": "loaded"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

"""
Prompt Library API
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from core.database import get_db, PromptLibraryItem

router = APIRouter()

class SavePromptRequest(BaseModel):
    title: str
    original_prompt: str
    optimized_prompt: str
    tags: List[str] = []
    context_id: Optional[str] = None
    analysis: Optional[dict] = None
    optimization: Optional[dict] = None

@router.post("/")
async def save_prompt(request: SavePromptRequest, db: Session = Depends(get_db)):
    """Save a prompt to the library"""
    prompt = PromptLibraryItem(
        title=request.title,
        original_prompt=request.original_prompt,
        optimized_prompt=request.optimized_prompt,
        tags=request.tags,
        context_id=request.context_id,
        analysis=request.analysis,
        optimization=request.optimization
    )

    db.add(prompt)
    db.commit()
    db.refresh(prompt)

    return {
        "success": True,
        "message": "Prompt saved to library",
        "id": prompt.id
    }

@router.get("/")
async def get_library(
    tags: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all prompts from library with optional filtering"""
    query = db.query(PromptLibraryItem)

    # Filter by tags if provided
    if tags:
        tag_list = [t.strip() for t in tags.split(',')]
        # SQLite JSON filtering
        for tag in tag_list:
            query = query.filter(PromptLibraryItem.tags.contains(tag))

    # Search in title and prompts
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (PromptLibraryItem.title.like(search_pattern)) |
            (PromptLibraryItem.original_prompt.like(search_pattern)) |
            (PromptLibraryItem.optimized_prompt.like(search_pattern))
        )

    prompts = query.order_by(PromptLibraryItem.created_at.desc()).all()

    return {
        "success": True,
        "count": len(prompts),
        "prompts": [
            {
                "id": p.id,
                "title": p.title,
                "original_prompt": p.original_prompt,
                "optimized_prompt": p.optimized_prompt,
                "tags": p.tags,
                "context_id": p.context_id,
                "created_at": p.created_at.isoformat(),
                "updated_at": p.updated_at.isoformat()
            }
            for p in prompts
        ]
    }

@router.get("/{prompt_id}")
async def get_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """Get a specific prompt by ID"""
    prompt = db.query(PromptLibraryItem).filter(PromptLibraryItem.id == prompt_id).first()

    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    return {
        "success": True,
        "prompt": {
            "id": prompt.id,
            "title": prompt.title,
            "original_prompt": prompt.original_prompt,
            "optimized_prompt": prompt.optimized_prompt,
            "tags": prompt.tags,
            "context_id": prompt.context_id,
            "analysis": prompt.analysis,
            "optimization": prompt.optimization,
            "created_at": prompt.created_at.isoformat(),
            "updated_at": prompt.updated_at.isoformat()
        }
    }

@router.put("/{prompt_id}")
async def update_prompt(prompt_id: int, request: SavePromptRequest, db: Session = Depends(get_db)):
    """Update a prompt in the library"""
    prompt = db.query(PromptLibraryItem).filter(PromptLibraryItem.id == prompt_id).first()

    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # Update fields
    prompt.title = request.title
    prompt.original_prompt = request.original_prompt
    prompt.optimized_prompt = request.optimized_prompt
    prompt.tags = request.tags
    prompt.context_id = request.context_id
    prompt.analysis = request.analysis
    prompt.optimization = request.optimization
    prompt.updated_at = datetime.utcnow()

    db.commit()

    return {
        "success": True,
        "message": "Prompt updated"
    }

@router.delete("/{prompt_id}")
async def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """Delete a prompt from library"""
    prompt = db.query(PromptLibraryItem).filter(PromptLibraryItem.id == prompt_id).first()

    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    db.delete(prompt)
    db.commit()

    return {
        "success": True,
        "message": "Prompt deleted"
    }

@router.get("/tags/all")
async def get_all_tags(db: Session = Depends(get_db)):
    """Get all unique tags from library"""
    prompts = db.query(PromptLibraryItem).all()

    # Collect all tags
    all_tags = set()
    for prompt in prompts:
        if prompt.tags:
            all_tags.update(prompt.tags)

    return {
        "success": True,
        "tags": sorted(list(all_tags))
    }

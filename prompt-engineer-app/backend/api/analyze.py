"""
Analyze API endpoint
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from core.analyzer import PromptAnalyzer
from core.optimizer import PromptOptimizer
from core.database import get_db, Context

router = APIRouter()

class AnalyzeRequest(BaseModel):
    prompt: str
    context_id: Optional[str] = None

class OptimizeRequest(BaseModel):
    prompt: str
    answers: dict
    context_id: Optional[str] = None

@router.post("/")
async def analyze_prompt(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """Analyze a prompt and return issues, questions, recommendations"""
    if not request.prompt or len(request.prompt.strip()) == 0:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    # Load context if specified
    context = None
    if request.context_id:
        context_obj = db.query(Context).filter(Context.name == request.context_id).first()
        if context_obj:
            context = context_obj.content

    # Analyze prompt
    analyzer = PromptAnalyzer(context=context)
    result = analyzer.analyze(request.prompt)

    return {
        "success": True,
        "analysis": result.dict()
    }

@router.post("/optimize")
async def optimize_prompt(request: OptimizeRequest, db: Session = Depends(get_db)):
    """Generate optimized prompt based on analysis and user answers"""
    if not request.prompt or len(request.prompt.strip()) == 0:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    # Load context if specified
    context = None
    if request.context_id:
        context_obj = db.query(Context).filter(Context.name == request.context_id).first()
        if context_obj:
            context = context_obj.content

    # Optimize prompt
    optimizer = PromptOptimizer(context=context)
    result = optimizer.optimize(
        original_prompt=request.prompt,
        answers=request.answers
    )

    return {
        "success": True,
        "optimization": result.dict()
    }

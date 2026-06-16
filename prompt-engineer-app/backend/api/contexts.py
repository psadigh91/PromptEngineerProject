"""
Context management API
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import yaml
import json
from datetime import datetime

from core.database import get_db, Context as ContextModel

router = APIRouter()

@router.post("/upload")
async def upload_context(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a context file (YAML or JSON)"""
    if not file.filename.endswith(('.yaml', '.yml', '.json')):
        raise HTTPException(status_code=400, detail="Only YAML or JSON files are supported")

    try:
        # Read file content
        content = await file.read()
        content_str = content.decode('utf-8')

        # Parse based on file type
        if file.filename.endswith('.json'):
            context_data = json.loads(content_str)
        else:
            context_data = yaml.safe_load(content_str)

        # Validate required fields
        if 'context' not in context_data:
            raise HTTPException(status_code=400, detail="Invalid context file: missing 'context' key")

        context_info = context_data['context']
        if 'name' not in context_info:
            raise HTTPException(status_code=400, detail="Invalid context file: missing 'name' in context")

        # Check if context already exists
        existing = db.query(ContextModel).filter(
            ContextModel.name == context_info['name']
        ).first()

        if existing:
            # Update existing
            existing.content = context_data
            existing.file_name = file.filename
            existing.uploaded_at = datetime.utcnow()
            db.commit()
            message = "Context updated successfully"
        else:
            # Create new
            new_context = ContextModel(
                name=context_info['name'],
                type=context_info.get('type', 'custom'),
                content=context_data,
                file_name=file.filename
            )
            db.add(new_context)
            db.commit()
            message = "Context uploaded successfully"

        return {
            "success": True,
            "message": message,
            "context": {
                "name": context_info['name'],
                "type": context_info.get('type', 'custom'),
                "filename": file.filename
            }
        }

    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML: {str(e)}")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/")
async def list_contexts(db: Session = Depends(get_db)):
    """List all uploaded contexts"""
    contexts = db.query(ContextModel).all()

    return {
        "success": True,
        "contexts": [
            {
                "id": ctx.id,
                "name": ctx.name,
                "type": ctx.type,
                "filename": ctx.file_name,
                "uploaded_at": ctx.uploaded_at.isoformat(),
                "is_active": bool(ctx.is_active)
            }
            for ctx in contexts
        ]
    }

@router.get("/{context_name}")
async def get_context(context_name: str, db: Session = Depends(get_db)):
    """Get a specific context"""
    context = db.query(ContextModel).filter(ContextModel.name == context_name).first()

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    return {
        "success": True,
        "context": {
            "id": context.id,
            "name": context.name,
            "type": context.type,
            "content": context.content,
            "filename": context.file_name,
            "uploaded_at": context.uploaded_at.isoformat(),
            "is_active": bool(context.is_active)
        }
    }

@router.post("/{context_name}/activate")
async def activate_context(context_name: str, db: Session = Depends(get_db)):
    """Activate a context (deactivates others)"""
    # Deactivate all contexts
    db.query(ContextModel).update({"is_active": 0})

    # Activate specified context
    context = db.query(ContextModel).filter(ContextModel.name == context_name).first()

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    context.is_active = 1
    db.commit()

    return {
        "success": True,
        "message": f"Context '{context_name}' activated"
    }

@router.delete("/{context_name}")
async def delete_context(context_name: str, db: Session = Depends(get_db)):
    """Delete a context"""
    context = db.query(ContextModel).filter(ContextModel.name == context_name).first()

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    db.delete(context)
    db.commit()

    return {
        "success": True,
        "message": f"Context '{context_name}' deleted"
    }

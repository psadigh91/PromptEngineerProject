"""
Settings API
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Any

from core.database import get_db, Settings as SettingsModel

router = APIRouter()

class SettingUpdate(BaseModel):
    key: str
    value: Any

@router.get("/")
async def get_settings(db: Session = Depends(get_db)):
    """Get all settings"""
    settings = db.query(SettingsModel).all()

    return {
        "success": True,
        "settings": {s.key: s.value for s in settings}
    }

@router.put("/")
async def update_setting(request: SettingUpdate, db: Session = Depends(get_db)):
    """Update a setting"""
    setting = db.query(SettingsModel).filter(SettingsModel.key == request.key).first()

    if setting:
        setting.value = request.value
    else:
        setting = SettingsModel(key=request.key, value=request.value)
        db.add(setting)

    db.commit()

    return {
        "success": True,
        "message": f"Setting '{request.key}' updated"
    }

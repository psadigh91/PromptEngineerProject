"""
Database setup and models
"""
import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database path
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "database")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "prompts.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class PromptLibraryItem(Base):
    __tablename__ = "prompt_library"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    original_prompt = Column(Text)
    optimized_prompt = Column(Text)
    tags = Column(JSON)  # List of tags
    context_id = Column(String, nullable=True)
    analysis = Column(JSON)  # Analysis results
    optimization = Column(JSON)  # Optimization results
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Context(Base):
    __tablename__ = "contexts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)  # industry, solution, role, custom
    content = Column(JSON)  # Context data
    file_name = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=0)  # SQLite uses int for boolean

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db():
    """Initialize database and create tables"""
    Base.metadata.create_all(bind=engine)
    print(f"✅ Database initialized at: {DB_PATH}")

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

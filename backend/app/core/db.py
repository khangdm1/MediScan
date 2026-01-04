# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Kết nối đến PostgreSQL
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Session để làm việc với DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base cho ORM model
Base = declarative_base()

# Dependency để inject vào FastAPI endpoint
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

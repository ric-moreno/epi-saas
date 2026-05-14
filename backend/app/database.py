from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependência do FastAPI — abre e fecha sessão automaticamente
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
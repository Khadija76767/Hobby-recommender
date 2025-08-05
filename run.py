import uvicorn
from app.main import app
from app.db.session import engine
from app.models.models import Base
from app.db.init_db import init_db
from app.db.session import SessionLocal
import asyncio

async def setup():
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize database with sample data
    db = SessionLocal()
    try:
        await init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    # Run setup
    asyncio.run(setup())
    
    # Run application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 
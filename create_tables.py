from sqlalchemy import create_engine
from app.models.models import Base
from app.core.config import settings

def create_tables():
    # Create a new engine that connects to the database
    engine = create_engine(settings.DATABASE_URL)
    
    # Create all tables
    Base.metadata.drop_all(bind=engine)  # Drop existing tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!") 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Hobby Recommender",
    description="An AI-powered system for recommending personalized hobbies",
    version="1.0.0"
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender is running!"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint working!"}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simplified for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporarily disable complex imports and routes
# from app.api.routes import api_router
# app.include_router(api_router, prefix="/api") 
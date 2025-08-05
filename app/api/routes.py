from fastapi import APIRouter
from app.api.endpoints import hobbies, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(hobbies.router, prefix="/hobbies", tags=["hobbies"]) 
from datetime import timedelta
from typing import Any, List
import random
import string
import logging
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

from app.core.security import create_access_token, get_password_hash, verify_password, get_current_user
from app.core.config import settings
from app.api import deps
from app.models.models import User, user_friends
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Create avatars directory if it doesn't exist
AVATARS_DIR = os.path.join("frontend", "public", "avatars")
os.makedirs(AVATARS_DIR, exist_ok=True)

class ProfileUpdate(BaseModel):
    display_name: str = None

def generate_user_code(db: Session) -> str:
    """Generate a unique user code."""
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not db.query(User).filter(User.user_code == code).first():
            return code

@router.post("/register", response_model=UserResponse)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """Register a new user."""
    try:
        logger.info(f"Attempting to register user with username: {user_in.username}")
        
    # Check if user exists
    user = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.email)
    ).first()
    if user:
        if user.username == user_in.username:
                logger.warning(f"Registration failed: Username {user_in.username} already exists")
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )
        else:
                logger.warning(f"Registration failed: Email {user_in.email} already exists")
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Generate unique user code
    user_code = generate_user_code(db)
    
    # Create new user
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        user_code=user_code,
            is_active=True,
            display_name=user_in.username  # Set initial display name as username
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
        logger.info(f"Successfully registered user: {user_in.username}")
        return user.to_dict()
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during registration: {str(e)}"
        )

@router.post("/token")
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login."""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get current user info."""
    return current_user.to_dict()

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)) -> Any:
    """Get user profile."""
    return {
        "display_name": current_user.display_name or current_user.username,
        "avatar_url": current_user.avatar_url,
        "user_code": current_user.user_code
    }

@router.post("/profile")
def update_profile(
    profile: ProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update user profile."""
    current_user.display_name = profile.display_name
    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Upload user avatar."""
    try:
        # Create user directory if it doesn't exist
        user_dir = os.path.join(AVATARS_DIR, str(current_user.id))
        os.makedirs(user_dir, exist_ok=True)

        # Save the file
        file_path = os.path.join(user_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Update user avatar URL in database
        avatar_url = f"/avatars/{current_user.id}/{file.filename}"
        current_user.avatar_url = avatar_url
        db.commit()

        return {"avatar_url": avatar_url}
    except Exception as e:
        logger.error(f"Error uploading avatar: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Could not upload avatar"
        )

@router.get("/friends", response_model=List[UserResponse])
def get_friends(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get list of friends."""
    return [friend.to_dict() for friend in current_user.friends]

@router.post("/friends/{code}")
async def add_friend(
    code: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Add friend by code."""
    try:
        # Find user by code
        friend = db.query(User).filter(User.user_code == code).first()
        if not friend:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        # Check if already friends
        existing_friends = db.query(User).join(
            user_friends,
            (user_friends.c.friend_id == User.id) & (user_friends.c.user_id == current_user.id)
        ).all()
        
        if friend in existing_friends:
            raise HTTPException(
                status_code=400,
                detail="Already friends with this user"
            )
        
        # Can't add yourself
        if friend.id == current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Cannot add yourself as a friend"
            )
        
        # Add friend using SQL
        db.execute(
            user_friends.insert().values(
                user_id=current_user.id,
                friend_id=friend.id
            )
        )
        db.commit()
        
        return friend.to_dict()
    except Exception as e:
        logger.error(f"Error adding friend: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to add friend. Please try again."
        )

@router.delete("/friends/{friend_id}")
def remove_friend(
    friend_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Remove friend."""
    # Find friend
    friend = db.query(User).filter(User.id == friend_id).first()
    if not friend:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check if actually friends
    if friend not in current_user.friends:
        raise HTTPException(
            status_code=400,
            detail="Not friends with this user"
        )
    
    # Remove friend
    current_user.friends.remove(friend)
    db.commit()
    
    return {"message": "Friend removed successfully"} 
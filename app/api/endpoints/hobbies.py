from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime, timedelta
import random
import hashlib

from app.db.session import get_db
from app.models.models import Hobby, User, UserHobbyView
from app.core.security import get_current_user
from app.schemas.hobby import HobbyCreate, HobbyResponse, HobbyList

router = APIRouter()

def get_unseen_hobbies(db: Session, user: User, limit: int = 3) -> List[Hobby]:
    """Get hobbies that the user hasn't seen yet."""
    # Get all hobby IDs the user has already seen
    seen_hobby_ids = db.query(UserHobbyView.hobby_id).filter(
        UserHobbyView.user_id == user.id
    ).all()
    seen_hobby_ids = [h[0] for h in seen_hobby_ids]
    
    # Get all hobbies that haven't been seen
    unseen_hobbies = db.query(Hobby).filter(
        ~Hobby.id.in_(seen_hobby_ids) if seen_hobby_ids else True
    ).all()
    
    # If we've seen all hobbies, reset the view history
    if len(unseen_hobbies) < limit:
        db.query(UserHobbyView).filter(UserHobbyView.user_id == user.id).delete()
        db.commit()
        unseen_hobbies = db.query(Hobby).all()
    
    # Randomly select hobbies
    selected_hobbies = random.sample(unseen_hobbies, min(limit, len(unseen_hobbies)))
    
    # Record these hobbies as seen
    for hobby in selected_hobbies:
        view = UserHobbyView(
            user_id=user.id,
            hobby_id=hobby.id,
            viewed_at=datetime.utcnow()
        )
        db.add(view)
    db.commit()
    
    return [hobby.to_dict() for hobby in selected_hobbies]

@router.get("/daily", response_model=List[HobbyResponse])
def get_daily_hobbies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get hobby recommendations (1 main + 2 alternatives) that user hasn't seen yet."""
    hobbies = get_unseen_hobbies(db, current_user, 3)
    if not hobbies:
        raise HTTPException(status_code=404, detail="No hobbies found in database")
    return hobbies

@router.get("/{hobby_id}", response_model=HobbyResponse)
def get_hobby(
    hobby_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific hobby."""
    hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby.to_dict()

@router.get("/", response_model=List[HobbyResponse])
def list_hobbies(
    skip: int = 0,
    limit: int = 10,
    category: str = None,
    skill_level: str = None,
    db: Session = Depends(get_db)
):
    """List all hobbies with optional filtering."""
    query = db.query(Hobby)
    
    if category:
        query = query.filter(Hobby.category == category)
    if skill_level:
        query = query.filter(Hobby.skill_level == skill_level)
    
    hobbies = query.offset(skip).limit(limit).all()
    return [hobby.to_dict() for hobby in hobbies] 
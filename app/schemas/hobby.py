from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HobbyBase(BaseModel):
    name: str
    description: str
    category: str
    skill_level: str
    cost_level: str
    time_commitment: str
    equipment_needed: str
    benefits: str
    detailed_guide: str

class HobbyCreate(HobbyBase):
    pass

class HobbyResponse(HobbyBase):
    id: int

    class Config:
        from_attributes = True

class HobbyList(BaseModel):
    hobbies: List[HobbyResponse]

class HobbyProgressUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class HobbyProgressResponse(BaseModel):
    id: int
    user_id: int
    hobby_id: int
    status: str
    start_date: datetime
    last_updated: datetime
    notes: Optional[str]
    hobby: HobbyResponse

    class Config:
        from_attributes = True 
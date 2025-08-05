from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base

# Association table for user-hobby relationship
user_hobbies = Table(
    'user_hobbies',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('hobby_id', Integer, ForeignKey('hobbies.id'))
)

# Association table for user friends
user_friends = Table(
    'user_friends',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('friend_id', Integer, ForeignKey('users.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    display_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    user_code = Column(String, unique=True, index=True)
    
    # Add relationship to viewed hobbies
    viewed_hobbies = relationship("UserHobbyView", back_populates="user")
    
    # Add friends relationship
    friends = relationship(
        "User",
        secondary=user_friends,
        primaryjoin=(user_friends.c.user_id == id),
        secondaryjoin=(user_friends.c.friend_id == id),
        backref="friend_of"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "display_name": self.display_name,
            "avatar_url": self.avatar_url,
            "is_active": self.is_active,
            "user_code": self.user_code
        }

class Hobby(Base):
    __tablename__ = "hobbies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    skill_level = Column(String)
    cost_level = Column(String)
    time_commitment = Column(String)
    equipment_needed = Column(String)
    benefits = Column(String)
    detailed_guide = Column(Text)

    # Add relationship to users who viewed this hobby
    viewed_by = relationship("UserHobbyView", back_populates="hobby")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "skill_level": self.skill_level,
            "cost_level": self.cost_level,
            "time_commitment": self.time_commitment,
            "equipment_needed": self.equipment_needed,
            "benefits": self.benefits,
            "detailed_guide": self.detailed_guide
        }

class UserHobbyView(Base):
    __tablename__ = "user_hobby_views"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    hobby_id = Column(Integer, ForeignKey("hobbies.id"))
    viewed_at = Column(DateTime)

    # Add relationships
    user = relationship("User", back_populates="viewed_hobbies")
    hobby = relationship("Hobby", back_populates="viewed_by") 
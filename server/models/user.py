from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    aadhaar_last4 = Column(String(4), nullable=False)  # Privacy fix: Only last 4 digits stored
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    dob = Column(String(20), nullable=True)  # DD/MM/YYYY
    gender = Column(String(20), nullable=True)
    state = Column(String(80), nullable=True)
    district = Column(String(80), nullable=True)
    education_level = Column(String(80), nullable=True)  # Class 9-10, Class 11-12, Undergraduate, Postgraduate, PhD, Overseas
    institution_name = Column(String(200), nullable=True)
    institution_code = Column(String(80), nullable=True)
    current_year = Column(String(20), nullable=True)
    percentage = Column(Float, nullable=True, default=0.0)
    st_certificate_no = Column(String(100), nullable=True)
    is_pvtg = Column(Boolean, default=False)  # Particularly Vulnerable Tribal Group
    family_income = Column(Float, nullable=True, default=0.0)
    is_bpl = Column(Boolean, default=False)
    has_disability = Column(Boolean, default=False)
    profile_picture = Column(String(255), nullable=True)
    role = Column(String(20), default="student")  # student, admin
    active_scholarship = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")

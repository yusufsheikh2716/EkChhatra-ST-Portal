from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    education_level: Optional[str] = None
    institution_name: Optional[str] = None
    institution_code: Optional[str] = None
    current_year: Optional[str] = None
    percentage: Optional[float] = 0.0
    st_certificate_no: Optional[str] = None
    is_pvtg: Optional[bool] = False
    family_income: Optional[float] = 0.0
    is_bpl: Optional[bool] = False
    has_disability: Optional[bool] = False
    profile_picture: Optional[str] = None
    role: Optional[str] = "student"
    active_scholarship: Optional[str] = None

class UserCreate(UserBase):
    password: str
    aadhaar_number: str = Field(..., min_length=12, max_length=14, description="Full Aadhaar used for verification, never saved in DB")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    education_level: Optional[str] = None
    institution_name: Optional[str] = None
    institution_code: Optional[str] = None
    current_year: Optional[str] = None
    percentage: Optional[float] = None
    st_certificate_no: Optional[str] = None
    is_pvtg: Optional[bool] = None
    family_income: Optional[float] = None
    is_bpl: Optional[bool] = None
    has_disability: Optional[bool] = None
    profile_picture: Optional[str] = None

class UserOut(UserBase):
    id: int
    aadhaar_last4: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

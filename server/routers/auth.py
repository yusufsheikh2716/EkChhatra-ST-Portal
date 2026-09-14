from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin, UserUpdate, UserOut, TokenResponse
from services.auth_service import hash_password, verify_password, create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email address is already registered."
        )

    # Privacy Fix: Extract last 4 digits of Aadhaar, NEVER store full number
    clean_aadhaar = user_in.aadhaar_number.replace("-", "").replace(" ", "")
    if len(clean_aadhaar) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Aadhaar number provided."
        )
    last4 = clean_aadhaar[-4:]

    new_user = User(
        name=user_in.name,
        email=user_in.email,
        aadhaar_last4=last4,
        password_hash=hash_password(user_in.password),
        phone=user_in.phone,
        dob=user_in.dob,
        gender=user_in.gender,
        state=user_in.state,
        district=user_in.district,
        education_level=user_in.education_level,
        institution_name=user_in.institution_name,
        institution_code=user_in.institution_code,
        current_year=user_in.current_year,
        percentage=user_in.percentage,
        st_certificate_no=user_in.st_certificate_no,
        is_pvtg=user_in.is_pvtg,
        family_income=user_in.family_income,
        is_bpl=user_in.is_bpl,
        has_disability=user_in.has_disability,
        profile_picture=user_in.profile_picture,
        role=user_in.role or "student"
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return TokenResponse(access_token=token, token_type="bearer", user=new_user)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalars().first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Use demo@ekchhatra.in / demo123 for testing."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
async def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_data = updates.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user

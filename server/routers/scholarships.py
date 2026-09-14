from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.scholarship import Scholarship
from models.user import User
from schemas.scholarship import ScholarshipOut, EligibilityCheckItem
from services.eligibility_service import evaluate_all_scholarships, check_scheme_eligibility
from dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/scholarships", tags=["Scholarships"])

@router.get("", response_model=List[ScholarshipOut])
async def list_scholarships(
    level: Optional[str] = Query(None, description="Filter by education level"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Scholarship).where(Scholarship.is_active == True)
    result = await db.execute(query)
    scholarships = result.scalars().all()
    
    if level:
        level_clean = level.lower()
        scholarships = [
            s for s in scholarships
            if any(level_clean in lvl.lower() for lvl in s.education_levels)
        ]
    return scholarships

@router.get("/eligible", response_model=List[EligibilityCheckItem])
async def check_user_eligibility(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Scholarship).where(Scholarship.is_active == True))
    scholarships = result.scalars().all()
    
    evaluations = evaluate_all_scholarships(current_user, scholarships)
    return [
        EligibilityCheckItem(
            scholarship=item["scholarship"],
            is_eligible=item["is_eligible"],
            reasons=item["reasons"],
            match_score=item["match_score"]
        )
        for item in evaluations
    ]

@router.get("/{id_or_code}", response_model=ScholarshipOut)
async def get_scholarship(
    id_or_code: str,
    db: AsyncSession = Depends(get_db)
):
    if id_or_code.isdigit():
        result = await db.execute(select(Scholarship).where(Scholarship.id == int(id_or_code)))
    else:
        result = await db.execute(select(Scholarship).where(Scholarship.code == id_or_code.upper()))
    
    sch = result.scalars().first()
    if not sch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship scheme not found")
    return sch

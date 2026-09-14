from typing import Optional, List, Any, Dict
from pydantic import BaseModel

class ScholarshipBase(BaseModel):
    name: str
    code: str
    ministry: str
    description: str
    target_group: str
    education_levels: List[str]
    max_income: Optional[float] = None
    min_percentage: Optional[float] = 0.0
    net_jrf_required: Optional[bool] = False
    foreign_university_required: Optional[bool] = False
    pvtg_only: Optional[bool] = False
    benefit_summary: str
    benefit_details: Optional[Dict[str, Any]] = None
    application_deadline: Optional[str] = None
    official_portal_url: str
    documents_required: List[str]
    is_active: Optional[bool] = True

class ScholarshipOut(ScholarshipBase):
    id: int

    class Config:
        from_attributes = True

class EligibilityCheckItem(BaseModel):
    scholarship: ScholarshipOut
    is_eligible: bool
    reasons: List[str]
    match_score: int

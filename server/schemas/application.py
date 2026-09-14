from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel
from schemas.scholarship import ScholarshipOut

class StatusHistoryItem(BaseModel):
    status: str
    timestamp: str
    remarks: Optional[str] = None
    verified_by: Optional[str] = None

class ApplicationCreate(BaseModel):
    scholarship_id: int
    form_data: Optional[Dict[str, Any]] = None
    selected_documents: Optional[List[int]] = None  # Document IDs attached

class ApplicationUpdateStatus(BaseModel):
    status: str
    remarks: Optional[str] = None
    verified_by: Optional[str] = None
    payment_amount: Optional[float] = None
    transaction_id: Optional[str] = None
    disbursement_date: Optional[str] = None
    bank_account_last4: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    user_id: int
    scholarship_id: int
    application_id: str
    status: str
    status_history: List[Dict[str, Any]]
    form_data: Optional[Dict[str, Any]] = None
    selected_documents: Optional[List[Any]] = None
    payment_amount: Optional[float] = 0.0
    transaction_id: Optional[str] = None
    disbursement_date: Optional[str] = None
    bank_account_last4: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    scholarship: Optional[ScholarshipOut] = None

    class Config:
        from_attributes = True

class ConflictCheckResponse(BaseModel):
    has_conflict: bool
    message: str
    existing_application_id: Optional[str] = None
    existing_scheme_name: Optional[str] = None
    status: Optional[str] = None
    can_proceed_override: bool = False

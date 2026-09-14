from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: str = Field(..., min_length=12, max_length=14)

class STCertificateVerifyRequest(BaseModel):
    certificate_number: str
    state: str
    sub_caste: Optional[str] = None

class IncomeVerifyRequest(BaseModel):
    certificate_number: str
    stated_income: float
    state: str

class AcademicVerifyRequest(BaseModel):
    institution_code: str
    roll_number: str
    board_or_university: str

class VerificationResult(BaseModel):
    success: bool
    service: str
    status: str
    verified_at: str
    details: Dict[str, Any]
    reference_id: str
    is_simulated: bool = True  # Clearly labeled as simulated per guidelines

class OCRVerifyResponse(BaseModel):
    success: bool
    document_type: str
    extracted_fields: Dict[str, Any]
    confidence: float
    message: str

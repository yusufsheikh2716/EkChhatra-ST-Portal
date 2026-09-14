from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from schemas.verification import (
    AadhaarVerifyRequest,
    STCertificateVerifyRequest,
    IncomeVerifyRequest,
    AcademicVerifyRequest,
    VerificationResult,
    OCRVerifyResponse
)
from services.verification_service import (
    verify_aadhaar,
    verify_st_certificate,
    verify_income_certificate,
    verify_academic_record
)
from services.ocr_service import process_document_ocr

router = APIRouter(prefix="/api/verify", tags=["Verification Services (Simulated)"])

@router.post("/aadhaar", response_model=VerificationResult)
async def verify_aadhaar_endpoint(req: AadhaarVerifyRequest):
    result = await verify_aadhaar(req.aadhaar_number)
    return VerificationResult(**result)

@router.post("/st-certificate", response_model=VerificationResult)
async def verify_st_certificate_endpoint(req: STCertificateVerifyRequest):
    result = await verify_st_certificate(req.certificate_number, req.state, req.sub_caste)
    return VerificationResult(**result)

@router.post("/income", response_model=VerificationResult)
async def verify_income_endpoint(req: IncomeVerifyRequest):
    result = await verify_income_certificate(req.certificate_number, req.stated_income, req.state)
    return VerificationResult(**result)

@router.post("/academic", response_model=VerificationResult)
async def verify_academic_endpoint(req: AcademicVerifyRequest):
    result = await verify_academic_record(req.institution_code, req.roll_number, req.board_or_university)
    return VerificationResult(**result)

@router.post("/ocr", response_model=OCRVerifyResponse)
async def verify_ocr_endpoint(
    file: UploadFile = File(...)
):
    try:
        contents = await file.read()
        result = await process_document_ocr(contents, filename=file.filename)
        return OCRVerifyResponse(**result)
    except Exception as e:
        # Graceful fallback per user requirements: never let a failed OCR break demo
        return OCRVerifyResponse(
            success=False,
            document_type="MANUAL_ENTRY_REQUIRED",
            extracted_fields={},
            confidence=0.0,
            message=f"OCR processing failed or timed out ({str(e)}). Please enter certificate details manually."
        )

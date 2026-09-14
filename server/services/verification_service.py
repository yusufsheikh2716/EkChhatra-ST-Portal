import asyncio
import uuid
from datetime import datetime
from typing import Dict, Any

async def simulate_verification_latency(seconds: float = 1.2):
    await asyncio.sleep(seconds)

async def verify_aadhaar(aadhaar_number: str) -> Dict[str, Any]:
    """
    Simulates UIDAI e-KYC instant verification.
    Note: Full Aadhaar is processed in memory for checksum and discarded.
    """
    clean_aadhaar = aadhaar_number.replace("-", "").replace(" ", "")
    await simulate_verification_latency(1.2)
    
    if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
        return {
            "success": False,
            "service": "UIDAI e-KYC Portal (Simulated)",
            "status": "Invalid Aadhaar number format. Expected 12 digits.",
            "verified_at": datetime.utcnow().isoformat(),
            "details": {},
            "reference_id": f"UIDAI-ERR-{uuid.uuid4().hex[:8].upper()}",
            "is_simulated": True
        }

    last4 = clean_aadhaar[-4:]
    return {
        "success": True,
        "service": "UIDAI e-KYC / NPCI Aadhaar Seeding (Simulated)",
        "status": "Aadhaar Identity & Bank Seeding Verified (Active)",
        "verified_at": datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S UTC"),
        "details": {
            "masked_aadhaar": f"XXXX-XXXX-{last4}",
            "auth_type": "OTP / Biometric e-KYC",
            "bank_account_seeded": True,
            "dbt_enabled": True
        },
        "reference_id": f"UIDAI-{uuid.uuid4().hex[:10].upper()}",
        "is_simulated": True
    }

async def verify_st_certificate(cert_no: str, state: str, sub_caste: str = None) -> Dict[str, Any]:
    """
    Simulates State Caste Certificate Verification Portal / DigiLocker fetch.
    """
    await simulate_verification_latency(1.4)
    ref = f"ST-REG-{uuid.uuid4().hex[:8].upper()}"
    return {
        "success": True,
        "service": "DigiLocker / State Tribal Welfare Registry (Simulated)",
        "status": "Authentic ST Caste Certificate Verified",
        "verified_at": datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S UTC"),
        "details": {
            "certificate_number": cert_no,
            "issuing_state": state,
            "category": "Scheduled Tribe (ST)",
            "sub_tribe_verified": sub_caste or "Recognized Tribal Community",
            "issuing_authority": f"Competent Revenue Sub-Divisional Officer, {state}",
            "digital_signature_valid": True
        },
        "reference_id": ref,
        "is_simulated": True
    }

async def verify_income_certificate(cert_no: str, stated_income: float, state: str) -> Dict[str, Any]:
    """
    Simulates State Revenue / e-District portal income verification.
    """
    await simulate_verification_latency(1.3)
    ref = f"REV-INC-{uuid.uuid4().hex[:8].upper()}"
    return {
        "success": True,
        "service": "State e-District Revenue Portal (Simulated)",
        "status": f"Income Certificate Authenticated (₹{stated_income:,.0f}/annum)",
        "verified_at": datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S UTC"),
        "details": {
            "certificate_number": cert_no,
            "verified_annual_income": stated_income,
            "financial_year": "2024-2025",
            "issuing_tehsildar": f"Office of Tahsildar / Revenue Officer, {state}",
            "validity_status": "Current & Valid"
        },
        "reference_id": ref,
        "is_simulated": True
    }

async def verify_academic_record(institution_code: str, roll_number: str, board_or_university: str) -> Dict[str, Any]:
    """
    Simulates AISHE / UDISE+ / National Academic Depository (NAD) lookup.
    """
    await simulate_verification_latency(1.1)
    ref = f"NAD-{uuid.uuid4().hex[:8].upper()}"
    return {
        "success": True,
        "service": "National Academic Depository (NAD) / AISHE Portal (Simulated)",
        "status": "Academic Enrolment & Marksheet Authenticated",
        "verified_at": datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S UTC"),
        "details": {
            "institution_code": institution_code,
            "student_roll_number": roll_number,
            "awarding_body": board_or_university,
            "enrollment_status": "Active / Regular Student",
            "apaar_id_linked": True
        },
        "reference_id": ref,
        "is_simulated": True
    }

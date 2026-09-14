from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.application import Application
from models.scholarship import Scholarship

ACTIVE_STATUSES = [
    "Submitted",
    "Institute_Verified",
    "District_Verified",
    "State_Verified",
    "Sanctioned",
    "Disbursed"
]

async def check_application_conflict(
    db: AsyncSession,
    user_id: int,
    target_scholarship_id: int
) -> dict:
    """
    Checks if student has another concurrent active central scholarship application.
    Central guidelines mandate that a student can draw central government scholarship from only one scheme at a time.
    """
    result = await db.execute(
        select(Application, Scholarship)
        .join(Scholarship, Application.scholarship_id == Scholarship.id)
        .where(
            Application.user_id == user_id,
            Application.status.in_(ACTIVE_STATUSES)
        )
    )
    existing_records = result.all()

    for app, sch in existing_records:
        if sch.id == target_scholarship_id:
            return {
                "has_conflict": True,
                "message": f"You already have an active application ({app.application_id}) for {sch.name} currently at '{app.status.replace('_', ' ')}' stage. Duplicate applications for the same scheme are prohibited.",
                "existing_application_id": app.application_id,
                "existing_scheme_name": sch.name,
                "status": app.status,
                "can_proceed_override": False
            }
        else:
            return {
                "has_conflict": True,
                "message": f"Conflict detected: Central MoTA regulations state students cannot hold dual scholarship benefits simultaneously. You currently have an active application ({app.application_id}) for '{sch.name}' in '{app.status.replace('_', ' ')}' status.",
                "existing_application_id": app.application_id,
                "existing_scheme_name": sch.name,
                "status": app.status,
                "can_proceed_override": True  # Can withdraw/switch with confirmation
            }

    return {
        "has_conflict": False,
        "message": "No conflicting active applications found. You are eligible to apply.",
        "existing_application_id": None,
        "existing_scheme_name": None,
        "status": None,
        "can_proceed_override": True
    }

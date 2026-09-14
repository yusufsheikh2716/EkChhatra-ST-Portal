import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from models.application import Application
from models.scholarship import Scholarship
from models.user import User
from models.notification import Notification
from schemas.application import (
    ApplicationCreate,
    ApplicationUpdateStatus,
    ApplicationOut,
    ConflictCheckResponse
)
from services.conflict_service import check_application_conflict
from dependencies import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

def generate_application_id() -> str:
    random_num = random.randint(10000, 99999)
    return f"EKCH-2025-{random_num}"

@router.get("", response_model=List[ApplicationOut])
async def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Application)
        .options(selectinload(Application.scholarship))
        .where(Application.user_id == current_user.id)
        .order_by(Application.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=ApplicationOut)
async def get_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Application)
        .options(selectinload(Application.scholarship))
        .where(Application.id == id, Application.user_id == current_user.id)
    )
    result = await db.execute(query)
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app

@router.post("/check-conflict", response_model=ConflictCheckResponse)
async def check_conflict_api(
    scholarship_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    conflict_info = await check_application_conflict(db, current_user.id, scholarship_id)
    return ConflictCheckResponse(**conflict_info)

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_in: ApplicationCreate,
    override_conflict: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify scholarship exists
    sch_result = await db.execute(select(Scholarship).where(Scholarship.id == app_in.scholarship_id))
    scholarship = sch_result.scalars().first()
    if not scholarship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship scheme not found")

    # Conflict check
    conflict_info = await check_application_conflict(db, current_user.id, scholarship.id)
    if conflict_info["has_conflict"] and not override_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=conflict_info["message"]
        )

    now_str = datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S")
    initial_history = [{
        "status": "Submitted",
        "timestamp": now_str,
        "remarks": "Application submitted by student with digital signature.",
        "verified_by": "Self (Student e-Sign)"
    }]

    app_id = generate_application_id()
    new_app = Application(
        user_id=current_user.id,
        scholarship_id=scholarship.id,
        application_id=app_id,
        status="Submitted",
        status_history=initial_history,
        form_data=app_in.form_data or {},
        selected_documents=app_in.selected_documents or [],
        remarks="Awaiting verification by Institute Nodal Officer."
    )

    db.add(new_app)

    # Create notification for user
    notif = Notification(
        user_id=current_user.id,
        title="Application Submitted Successfully",
        message=f"Your application for {scholarship.name} ({app_id}) has been submitted and forwarded for Institute level scrutiny.",
        notif_type="success",
        link="/dashboard"
    )
    db.add(notif)

    await db.commit()
    await db.refresh(new_app)

    # Reload with scholarship relation
    query = select(Application).options(selectinload(Application.scholarship)).where(Application.id == new_app.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.put("/{id}/status", response_model=ApplicationOut)
async def update_application_status(
    id: int,
    status_update: ApplicationUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Application).options(selectinload(Application.scholarship)).where(Application.id == id)
    result = await db.execute(query)
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    now_str = datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S")
    history_entry = {
        "status": status_update.status,
        "timestamp": now_str,
        "remarks": status_update.remarks or f"Stage updated to {status_update.status}",
        "verified_by": status_update.verified_by or "Nodal Verification Officer"
    }
    
    current_history = list(app.status_history or [])
    current_history.append(history_entry)
    app.status_history = current_history
    app.status = status_update.status
    
    if status_update.remarks:
        app.remarks = status_update.remarks
    if status_update.payment_amount is not None:
        app.payment_amount = status_update.payment_amount
    if status_update.transaction_id:
        app.transaction_id = status_update.transaction_id
    if status_update.disbursement_date:
        app.disbursement_date = status_update.disbursement_date
    if status_update.bank_account_last4:
        app.bank_account_last4 = status_update.bank_account_last4

    # Create notification
    notif = Notification(
        user_id=app.user_id,
        title=f"Application Stage: {status_update.status.replace('_', ' ')}",
        message=f"Application {app.application_id} has advanced to '{status_update.status.replace('_', ' ')}'.",
        notif_type="info" if "Reject" not in status_update.status else "warning",
        link="/dashboard"
    )
    db.add(notif)

    await db.commit()
    await db.refresh(app)
    return app

@router.delete("/{id}")
async def withdraw_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Application).where(Application.id == id, Application.user_id == current_user.id)
    result = await db.execute(query)
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    await db.delete(app)
    await db.commit()
    return {"success": True, "message": "Application withdrawn successfully."}

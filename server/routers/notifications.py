from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from database import get_db
from models.notification import Notification
from models.user import User
from schemas.notification import NotificationOut
from dependencies import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    return result.scalars().all()

@router.put("/{id}/read", response_model=NotificationOut)
async def mark_as_read(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification).where(Notification.id == id, Notification.user_id == current_user.id)
    )
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notif.is_read = True
    await db.commit()
    await db.refresh(notif)
    return notif

@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"success": True, "message": "All notifications marked as read"}

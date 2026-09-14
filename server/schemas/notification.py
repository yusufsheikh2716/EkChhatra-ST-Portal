from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notif_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool = True

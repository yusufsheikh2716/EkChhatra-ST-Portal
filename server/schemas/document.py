from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class DocumentBase(BaseModel):
    doc_type: str
    file_name: str
    file_url: str
    is_verified: Optional[bool] = False
    verified_by: Optional[str] = None
    verified_date: Optional[str] = None
    source: Optional[str] = "User Upload"

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    id: int
    user_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

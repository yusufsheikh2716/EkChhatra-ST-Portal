from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatAction(BaseModel):
    label: str
    url: Optional[str] = None
    query: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    actions: Optional[List[ChatAction]] = []
    timestamp: Optional[datetime] = None

class ChatMessageOut(BaseModel):
    id: int
    user_id: int
    message: str
    sender: str
    timestamp: datetime

    class Config:
        from_attributes = True

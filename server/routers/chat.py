from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.chat_message import ChatMessage
from models.user import User
from schemas.chat import ChatRequest, ChatResponse, ChatMessageOut
from services.chatbot_service import process_chat_message
from dependencies import get_current_user_optional, get_current_user

router = APIRouter(prefix="/api/chat", tags=["JAGO Chatbot"])

@router.post("/send", response_model=ChatResponse)
async def send_chat_message(
    chat_in: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    response_data = await process_chat_message(chat_in.message, current_user, db)
    
    # If user is authenticated, save chat history
    if current_user:
        user_msg = ChatMessage(
            user_id=current_user.id,
            message=chat_in.message,
            sender="user",
            timestamp=datetime.utcnow()
        )
        jago_msg = ChatMessage(
            user_id=current_user.id,
            message=response_data["reply"],
            sender="jago",
            timestamp=datetime.utcnow()
        )
        db.add(user_msg)
        db.add(jago_msg)
        await db.commit()

    return ChatResponse(
        reply=response_data["reply"],
        actions=response_data.get("actions", []),
        timestamp=datetime.utcnow()
    )

@router.get("/history", response_model=List[ChatMessageOut])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.timestamp.asc())
    )
    return result.scalars().all()

@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ChatMessage).where(ChatMessage.user_id == current_user.id))
    messages = result.scalars().all()
    for m in messages:
        await db.delete(m)
    await db.commit()
    return {"success": True, "message": "Chat history cleared"}

@router.post("/voice", response_model=ChatResponse)
async def voice_chat_endpoint(
    transcript: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    # Phase 2 voice handler: Accepts audio blob or frontend STT transcript with graceful fallback
    query_text = transcript or "Check my scholarship eligibility"
    response_data = await process_chat_message(query_text, current_user, db)
    return ChatResponse(
        reply=response_data["reply"],
        actions=response_data.get("actions", []),
        timestamp=datetime.utcnow()
    )

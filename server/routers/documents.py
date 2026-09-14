import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.document import Document
from models.user import User
from schemas.document import DocumentOut
from dependencies import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[DocumentOut])
async def list_my_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
    )
    return result.scalars().all()

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    source: Optional[str] = Form("User Upload"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Save file to disk
    file_ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    file_url = f"/uploads/{safe_filename}"
    
    # Auto-verify if fetched from DigiLocker or recognized source
    is_auto_verified = source in ["DigiLocker", "State ST Database", "e-District"]
    
    new_doc = Document(
        user_id=current_user.id,
        doc_type=doc_type.upper(),
        file_name=file.filename,
        file_url=file_url,
        is_verified=is_auto_verified,
        verified_by="DigiLocker MoTA Gateway" if is_auto_verified else None,
        verified_date=datetime.utcnow().strftime("%d/%m/%Y") if is_auto_verified else None,
        source=source or "User Upload"
    )

    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    return new_doc

@router.put("/{id}/verify", response_model=DocumentOut)
async def verify_document(
    id: int,
    verified_by: Optional[str] = "DigiLocker / Institute Officer",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).where(Document.id == id, Document.user_id == current_user.id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    doc.is_verified = True
    doc.verified_by = verified_by
    doc.verified_date = datetime.utcnow().strftime("%d/%m/%Y")

    await db.commit()
    await db.refresh(doc)
    return doc

@router.delete("/{id}")
async def delete_document(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).where(Document.id == id, Document.user_id == current_user.id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    await db.delete(doc)
    await db.commit()
    return {"success": True, "message": "Document deleted from wallet"}

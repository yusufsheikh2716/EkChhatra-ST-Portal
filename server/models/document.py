from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String(80), nullable=False)  # ST_CERTIFICATE, INCOME_CERTIFICATE, MARKSHEET, DOMICILE, FEE_RECEIPT, BANK_PASSBOOK
    file_name = Column(String(200), nullable=False)
    file_url = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String(100), nullable=True)  # e.g. "DigiLocker / State Portal", "Institute Nodal Officer"
    verified_date = Column(String(50), nullable=True)
    source = Column(String(50), default="User Upload")  # "DigiLocker", "User Upload", "State ST Database"
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")

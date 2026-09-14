from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    application_id = Column(String(50), unique=True, index=True, nullable=False)  # EKCH-2025-XXXXX
    
    # Status workflow:
    # 1: Submitted -> 2: Institute_Verified -> 3: District_Verified -> 4: State_Verified -> 5: Sanctioned -> 6: Disbursed (or Rejected)
    status = Column(String(50), default="Submitted", nullable=False)
    status_history = Column(JSON, default=list)  # list of {status, timestamp, remarks, verified_by}
    
    # Snapshot of submitted profile data at application time
    form_data = Column(JSON, nullable=True)
    selected_documents = Column(JSON, nullable=True)  # list of doc references / IDs
    
    # Payment & disbursement info
    payment_amount = Column(Float, nullable=True, default=0.0)
    transaction_id = Column(String(100), nullable=True)
    disbursement_date = Column(String(50), nullable=True)
    bank_account_last4 = Column(String(4), nullable=True)
    
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")

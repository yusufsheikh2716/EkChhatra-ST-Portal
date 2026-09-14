from sqlalchemy import Column, Integer, String, Float, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)  # PRE_MATRIC, POST_MATRIC, TOP_CLASS, NFST, NOS
    ministry = Column(String(150), default="Ministry of Tribal Affairs")
    description = Column(Text, nullable=False)
    target_group = Column(String(150), default="Scheduled Tribe (ST) Students")
    
    # Eligibility rules
    education_levels = Column(JSON, nullable=False)  # e.g. ["Class 9", "Class 10"]
    max_income = Column(Float, nullable=True)  # e.g. 250000.0 or 600000.0
    min_percentage = Column(Float, default=0.0)  # e.g. 60.0 for Top Class
    net_jrf_required = Column(Boolean, default=False)  # For NFST
    foreign_university_required = Column(Boolean, default=False)  # For NOS
    pvtg_only = Column(Boolean, default=False)
    
    # Benefits
    benefit_summary = Column(String(255), nullable=False)
    benefit_details = Column(JSON, nullable=True)  # { tuition: "Full", maintenance: "₹1,200/mo", book_grant: ... }
    
    # Metadata
    application_deadline = Column(String(50), nullable=True)
    official_portal_url = Column(String(255), nullable=False)
    documents_required = Column(JSON, nullable=False)  # ["ST Caste Certificate", "Income Certificate", ...]
    is_active = Column(Boolean, default=True)

    applications = relationship("Application", back_populates="scholarship")

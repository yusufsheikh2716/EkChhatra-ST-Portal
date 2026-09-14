import asyncio
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import engine, AsyncSessionLocal, Base
from models.user import User
from models.scholarship import Scholarship
from models.application import Application
from models.document import Document
from models.notification import Notification
from services.auth_service import hash_password

SCHEMES = [
    {
        "name": "Pre-Matric Scholarship for ST Students (Class 9 & 10)",
        "code": "PRE_MATRIC",
        "ministry": "Ministry of Tribal Affairs",
        "description": "Centrally sponsored scheme to support Scheduled Tribe parents for education of their children studying in classes IX & X so that incidences of drop-out are minimized.",
        "target_group": "Scheduled Tribe (ST) students in Classes IX & X",
        "education_levels": ["Class 9", "Class 10", "Secondary"],
        "max_income": 250000.0,
        "min_percentage": 0.0,
        "net_jrf_required": False,
        "foreign_university_required": False,
        "pvtg_only": False,
        "benefit_summary": "₹150 to ₹350 per month maintenance allowance + ₹750 to ₹1,000 annual book/ad-hoc grant",
        "benefit_details": {
            "day_scholar_allowance": "₹150 to ₹225/month for 10 months",
            "hosteller_allowance": "₹350 to ₹525/month for 10 months",
            "annual_grant": "₹750 (Day Scholars) / ₹1,000 (Hostellers) per annum",
            "disability_allowance": "Additional ₹240/month for students with benchmark disabilities"
        },
        "application_deadline": "31st October 2025",
        "official_portal_url": "https://scholarships.gov.in/",
        "documents_required": [
            "ST Caste Certificate (DigiLocker/State Portal)",
            "Income Certificate (< ₹2.5L/year)",
            "Previous Year Marksheet (Class 8 or 9)",
            "Current School Enrollment Proof / Bonafide",
            "Aadhaar-Linked Bank Account Passbook"
        ],
        "is_active": True
    },
    {
        "name": "Post-Matric Scholarship for ST Students",
        "code": "POST_MATRIC",
        "ministry": "Ministry of Tribal Affairs",
        "description": "Centrally sponsored umbrella scheme providing comprehensive financial assistance to ST students studying at post-matriculation or post-secondary stages up to postgraduate and doctoral levels.",
        "target_group": "ST students enrolled in Class XI, XII, ITI, Diploma, Degree, Masters, Medical, Engineering",
        "education_levels": ["Class 11", "Class 12", "Undergraduate", "Postgraduate", "Diploma", "ITI"],
        "max_income": 250000.0,
        "min_percentage": 0.0,
        "net_jrf_required": False,
        "foreign_university_required": False,
        "pvtg_only": False,
        "benefit_summary": "100% compulsory non-refundable fees reimbursed + ₹550 to ₹1,200/month DBT stipend",
        "benefit_details": {
            "tuition_reimbursement": "100% compulsory non-refundable course fees paid directly to institution",
            "maintenance_allowance": "Group 1 (Engg/Med): ₹1,200/mo (Hostel) / ₹550/mo (Day Scholar); Group 2-4: ₹570–₹230/mo",
            "study_tour_charges": "Up to ₹1,600 per annum for professional courses",
            "thesis_typing": "Up to ₹1,600 for research scholars"
        },
        "application_deadline": "30th November 2025",
        "official_portal_url": "https://scholarships.gov.in/",
        "documents_required": [
            "ST Caste Certificate with Digital Signature",
            "Family Annual Income Certificate (< ₹2.5 Lakhs)",
            "10th / 12th Board Marksheet",
            "College Bonafide & Fee Receipt for Current Academic Year",
            "Aadhaar e-KYC Seeded Bank Account Details",
            "Domicile Certificate of Home State"
        ],
        "is_active": True
    },
    {
        "name": "Top Class Education Scheme for ST Students",
        "code": "TOP_CLASS",
        "ministry": "Ministry of Tribal Affairs",
        "description": "Central sector scheme designed to recognize and promote quality education amongst ST students in 265 notified premier institutions (IITs, IIMs, NITs, AIIMS, NLUs, Central Universities).",
        "target_group": "Meritorious ST students pursuing graduation/postgraduation in premier institutions",
        "education_levels": ["Undergraduate", "Postgraduate"],
        "max_income": 600000.0,
        "min_percentage": 60.0,
        "net_jrf_required": False,
        "foreign_university_required": False,
        "pvtg_only": False,
        "benefit_summary": "Full tuition fees + ₹2,220/month living expenses + ₹45,000 computer grant + ₹3,000 books",
        "benefit_details": {
            "tuition_fee": "Full tuition fee and other non-refundable charges (up to ₹2.00 Lakhs per annum for private institutes; actuals for government institutes)",
            "living_expenses": "₹2,220 per month per student (₹26,640 per annum)",
            "books_stationery": "₹3,000 per annum",
            "computer_aid": "One-time grant of ₹45,000 for latest laptop/PC with accessories during the course"
        },
        "application_deadline": "31st December 2025",
        "official_portal_url": "https://tribal.nic.in/",
        "documents_required": [
            "ST Caste Verification Certificate",
            "Family Income Certificate (< ₹6.0 Lakhs/annum)",
            "JEE / NEET / CAT / CLAT Entrance Rank Card",
            "Admission Allotment Letter of Notified Premier Institution",
            "Class 12 / Qualifying Exam Marksheet (Min 60%)",
            "Bank Account Front Page (NPCI Seeded)"
        ],
        "is_active": True
    },
    {
        "name": "National Fellowship for Higher Education of ST Students (NFST)",
        "code": "NFST",
        "ministry": "Ministry of Tribal Affairs & Canara Bank",
        "description": "Prestigious fellowship providing 750 slots annually to ST scholars pursuing regular, full-time M.Phil. and Ph.D. degrees in Science, Humanities, Social Sciences, and Engineering.",
        "target_group": "ST scholars pursuing full-time Ph.D. or M.Phil. research in recognized universities",
        "education_levels": ["Postgraduate", "PhD", "M.Phil"],
        "max_income": None,  # No restrictive income ceiling for research fellowship
        "min_percentage": 55.0,
        "net_jrf_required": True,
        "foreign_university_required": False,
        "pvtg_only": False,
        "benefit_summary": "₹31,000/month (JRF) to ₹35,000/month (SRF) + HRA + ₹25,000 annual contingency",
        "benefit_details": {
            "junior_research_fellow": "₹31,000 per month for initial 2 years",
            "senior_research_fellow": "₹35,000 per month for remaining 3 years",
            "contingency_humanities": "₹10,000 per annum",
            "contingency_sciences": "₹25,000 per annum for experiments and laboratory materials",
            "house_rent_allowance": "As per Central Government HRA norms (8% / 16% / 24% of fellowship amount)"
        },
        "application_deadline": "15th January 2026",
        "official_portal_url": "https://nfrsfmp.canarabank.in/",
        "documents_required": [
            "ST Certificate issued by Competent Authority",
            "UGC-NET / CSIR-NET / GATE Qualified Score Card",
            "Ph.D. / M.Phil. University Registration & Admission Proof",
            "Research Synopsis approved by Research Guide / HoD",
            "Aadhaar Card Copy and Bank Mandate Form"
        ],
        "is_active": True
    },
    {
        "name": "National Overseas Scholarship for ST Students (NOS)",
        "code": "NOS",
        "ministry": "Ministry of Tribal Affairs",
        "description": "Offers financial support to 20 selected ST scholars per year to pursue Master's, Ph.D., and Post-Doctoral studies in accredited institutions and universities abroad.",
        "target_group": "ST students with unconditional admission offers from top 500 QS/Times ranked foreign universities",
        "education_levels": ["Postgraduate", "PhD", "Overseas"],
        "max_income": 600000.0,
        "min_percentage": 55.0,
        "net_jrf_required": False,
        "foreign_university_required": True,
        "pvtg_only": False,
        "benefit_summary": "100% foreign tuition covered + $15,400/yr living allowance + visa + return economy airfare",
        "benefit_details": {
            "tuition_fee": "Actual tuition fees paid directly to international university",
            "annual_maintenance_usa": "USD 15,400 per annum for USA and other countries",
            "annual_maintenance_uk": "GBP 9,900 per annum for United Kingdom",
            "contingency_allowance": "USD 1,500 / GBP 1,100 per annum for books, equipment, research tours",
            "travel_expenses": "Economy class airfare from India to destination country and back upon completion"
        },
        "application_deadline": "31st March 2026",
        "official_portal_url": "https://nosmsje.gov.in/",
        "documents_required": [
            "ST Caste Certificate & Domicile",
            "Income Tax Return / Tahsildar Income Proof (< ₹6.0L)",
            "Unconditional Offer Letter from Foreign University (QS Rank <= 500)",
            "Valid Indian Passport Copy",
            "Bachelor's / Master's Degree Transcript (Min 55% Marks)",
            "Statement of Purpose (SOP) & Two Academic Recommendations"
        ],
        "is_active": True
    }
]

async def seed_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Seed Schemes
        for scheme_data in SCHEMES:
            res = await session.execute(select(Scholarship).where(Scholarship.code == scheme_data["code"]))
            existing = res.scalars().first()
            if not existing:
                sch = Scholarship(**scheme_data)
                session.add(sch)
            else:
                for k, v in scheme_data.items():
                    setattr(existing, k, v)
        await session.commit()

        # 2. Seed Demo Student
        demo_email = "demo@ekchhatra.in"
        res = await session.execute(select(User).where(User.email == demo_email))
        demo_user = res.scalars().first()

        if not demo_user:
            demo_user = User(
                name="Birsa Munda",
                email=demo_email,
                aadhaar_last4="4821",  # Fix #3: Only last 4 digits stored!
                password_hash=hash_password("demo123"),
                phone="+91 98351 24890",
                dob="15/11/2003",
                gender="Male",
                state="Jharkhand",
                district="Ranchi",
                education_level="Undergraduate",
                institution_name="National Institute of Technology (NIT) Jamshedpur",
                institution_code="NITJSR-083",
                current_year="2nd Year (B.Tech Computer Science)",
                percentage=78.5,
                st_certificate_no="ST/JH/2023/88124",
                is_pvtg=False,
                family_income=180000.0,
                is_bpl=False,
                has_disability=False,
                profile_picture="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                role="student",
                active_scholarship="TOP_CLASS"
            )
            session.add(demo_user)
            await session.commit()
            await session.refresh(demo_user)

        # 3. Seed Admin User
        admin_email = "admin@ekchhatra.in"
        res = await session.execute(select(User).where(User.email == admin_email))
        admin_user = res.scalars().first()
        if not admin_user:
            admin_user = User(
                name="Dr. Arjun Soren",
                email=admin_email,
                aadhaar_last4="9901",
                password_hash=hash_password("admin123"),
                phone="+91 94311 00223",
                dob="12/04/1982",
                gender="Male",
                state="New Delhi",
                district="Central Delhi",
                education_level="PhD",
                institution_name="Ministry of Tribal Affairs Directorate",
                institution_code="MOTA-HQ-01",
                role="admin"
            )
            session.add(admin_user)
            await session.commit()

        # 4. Seed Applications for Demo Student
        # Retrieve scholarships
        tc_res = await session.execute(select(Scholarship).where(Scholarship.code == "TOP_CLASS"))
        top_class = tc_res.scalars().first()

        pm_res = await session.execute(select(Scholarship).where(Scholarship.code == "POST_MATRIC"))
        post_matric = pm_res.scalars().first()

        app_res = await session.execute(select(Application).where(Application.user_id == demo_user.id))
        existing_apps = app_res.scalars().all()

        if not existing_apps and top_class and post_matric:
            # Active Top Class Application at State_Verified stage
            app1 = Application(
                user_id=demo_user.id,
                scholarship_id=top_class.id,
                application_id="EKCH-2025-48192",
                status="State_Verified",
                status_history=[
                    {
                        "status": "Submitted",
                        "timestamp": "12/01/2025 10:24:18",
                        "remarks": "Application submitted by student with Aadhaar e-KYC.",
                        "verified_by": "Birsa Munda (e-Sign)"
                    },
                    {
                        "status": "Institute_Verified",
                        "timestamp": "18/01/2025 14:10:05",
                        "remarks": "Academic records, fee structure, and bonafide verified by NIT Jamshedpur Nodal Officer.",
                        "verified_by": "NIT Jamshedpur Verification Desk"
                    },
                    {
                        "status": "District_Verified",
                        "timestamp": "26/01/2025 11:45:20",
                        "remarks": "ST certificate authenticity confirmed against Jharkhand State Tribal Registry.",
                        "verified_by": "District Welfare Officer, Ranchi"
                    },
                    {
                        "status": "State_Verified",
                        "timestamp": "08/02/2025 16:30:12",
                        "remarks": "State Level Scrutiny Committee approved application. Forwarded to MoTA for sanction.",
                        "verified_by": "Jharkhand State Tribal Welfare Directorate"
                    }
                ],
                form_data={
                    "course": "B.Tech Computer Science & Engineering",
                    "annual_tuition_fee": 125000.0,
                    "hostel_fee": 36000.0,
                    "bank_account_last4": "6109",
                    "bank_name": "State Bank of India (NIT Jamshedpur Branch)"
                },
                selected_documents=[1, 2, 3, 4],
                payment_amount=161000.0,
                remarks="Approved at State level. Awaiting central financial sanction and DBT generation."
            )
            session.add(app1)

            # Previous year disbursed Post-Matric application
            app2 = Application(
                user_id=demo_user.id,
                scholarship_id=post_matric.id,
                application_id="EKCH-2024-11048",
                status="Disbursed",
                status_history=[
                    {"status": "Submitted", "timestamp": "10/08/2024 09:15:00", "remarks": "Submitted for FY 2023-24."},
                    {"status": "Institute_Verified", "timestamp": "20/08/2024 11:30:00", "remarks": "Verified by Institute."},
                    {"status": "District_Verified", "timestamp": "05/09/2024 15:00:00", "remarks": "Verified by DWO."},
                    {"status": "State_Verified", "timestamp": "25/09/2024 17:00:00", "remarks": "Approved by State Directorate."},
                    {"status": "Sanctioned", "timestamp": "10/10/2024 14:00:00", "remarks": "Sanction Order #MOTA-JH-2024-892 generated."},
                    {"status": "Disbursed", "timestamp": "24/10/2024 12:45:00", "remarks": "DBT Transfer credited into SBI account ending in 6109."}
                ],
                payment_amount=38500.0,
                transaction_id="DBT-NPCI-20241024-884912",
                disbursement_date="24/10/2024",
                bank_account_last4="6109",
                remarks="Scholarship disbursed successfully via Aadhaar Payment Bridge."
            )
            session.add(app2)
            await session.commit()

        # 5. Seed Documents in Wallet
        doc_res = await session.execute(select(Document).where(Document.user_id == demo_user.id))
        if not doc_res.scalars().all():
            docs = [
                Document(
                    user_id=demo_user.id,
                    doc_type="ST_CERTIFICATE",
                    file_name="Birsa_Munda_ST_Certificate.pdf",
                    file_url="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
                    is_verified=True,
                    verified_by="DigiLocker / Govt of Jharkhand",
                    verified_date="15/01/2025",
                    source="DigiLocker"
                ),
                Document(
                    user_id=demo_user.id,
                    doc_type="INCOME_CERTIFICATE",
                    file_name="Income_Certificate_FY24_25.pdf",
                    file_url="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
                    is_verified=True,
                    verified_by="Office of Tahsildar, Ranchi",
                    verified_date="16/01/2025",
                    source="State e-District"
                ),
                Document(
                    user_id=demo_user.id,
                    doc_type="MARKSHEET",
                    file_name="Class_12th_CBSE_Marksheet.pdf",
                    file_url="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80",
                    is_verified=True,
                    verified_by="CBSE National Academic Depository (NAD)",
                    verified_date="12/01/2025",
                    source="NAD DigiLocker"
                ),
                Document(
                    user_id=demo_user.id,
                    doc_type="FEE_RECEIPT",
                    file_name="NIT_Jamshedpur_Admission_Receipt.pdf",
                    file_url="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
                    is_verified=True,
                    verified_by="NIT Jamshedpur Accounts Section",
                    verified_date="18/01/2025",
                    source="User Upload"
                ),
                Document(
                    user_id=demo_user.id,
                    doc_type="BANK_PASSBOOK",
                    file_name="SBI_Savings_Passbook_Frontpage.pdf",
                    file_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
                    is_verified=True,
                    verified_by="NPCI Aadhaar Seeding Portal",
                    verified_date="12/01/2025",
                    source="User Upload"
                )
            ]
            session.add_all(docs)
            await session.commit()

        # 6. Seed Notifications
        notif_res = await session.execute(select(Notification).where(Notification.user_id == demo_user.id))
        if not notif_res.scalars().all():
            notifs = [
                Notification(
                    user_id=demo_user.id,
                    title="State Level Verification Approved",
                    message="Congratulations! Your Top Class Education Scholarship application (EKCH-2025-48192) has passed State Level Scrutiny and is forwarded for sanction.",
                    notif_type="success",
                    is_read=False,
                    link="/dashboard",
                    created_at=datetime.utcnow()
                ),
                Notification(
                    user_id=demo_user.id,
                    title="DigiLocker Document Synced",
                    message="Your ST Caste Certificate was successfully validated with digital signature via DigiLocker.",
                    notif_type="info",
                    is_read=False,
                    link="/documents",
                    created_at=datetime.utcnow()
                ),
                Notification(
                    user_id=demo_user.id,
                    title="Previous Cycle DBT Disbursed",
                    message="₹38,500 was successfully disbursed to your bank account ending in 6109 for application EKCH-2024-11048.",
                    notif_type="success",
                    is_read=True,
                    link="/dashboard",
                    created_at=datetime.utcnow()
                ),
                Notification(
                    user_id=demo_user.id,
                    title="Welcome to EkChhatra Portal",
                    message="Johar Birsa! You have unified access to all 5 Ministry of Tribal Affairs scholarship schemes under one roof.",
                    notif_type="info",
                    is_read=True,
                    link="/dashboard",
                    created_at=datetime.utcnow()
                )
            ]
            session.add_all(notifs)
            await session.commit()

    print("EkChhatra database seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_database())

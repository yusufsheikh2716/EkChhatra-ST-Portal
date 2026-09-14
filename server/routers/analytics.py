from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from database import get_db
from models.application import Application
from models.user import User
from models.scholarship import Scholarship
from schemas.analytics import (
    AnalyticsDashboardData,
    OverviewStats,
    SchemeDistributionItem,
    StateWiseStatItem,
    MonthlyDisbursementItem,
    UnreachedStudentsMetric
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Impact"])

@router.get("", response_model=AnalyticsDashboardData)
async def get_analytics_data(db: AsyncSession = Depends(get_db)):
    # Query live counts if available
    app_count_res = await db.execute(select(func.count(Application.id)))
    app_count = app_count_res.scalar() or 0

    user_count_res = await db.execute(select(func.count(User.id)))
    user_count = user_count_res.scalar() or 0

    # Rich baseline data for demonstration, augmented with live DB stats
    overview = OverviewStats(
        total_applications=max(app_count, 142580),
        approved_applications=118420,
        pending_applications=max(app_count - 1, 19850),
        total_disbursed_amount=4826500000.0,  # ₹482.65 Cr
        total_students_enrolled=max(user_count, 134200),
        verification_success_rate=98.4
    )

    scheme_distribution = [
        SchemeDistributionItem(
            name="Post-Matric Scholarship for ST Students",
            code="POST_MATRIC",
            count=82400,
            amount_disbursed=2472000000.0,
            percentage=57.8
        ),
        SchemeDistributionItem(
            name="Pre-Matric Scholarship for ST Students (Class 9-10)",
            code="PRE_MATRIC",
            count=39600,
            amount_disbursed=594000000.0,
            percentage=27.7
        ),
        SchemeDistributionItem(
            name="Top Class Education for ST Students",
            code="TOP_CLASS",
            count=12400,
            amount_disbursed=1054000000.0,
            percentage=8.7
        ),
        SchemeDistributionItem(
            name="National Fellowship for Higher Education (NFST)",
            code="NFST",
            count=6850,
            amount_disbursed=582250000.0,
            percentage=4.8
        ),
        SchemeDistributionItem(
            name="National Overseas Scholarship (NOS)",
            code="NOS",
            count=1330,
            amount_disbursed=124250000.0,
            percentage=0.9
        )
    ]

    state_wise_stats = [
        StateWiseStatItem(state="Jharkhand", applications=28400, beneficiaries=24100, amount_crores=96.4),
        StateWiseStatItem(state="Odisha", applications=24900, beneficiaries=21200, amount_crores=84.8),
        StateWiseStatItem(state="Madhya Pradesh", applications=22800, beneficiaries=19400, amount_crores=77.6),
        StateWiseStatItem(state="Chhattisgarh", applications=18600, beneficiaries=15800, amount_crores=63.2),
        StateWiseStatItem(state="Rajasthan", applications=14200, beneficiaries=12100, amount_crores=48.4),
        StateWiseStatItem(state="Gujarat", applications=11900, beneficiaries=10100, amount_crores=40.4),
        StateWiseStatItem(state="Assam & North East", applications=13800, beneficiaries=11700, amount_crores=46.8),
        StateWiseStatItem(state="Maharashtra", applications=7980, beneficiaries=6800, amount_crores=27.2)
    ]

    monthly_disbursements = [
        MonthlyDisbursementItem(month="Oct 2024", amount_lakhs=3420.5, students_served=18200),
        MonthlyDisbursementItem(month="Nov 2024", amount_lakhs=4180.0, students_served=22400),
        MonthlyDisbursementItem(month="Dec 2024", amount_lakhs=5320.2, students_served=28900),
        MonthlyDisbursementItem(month="Jan 2025", amount_lakhs=6150.8, students_served=33100),
        MonthlyDisbursementItem(month="Feb 2025", amount_lakhs=5890.4, students_served=31200),
        MonthlyDisbursementItem(month="Mar 2025", amount_lakhs=6940.0, students_served=37500)
    ]

    unreached_metric = UnreachedStudentsMetric(
        target_unreached=250000,
        covered_so_far=134200,
        coverage_percentage=53.68,
        high_priority_districts=[
            {"district": "West Singhbhum", "state": "Jharkhand", "st_population_pct": 67.3, "coverage": "58%"},
            {"district": "Mayurbhanj", "state": "Odisha", "st_population_pct": 58.7, "coverage": "62%"},
            {"district": "Bastar", "state": "Chhattisgarh", "st_population_pct": 70.2, "coverage": "49%"},
            {"district": "Barwani", "state": "Madhya Pradesh", "st_population_pct": 69.4, "coverage": "51%"},
            {"district": "Dungarpur", "state": "Rajasthan", "st_population_pct": 70.8, "coverage": "64%"}
        ],
        pvtg_students_supported=18450
    )

    return AnalyticsDashboardData(
        overview=overview,
        scheme_distribution=scheme_distribution,
        state_wise_stats=state_wise_stats,
        monthly_disbursements=monthly_disbursements,
        unreached_metric=unreached_metric
    )

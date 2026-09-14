from typing import List, Dict, Any
from pydantic import BaseModel

class OverviewStats(BaseModel):
    total_applications: int
    approved_applications: int
    pending_applications: int
    total_disbursed_amount: float
    total_students_enrolled: int
    verification_success_rate: float

class SchemeDistributionItem(BaseModel):
    name: str
    code: str
    count: int
    amount_disbursed: float
    percentage: float

class StateWiseStatItem(BaseModel):
    state: str
    applications: int
    beneficiaries: int
    amount_crores: float

class MonthlyDisbursementItem(BaseModel):
    month: str
    amount_lakhs: float
    students_served: int

class UnreachedStudentsMetric(BaseModel):
    target_unreached: int
    covered_so_far: int
    coverage_percentage: float
    high_priority_districts: List[Dict[str, Any]]
    pvtg_students_supported: int

class AnalyticsDashboardData(BaseModel):
    overview: OverviewStats
    scheme_distribution: List[SchemeDistributionItem]
    state_wise_stats: List[StateWiseStatItem]
    monthly_disbursements: List[MonthlyDisbursementItem]
    unreached_metric: UnreachedStudentsMetric

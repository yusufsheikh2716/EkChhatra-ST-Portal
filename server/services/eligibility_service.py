from typing import List, Dict, Any, Tuple
from models.user import User
from models.scholarship import Scholarship

def check_scheme_eligibility(user: User, scholarship: Scholarship) -> Tuple[bool, List[str], int]:
    """
    Evaluates a student against a specific scholarship scheme.
    Returns: (is_eligible, list_of_reasons, match_score_percentage)
    """
    reasons = []
    is_eligible = True
    score_points = 0
    total_points = 4

    user_income = user.family_income or 0.0
    user_level = (user.education_level or "").strip().lower()
    user_pct = user.percentage or 0.0
    is_pvtg = bool(user.is_pvtg)

    # 1. Category Check: All 5 schemes require ST status
    # (By nature of portal, all registered users are ST, bonus if PVTG)
    if is_pvtg:
        reasons.append("Eligible: Priority reservation applies for Particularly Vulnerable Tribal Group (PVTG).")
        score_points += 1
    else:
        score_points += 1

    # 2. Education Level Check
    scheme_levels = [lvl.strip().lower() for lvl in (scholarship.education_levels or [])]
    level_match = False
    
    for req_lvl in scheme_levels:
        if req_lvl in user_level or user_level in req_lvl:
            level_match = True
            break
        # Broader mappings
        if "undergraduate" in user_level and ("undergraduate" in req_lvl or "ug" in req_lvl or "degree" in req_lvl or "college" in req_lvl):
            level_match = True
            break
        if "postgraduate" in user_level and ("postgraduate" in req_lvl or "pg" in req_lvl or "masters" in req_lvl):
            level_match = True
            break
        if "phd" in user_level and ("phd" in req_lvl or "fellowship" in req_lvl or "research" in req_lvl):
            level_match = True
            break
        if ("class 11" in user_level or "class 12" in user_level) and ("class 11" in req_lvl or "class 12" in req_lvl or "higher secondary" in req_lvl or "post-matric" in req_lvl):
            level_match = True
            break
        if ("class 9" in user_level or "class 10" in user_level) and ("class 9" in req_lvl or "class 10" in req_lvl or "pre-matric" in req_lvl or "secondary" in req_lvl):
            level_match = True
            break
        if "overseas" in user_level and "overseas" in req_lvl:
            level_match = True
            break

    if level_match:
        reasons.append(f"Education match: Current level ({user.education_level}) qualifies for this scheme.")
        score_points += 1
    else:
        is_eligible = False
        reasons.append(f"Education level mismatch: Scheme requires {', '.join(scholarship.education_levels)}, current profile is '{user.education_level or 'Not specified'}'.")

    # 3. Income Ceiling Check
    if scholarship.max_income is not None and scholarship.max_income > 0:
        if user_income <= scholarship.max_income:
            reasons.append(f"Income criteria met: Annual family income ₹{user_income:,.0f} is within the ₹{scholarship.max_income:,.0f} limit.")
            score_points += 1
        elif is_pvtg and user_income <= (scholarship.max_income * 1.25):
            reasons.append(f"Income concession: PVTG exemption extends income threshold up to ₹{(scholarship.max_income * 1.25):,.0f}.")
            score_points += 1
        else:
            is_eligible = False
            reasons.append(f"Income exceeded: Family income ₹{user_income:,.0f} exceeds maximum ceiling of ₹{scholarship.max_income:,.0f}.")
    else:
        reasons.append("No restrictive annual family income ceiling for this fellowship.")
        score_points += 1

    # 4. Minimum Academic Marks Check
    if scholarship.min_percentage and scholarship.min_percentage > 0:
        if user_pct >= scholarship.min_percentage:
            reasons.append(f"Academic benchmark satisfied: Scored {user_pct}% (minimum required: {scholarship.min_percentage}%).")
            score_points += 1
        else:
            is_eligible = False
            reasons.append(f"Academic benchmark unmet: Scored {user_pct}% (requires at least {scholarship.min_percentage}%).")
    else:
        score_points += 1

    # Match score calculation
    match_score = int((score_points / total_points) * 100)
    if is_eligible and match_score < 75:
        match_score = 80

    return is_eligible, reasons, match_score

def evaluate_all_scholarships(user: User, scholarships: List[Scholarship]) -> List[Dict[str, Any]]:
    results = []
    for s in scholarships:
        eligible, reasons, score = check_scheme_eligibility(user, s)
        results.append({
            "scholarship": s,
            "is_eligible": eligible,
            "reasons": reasons,
            "match_score": score
        })
    # Sort with eligible schemes first, then by match score
    results.sort(key=lambda x: (x["is_eligible"], x["match_score"]), reverse=True)
    return results

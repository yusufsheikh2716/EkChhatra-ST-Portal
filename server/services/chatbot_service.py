from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from models.scholarship import Scholarship
from models.application import Application
from services.eligibility_service import evaluate_all_scholarships

async def process_chat_message(
    message: str,
    user: Optional[User],
    db: AsyncSession
) -> Dict[str, Any]:
    text = message.strip().lower()
    actions = []

    # 1. Greetings
    if any(k in text for k in ["hello", "hi", "namaste", "johar", "hey", "greetings", "pranam"]):
        name_str = f" {user.name}" if user else ""
        reply = (
            f"Johar & Namaste{name_str}! 🙏 I am **JAGO**, your dedicated AI scholarship guide for EkChhatra.\n\n"
            "I can assist you with:\n"
            "- **Checking your eligibility** across all 5 central MoTA schemes\n"
            "- **Tracking the real-time stage** of your scholarship application\n"
            "- **Document requirements** (ST certificate, Income certificate, Marksheet)\n"
            "- **Direct links** to National Scholarship Portal (NSP), NFST, and NOS\n"
            "- **Disbursement and DBT payment status**\n\n"
            "How can I help your academic journey today?"
        )
        actions = [
            {"label": "Check My Eligibility", "query": "Am I eligible for any scheme?"},
            {"label": "Track Application Status", "query": "What is my application status?"},
            {"label": "Documents Required", "query": "What documents do I need?"}
        ]
        return {"reply": reply, "actions": actions}

    # 2. Eligibility inquiries
    if any(k in text for k in ["eligib", "qualify", "can i apply", "which scheme"]):
        if not user:
            reply = (
                "To evaluate your eligibility accurately, please **Sign In** to your EkChhatra student profile. "
                "EkChhatra tests your education level, family income, ST certificate, and marks against all 5 central schemes."
            )
            actions = [{"label": "Login Now", "url": "/login"}]
            return {"reply": reply, "actions": actions}

        # Fetch scholarships and run engine
        res = await db.execute(select(Scholarship).where(Scholarship.is_active == True))
        all_schemes = res.scalars().all()
        evals = evaluate_all_scholarships(user, all_schemes)

        eligible_schemes = [e for e in evals if e["is_eligible"]]
        ineligible_schemes = [e for e in evals if not e["is_eligible"]]

        reply_lines = [f"### 📋 Eligibility Assessment for {user.name}\n"]
        reply_lines.append(f"- **Education Level**: {user.education_level or 'Not specified'}")
        reply_lines.append(f"- **Annual Family Income**: ₹{(user.family_income or 0):,.0f}")
        reply_lines.append(f"- **Academic Score**: {user.percentage or 0}%")
        reply_lines.append(f"- **PVTG Category**: {'Yes' if user.is_pvtg else 'No'}\n")

        if eligible_schemes:
            reply_lines.append("#### ✅ Schemes You Are Eligible For:")
            for item in eligible_schemes:
                sch = item["scholarship"]
                reply_lines.append(f"- **{sch.name}** ({sch.benefit_summary})")
                for r in item["reasons"][:2]:
                    reply_lines.append(f"  • {r}")
        else:
            reply_lines.append("#### ℹ️ Currently, no schemes match your exact profile:")
            for item in ineligible_schemes[:3]:
                sch = item["scholarship"]
                reasons_str = "; ".join([r for r in item["reasons"] if "mismatch" in r or "exceeded" in r or "unmet" in r])
                reply_lines.append(f"- **{sch.name}**: {reasons_str or 'Criteria not satisfied.'}")

        reply_lines.append("\n👉 You can submit a new application anytime from the **Apply** section.")
        actions = [
            {"label": "Apply for Scholarship", "url": "/apply"},
            {"label": "View Dashboard", "url": "/dashboard"}
        ]
        return {"reply": "\n".join(reply_lines), "actions": actions}

    # 3. Status Tracking
    if any(k in text for k in ["status", "track", "where is my application", "progress", "update"]):
        if not user:
            return {
                "reply": "Please log in to track your individual application progress.",
                "actions": [{"label": "Login", "url": "/login"}]
            }

        res = await db.execute(
            select(Application, Scholarship)
            .join(Scholarship, Application.scholarship_id == Scholarship.id)
            .where(Application.user_id == user.id)
            .order_by(Application.created_at.desc())
        )
        apps = res.all()

        if not apps:
            return {
                "reply": (
                    f"Hello {user.name}, you haven't submitted any scholarship applications yet on EkChhatra.\n\n"
                    "Click below to explore schemes and start an application in under 3 minutes!"
                ),
                "actions": [{"label": "Start Application", "url": "/apply"}]
            }

        reply_lines = [f"### 📍 Application Tracking ({len(apps)} Total)\n"]
        for app, sch in apps:
            stage_display = app.status.replace("_", " ")
            reply_lines.append(f"**Application ID**: `{app.application_id}`")
            reply_lines.append(f"- **Scheme**: {sch.name}")
            reply_lines.append(f"- **Current Stage**: `{stage_display}`")
            if app.remarks:
                reply_lines.append(f"- **Remarks**: {app.remarks}")
            if app.payment_amount and app.payment_amount > 0:
                reply_lines.append(f"- **Disbursed Amount**: ₹{app.payment_amount:,.0f} (Txn: {app.transaction_id or 'Processing'})")
            reply_lines.append("---")

        actions = [{"label": "Open Dashboard", "url": "/dashboard"}]
        return {"reply": "\n".join(reply_lines), "actions": actions}

    # 4. Specific Schemes Keyword Matching
    if "pre-matric" in text or "pre matric" in text or "class 9" in text or "class 10" in text:
        reply = (
            "### 🏫 Pre-Matric Scholarship for ST Students (Class 9 & 10)\n\n"
            "- **Administered by**: Ministry of Tribal Affairs (MoTA) & Respective State Governments\n"
            "- **Target**: Day scholars and hostellers studying in government or recognized schools.\n"
            "- **Income Ceiling**: Annual family income must not exceed **₹2,50,000**.\n"
            "- **Benefits**: Monthly allowance of ₹150–₹350/month plus annual book grant of ₹750–₹1,000.\n"
            "- **Official National Portal**: [National Scholarship Portal (scholarships.gov.in)](https://scholarships.gov.in/)\n\n"
            "You can apply directly via EkChhatra or through the official NSP gateway."
        )
        actions = [
            {"label": "Apply for Pre-Matric", "url": "/apply?scheme=PRE_MATRIC"},
            {"label": "Official NSP Link", "url": "https://scholarships.gov.in/"}
        ]
        return {"reply": reply, "actions": actions}

    if "post-matric" in text or "post matric" in text or "class 11" in text or "class 12" in text or "degree" in text:
        reply = (
            "### 🎓 Post-Matric Scholarship for ST Students\n\n"
            "- **Target**: ST students pursuing post-matriculation courses (Class 11, 12, ITI, Diploma, Undergraduate, Postgraduate).\n"
            "- **Income Ceiling**: Annual family income up to **₹2,50,000**.\n"
            "- **Benefits**: 100% compulsory non-refundable tuition fees reimbursed + maintenance stipend of ₹550 to ₹1,200/month directly via DBT.\n"
            "- **Official National Portal**: [National Scholarship Portal](https://scholarships.gov.in/)\n\n"
            "Your verified ST Caste Certificate and bank account seeded with Aadhaar ensure rapid DBT sanction."
        )
        actions = [
            {"label": "Apply for Post-Matric", "url": "/apply?scheme=POST_MATRIC"},
            {"label": "Official NSP Link", "url": "https://scholarships.gov.in/"}
        ]
        return {"reply": reply, "actions": actions}

    if "top class" in text or "premier" in text or "iit" in text or "iim" in text or "nit" in text or "aiims" in text:
        reply = (
            "### 🏆 National Fellowship / Top Class Education for ST Students\n\n"
            "- **Eligibility**: ST students admitted into notified premier institutions (IITs, NITs, IIMs, AIIMS, NLUs, Central Universities).\n"
            "- **Academic Benchmark**: Minimum 60% in Class 12 or qualifying exam.\n"
            "- **Income Ceiling**: Annual family income up to **₹6,00,000**.\n"
            "- **Benefits**: Full tuition fee covered directly to the institute + living allowance of **₹2,220/month** + **₹3,000/year** books + one-time **₹45,000** computer grant.\n"
            "- **Official Portal**: [MoTA Top Class Portal](https://tribal.nic.in/)\n"
        )
        actions = [
            {"label": "Apply for Top Class", "url": "/apply?scheme=TOP_CLASS"},
            {"label": "MoTA Official Site", "url": "https://tribal.nic.in/"}
        ]
        return {"reply": reply, "actions": actions}

    if "nfst" in text or "fellowship" in text or "phd" in text or "m.phil" in text or "research" in text or "jrf" in text or "net" in text:
        reply = (
            "### 🔬 National Fellowship for Higher Education of ST Students (NFST)\n\n"
            "- **Target**: ST candidates enrolled in full-time regular M.Phil / Ph.D. programs.\n"
            "- **Seats**: 750 fellowships awarded every academic year.\n"
            "- **Benefits**:\n"
            "  • JRF: **₹31,000/month** for initial 2 years\n"
            "  • SRF: **₹35,000/month** for remaining duration\n"
            "  • Contingency grant up to ₹25,000/year + House Rent Allowance (HRA) as per central norms.\n"
            "- **Official Fellowship Portal**: [Canara Bank SFMP Portal](https://nfrsfmp.canarabank.in/)\n"
        )
        actions = [
            {"label": "Apply for NFST", "url": "/apply?scheme=NFST"},
            {"label": "Canara Bank Portal", "url": "https://nfrsfmp.canarabank.in/"}
        ]
        return {"reply": reply, "actions": actions}

    if "nos" in text or "overseas" in text or "abroad" in text or "foreign" in text:
        reply = (
            "### ✈️ National Overseas Scholarship for ST Students (NOS)\n\n"
            "- **Target**: ST students pursuing Master's, Ph.D., or Post-Doctoral research in accredited foreign universities.\n"
            "- **Income Limit**: Total family income must not exceed **₹6,00,000/year**.\n"
            "- **Slots**: 20 designated slots per financial year.\n"
            "- **Benefits**: Total tuition fees + annual maintenance allowance of **USD 15,400** (or GBP 9,900) + contingency + economy airfare.\n"
            "- **Official Ministry Portal**: [NOS MSJE / MoTA Portal](https://nosmsje.gov.in/)\n"
        )
        actions = [
            {"label": "Apply for NOS", "url": "/apply?scheme=NOS"},
            {"label": "Official NOS Portal", "url": "https://nosmsje.gov.in/"}
        ]
        return {"reply": reply, "actions": actions}

    # 5. Documents required
    if any(k in text for k in ["document", "docs", "certificate", "wallet", "upload", "proof"]):
        reply = (
            "### 📁 Required Documents Checklist for ST Scholarships\n\n"
            "Keep digital copies ready in your **Document Wallet**:\n\n"
            "1. **ST Caste Certificate**: Issued by designated Sub-Divisional Officer (SDO) or Tahsildar.\n"
            "2. **Income Certificate**: Valid for current financial year (less than ₹2.5L or ₹6.0L depending on scheme).\n"
            "3. **Previous Academic Marksheet**: Marksheet of 10th / 12th / Degree.\n"
            "4. **Institution Admission / Fee Receipt**: Proving current enrollment.\n"
            "5. **Aadhaar-Linked Bank Passbook**: Front page showing IFSC and Account Number (DBT active).\n"
            "6. **Domicile / Residence Certificate**: Proof of home state.\n\n"
            "💡 *Tip: Once uploaded to your EkChhatra wallet, documents can be reused across all scholarship applications with 1 click!*"
        )
        actions = [
            {"label": "Go to Document Wallet", "url": "/documents"},
            {"label": "Scan Document (AI OCR)", "url": "/documents?ocr=open"}
        ]
        return {"reply": reply, "actions": actions}

    # 6. Payment & Disbursement
    if any(k in text for k in ["payment", "disburs", "money", "dbt", "bank", "account", "fund"]):
        reply = (
            "### 💳 Scholarship Disbursement & Direct Benefit Transfer (DBT)\n\n"
            "- **Mode of Payment**: All scholarship amounts are transferred via **Direct Benefit Transfer (DBT)** using the Aadhaar Payment Bridge (APB).\n"
            "- **Bank Account Rule**: Your bank account must be **seeded with your 12-digit Aadhaar** and NPCI mapped.\n"
            "- **Disbursement Schedule**: Once State verification is completed, sanction orders are generated and funds are released directly into your account in 7–14 working days.\n"
            "- **Check Seeding**: Verify your Aadhaar-Bank link status on the [UIDAI Resident Portal](https://resident.uidai.gov.in/bank-mapper)."
        )
        actions = [
            {"label": "Check My Wallet", "url": "/documents"},
            {"label": "UIDAI Bank Mapper", "url": "https://resident.uidai.gov.in/bank-mapper"}
        ]
        return {"reply": reply, "actions": actions}

    # 7. How to Apply / Guidance
    if any(k in text for k in ["how to apply", "apply process", "step", "procedure"]):
        reply = (
            "### 🚀 How to Apply on EkChhatra in 5 Simple Steps\n\n"
            "1. **Select Scheme**: Choose from the 5 central MoTA schemes based on your education level.\n"
            "2. **Verify Demographics**: Your personal details and masked Aadhaar are pre-filled.\n"
            "3. **Academic Information**: Provide current course, institution code, and previous marks.\n"
            "4. **Attach Documents**: Select verified certificates directly from your EkChhatra Wallet.\n"
            "5. **Review & Submit**: Automatic conflict check confirms no overlapping central schemes. Receive your unique `EKCH-2025-XXXXX` tracking ID instantly!"
        )
        actions = [
            {"label": "Start Application", "url": "/apply"},
            {"label": "Explore Schemes", "url": "/#schemes"}
        ]
        return {"reply": reply, "actions": actions}

    # 8. Help & Contact
    if any(k in text for k in ["help", "contact", "support", "helpline", "phone", "email"]):
        reply = (
            "### 📞 EkChhatra & MoTA Student Helpdesk\n\n"
            "- **Toll-Free National Helpline**: 1800-11-2001 (Mon–Fri, 9:30 AM – 6:00 PM)\n"
            "- **MoTA Portal Support**: support-tribal@gov.in\n"
            "- **NSP Helpdesk**: helpdesk@nsp.gov.in / 0120-6619540\n"
            "- **Headquarters**: Ministry of Tribal Affairs, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001\n"
            "- **Official Website**: [tribal.nic.in](https://tribal.nic.in/)"
        )
        actions = [
            {"label": "Visit MoTA Portal", "url": "https://tribal.nic.in/"},
            {"label": "National Scholarship Portal", "url": "https://scholarships.gov.in/"}
        ]
        return {"reply": reply, "actions": actions}

    # Default fallback
    reply = (
        "I'm here to support your scholarship journey under the Ministry of Tribal Affairs! "
        "You can ask me about **scheme eligibility**, **application status**, **documents needed**, "
        "or specific schemes like **Post-Matric**, **Top Class**, or **NFST**.\n\n"
        "For comprehensive policy guidelines, you can also consult the official portal at [tribal.nic.in](https://tribal.nic.in/)."
    )
    actions = [
        {"label": "Check Eligibility", "query": "Check my eligibility"},
        {"label": "Track Status", "query": "Track application status"},
        {"label": "Our 5 Schemes", "query": "Explain all schemes"}
    ]
    return {"reply": reply, "actions": actions}

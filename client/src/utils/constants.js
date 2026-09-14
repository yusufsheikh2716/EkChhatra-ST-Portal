/**
 * Official Ministry of Tribal Affairs and Central Government Portal Links
 */
export const GOV_LINKS = {
  MOTA: {
    name: 'Ministry of Tribal Affairs (MoTA)',
    url: 'https://tribal.nic.in/',
    description: 'Nodal central ministry formulating policies and schemes for Scheduled Tribes.'
  },
  NSP: {
    name: 'National Scholarship Portal (NSP)',
    url: 'https://scholarships.gov.in/',
    description: 'Central portal for Pre-Matric and Post-Matric ST scholarship registration.'
  },
  NFST: {
    name: 'Canara Bank SFMP (NFST Fellowship)',
    url: 'https://nfrsfmp.canarabank.in/',
    description: 'Canara Bank portal for monthly M.Phil/Ph.D. fellowship management.'
  },
  NOS: {
    name: 'National Overseas Portal (NOS)',
    url: 'https://nosmsje.gov.in/',
    description: 'MoTA gateway for ST students pursuing overseas Masters and Ph.D.'
  },
  DIGILOCKER: {
    name: 'DigiLocker National Gateway',
    url: 'https://www.digilocker.gov.in/',
    description: 'Digital document wallet for instant verification of ST certificates.'
  },
  UIDAI: {
    name: 'UIDAI Aadhaar Portal',
    url: 'https://uidai.gov.in/',
    description: 'Unique Identification Authority of India for Aadhaar-DBT bank seeding.'
  },
  APAAR: {
    name: 'APAAR / Academic Bank of Credits',
    url: 'https://www.abc.gov.in/',
    description: 'One Nation, One Student ID repository for academic credit mobility.'
  },
  UDISE: {
    name: 'UDISE+ Unified School Portal',
    url: 'https://udiseplus.gov.in/',
    description: 'National school registry verifying Pre-Matric school student enrollment.'
  },
  AISHE: {
    name: 'AISHE Higher Education Portal',
    url: 'https://aishe.gov.in/',
    description: 'All India Survey on Higher Education portal for college verification.'
  },
  UGC: {
    name: 'University Grants Commission (UGC)',
    url: 'https://www.ugc.gov.in/',
    description: 'Higher education regulator verifying university degree recognitions.'
  }
};

export const SCHEME_DETAILS = {
  PRE_MATRIC: {
    title: 'Pre-Matric Scholarship for ST Students',
    classRange: 'Class IX & X',
    incomeCap: '₹2,50,000 / year',
    benefits: '₹150–₹350/mo allowance + ₹1,000 annual book grant',
    portalUrl: GOV_LINKS.NSP.url,
    portalName: 'National Scholarship Portal (NSP)',
    tag: 'School Level',
    color: 'from-amber-500/20 to-orange-500/10'
  },
  POST_MATRIC: {
    title: 'Post-Matric Scholarship for ST Students',
    classRange: 'Class XI, XII, ITI, Degree, PG',
    incomeCap: '₹2,50,000 / year',
    benefits: '100% Tuition fee refund + ₹550–₹1,200/mo DBT living stipend',
    portalUrl: GOV_LINKS.NSP.url,
    portalName: 'National Scholarship Portal (NSP)',
    tag: 'Higher Secondary & College',
    color: 'from-blue-500/20 to-indigo-500/10'
  },
  TOP_CLASS: {
    title: 'Top Class Education for ST Students',
    classRange: 'IITs, NITs, IIMs, AIIMS, NLUs',
    incomeCap: '₹6,00,000 / year',
    benefits: 'Full tuition fee + ₹2,220/mo living + ₹45,000 computer aid + ₹3,000 books',
    portalUrl: GOV_LINKS.MOTA.url,
    portalName: 'MoTA Central Gateway',
    tag: 'Premier Institutes (265 Notified)',
    color: 'from-emerald-500/20 to-teal-500/10'
  },
  NFST: {
    title: 'National Fellowship for Higher Education (NFST)',
    classRange: 'M.Phil & Ph.D. Scholars',
    incomeCap: 'No Cap (Merit & Research)',
    benefits: '₹31,000/mo (JRF) / ₹35,000/mo (SRF) + HRA + ₹25,000/yr contingency',
    portalUrl: GOV_LINKS.NFST.url,
    portalName: 'Canara Bank SFMP Portal',
    tag: 'Ph.D. Research (750 Slots)',
    color: 'from-purple-500/20 to-pink-500/10'
  },
  NOS: {
    title: 'National Overseas Scholarship (NOS)',
    classRange: 'Foreign Masters & Ph.D.',
    incomeCap: '₹6,00,000 / year',
    benefits: 'Full foreign tuition + $15,400/yr living + visa + airfare',
    portalUrl: GOV_LINKS.NOS.url,
    portalName: 'NOS Ministry Portal',
    tag: 'Overseas Studies (20 Slots)',
    color: 'from-rose-500/20 to-crimson-500/10'
  }
};

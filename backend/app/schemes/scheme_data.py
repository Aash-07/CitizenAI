SCHEMES = [
    {
        "name": "PM-KISAN",
        "category": "Farmer",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "source_pdf": "PM_KISAN_Guidelines.pdf",
    },
    {
        "name": "Ayushman Bharat PM-JAY",
        "category": "Healthcare",
        "ministry": "Ministry of Health and Family Welfare",
        "source_pdf": "PMJAY_Guidelines.pdf",
    },
    {
        "name": "National Scholarship",
        "category": "Education",
        "ministry": "University Grants Commission",
        "source_pdf": "NSP_Guidelines.pdf",
    },
    {
        "name": "Pradhan Mantri MUDRA Yojana",
        "category": "Business/MSME",
        "ministry": "Ministry of Finance",
        "source_pdf": "Mudra_Guidelines.pdf",
    },
]


def get_all_schemes():
    return SCHEMES


def get_schemes_by_category(category: str):
    return [
        scheme
        for scheme in SCHEMES
        if scheme["category"].lower() == category.lower()
    ]


def search_schemes(query: str):
    query = query.lower().strip()

    return [
        scheme
        for scheme in SCHEMES
        if (
            query in scheme["name"].lower()
            or query in scheme["category"].lower()
            or query in scheme["ministry"].lower()
        )
    ]
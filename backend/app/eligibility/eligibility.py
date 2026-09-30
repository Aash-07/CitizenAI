from dataclasses import dataclass

from app.schemes.scheme_data import get_all_schemes


@dataclass
class CitizenProfile:
    age: int
    state: str
    occupation: str
    annual_income: float
    is_student: bool = False
    is_farmer: bool = False
    owns_business: bool = False


def check_eligibility(profile: CitizenProfile):
    categories = []

    if profile.is_student:
        categories.append("Education")

    if profile.is_farmer:
        categories.append("Farmer")

    if profile.owns_business:
        categories.append("Business/MSME")

    if profile.annual_income <= 500000:
        categories.append("Income-based")

    if profile.age >= 60:
        categories.append("Senior citizen")

    schemes = [
        scheme
        for scheme in get_all_schemes()
        if scheme["category"] in categories
    ]

    return {
        "profile": {
            "age": profile.age,
            "state": profile.state,
            "occupation": profile.occupation,
            "annual_income": profile.annual_income,
        },
        "eligible_categories": categories,
        "matching_schemes": schemes,
    }
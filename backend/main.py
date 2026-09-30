from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag.rag_chain import ask_citizenai
from app.eligibility.eligibility import CitizenProfile, check_eligibility
from app.schemes.scheme_data import get_all_schemes, search_schemes


app = FastAPI(
    title="CitizenAI API",
    version="2.0"
)


# Allow Next.js frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://citizen-1z23k4eqj-aaashleshs-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "CitizenAI Backend is Running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "CitizenAI Backend"
    }


# # Simple Gemini test endpoint
# @app.post("/chat/test")
# def test_chat(request: ChatRequest):
#     response = client.models.generate_content(
#         model=MODEL_NAME,
#         contents=request.message
#     )

#     return {
#         "reply": response.text
#     }


# # Real RAG endpoint
# @app.post("/chat")
# def rag_chat(request: ChatRequest):
#     result = ask_citizenai(request.message)

#     return {
#         "answer": result["answer"],
#         "sources": result["sources"]
#     }

@app.post("/chat")
def rag_chat(request: ChatRequest):
    try:
        result = ask_citizenai(request.message)

        return {
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as e:
        print("RAG ERROR:", repr(e))

        if "503" in str(e):
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily unavailable. Please try again in a moment."
            )

        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request."
        )


class EligibilityRequest(BaseModel):
    age: int
    state: str
    occupation: str
    annual_income: float
    is_student: bool = False
    is_farmer: bool = False
    owns_business: bool = False


@app.post("/eligibility")
def eligibility(request: EligibilityRequest):
    profile = CitizenProfile(
        age=request.age,
        state=request.state,
        occupation=request.occupation,
        annual_income=request.annual_income,
        is_student=request.is_student,
        is_farmer=request.is_farmer,
        owns_business=request.owns_business,
    )

    return check_eligibility(profile)


@app.get("/schemes")
def schemes():
    return {
        "count": len(get_all_schemes()),
        "schemes": get_all_schemes()
    }

@app.get("/schemes/search")
def scheme_search(q: str):
    return {
        "query": q,
        "schemes": search_schemes(q)
    }
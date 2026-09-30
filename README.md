# CitizenAI — Bharat Policy & Government Scheme Navigator

CitizenAI is a full-stack AI-powered government scheme navigator that helps citizens understand government schemes using information retrieved from official government guideline documents.

## Features

- Government scheme discovery and search
- Profile-based eligibility guidance
- RAG-powered question answering
- Answers grounded in indexed government PDFs
- PDF and page citations in chat responses
- Saved schemes
- Local authentication and profile
- React/Vite frontend
- FastAPI backend
- Groq-powered LLM generation

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide Icons

### Backend

- Python
- FastAPI
- LangChain
- FAISS
- Hugging Face Sentence Transformers
- PyPDF
- Groq API
- `openai/gpt-oss-20b`

## RAG Pipeline

```text
Government PDFs
      ↓
PDF ingestion
      ↓
Text chunking
      ↓
Local embeddings
      ↓
FAISS vector store
      ↓
Relevant document retrieval
      ↓
Groq LLM
      ↓
Answer + PDF/page citations
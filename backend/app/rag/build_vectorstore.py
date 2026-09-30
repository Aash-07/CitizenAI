# import os
# from pathlib import Path

# from dotenv import load_dotenv
# from langchain_community.vectorstores import FAISS
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# from app.rag.chunk_documents import chunk_documents

# load_dotenv()

# VECTORSTORE_PATH = Path("data/vector_store")


# def build_vectorstore():
#     chunks = chunk_documents()

#     api_key = os.getenv("GEMINI_API_KEY")

#     if not api_key:
#         raise ValueError("GEMINI_API_KEY not found in .env")

#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="gemini-embedding-001",
#         google_api_key=api_key,
#         batch_size=10,
#     )

#     vectorstore = FAISS.from_documents(
#         chunks,
#         embeddings,
#     )

#     VECTORSTORE_PATH.mkdir(parents=True, exist_ok=True)
#     vectorstore.save_local(str(VECTORSTORE_PATH))

#     return len(chunks)


# if __name__ == "__main__":
#     total_chunks = build_vectorstore()

#     print("\nVector store created successfully.")
#     print(f"Chunks indexed: {total_chunks}")
#     print(f"Saved to: {VECTORSTORE_PATH}")








from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

from app.rag.chunk_documents import chunk_documents


VECTORSTORE_PATH = Path("data/vector_store")


def build_vectorstore():
    chunks = chunk_documents()

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(chunks, embeddings)

    VECTORSTORE_PATH.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(VECTORSTORE_PATH))

    return len(chunks)


if __name__ == "__main__":
    total_chunks = build_vectorstore()

    print("\nVector store created successfully.")
    print(f"Chunks indexed: {total_chunks}")
    print(f"Saved to: {VECTORSTORE_PATH}")


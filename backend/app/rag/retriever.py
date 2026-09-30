from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


VECTORSTORE_PATH = Path("data/vector_store")

# Load the embedding model only once
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load FAISS only once
vectorstore = FAISS.load_local(
    str(VECTORSTORE_PATH),
    embeddings,
    allow_dangerous_deserialization=True
)


def search_documents(query: str, k: int = 6):
    results_with_scores = vectorstore.similarity_search_with_score(
        query,
        k=k
    )

    documents = []

    for doc, score in results_with_scores:
        doc.metadata["retrieval_score"] = float(score)
        documents.append(doc)

    return documents
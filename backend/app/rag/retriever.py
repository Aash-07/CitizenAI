from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


VECTORSTORE_PATH = Path("data/vector_store")


def get_vectorstore():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    return FAISS.load_local(
        str(VECTORSTORE_PATH),
        embeddings,
        allow_dangerous_deserialization=True
    )


def search_documents(query: str, k: int = 6):
    vectorstore = get_vectorstore()

    results_with_scores = vectorstore.similarity_search_with_score(
        query,
        k=k
    )

    documents = []

    for doc, score in results_with_scores:
        doc.metadata["retrieval_score"] = float(score)
        documents.append(doc)

    return documents


if __name__ == "__main__":
    query = input("Enter your question: ")

    results = search_documents(query)

    print(f"\nFound {len(results)} relevant chunks:\n")

    for i, doc in enumerate(results, start=1):
        print("=" * 60)
        print(f"Result {i}")
        print("Source:", doc.metadata.get("source_pdf"))
        print("Page:", doc.metadata.get("page", 0) + 1)
        print("Score:", doc.metadata.get("retrieval_score"))
        print("Text:", doc.page_content[:500])
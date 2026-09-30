from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.ingestion.load_documents import load_all_documents


def chunk_documents():
    documents = load_all_documents()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    chunks = splitter.split_documents(documents)

    return chunks


if __name__ == "__main__":
    chunks = chunk_documents()

    print(f"Total pages: {len(set(doc.metadata.get('page') for doc in chunks))}")
    print(f"Total chunks: {len(chunks)}")

    for i, chunk in enumerate(chunks[:5], start=1):
        print("\n" + "=" * 60)
        print(f"Chunk {i}")
        print("Source:", chunk.metadata.get("source_pdf"))
        print("Page:", chunk.metadata.get("page", 0) + 1)
        print("Text:", chunk.page_content[:300])
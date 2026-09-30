from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

# Folder containing government PDFs
PDF_FOLDER = Path("data/raw_documents")

def load_all_documents():
    documents = []

    for pdf in PDF_FOLDER.glob("*.pdf"):
        loader = PyPDFLoader(str(pdf))
        pages = loader.load()

        # Add PDF name to metadata
        for page in pages:
            page.metadata["source_pdf"] = pdf.name

        documents.extend(pages)

    return documents


if __name__ == "__main__":
    docs = load_all_documents()

    print(f"\nTotal Pages Loaded: {len(docs)}\n")

    for doc in docs[:5]:  # Show first 5 pages only
        print("=" * 60)
        print("PDF:", doc.metadata["source_pdf"])
        print("Page:", doc.metadata["page"] + 1)
        print("Preview:")
        print(doc.page_content[:250])
        print()
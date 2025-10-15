from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_local_embedding(text: str) -> np.ndarray:
    """Return embedding as a NumPy array."""
    return model.encode(text, convert_to_numpy=True)

def cosine_distance(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Compute cosine distance (1 - cosine similarity) between two embedding vectors.
    """
    sim = cosine_similarity([vec1], [vec2])[0][0]
    return 1 - sim

if __name__ == "__main__":
    text1 = "Cat"
    text2 = "A dog sits on the mat."

    emb1 = get_local_embedding(text1)
    emb2 = get_local_embedding(text2)

    distance = cosine_distance(emb1, emb2)

    print(f"Cosine distance: {distance:.4f}")
    print(f"Cosine similarity: {1 - distance:.4f}")

    print(emb1)

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ComicDetails = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/comic/${id}`);
        setComic(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du comic :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComic();
  }, [id]);

  if (isLoading) {
    return <p style={{ color: "#fff", padding: "2rem" }}>Chargement...</p>;
  }

  if (!comic) {
    return <p style={{ color: "#fff", padding: "2rem" }}>Comic non trouvé.</p>;
  }

  const thumbnailUrl = comic.thumbnail
    ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    : "https://via.placeholder.com/300x450.png?text=No+Image";

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2>{comic.title}</h2>
      <img
        src={thumbnailUrl}
        alt={comic.title}
        style={{ width: "300px", borderRadius: "8px" }}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x450.png?text=Image+Not+Found";
        }}
      />
      <p style={{ marginTop: "1rem", maxWidth: "600px" }}>
        {comic.description || "Aucune description disponible."}
      </p>
    </div>
  );
};

export default ComicDetails;

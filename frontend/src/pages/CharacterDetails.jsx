import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchCharacterAndComics = async () => {
      try {
        setIsLoading(true);

        // 1. Récupération des détails du personnage
        const charResponse = await axios.get(
          `${API_BASE_URL}/characters/${id}`
        );
        setCharacter(charResponse.data);

        // 2. Récupération des comics associés
        const comicsResponse = await axios.get(`${API_BASE_URL}/comics`, {
          params: {
            characterId: id,
          },
        });

        setComics(comicsResponse.data.results || []);
      } catch (error) {
        console.error("Erreur lors du chargement des détails :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterAndComics();
  }, [id]);

  if (isLoading) {
    return <p style={{ color: "#fff", padding: "2rem" }}>Chargement...</p>;
  }

  if (!character) {
    return (
      <p style={{ color: "#fff", padding: "2rem" }}>Personnage non trouvé</p>
    );
  }

  const thumbnailUrl = character.thumbnail
    ? `${character.thumbnail.path}.${character.thumbnail.extension}`
    : "https://via.placeholder.com/250x250.png?text=No+Image";

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2>{character.name}</h2>
      <img
        src={thumbnailUrl}
        alt={character.name}
        style={{ width: "250px", borderRadius: "8px" }}
      />
      <p style={{ maxWidth: "600px", marginTop: "1rem" }}>
        {character.description || "Aucune description disponible."}
      </p>

      <h3 className="black-title">Comics associés :</h3>
      {comics.length === 0 ? (
        <p>Aucun comic trouvé pour ce personnage.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem",
          }}
        >
          {comics.map((comic) => {
            const comicThumb = comic.thumbnail
              ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
              : "https://via.placeholder.com/200x300.png?text=No+Image";

            return (
              <div
                key={comic._id || comic.id}
                style={{
                  backgroundColor: "#1e1e1e",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={comicThumb}
                  alt={comic.title}
                  style={{ width: "100%", borderRadius: "4px" }}
                />
                <h4>{comic.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
                  {comic.description || "Pas de description."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CharacterDetails;

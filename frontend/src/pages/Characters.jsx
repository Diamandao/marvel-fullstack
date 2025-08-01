import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  //  Fonction pour gérer les favoris
  const handleFavorite = (item) => {
    const stored = localStorage.getItem("marvelFavorites");
    const favorites = stored ? JSON.parse(stored) : [];

    const exists = favorites.some((fav) => fav._id === item._id);
    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter((fav) => fav._id !== item._id);
      toast.info(`${item.name || item.title} retiré des favoris`);
    } else {
      updatedFavorites = [...favorites, item];
      toast.success(`${item.name || item.title} ajouté aux favoris`);
    }

    localStorage.setItem("marvelFavorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/characters", {
          params: {
            name: search,
            page: page,
          },
        });
        console.log("Résultats de la page :", page, response.data);
        setCharacters(response.data.results);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [search, page]);

  return (
    <div style={{ padding: "2rem" }}>
      <input
        type="text"
        placeholder="Rechercher un personnage"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "400px",
        }}
      />

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {characters.map((character) => (
            <div
              key={character._id}
              style={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <img
                src={
                  character.thumbnail?.path +
                  "." +
                  character.thumbnail?.extension
                }
                alt={character.name}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
                }
              />
              <h3 style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                {character.name}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
                {character.description || "Aucune description."}
              </p>

              {/* ⭐ Bouton Favori */}
              <button
                onClick={() => handleFavorite(character)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.3rem 0.7rem",
                  fontSize: "0.9rem",
                  backgroundColor: "#f5c518",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ⭐ Favori
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔢 Pagination */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ⬅️ Précédent
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage((prev) => prev + 1)}>Suivant ➡️</button>
      </div>
    </div>
  );
};

export default Characters;

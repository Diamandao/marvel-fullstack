import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/cards.css";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const limit = 30;

  useEffect(() => {
    const stored = localStorage.getItem("marvelFavorites");
    setFavorites(stored ? JSON.parse(stored) : []);
  }, []);

  const handleFavorite = (item) => {
    const exists = favorites.some((fav) => fav._id === item._id);
    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter((fav) => fav._id !== item._id);
      toast.info(`${item.name} retiré des favoris`);
    } else {
      updatedFavorites = [...favorites, item];
      toast.success(`${item.name} ajouté aux favoris`);
    }

    setFavorites(updatedFavorites);
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
            limit: limit,
          },
        });
        setCharacters(response.data.results);
      } catch (error) {
        console.error("Erreur de chargement :", error.message);
        toast.error("Erreur lors du chargement des personnages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [search, page]);

  return (
    <div>
      <h2>Liste des personnages Marvel</h2>

      <input
        type="text"
        placeholder="Rechercher un personnage"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {isLoading ? (
        <p style={{ textAlign: "center" }}>Chargement...</p>
      ) : (
        <div className="grid-container">
          {characters.map((character) => {
            const isFavorite = favorites.some(
              (fav) => fav._id === character._id
            );

            return (
              <div key={character._id} className="card">
                <Link
                  to={`/character/${character._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={
                      character.thumbnail?.path +
                      "." +
                      character.thumbnail?.extension
                    }
                    alt={character.name}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
                    }
                  />
                  <h3>{character.name}</h3>
                  <p>{character.description || "Aucune description."}</p>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavorite(character);
                  }}
                >
                  {isFavorite ? "⭐ Retirer" : "☆ Favori"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="pagination">
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

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/cards.css";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const limit = 30;

  // Charger les favoris depuis le localStorage une seule fois
  useEffect(() => {
    const storedFavorites = localStorage.getItem("marvelFavoritesCharacters");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        localStorage.removeItem("marvelFavoritesCharacters");
      }
    }
  }, []);

  // Ajouter ou retirer un favori
  const handleFavorite = (item) => {
    if (!item || !item._id) {
      toast.error("Impossible d’ajouter ce personnage !");
      return;
    }

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
    localStorage.setItem(
      "marvelFavoritesCharacters",
      JSON.stringify(updatedFavorites)
    );
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/characters`,
          {
            params: {
              name: search,
              page,
              limit,
            },
          }
        );

        if (Array.isArray(res.data.results)) {
          setCharacters(res.data.results);
        } else {
          console.warn("⚠️ Données inattendues:", res.data);
          setCharacters([]);
        }
      } catch (err) {
        console.error("❌ Erreur API :", err.message);
        toast.error("Erreur lors du chargement des personnages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [search, page]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#E62429" }}>Vos Personnages Marvel</h1>

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
        <p style={{ textAlign: "center", color: "#222" }}>Chargement...</p>
      ) : characters.length === 0 ? (
        <p style={{ textAlign: "center", color: "#222" }}>
          Aucun personnage trouvé.
        </p>
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
                    src={`${character.thumbnail?.path}.${character.thumbnail?.extension}`}
                    alt={character.name}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/200x200.png?text=Image+Non+dispo")
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

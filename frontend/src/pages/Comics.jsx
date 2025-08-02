import "../components/cards.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Comics = () => {
  const [comics, setComics] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/comics", {
          params: {
            title: search,
            page: page,
          },
        });
        setComics(response.data.results);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, [search, page]);

  useEffect(() => {
    // Chargement des favoris depuis localStorage
    const stored = localStorage.getItem("marvelFavorites");
    const parsed = stored ? JSON.parse(stored) : [];
    setFavorites(parsed);
  }, []);

  const handleFavorite = (item) => {
    const exists = favorites.some((fav) => fav._id === item._id);
    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter((fav) => fav._id !== item._id);
      toast.info(`${item.title} retiré des favoris`);
    } else {
      updatedFavorites = [...favorites, item];
      toast.success(`${item.title} ajouté aux favoris`);
    }

    localStorage.setItem("marvelFavorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites); // <== MISE À JOUR DU STATE
  };

  const isInFavorites = (itemId) => {
    return favorites.some((fav) => fav._id === itemId);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Liste des comics</h2>

      <input
        type="text"
        placeholder="Rechercher un comic"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {comics.map((comic) => (
            <div key={comic._id} className="card">
              <img
                src={comic.thumbnail?.path + "." + comic.thumbnail?.extension}
                alt={comic.title}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
                }
              />
              <h3>{comic.title}</h3>
              <p>{comic.description || "Aucune description."}</p>
              <button onClick={() => handleFavorite(comic)}>
                {isInFavorites(comic._id) ? "⭐ Supprimer" : "☆ Favori"}
              </button>
            </div>
          ))}
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

export default Comics;

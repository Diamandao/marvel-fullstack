import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Comics = () => {
  const [comics, setComics] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  const isInFavorites = (itemId) => {
    const stored = localStorage.getItem("marvelFavorites");
    const favorites = stored ? JSON.parse(stored) : [];
    return favorites.some((fav) => fav._id === itemId);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Liste des comics</h2>

      <input
        type="text"
        placeholder="Rechercher un comic"
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
          {comics.map((comic) => (
            <div
              key={comic._id}
              style={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <img
                src={comic.thumbnail?.path + "." + comic.thumbnail?.extension}
                alt={comic.title}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
                }
              />
              <h3 style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                {comic.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
                {comic.description || "Aucune description."}
              </p>
              <button
                onClick={() => handleFavorite(comic)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.3rem 0.6rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                {isInFavorites(comic._id) ? "⭐ Supprimer" : "☆ Favori"}
              </button>
            </div>
          ))}
        </div>
      )}

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

export default Comics;

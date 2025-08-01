import { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // 🔄 Charger depuis localStorage au chargement
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem("marvelFavorites");
    const parsed = stored ? JSON.parse(stored) : [];
    setFavorites(parsed);
  };

  // ❌ Supprimer un favori
  const removeFavorite = (itemId) => {
    const updatedFavorites = favorites.filter((item) => item._id !== itemId);
    localStorage.setItem("marvelFavorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  // 🔍 Séparer personnages et comics (si thumbnail contient "image_not_available" = comic dans certaines données)
  const characters = favorites.filter((item) => item.title === undefined);
  const comics = favorites.filter((item) => item.title !== undefined);

  const renderItems = (items) => {
    return items.map((item) => (
      <div
        key={item._id}
        style={{
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <img
          src={item.thumbnail?.path + "." + item.thumbnail?.extension}
          alt={item.name || item.title}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
          }
        />
        <h3 style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
          {item.name || item.title}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
          {item.description || "Aucune description."}
        </p>
        <button
          onClick={() => removeFavorite(item._id)}
          style={{
            marginTop: "0.5rem",
            padding: "0.3rem 0.6rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ⭐ Retirer
        </button>
      </div>
    ));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>⭐ Vos favoris</h2>

      {favorites.length === 0 ? (
        <p>Vous n’avez encore ajouté aucun favori.</p>
      ) : (
        <>
          {characters.length > 0 && (
            <>
              <h3>🦸‍♂️ Personnages</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "2rem",
                  marginBottom: "3rem",
                }}
              >
                {renderItems(characters)}
              </div>
            </>
          )}

          {comics.length > 0 && (
            <>
              <h3>📚 Comics</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "2rem",
                }}
              >
                {renderItems(comics)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;

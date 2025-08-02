import { useEffect, useState } from "react";
import "../components/cards.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem("marvelFavorites");
    const parsed = stored ? JSON.parse(stored) : [];
    setFavorites(parsed);
  };

  const removeFavorite = (itemId) => {
    const updatedFavorites = favorites.filter((item) => item._id !== itemId);
    localStorage.setItem("marvelFavorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const characters = favorites.filter((item) => item.title === undefined);
  const comics = favorites.filter((item) => item.title !== undefined);

  const renderItems = (items) => {
    return items.map((item) => (
      <div key={item._id} className="card">
        <img
          src={item.thumbnail?.path + "." + item.thumbnail?.extension}
          alt={item.name || item.title}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/200x200.png?text=Image+Not+Found")
          }
        />
        <h3>{item.name || item.title}</h3>
        <p>{item.description || "Aucune description."}</p>
        <button onClick={() => removeFavorite(item._id)}>⭐ Retirer</button>
      </div>
    ));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vos favoris</h2>

      {favorites.length === 0 ? (
        <p>Vous n’avez encore ajouté aucun favori.</p>
      ) : (
        <>
          {characters.length > 0 && (
            <>
              <h3>Vos Personnages</h3>
              <div className="grid-container">{renderItems(characters)}</div>
            </>
          )}

          {comics.length > 0 && (
            <>
              <h3>Comics</h3>
              <div className="grid-container">{renderItems(comics)}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;

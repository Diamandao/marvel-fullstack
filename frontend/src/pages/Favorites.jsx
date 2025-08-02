import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/cards.css";

const Favorites = () => {
  const [characterFavorites, setCharacterFavorites] = useState([]);
  const [comicFavorites, setComicFavorites] = useState([]);

  // Charger les favoris au montage
  useEffect(() => {
    try {
      const storedCharacters =
        JSON.parse(localStorage.getItem("marvelFavoritesCharacters")) || [];
      const storedComics =
        JSON.parse(localStorage.getItem("marvelFavoritesComics")) || [];
      setCharacterFavorites(storedCharacters);
      setComicFavorites(storedComics);
    } catch (e) {
      console.error("Erreur lors du chargement des favoris :", e);
      toast.error("Erreur de chargement des favoris");
    }
  }, []);

  // Supprimer un personnage
  const removeCharacter = (id) => {
    const updated = characterFavorites.filter((item) => item._id !== id);
    setCharacterFavorites(updated);
    localStorage.setItem("marvelFavoritesCharacters", JSON.stringify(updated));
    toast.info("Personnage retiré des favoris");
  };

  // Supprimer un comic
  const removeComic = (id) => {
    const updated = comicFavorites.filter((item) => item._id !== id);
    setComicFavorites(updated);
    localStorage.setItem("marvelFavoritesComics", JSON.stringify(updated));
    toast.info("Comic retiré des favoris");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#E62429" }}>Vos Favoris Marvel</h1>

      {/* Personnages favoris */}
      <h2>Personnages favoris</h2>
      {characterFavorites.length === 0 ? (
        <p>Aucun personnage favori.</p>
      ) : (
        <div className="grid-container">
          {characterFavorites.map((char) => (
            <div key={char._id} className="card">
              <Link
                to={`/character/${char._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={`${char.thumbnail?.path}.${char.thumbnail?.extension}`}
                  alt={char.name}
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/200x200.png?text=Image+Non+dispo")
                  }
                />
                <h3>{char.name}</h3>
                <p>{char.description || "Aucune description."}</p>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeCharacter(char._id);
                }}
              >
                ❌ Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comics favoris */}
      <h2 style={{ marginTop: "3rem" }}>Comics favoris</h2>
      {comicFavorites.length === 0 ? (
        <p>Aucun comic favori.</p>
      ) : (
        <div className="grid-container">
          {comicFavorites.map((comic) => (
            <div key={comic._id} className="card">
              <img
                src={`${comic.thumbnail?.path}.${comic.thumbnail?.extension}`}
                alt={comic.title}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/200x200.png?text=Image+Non+dispo")
                }
              />
              <h3>{comic.title}</h3>
              <p>{comic.description || "Aucune description."}</p>
              <button onClick={() => removeComic(comic._id)}>❌ Retirer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

import { Link } from "react-router-dom";

const Card = ({
  id,
  title,
  description,
  image,
  linkTo,
  isFavorite,
  onFavoriteClick,
}) => {
  const imageUrl =
    image?.path && image?.extension
      ? `${image.path}.${image.extension}`
      : "https://via.placeholder.com/300x450?text=Image+Not+Found";

  return (
    <div className="card">
      <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={imageUrl} alt={title} />
        <h3>{title}</h3>
      </Link>

      <p>{description || "Aucune description."}</p>

      <button onClick={onFavoriteClick}>
        {isFavorite ? "⭐ Retirer" : "☆ Favori"}
      </button>
    </div>
  );
};

export default Card;

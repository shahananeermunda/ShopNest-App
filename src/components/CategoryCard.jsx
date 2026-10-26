import { Link } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ name, image, path }) {
  return (
    <Link to={path} className="category-card">
      <img src={image} alt={name} />

      <div className="category-overlay">
        <h3>{name}</h3>
        <span>Explore Collection →</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
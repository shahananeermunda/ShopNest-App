import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const originalPrice = Number(product.originalPrice);
  const currentPrice = Number(product.currentPrice);

  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-details-link"
      >
        <div className="product-image">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
          />

          {product.badge?.toLowerCase() === "sale" && (
            <span className="sale-badge">SALE</span>
          )}

          {product.badge?.toLowerCase() === "new" && (
            <span className="new-badge">NEW</span>
          )}
        </div>

        <div className="product-info">
          <small>{product.category}</small>

          <h3>{product.title}</h3>

          <div className="product-rating">
            <span className="stars">
              {Array.from({ length: 5 }, (_, index) => {
                const rating = product.rating || 4.5;

                return (
                  <span
                    key={index}
                    className={
                      rating >= index + 1
                        ? "star full"
                        : rating >= index + 0.5
                        ? "star half"
                        : "star empty"
                    }
                  >
                    ★
                  </span>
                );
              })}
            </span>

            <span className="rating-number">
              {product.rating || 4.5}
            </span>
          </div>

          <div className="price">
            {Number.isFinite(originalPrice) &&
              Number.isFinite(currentPrice) &&
              originalPrice > currentPrice && (
                <span className="old-price">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}

            {Number.isFinite(currentPrice) && (
              <strong>
                ₹{currentPrice.toLocaleString("en-IN")}
              </strong>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="add-cart"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </article>
  );
}

export default ProductCard;

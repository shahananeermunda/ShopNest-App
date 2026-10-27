import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">
        {/* 404 Illustration */}
        <div className="not-found-illustration" aria-hidden="true">
          <span className="not-found-number">4</span>

          <div className="not-found-bag">
            <i className="bi bi-bag-heart-fill"></i>
          </div>

          <span className="not-found-number">4</span>
        </div>

        {/* Page Content */}
        <p className="not-found-eyebrow">
          OOPS! PAGE NOT FOUND
        </p>

        <h1>Looks like you're lost</h1>

        <p className="not-found-description">
          The page you're looking for may have been moved,
          removed, or doesn't exist. Let's get you back to shopping.
        </p>

        {/* Navigation Actions */}
        <div className="not-found-actions">
          <Link to="/" className="not-found-home-btn">
            <i className="bi bi-house-door"></i>
            Back to Home
          </Link>

          <Link to="/products" className="not-found-products-btn">
            Explore Products
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="not-found-footer">
          <i className="bi bi-bag-heart"></i>
          <span>ShopNest</span>
          <span className="not-found-divider">|</span>
          <span>Your style, your story.</span>
        </div>
      </div>
    </main>
  );
}

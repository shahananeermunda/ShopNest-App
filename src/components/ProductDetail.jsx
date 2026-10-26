
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Check,
} from "lucide-react";

import useFetch from "../Hooks/useFetch";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    data: products = [],
    loading,
    error,
  } = useFetch("/products.json");

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  if (loading) {
    return (
      <main className="product-details-state">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details-state">
        <h2>Unable to load product</h2>
        <p>Please try again later.</p>
        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </main>
    );
  }

  const product = Array.isArray(products)
    ? products.find((item) => String(item.id) === String(id))
    : null;

  if (!product) {
    return (
      <main className="product-details-state">
        <h2>Product not found</h2>
        <p>The product may have been removed or the link is incorrect.</p>
        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </main>
    );
  }

  const name = product.title || product.name || "ShopNest Product";

  const image =
    product.thumbnail ||
    product.image ||
    (Array.isArray(product.images)
      ? product.images[0]
      : product.images) ||
    "/placeholder.png";

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;
  const rating = Number(product.rating) || 0;
  const category = String(product.category || "").toLowerCase();

  const isFootwear =
    category.includes("footwear") ||
    category.includes("shoe") ||
    category.includes("sneaker") ||
    category.includes("sandal");

  const hasSizes =
    isFootwear ||
    category.includes("clothing") ||
    category.includes("fashion") ||
    category.includes("apparel");

  const sizes = isFootwear
    ? ["6", "7", "8", "9", "10", "11"]
    : ["S", "M", "L", "XL", "XXL"];

  const defaultSize = isFootwear ? "6" : "M";

  const activeSize = sizes.includes(selectedSize)
    ? selectedSize
    : defaultSize;

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  function handleAddToCart() {
    const cartProduct = {
      ...product,
      name,
      image,
      price,
      quantity,
      ...(hasSizes ? { size: activeSize } : {}),
    };

    addToCart(cartProduct);
    setMessage("Added to cart successfully!");
  }

  return (
    <main className="shopnest-product-page">
      <div className="product-breadcrumb">
        <button
          type="button"
          className="product-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{name}</span>
      </div>

      <section className="shopnest-product-details">
        <div className="product-gallery">
          <div className="product-image-frame">
            {discount > 0 && (
              <span className="product-discount-badge">
                {discount}% OFF
              </span>
            )}

            <img
              src={image}
              alt={name}
              className="product-main-image"
            />
          </div>

          <div className="product-image-caption">
            <ShieldCheck size={17} />
            <span>Quality you can trust</span>
          </div>
        </div>

        <div className="product-information">
          <p className="product-brand">
            <ShoppingBag size={15} />
            SHOPNEST COLLECTION
          </p>

          <p className="product-category">
            {product.category || "Featured Product"}
          </p>

          <h1 className="product-detail-title">{name}</h1>

          {rating > 0 && (
            <div className="product-rating">
              <span className="rating-star">
                <Star size={16} fill="currentColor" />
              </span>

              <strong>{rating.toFixed(1)}</strong>

              <span className="rating-label">
                Customer rating
              </span>
            </div>
          )}

          <div className="product-price-section">
            <span className="product-current-price">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {originalPrice > price && (
              <>
                <span className="product-original-price">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>

                <span className="product-savings">
                  Save ₹
                  {(originalPrice - price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          <p className="product-tax-note">
            Inclusive of applicable taxes
          </p>

          <div className="product-detail-divider" />

          <div className="product-description">
            <h3>Product Description</h3>

            <p>
              {product.description ||
                `Discover ${name} at ShopNest. A stylish and practical addition to your collection, selected to bring quality and everyday comfort to your shopping experience.`}
            </p>
          </div>

          {hasSizes && (
            <div className="product-size-section">
              <div className="product-option-heading">
                <h3>Select Size</h3>
                <span>{activeSize}</span>
              </div>

              <div className="product-size-options">
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={
                      activeSize === size
                        ? "product-size selected"
                        : "product-size"
                    }
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage("");
                    }}
                    aria-pressed={activeSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-quantity-section">
            <h3>Quantity</h3>

            <div className="product-quantity-control">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= 5}
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(5, current + 1)
                  )
                }
              >
                <Plus size={16} />
              </button>
            </div>

            <p className="product-quantity-note">
              Maximum 5 per selection
            </p>
          </div>

          <button
            type="button"
            className="product-add-to-cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={19} />
            ADD TO CART
          </button>

          {message && (
            <p
              className={`product-cart-message ${
                message.startsWith("Unable")
                  ? "product-cart-error"
                  : ""
              }`}
              role="status"
            >
              {!message.startsWith("Unable") && (
                <Check size={17} />
              )}
              {message}
            </p>
          )}

          <div className="product-additional-details">
            <details>
              <summary>Product Details</summary>
              <p>Product: {name}</p>
              <p>Category: {product.category || "General"}</p>
              <p>Product ID: {product.id}</p>
            </details>

            <details>
              <summary>Care and Information</summary>
              <p>
                Please refer to the product description and label
                for specific usage or care instructions.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;

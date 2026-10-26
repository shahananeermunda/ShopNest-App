
import "./Home.css";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import { useCart } from "../context/CartContext";

function Home() {
  const { addToCart } = useCart();
  const {
    data: products,
    loading,
    error,
  } = useFetch("/products.json");

  // Four categories with images from your own products.json
  const categoryNames = [
    {
      name: "Electronics",
      slug: "electronics",
      path: "/products?category=electronics",
    },
    {
      name: "Clothing",
      slug: "clothing",
      path: "/products?category=clothing",
    },
    {
      name: "Footwear",
      slug: "footwear",
      path: "/products?category=footwear",
    },
    {
      name: "Books",
      slug: "books",
      path: "/products?category=books",
    },
  ];

  // Find one product image for each category
  const categories = categoryNames.map((category) => {
    const product = products.find(
      (item) => item.category === category.slug
    );

    return {
      ...category,
      image: product?.thumbnail || "",
    };
  });

  const featuredProducts = [
  ...new Set(
    categoryNames.map((category) =>
      products.find(
        (product) =>
          product.category === category.slug &&
          product.badge?.toLowerCase() === "new"
      )
    )
  ),
].filter(Boolean);

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <p className="hero-small">
              WELCOME TO SHOPNEST
            </p>

            <h1>
              Shop Smart.
              <br />
              Live Better.
            </h1>

            <p className="hero-text">
              Discover quality products, amazing deals and
              everything you need — all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="primary-btn">
                Shop Now <i className="bi bi-arrow-right"></i>
              </Link>

              <a href="#deals" className="secondary-btn">
                Explore Deals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-truck"></i>
              </div>
              <div>
                <h4>Free Delivery</h4>
                <p>On orders above ₹999</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure transactions</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <div>
                <h4>Easy Returns</h4>
                <p>7-day return policy</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section
        id="categories-section"
        className="categories-section"
      >
        <div className="container">

          <div className="section-heading">
            <p>EXPLORE OUR COLLECTIONS</p>
            <h2>Shop by Category</h2>
            <span>
              Find your favourites across our four collections.
            </span>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                image={category.image}
                path={category.path}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">

          <div className="section-heading">
            <p>HANDPICKED FOR YOU</p>
            <h2>Featured Products</h2>
            <span>
              A few favourites from all four categories.
            </span>
          </div>

          {loading && (
            <p className="loading-message">
              Loading products...
            </p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="error-message">
              No products found.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className="featured-actions">
            <Link to="/products" className="primary-btn">
              Explore All Products
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

        </div>
      </section>

      {/* Deals Section */}
      <section className="deal-section" id="deals">
        <div className="container">
          <div className="deal-content">
            <div>
              <p>LIMITED TIME OFFER</p>
              <h2>Discover Great Deals</h2>
              <span>
                Explore our collections and find something you love.
              </span>
            </div>

            <Link to="/products" className="deal-button">
              Shop Now <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
     
{/* CUSTOMER EXPERIENCE / REVIEWS */}
<section className="reviews-section">
  <div className="container">
    <div className="section-heading">
      <p>CUSTOMER EXPERIENCE</p>
      <h2>Loved by Our Shoppers</h2>
      <span>Real feedback that makes shopping feel better.</span>
    </div>

    <div className="reviews-summary">
      {/* Overall Rating */}
      <div className="rating-score">
        <strong>4.8</strong>

        <div className="stars" aria-label="5 out of 5 stars">
          ★★★★★
        </div>

        <span>Based on 1,240+ happy shoppers</span>
      </div>

      {/* Rating Breakdown */}
      <div className="rating-bars">
        <div>
          <span>5 ★</span>
          <div className="bar">
            <i style={{ width: "86%" }} />
          </div>
          <strong>86%</strong>
        </div>

        <div>
          <span>4 ★</span>
          <div className="bar">
            <i style={{ width: "10%" }} />
          </div>
          <strong>10%</strong>
        </div>

        <div>
          <span>3 ★</span>
          <div className="bar">
            <i style={{ width: "3%" }} />
          </div>
          <strong>3%</strong>
        </div>

        <div>
          <span>2 ★</span>
          <div className="bar">
            <i style={{ width: "1%" }} />
          </div>
          <strong>1%</strong>
        </div>

        <div>
          <span>1 ★</span>
          <div className="bar">
            <i style={{ width: "0%" }} />
          </div>
          <strong>0%</strong>
        </div>
      </div>
    </div>

    {/* Customer Review Cards */}
    <div className="reviews-grid">
      <article className="review-card">
        <div className="review-stars" aria-label="5 out of 5 stars">
          ★★★★★
        </div>

        <p>
          “The site is smooth, easy to search, and the cart
          remembers my items even after I come back.”
        </p>

        <div className="review-user">
          <span>AN</span>
          <div>
            <strong>Ananya N.</strong>
            <small>Verified shopper</small>
          </div>
        </div>
      </article>

      <article className="review-card">
        <div className="review-stars" aria-label="5 out of 5 stars">
          ★★★★★
        </div>

        <p>
          “Clean layout, useful filters, and I found what
          I wanted in seconds. Checkout-style cart feels
          very intuitive.”
        </p>

        <div className="review-user">
          <span>RK</span>
          <div>
            <strong>Rahul K.</strong>
            <small>Verified shopper</small>
          </div>
        </div>
      </article>

      <article className="review-card">
        <div className="review-stars" aria-label="4 out of 5 stars">
          ★★★★☆
        </div>

        <p>
          “Product cards are clear and the running total
          makes it easy to keep track of my budget.”
        </p>

        <div className="review-user">
          <span>MS</span>
          <div>
            <strong>Meera S.</strong>
            <small>Verified shopper</small>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

    </main>
  );
}

export default Home;

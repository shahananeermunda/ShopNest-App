
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

import useFetch from "../Hooks/useFetch";
import useWindowSize from "../Hooks/useWindowSize";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useCart();

  const { width } = useWindowSize();
  const isMobile = width < 768;
  const navigate = useNavigate();

  // Fetch products from the JSON file
  const { data: products = [] } = useFetch("/products.json");

  // Close the mobile menu on desktop
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (!event.target.closest(".search-wrapper")) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Find up to 5 matching products
  const suggestions = searchText.trim()
    ? products
        .filter((product) => {
          const query = searchText.trim().toLowerCase();

          return [
            product.title,
            product.name,
            product.category,
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(query)
          );
        })
        .slice(0, 5)
    : [];

  // Update search input while typing
  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setSearchOpen(true);
  }

  // Submit a normal search
  function handleSearch(event) {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    setSearchOpen(false);
    setMenuOpen(false);

    navigate(`/products?search=${encodeURIComponent(query)}`);
  }

  // Open only the selected product
  function handleSuggestionClick() {
    setSearchText("");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <i className="bi bi-bag-heart-fill brand-icon"></i>
        <span>ShopNest</span>
      </Link>

      {/* Navigation links */}
      <div
        className={`nav-link ${
          isMobile ? "mobile-menu" : ""
        } ${menuOpen ? "nav-link-open" : ""}`}
      >
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/contact"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Search and cart */}
      <div className="nav-icons">
        {/* Mobile search button */}
        {isMobile && (
          <button
            type="button"
            className="icon-btn search-icon"
            aria-label="Open search"
            onClick={() => setSearchOpen((previous) => !previous)}
          >
            {searchOpen ? <X /> : <Search />}
          </button>
        )}

        {/* Search input and suggestions */}
        {(!isMobile || searchOpen) && (
          <div className="search-wrapper">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                autoComplete="off"
                value={searchText}
                onFocus={() => setSearchOpen(true)}
                onChange={handleSearchChange}
              />

              <button type="submit" aria-label="Search">
                <Search size={20} />
              </button>
            </form>

            {searchOpen && searchText.trim() && (
              <div className="search-suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((product) => {
                    const productName =
                      product.title || product.name || "Product";

                    const productImage =
                      product.thumbnail ||
                      product.image ||
                      (Array.isArray(product.images)
                        ? product.images[0]
                        : product.images) ||
                      "/placeholder.png";

                    return (
                      <Link
                        to={`/products?productId=${encodeURIComponent(
                          product.id
                        )}`}
                        className="search-suggestion"
                        key={product.id}
                        onClick={handleSuggestionClick}
                      >
                        <img src={productImage} alt={productName} />

                        <span>{productName}</span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="no-suggestions">
                    No matching products
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cart */}
       <Link to="/cart" className="icon-btn" aria-label={`Shopping cart, ${cartCount} items`}>
  <ShoppingCart />
  {cartCount > 0 && (
    <span className="cart-badge">{cartCount}</span>
  )}
</Link>
      </div>

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          type="button"
          className="Hamburger"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      )}
    </nav>
  );
}


import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import "./products.css";

// Constant for displaying all product categories.
const ALL_CATEGORIES = "All Categories";

// Convert the first letter of a value to uppercase.
function toLabel(value) {
  const text = String(value ?? "").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Available price range filter options.
const priceOptions = [
  { value: "all", label: "All prices" },
  { value: "under500", label: "Under ₹500" },
  { value: "500to1000", label: "₹500 - ₹1,000" },
  { value: "1000to2000", label: "₹1,000 - ₹2,000" },
  { value: "above2000", label: "Above ₹2,000" },
];

// Available minimum customer rating filter options.
const ratingOptions = [
  { value: "all", label: "All ratings" },
  { value: "4", label: "★★★★☆ 4 stars & above" },
  { value: "3", label: "★★★☆☆ 3 stars & above" },
  { value: "2", label: "★★☆☆☆ 2 stars & above" },
];

// Convert values to lowercase and remove extra spaces.
function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function Products() {
  // Fetch products from the public/products.json file.
  const {
    data: fetchedProducts,
    loading,
    error,
  } = useFetch("/products.json");

  // Ensure products is always an array.
  const products = Array.isArray(fetchedProducts)
    ? fetchedProducts
    : [];

  // ----------------------------------------
  // DYNAMIC CATEGORY LIST
  // ----------------------------------------

  const categories = useMemo(() => {
    const firstSeen = new Map();

    products.forEach((product, index) => {
      const key = normalize(product.category);

      if (!key) return;

      const id = Number(product.id);
      const order = Number.isFinite(id) ? id : 1e9 + index;

      if (!firstSeen.has(key) || order < firstSeen.get(key)) {
        firstSeen.set(key, order);
      }
    });

    return [...firstSeen.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([key]) => toLabel(key));
  }, [products]);

  // ----------------------------------------
  // URL SEARCH PARAMETERS
  // ----------------------------------------

  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = (searchParams.get("search") || "").trim();

  const selectedProductId = searchParams.get("productId");

  // Read category from URL.
  const categoryFromURL = searchParams.get("category");

  // ----------------------------------------
  // FILTER AND UI STATES
  // ----------------------------------------

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL
      ? toLabel(categoryFromURL)
      : ALL_CATEGORIES
  );

  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  const [saleOnly, setSaleOnly] = useState(false);

  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [showSubcategories, setShowSubcategories] = useState(true);
  const [showPrice, setShowPrice] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const [showFiltersOnMobile, setShowFiltersOnMobile] =
    useState(false);

  const productsPerPage = 4;

  // ----------------------------------------
  // SYNC CATEGORY WITH URL
  // ----------------------------------------

  useEffect(() => {
    const category = searchParams.get("category");

    if (category) {
      setSelectedCategory(toLabel(category));
    } else {
      setSelectedCategory(ALL_CATEGORIES);
    }

    setSelectedSubcategory("");
  }, [searchParams]);

  // ----------------------------------------
  // DYNAMIC SUBCATEGORY LIST
  // ----------------------------------------

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) return [];

    const names = new Set();

    products.forEach((product) => {
      if (normalize(product.category) !== normalize(selectedCategory)) {
        return;
      }

      const name = String(product.subcategory ?? "").trim();

      if (name) names.add(name);
    });

    return [...names]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name }));
  }, [products, selectedCategory]);

  // ----------------------------------------
  // FILTERING AND SORTING PRODUCTS
  // ----------------------------------------

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {

      // If a product ID exists in the URL, show only that product.
      if (selectedProductId !== null) {
        return String(product.id) === selectedProductId;
      }

      // Search by product name, category, or subcategory.
      const productName = product.title || product.name || "";

      const matchesSearch = [
        productName,
        product.category,
        product.subcategory,
      ].some((value) =>
        normalize(value).includes(normalize(searchText))
      );

      if (!matchesSearch) return false;

      // Filter by selected category.
      if (
        selectedCategory !== ALL_CATEGORIES &&
        normalize(product.category) !== normalize(selectedCategory)
      ) {
        return false;
      }

      // Filter by selected subcategory.
      if (
        selectedSubcategory &&
        normalize(product.subcategory) !== normalize(selectedSubcategory)
      ) {
        return false;
      }

      // Read product price.
      const price = Number(product.price) || 0;

      // Filter products under ₹500.
      if (priceRange === "under500" && price >= 500) {
        return false;
      }

      // Filter products between ₹500 and ₹1,000.
      if (
        priceRange === "500to1000" &&
        (price < 500 || price > 1000)
      ) {
        return false;
      }

      // Filter products between ₹1,000 and ₹2,000.
      if (
        priceRange === "1000to2000" &&
        (price <= 1000 || price > 2000)
      ) {
        return false;
      }

      // Filter products above ₹2,000.
      if (priceRange === "above2000" && price <= 2000) {
        return false;
      }

      // Filter by minimum customer rating.
      if (
        minRating !== "all" &&
        (Number(product.rating) || 0) < Number(minRating)
      ) {
        return false;
      }

      // Show only sale products.
      if (
        saleOnly &&
        normalize(product.badge) !== "sale" &&
        !(Number(product.originalPrice) > Number(product.price))
      ) {
        return false;
      }

      return true;
    });

    // Create a copy before sorting.
    result = [...result];

    // Sort by price: low to high.
    if (sortBy === "priceLow") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    // Sort by price: high to low.
    else if (sortBy === "priceHigh") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // Sort by highest rating.
    else if (sortBy === "rating") {
      result.sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
      );
    }

    // Sort alphabetically.
    else if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.title || a.name || "").localeCompare(
          String(b.title || b.name || "")
        )
      );
    }

    return result;
  }, [
    products,
    searchText,
    selectedProductId,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    minRating,
    saleOnly,
    sortBy,
  ]);

  // ----------------------------------------
  // PAGINATION
  // ----------------------------------------

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // ----------------------------------------
  // RESET PAGINATION WHEN FILTERS CHANGE
  // ----------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    selectedProductId,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    minRating,
    saleOnly,
    sortBy,
  ]);

  // ----------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------

  // Change category and clear subcategory.
  function changeCategory(category) {
    setSelectedCategory(category);
    setSelectedSubcategory("");

    const nextParams = new URLSearchParams(searchParams);

    if (category === ALL_CATEGORIES) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category.toLowerCase());
    }

    setSearchParams(nextParams);
  }

  // Reset all filters.
  function clearFilters() {
    setSelectedCategory(ALL_CATEGORIES);
    setSelectedSubcategory("");
    setPriceRange("all");
    setMinRating("all");
    setSaleOnly(false);
    setSortBy("featured");
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("category");

    setSearchParams(nextParams);
  }

  // Remove search and product ID parameters.
  function clearSearch() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");
    nextParams.delete("productId");

    setSearchParams(nextParams);
  }

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  if (loading) {
    return (
      <main className="products-page">
        <p className="products-message">Loading products...</p>
      </main>
    );
  }

  // ----------------------------------------
  // ERROR STATE
  // ----------------------------------------

  if (error) {
    return (
      <main className="products-page">
        <div className="products-message">
          <h2>Unable to load products</h2>
          <p>Please try again later.</p>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // MAIN PRODUCTS PAGE
  // ----------------------------------------

  return (
    <main className="products-page">
      <div className="products-container">

        {/* Collection heading */}
        <header className="shop-collection-header">
          <p className="products-eyebrow">OUR COLLECTION</p>
          <h1>Featured Products</h1>
          <p>Discover products selected specially for you.</p>
        </header>

        {/* Category buttons */}
        <div
          className="category-pills"
          role="group"
          aria-label="Product categories"
        >
          {[ALL_CATEGORIES, ...categories].map((category) => (
            <button
              type="button"
              key={category}
              className={`category-pill ${
                selectedCategory === category ? "active" : ""
              }`}
              aria-pressed={selectedCategory === category}
              onClick={() => changeCategory(category)}
            >
              {category === ALL_CATEGORIES ? "All" : category}
            </button>
          ))}
        </div>

        {/* Search results heading */}
        {searchText && (
          <div className="search-results-heading">
            <div>
              <h2>Search Results</h2>
              <p>
                Showing results for <strong>“{searchText}”</strong>
              </p>
            </div>

            <button type="button" onClick={clearSearch}>
              Clear Search ×
            </button>
          </div>
        )}

        {/* Selected product heading */}
        {selectedProductId !== null && (
          <div className="search-results-heading">
            <div>
              <h2>Selected Product</h2>
              <p>Showing the product you selected.</p>
            </div>

            <button type="button" onClick={clearSearch}>
              View All Products
            </button>
          </div>
        )}

        {/* Collection toolbar */}
        <div className="products-collection-toolbar">
          <div>
            <h2>
              {selectedSubcategory ||
                (selectedCategory === ALL_CATEGORIES
                  ? "Explore Our Collection"
                  : `${selectedCategory} Collection`)}
            </h2>

            <p>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} to
              explore
            </p>
          </div>

          {/* Sorting dropdown */}
          <label className="products-sort">
            <span>Sort by:</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {/* Main products layout */}
        <div className="products-layout">

          {/* Filter sidebar */}
          <aside className="product-filters">

            <div className="filter-heading">
              <h3>Filter Products</h3>

              <button type="button" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button
              type="button"
              className="mobile-filter-toggle"
              aria-expanded={showFiltersOnMobile}
              onClick={() =>
                setShowFiltersOnMobile((value) => !value)
              }
            >
              {showFiltersOnMobile ? "Hide Filters −" : "Show Filters +"}
            </button>

            <div
              className={`filter-content ${
                showFiltersOnMobile ? "filter-content-open" : ""
              }`}
            >

              {/* Subcategory filter */}
              {selectedCategory !== ALL_CATEGORIES && (
                <section className="filter-group">

                  <button
                    type="button"
                    className="filter-toggle"
                    aria-expanded={showSubcategories}
                    onClick={() =>
                      setShowSubcategories((value) => !value)
                    }
                  >
                    <span>Subcategories</span>

                    <span className="filter-toggle-icon">
                      {showSubcategories ? "−" : "+"}
                    </span>
                  </button>

                  {showSubcategories && (
                    <div className="filter-options">

                      <label className="filter-option">
                        <input
                          type="radio"
                          name="shop-subcategory"
                          checked={!selectedSubcategory}
                          onChange={() => setSelectedSubcategory("")}
                        />

                        <span>All {selectedCategory}</span>
                      </label>

                      {availableSubcategories.map((subcategory) => (
                        <label
                          className="filter-option"
                          key={subcategory.name}
                        >
                          <input
                            type="radio"
                            name="shop-subcategory"
                            checked={
                              selectedSubcategory === subcategory.name
                            }
                            onChange={() =>
                              setSelectedSubcategory(subcategory.name)
                            }
                          />

                          <span>{subcategory.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Price range filter */}
              <section className="filter-group">

                <button
                  type="button"
                  className="filter-toggle"
                  aria-expanded={showPrice}
                  onClick={() => setShowPrice((value) => !value)}
                >
                  <span>Price Range</span>

                  <span className="filter-toggle-icon">
                    {showPrice ? "−" : "+"}
                  </span>
                </button>

                {showPrice && (
                  <div className="filter-options">
                    {priceOptions.map((option) => (
                      <label className="filter-option" key={option.value}>
                        <input
                          type="radio"
                          name="shop-price"
                          checked={priceRange === option.value}
                          onChange={() => setPriceRange(option.value)}
                        />

                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Customer rating filter */}
              <section className="filter-group">

                <button
                  type="button"
                  className="filter-toggle"
                  aria-expanded={showRating}
                  onClick={() => setShowRating((value) => !value)}
                >
                  <span>Customer Rating</span>

                  <span className="filter-toggle-icon">
                    {showRating ? "−" : "+"}
                  </span>
                </button>

                {showRating && (
                  <div className="filter-options">
                    {ratingOptions.map((option) => (
                      <label className="filter-option" key={option.value}>
                        <input
                          type="radio"
                          name="shop-rating"
                          checked={minRating === option.value}
                          onChange={() => setMinRating(option.value)}
                        />

                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Sale filter */}
              <section className="filter-group">
                <label className="filter-option filter-sale">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(event) =>
                      setSaleOnly(event.target.checked)
                    }
                  />

                  <span>Sale items only</span>
                </label>
              </section>
            </div>
          </aside>

          {/* Product results */}
          <section className="products-results">

            <div className="results-toolbar">
              <span>
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
              </span>
            </div>

            {currentProducts.length > 0 ? (
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="empty-bag">⌕</div>

                <h2>No products found</h2>

                <p>
                  We couldn't find products matching your search or filters.
                  Try changing your selection.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    clearSearch();
                  }}
                >
                  View All Products
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="products-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Products;

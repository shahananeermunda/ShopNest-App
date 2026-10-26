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
// Used to compare product names, categories, and subcategories.
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

  // Build the category list from the fetched product data.
  // Categories are ordered according to their lowest product ID.
  const categories = useMemo(() => {
    const firstSeen = new Map();

    products.forEach((product, index) => {
      const key = normalize(product.category);

      // Ignore products without a category.
      if (!key) return;

      // Use the product ID to determine category order.
      const id = Number(product.id);
      const order = Number.isFinite(id) ? id : 1e9 + index;

      // Store the smallest ID found for each category.
      if (!firstSeen.has(key) || order < firstSeen.get(key)) {
        firstSeen.set(key, order);
      }
    });

    // Sort categories and convert them into display labels.
    return [...firstSeen.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([key]) => toLabel(key));
  }, [products]);

  // ----------------------------------------
  // URL SEARCH PARAMETERS
  // ----------------------------------------

  // Read and update search parameters in the URL.
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the search keyword from the URL.
  const searchText = (searchParams.get("search") || "").trim();

  // Read a specific product ID from the URL, if provided.
  const selectedProductId = searchParams.get("productId");

  // ----------------------------------------
  // FILTER AND UI STATES
  // ----------------------------------------

  // Currently selected category and subcategory.
  const [selectedCategory, setSelectedCategory] =
    useState(ALL_CATEGORIES);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Selected price range and minimum rating.
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  // Whether to display only products on sale.
  const [saleOnly, setSaleOnly] = useState(false);

  // Selected product sorting option.
  const [sortBy, setSortBy] = useState("featured");

  // Current pagination page.
  const [currentPage, setCurrentPage] = useState(1);

  // Control whether each filter section is expanded.
  const [showSubcategories, setShowSubcategories] = useState(true);
  const [showPrice, setShowPrice] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Control the filter panel on mobile screens.
  const [showFiltersOnMobile, setShowFiltersOnMobile] =
    useState(false);

  // Number of products displayed on each page.
  const productsPerPage = 4;

  // ----------------------------------------
  // DYNAMIC SUBCATEGORY LIST
  // ----------------------------------------

  // Get subcategories belonging to the selected category.
  const availableSubcategories = useMemo(() => {
    // No subcategory list is needed when all categories are selected.
    if (selectedCategory === ALL_CATEGORIES) return [];

    const names = new Set();

    products.forEach((product) => {
      // Ignore products belonging to other categories.
      if (normalize(product.category) !== normalize(selectedCategory)) {
        return;
      }

      // Add non-empty subcategories without duplicates.
      const name = String(product.subcategory ?? "").trim();
      if (name) names.add(name);
    });

    // Sort subcategories alphabetically.
    return [...names]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name }));
  }, [products, selectedCategory]);

  // ----------------------------------------
  // FILTERING AND SORTING PRODUCTS
  // ----------------------------------------

  // Apply search, category, price, rating, and sale filters.
  // Then sort the filtered products based on the selected option.
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

      // Read the product price as a number.
      const price = Number(product.price) || 0;

      // Filter products under ₹500.
      if (priceRange === "under500" && price >= 500) {
        return false;
      }

      // Filter products priced between ₹500 and ₹1,000.
      if (
        priceRange === "500to1000" &&
        (price < 500 || price > 1000)
      ) {
        return false;
      }

      // Filter products above ₹1,000 and up to ₹2,000.
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

      // Show only products marked as sale items
      // or products whose original price exceeds their current price.
      if (
        saleOnly &&
        normalize(product.badge) !== "sale" &&
        !(Number(product.originalPrice) > Number(product.price))
      ) {
        return false;
      }

      // Include products that pass every active filter.
      return true;
    });

    // Create a copy before sorting so the original array is unchanged.
    result = [...result];

    // Sort products by price from low to high.
    if (sortBy === "priceLow") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    // Sort products by price from high to low.
    else if (sortBy === "priceHigh") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // Sort products by highest rating first.
    else if (sortBy === "rating") {
      result.sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
      );
    }

    // Sort products alphabetically by name.
    else if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.title || a.name || "").localeCompare(
          String(b.title || b.name || "")
        )
      );
    }

    // Return the filtered and sorted products.
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

  // Calculate the total number of pages.
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // Get only the products that belong to the current page.
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // ----------------------------------------
  // RESET PAGINATION WHEN FILTERS CHANGE
  // ----------------------------------------

  // Whenever the search, filters, or sorting changes,
  // return to the first page.
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

  // Change the selected category and clear its subcategory.
  function changeCategory(category) {
    setSelectedCategory(category);
    setSelectedSubcategory("");
  }

  // Reset all category, price, rating, sale, and sorting filters.
  function clearFilters() {
    setSelectedCategory(ALL_CATEGORIES);
    setSelectedSubcategory("");
    setPriceRange("all");
    setMinRating("all");
    setSaleOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  }

  // Remove search and product ID parameters from the URL.
  function clearSearch() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");
    nextParams.delete("productId");

    setSearchParams(nextParams);
  }

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  // Display a message while products are being fetched.
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

  // Display an error message if fetching products fails.
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

        {/* Category buttons generated dynamically from product data */}
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

        {/* Display the current search keyword and provide a clear button */}
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

        {/* Display a message when a specific product ID is selected */}
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

        {/* Collection title, product count, and sorting dropdown */}
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

          {/* Update the sorting order when the user selects an option */}
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

        {/* Main layout containing the filter sidebar and product results */}
        <div className="products-layout">

          {/* Sidebar containing all product filters */}
          <aside className="product-filters">

            {/* Sidebar heading and clear-all button */}
            <div className="filter-heading">
              <h3>Filter Products</h3>

              <button type="button" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Show or hide the filters on mobile devices */}
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

            {/* Filter content becomes visible on mobile when expanded */}
            <div
              className={`filter-content ${
                showFiltersOnMobile ? "filter-content-open" : ""
              }`}
            >

              {/* Subcategory filter appears only when a category is selected */}
              {selectedCategory !== ALL_CATEGORIES && (
                <section className="filter-group">

                  {/* Expand or collapse the subcategory options */}
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

                  {/* Display available subcategories */}
                  {showSubcategories && (
                    <div className="filter-options">

                      {/* Option to show every subcategory in this category */}
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="shop-subcategory"
                          checked={!selectedSubcategory}
                          onChange={() => setSelectedSubcategory("")}
                        />

                        <span>All {selectedCategory}</span>
                      </label>

                      {/* Generate a radio option for each subcategory */}
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

                {/* Expand or collapse price options */}
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

                {/* Display available price ranges */}
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

                {/* Expand or collapse rating options */}
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

                {/* Display available minimum ratings */}
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

              {/* Checkbox to show only products on sale */}
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

          {/* Product results section */}
          <section className="products-results">

            {/* Show how many products are displayed on the current page */}
            <div className="results-toolbar">
              <span>
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
              </span>
            </div>

            {/* Display product cards when matching products exist */}
            {currentProducts.length > 0 ? (
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Display an empty state when no products match the filters.
              <div className="no-products">
                <div className="empty-bag">⌕</div>

                <h2>No products found</h2>

                <p>
                  We couldn't find products matching your search or filters.
                  Try changing your selection.
                </p>

                {/* Reset filters and URL search to show all products again */}
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

            {/* Show pagination only when multiple pages are available */}
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


import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  function getPages() {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, "...", totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  }

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        className="page-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      {getPages().map((page, index) =>
        page === "..." ? (
          <span className="page-dots" key={`dots-${index}`}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={`page-number ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;

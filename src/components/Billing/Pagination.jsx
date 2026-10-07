const Pagination = ({ pagination, onPageChange, disabled = false }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total } = pagination;

  return (
    <div className="bl-pagination">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div>
        <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button
          type="button"
          className="bl-btn bl-btn--ghost bl-btn--sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ExpertCard from "../components/ExpertCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { CATEGORIES } from "../constants/categories.js";
import { fetchExperts } from "../services/api.js";

const PAGE_SIZE = 6;

export default function ExpertListPage() {
  const [experts, setExperts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [category, setCategory] = useState("All");

  const query = useMemo(
    () => ({
      search: submittedSearch,
      category: category === "All" ? "" : category,
      page: pagination.page,
      limit: PAGE_SIZE
    }),
    [submittedSearch, category, pagination.page]
  );

  useEffect(() => {
    let ignore = false;

    async function loadExperts() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchExperts(query);
        if (ignore) {
          return;
        }

        setExperts(data.experts);
        setPagination((current) => ({
          ...current,
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          total: data.pagination.total
        }));
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadExperts();
    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();
    setPagination((current) => ({ ...current, page: 1 }));
    setSubmittedSearch(searchTerm.trim());
  }

  function handleCategoryChange(event) {
    setPagination((current) => ({ ...current, page: 1 }));
    setCategory(event.target.value);
  }

  const hasResults = experts.length > 0;

  return (
    <section className="stack-24">
      <div className="hero surface">
        <div>
          <p className="eyebrow">Expert Listing</p>
          <h2>Find the right expert and book a live session.</h2>
          <p className="muted">
            Search by name, filter by category, and browse the next available slots.
          </p>
        </div>
        <Link to="/my-bookings" className="secondary-button">
          Check my bookings
        </Link>
      </div>

      <form className="surface filter-bar" onSubmit={handleSubmit}>
        <label className="field">
          <span>Search by name</span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Aarav, Sara, Neha..."
          />
        </label>

        <label className="field">
          <span>Category</span>
          <select value={category} onChange={handleCategoryChange}>
            {CATEGORIES.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </label>

        <button className="primary-button" type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div className="surface skeleton-card" key={index} />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Unable to load experts" description={error} />
      ) : hasResults ? (
        <>
          <div className="results-meta muted">
            Showing {experts.length} of {pagination.total} experts
          </div>

          <div className="grid grid-3">
            {experts.map((expert) => (
              <ExpertCard expert={expert} key={expert._id} />
            ))}
          </div>

          <div className="pagination surface">
            <button
              className="secondary-button"
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              className="secondary-button"
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          title="No experts found"
          description="Try another search term or switch the category filter."
        />
      )}
    </section>
  );
}
import { Link } from "react-router-dom";

export default function ExpertCard({ expert }) {
  return (
    <article className="card expert-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">{expert.category}</p>
          <h3>{expert.name}</h3>
        </div>
        <div className="rating-pill">{expert.rating.toFixed(1)}</div>
      </div>

      <p className="muted">{expert.bio}</p>

      <dl className="stats-grid">
        <div>
          <dt>Experience</dt>
          <dd>{expert.experience} yrs</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{expert.rating.toFixed(1)} / 5</dd>
        </div>
      </dl>

      <Link to={`/experts/${expert._id}`} className="secondary-button">
        View details
      </Link>
    </article>
  );
}
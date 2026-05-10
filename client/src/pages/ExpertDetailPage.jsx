import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import { fetchExpertById } from "../services/api.js";
import { getSocket } from "../services/socket.js";

function formatDateLabel(dateValue) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date(`${dateValue}T00:00:00`));
}

export default function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedAvailability = useMemo(
    () => [...availability].sort((left, right) => left.date.localeCompare(right.date)),
    [availability]
  );

  useEffect(() => {
    let ignore = false;

    async function loadExpert() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchExpertById(id);
        if (!ignore) {
          setExpert(data.expert);
          setAvailability(data.availability);
        }
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

    loadExpert();

    const socket = getSocket();
    socket.connect();

    const handleSlotBooked = (payload) => {
      if (String(payload.expertId) === String(id)) {
        loadExpert();
      }
    };

    socket.on("slot-booked", handleSlotBooked);

    return () => {
      ignore = true;
      socket.off("slot-booked", handleSlotBooked);
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return <div className="surface centered">Loading expert details...</div>;
  }

  if (error) {
    return <EmptyState title="Unable to load expert" description={error} />;
  }

  if (!expert) {
    return <EmptyState title="Expert not found" description="The requested expert no longer exists." />;
  }

  return (
    <section className="stack-24">
      <div className="surface detail-header">
        <div>
          <p className="eyebrow">{expert.category}</p>
          <h2>{expert.name}</h2>
          <p className="muted">{expert.bio}</p>
        </div>

        <dl className="stats-grid compact">
          <div>
            <dt>Experience</dt>
            <dd>{expert.experience} years</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{expert.rating.toFixed(1)} / 5</dd>
          </div>
        </dl>
      </div>

      <div className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Availability</p>
            <h3>Available slots grouped by date</h3>
          </div>
          <Link to="/" className="secondary-button">
            Back to experts
          </Link>
        </div>

        <div className="availability-stack">
          {sortedAvailability.map((day) => (
            <article className="availability-day" key={day.date}>
              <div className="availability-day-header">
                <h4>{formatDateLabel(day.date)}</h4>
                <span className="muted">{day.slots.filter((slot) => !slot.booked).length} open slots</span>
              </div>

              <div className="slot-grid">
                {day.slots.map((slot) => (
                  <button
                    className={`slot-button ${slot.booked ? "slot-booked" : ""}`}
                    key={`${day.date}-${slot.timeSlot}`}
                    disabled={slot.booked}
                    type="button"
                    onClick={() => navigate(`/book/${id}?date=${day.date}&slot=${encodeURIComponent(slot.timeSlot)}`)}
                  >
                    <span>{slot.timeSlot}</span>
                    <small>{slot.booked ? "Booked" : "Book now"}</small>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
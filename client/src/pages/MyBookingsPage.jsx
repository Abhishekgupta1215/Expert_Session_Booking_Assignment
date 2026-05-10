import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { fetchBookingsByEmail } from "../services/api.js";

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(true);

    try {
      const data = await fetchBookingsByEmail(email);
      setBookings(data.bookings);
    } catch (submitError) {
      setError(submitError.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack-24">
      <div className="surface hero">
        <div>
          <p className="eyebrow">My bookings</p>
          <h2>Find your scheduled sessions by email.</h2>
          <p className="muted">Track the latest status of each reservation in one place.</p>
        </div>
      </div>

      <form className="surface filter-bar" onSubmit={handleSubmit}>
        <label className="field grow">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter the email used for booking"
          />
        </label>

        <button className="primary-button" type="submit">
          Show bookings
        </button>
      </form>

      {loading ? (
        <div className="surface centered">Loading bookings...</div>
      ) : error ? (
        <EmptyState title="Unable to load bookings" description={error} />
      ) : submitted && bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Use the same email address that was entered during booking."
        />
      ) : bookings.length > 0 ? (
        <div className="grid grid-2">
          {bookings.map((booking) => (
            <article className="surface booking-card" key={booking._id}>
              <div className="card-head">
                <div>
                  <p className="eyebrow">{booking.expertId?.category || "Expert"}</p>
                  <h3>{booking.expertId?.name || "Expert session"}</h3>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="stats-grid compact">
                <div>
                  <dt>Date</dt>
                  <dd>{booking.date}</dd>
                </div>
                <div>
                  <dt>Slot</dt>
                  <dd>{booking.timeSlot}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{booking.phone}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{booking.email}</dd>
                </div>
              </dl>

              {booking.notes ? <p className="muted">{booking.notes}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Search to see bookings"
          description="Enter your email address and submit the form to view your sessions."
        />
      )}
    </section>
  );
}
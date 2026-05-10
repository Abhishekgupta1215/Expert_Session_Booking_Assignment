import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import { createBooking, fetchExpertById } from "../services/api.js";

function makeBookingDateOptions(availability) {
  return [...availability].sort((left, right) => left.date.localeCompare(right.date));
}

export default function BookingPage() {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const [expert, setExpert] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: searchParams.get("date") || "",
    timeSlot: searchParams.get("slot") || "",
    notes: ""
  });

  useEffect(() => {
    let ignore = false;

    async function loadExpert() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchExpertById(expertId);
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
    return () => {
      ignore = true;
    };
  }, [expertId]);

  const dateOptions = useMemo(() => makeBookingDateOptions(availability), [availability]);
  const selectedDay = dateOptions.find((day) => day.date === form.date) ?? null;
  const selectedSlots = selectedDay?.slots ?? [];

  useEffect(() => {
    if (!form.date && dateOptions[0]) {
      setForm((current) => ({ ...current, date: dateOptions[0].date }));
    }
  }, [dateOptions, form.date]);

  useEffect(() => {
    if (form.date && selectedSlots.length && !selectedSlots.some((slot) => slot.timeSlot === form.timeSlot && !slot.booked)) {
      const nextAvailable = selectedSlots.find((slot) => !slot.booked);
      setForm((current) => ({
        ...current,
        timeSlot: nextAvailable?.timeSlot || ""
      }));
    }
  }, [form.date, form.timeSlot, selectedSlots]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date || !form.timeSlot) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      const response = await createBooking({
        expertId,
        ...form
      });

      setSuccessMessage(
        `${response.message || "Booking created successfully."} Your slot is reserved pending confirmation.`
      );
      setForm((current) => ({
        ...current,
        notes: ""
      }));
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  if (loading) {
    return <div className="surface centered">Loading booking form...</div>;
  }

  if (error && !expert) {
    return <EmptyState title="Unable to load booking form" description={error} />;
  }

  if (!expert) {
    return <EmptyState title="Expert not found" description="The booking target is unavailable." />;
  }

  return (
    <section className="stack-24">
      <div className="surface detail-header">
        <div>
          <p className="eyebrow">Book session</p>
          <h2>{expert.name}</h2>
          <p className="muted">Fill in your details to reserve an available slot.</p>
        </div>
        <Link to={`/experts/${expertId}`} className="secondary-button">
          Back to expert
        </Link>
      </div>

      <form className="surface form-grid" onSubmit={handleSubmit}>
        {successMessage ? <div className="notice success">{successMessage}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}

        <label className="field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Your full name"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
          />
        </label>

        <label className="field">
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Mobile number"
          />
        </label>

        <label className="field">
          <span>Date</span>
          <select
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, timeSlot: "" }))}
          >
            <option value="" disabled>
              Choose a date
            </option>
            {dateOptions.map((day) => (
              <option key={day.date} value={day.date}>
                {day.date}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Time Slot</span>
          <select
            value={form.timeSlot}
            onChange={(event) => setForm((current) => ({ ...current, timeSlot: event.target.value }))}
            disabled={!selectedSlots.length}
          >
            <option value="" disabled>
              {selectedSlots.length ? "Choose a slot" : "Select a date first"}
            </option>
            {selectedSlots.map((slot) => (
              <option key={slot.timeSlot} disabled={slot.booked} value={slot.timeSlot}>
                {slot.timeSlot} {slot.booked ? "(Booked)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="field full-width">
          <span>Notes</span>
          <textarea
            rows="4"
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Tell the expert what you want to cover"
          />
        </label>

        <div className="form-actions">
          <Link to={`/experts/${expertId}`} className="secondary-button">
            Cancel
          </Link>
          <button className="primary-button" type="submit">
            Confirm booking
          </button>
        </div>
      </form>
    </section>
  );
}
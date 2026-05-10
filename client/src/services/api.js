const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function fetchExperts(params) {
  return request(`/experts${buildQuery(params)}`);
}

export function fetchExpertById(id) {
  return request(`/experts/${id}`);
}

export function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchBookingsByEmail(email) {
  return request(`/bookings${buildQuery({ email })}`);
}

export function updateBookingStatus(id, status) {
  return request(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export { API_BASE_URL };
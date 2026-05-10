import { NavLink, Route, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage.jsx";
import ExpertDetailPage from "./pages/ExpertDetailPage.jsx";
import ExpertListPage from "./pages/ExpertListPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Real-Time Booking</p>
          <h1>Expert Session Booking</h1>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Experts</NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? "active" : "")}>My Bookings</NavLink>
        </nav>
      </header>
      <main className="page-frame">{children}</main>
    </div>
  );
}

function NotFound() {
  return (
    <section className="surface centered">
      <p className="eyebrow">Not found</p>
      <h2>The page you requested does not exist.</h2>
      <NavLink to="/" className="primary-button">
        Back to experts
      </NavLink>
    </section>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ExpertListPage />} />
        <Route path="/experts/:id" element={<ExpertDetailPage />} />
        <Route path="/book/:expertId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
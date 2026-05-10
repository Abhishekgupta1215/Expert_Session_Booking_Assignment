const STATUS_CLASS_MAP = {
  Pending: "status-pending",
  Confirmed: "status-confirmed",
  Completed: "status-completed"
};

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${STATUS_CLASS_MAP[status] || ""}`}>{status}</span>;
}
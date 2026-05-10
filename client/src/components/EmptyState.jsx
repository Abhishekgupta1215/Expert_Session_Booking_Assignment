export default function EmptyState({ title, description }) {
  return (
    <div className="surface centered empty-state">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}
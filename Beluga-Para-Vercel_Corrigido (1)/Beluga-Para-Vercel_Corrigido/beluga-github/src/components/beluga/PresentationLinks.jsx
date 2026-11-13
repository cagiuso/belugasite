export function RollingLabel({ children }) {
  return (
    <span className="rolling-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

// Button label that rolls up to a fresh copy of itself on hover. The second
// copy is decorative, so screen readers hear the label once.
export default function Roll({ children }: { children: string }) {
  return (
    <span className="fx-roll">
      <span className="fx-roll__a">{children}</span>
      <span className="fx-roll__b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

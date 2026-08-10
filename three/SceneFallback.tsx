/**
 * Static stand-in for the WebGL scene, shown when the visitor has asked for
 * reduced motion at the CSS level, when WebGL is unavailable, and as the
 * Suspense fallback while the scene chunk loads.
 *
 * It is not a loading spinner — it is the same composition rendered flat, so the
 * hero never appears broken or empty.
 */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ground" aria-hidden="true">
      <div className="absolute inset-0 wire-grid" />
      {/* A faint accent horizon, standing in for the grid plane's vanishing point. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, var(--color-accent-veil), transparent 70%)",
        }}
      />
    </div>
  );
}

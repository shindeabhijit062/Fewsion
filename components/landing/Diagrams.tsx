// Static stand-ins for the 3D scene, shown only when 3D is off
// (reduced motion, data saver, no WebGL, very low-power devices).

const NODES = [
  { label: 'Brands', x: 160, y: 46 },
  { label: 'Creators', x: 52, y: 232 },
  { label: 'Editors', x: 268, y: 232 },
];

export function NetworkDiagram({ focus }: { focus?: number }) {
  return (
    <svg className="fx-diagram" viewBox="0 0 320 300" role="presentation">
      <defs>
        <radialGradient id="fx-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb05c" />
          <stop offset="60%" stopColor="#f26a0f" />
          <stop offset="100%" stopColor="#f26a0f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="170" r="122" fill="none" stroke="rgba(255,229,205,0.14)" strokeDasharray="3 6" />
      {NODES.map((n, i) => (
        <line key={n.label} x1="160" y1="170" x2={n.x} y2={n.y} stroke={focus === i ? '#ff8a1f' : 'rgba(255,138,31,0.35)'} strokeWidth={focus === i ? 2 : 1.2} />
      ))}
      <circle cx="160" cy="170" r="44" fill="url(#fx-core)" />
      <text x="160" y="175" textAnchor="middle" className="fx-diagram__core">AI</text>
      {NODES.map((n, i) => (
        <g key={n.label} opacity={focus === undefined || focus === i ? 1 : 0.45}>
          <circle cx={n.x} cy={n.y} r="20" fill="#141a46" stroke="#ff8a1f" strokeWidth={focus === i ? 2.5 : 1.5} />
          <text x={n.x} y={n.y + 40} textAnchor="middle" className="fx-diagram__label">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ShieldDiagram() {
  return (
    <svg className="fx-diagram" viewBox="0 0 320 300" role="presentation">
      {[118, 92, 66].map((r, i) => (
        <circle key={r} cx="160" cy="150" r={r} fill="none" stroke="#ff8a1f" strokeOpacity={0.18 + i * 0.18} strokeDasharray={i === 0 ? '2 6' : undefined} />
      ))}
      <rect x="132" y="138" width="56" height="44" rx="10" fill="#f26a0f" />
      <path d="M144 138v-12a16 16 0 0 1 32 0v12" fill="none" stroke="#f26a0f" strokeWidth="7" strokeLinecap="round" />
      <circle cx="160" cy="158" r="5" fill="#0f1330" />
      <rect x="157.5" y="160" width="5" height="12" rx="2" fill="#0f1330" />
    </svg>
  );
}

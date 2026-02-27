export const Buildings = () => (
  <>
    {/* ===== BUILDINGS LEFT HALF (slide from left) ===== */}
    <g className="anim-buildings-left">
      {/* Building 1 - tall */}
      <rect x="240" y="280" width="60" height="240" rx="3" fill="#a8d4c8" />
      <rect x="240" y="280" width="60" height="8" rx="3" fill="#6FBBF5" opacity="0.6" />
      {/* windows */}
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`bl1-${r}-${c}`}
            x={252 + c * 22}
            y={296 + r * 36}
            width="14"
            height="20"
            rx="2"
            fill="#E2F1F4"
            opacity="0.7"
          />
        ))
      )}

      {/* Building 2 - shorter */}
      <rect x="310" y="340" width="50" height="180" rx="3" fill="#b0d8cc" />
      <rect x="310" y="340" width="50" height="8" rx="3" fill="#2FFFA8" opacity="0.5" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`bl2-${r}-${c}`}
            x={320 + c * 18}
            y={356 + r * 38}
            width="10"
            height="18"
            rx="2"
            fill="#E2F1F4"
            opacity="0.65"
          />
        ))
      )}

      {/* Building 3 - medium */}
      <rect x="370" y="310" width="55" height="210" rx="3" fill="#9cc8be" />
      <rect x="370" y="310" width="55" height="8" rx="3" fill="#6FBBF5" opacity="0.5" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`bl3-${r}-${c}`}
            x={382 + c * 20}
            y={326 + r * 36}
            width="12"
            height="18"
            rx="2"
            fill="#E2F1F4"
            opacity="0.7"
          />
        ))
      )}

      {/* Small house left */}
      <rect x="160" y="450" width="70" height="70" fill="#f2e4cc" rx="2" />
      <polygon points="150,450 195,410 240,450" fill="#d49070" />
      <rect x="185" y="490" width="18" height="30" rx="2" fill="#8b5e3c" />
      <rect x="165" y="462" width="14" height="14" rx="1.5" fill="#E2F1F4" opacity="0.8" />
      <line x1="172" y1="462" x2="172" y2="476" stroke="#f2e4cc" strokeWidth="1.5" />
      <line x1="165" y1="469" x2="179" y2="469" stroke="#f2e4cc" strokeWidth="1.5" />
    </g>

    {/* ===== BUILDINGS RIGHT HALF (slide from right) ===== */}
    <g className="anim-buildings-right">
      {/* Building 4 - tall */}
      <rect x="760" y="290" width="65" height="230" rx="3" fill="#a0ccbe" />
      <rect x="760" y="290" width="65" height="8" rx="3" fill="#2FFFA8" opacity="0.5" />
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`br1-${r}-${c}`}
            x={770 + c * 18}
            y={306 + r * 34}
            width="10"
            height="16"
            rx="2"
            fill="#E2F1F4"
            opacity="0.65"
          />
        ))
      )}

      {/* Building 5 - shorter */}
      <rect x="835" y="350" width="55" height="170" rx="3" fill="#b4dcd0" />
      <rect x="835" y="350" width="55" height="8" rx="3" fill="#6FBBF5" opacity="0.6" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`br2-${r}-${c}`}
            x={847 + c * 20}
            y={366 + r * 38}
            width="12"
            height="18"
            rx="2"
            fill="#E2F1F4"
            opacity="0.7"
          />
        ))
      )}

      {/* Building 6 - medium */}
      <rect x="900" y="320" width="50" height="200" rx="3" fill="#9ec5c0" />
      <rect x="900" y="320" width="50" height="8" rx="3" fill="#2FFFA8" opacity="0.5" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`br3-${r}-${c}`}
            x={910 + c * 18}
            y={336 + r * 34}
            width="10"
            height="16"
            rx="2"
            fill="#E2F1F4"
            opacity="0.65"
          />
        ))
      )}

      {/* Small house right */}
      <rect x="970" y="450" width="75" height="70" fill="#f0e0c8" rx="2" />
      <polygon points="960,450 1008,408 1055,450" fill="#c88468" />
      <rect x="998" y="490" width="18" height="30" rx="2" fill="#7a5030" />
      <rect x="975" y="462" width="14" height="14" rx="1.5" fill="#E2F1F4" opacity="0.8" />
      <line x1="982" y1="462" x2="982" y2="476" stroke="#f0e0c8" strokeWidth="1.5" />
      <line x1="975" y1="469" x2="989" y2="469" stroke="#f0e0c8" strokeWidth="1.5" />
      <rect x="1020" y="462" width="14" height="14" rx="1.5" fill="#E2F1F4" opacity="0.8" />
    </g>
  </>
);
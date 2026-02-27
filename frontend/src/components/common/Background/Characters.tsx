export const Characters = () => (
  <>
    {/* ===== RECYCLING BINS (fall from sky) ===== */}
    {/* Bin 1 - Blue (PET) */}
    <g className="anim-fall-bin-1">
      <g transform="translate(380, 480)">
        <ellipse cx="0" cy="58" rx="32" ry="6" fill="#3a8a6a" opacity="0.15" />
        <path d="M-28,-50 L-24,50 L24,50 L28,-50 Z" fill="#6FBBF5" />
        <rect x="-32" y="-58" width="64" height="12" rx="5" fill="#5aa4e0" />
        <text x="0" y="36" textAnchor="middle" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">PET</text>
      </g>
    </g>

    {/* Bin 2 - Yellow (PAPEL) */}
    <g className="anim-fall-bin-2">
      <g transform="translate(480, 480)">
        <ellipse cx="0" cy="58" rx="32" ry="6" fill="#3a8a6a" opacity="0.15" />
        <path d="M-28,-50 L-24,50 L24,50 L28,-50 Z" fill="#f0c850" />
        <rect x="-32" y="-58" width="64" height="12" rx="5" fill="#d8b040" />
        <text x="0" y="36" textAnchor="middle" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">PAPEL</text>
      </g>
    </g>

    {/* Bin 3 - Green (ORG) */}
    <g className="anim-fall-bin-3">
      <g transform="translate(580, 480)">
        <ellipse cx="0" cy="58" rx="32" ry="6" fill="#3a8a6a" opacity="0.15" />
        <path d="M-28,-50 L-24,50 L24,50 L28,-50 Z" fill="#3daa70" />
        <rect x="-32" y="-58" width="64" height="12" rx="5" fill="#2d9460" />
        <text x="0" y="36" textAnchor="middle" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">ORG</text>
      </g>
    </g>


    {/* ===== DECORATIVE LEAVES ===== */}
    <g opacity="0.35" className="anim-clouds">
      {[
        { x: 100, y: 300, r: 15 },
        { x: 700, y: 250, r: 30 },
        { x: 1000, y: 280, r: -20 },
      ].map((l, i) => (
        <g key={`leaf-${i}`} transform={`translate(${l.x}, ${l.y}) rotate(${l.r})`}>
          <path d="M0,0 Q6,-8 12,0 Q6,4 0,0Z" fill="#2FFFA8" />
        </g>
      ))}
    </g>
  </>
);
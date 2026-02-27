export const Environment = () => (
  <>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c4e8f0" />
        <stop offset="60%" stopColor="#daf0f4" />
        <stop offset="100%" stopColor="#e2f4f3" />
      </linearGradient>
      <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#68c98e" />
        <stop offset="100%" stopColor="#4db87a" />
      </linearGradient>
    </defs>

    {/* ===== SKY ===== */}
    <rect width="1200" height="700" fill="url(#skyG)" />

    {/* ===== CLOUDS (fade in) ===== */}
    <g className="anim-clouds">
      <g opacity="0.85">
        <ellipse cx="160" cy="90" rx="72" ry="28" fill="white" />
        <ellipse cx="195" cy="78" rx="50" ry="22" fill="white" />
        <ellipse cx="130" cy="82" rx="40" ry="18" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="550" cy="60" rx="65" ry="24" fill="white" />
        <ellipse cx="580" cy="50" rx="48" ry="20" fill="white" />
        <ellipse cx="520" cy="54" rx="38" ry="16" fill="white" />
      </g>
      <g opacity="0.6">
        <ellipse cx="900" cy="75" rx="58" ry="22" fill="white" />
        <ellipse cx="928" cy="66" rx="40" ry="16" fill="white" />
        <ellipse cx="875" cy="70" rx="35" ry="14" fill="white" />
      </g>
    </g>

    {/* ===== GROUND ===== */}
    <g className="anim-ground">
      <ellipse cx="600" cy="700" rx="750" ry="230" fill="#5dbc84" />
      <ellipse cx="600" cy="700" rx="700" ry="190" fill="#4db87a" />
    </g>

    {/* ===== TREES (grow from ground) ===== */}
    <g className="anim-trees">
      <g transform="translate(50, 500)">
        <rect x="-4" y="-8" width="8" height="40" fill="#5a4838" rx="2" />
        <ellipse cx="0" cy="-30" rx="32" ry="36" fill="#4aaa7a" />
        <ellipse cx="-10" cy="-38" rx="18" ry="20" fill="#5dbc84" opacity="0.7" />
      </g>
      <g transform="translate(130, 510)">
        <rect x="-3" y="-6" width="6" height="30" fill="#5a4838" rx="2" />
        <ellipse cx="0" cy="-26" rx="24" ry="28" fill="#3d9e6e" />
        <ellipse cx="8" cy="-30" rx="14" ry="16" fill="#4aaa7a" opacity="0.7" />
      </g>
      <g transform="translate(1100, 500)">
        <rect x="-4" y="-8" width="8" height="40" fill="#5a4838" rx="2" />
        <ellipse cx="0" cy="-30" rx="30" ry="34" fill="#4aaa7a" />
        <ellipse cx="10" cy="-36" rx="16" ry="18" fill="#5dbc84" opacity="0.7" />
      </g>
      <g transform="translate(1160, 510)">
        <rect x="-3" y="-6" width="6" height="28" fill="#5a4838" rx="2" />
        <ellipse cx="0" cy="-22" rx="20" ry="24" fill="#3d9e6e" />
      </g>
      <g transform="translate(600, 505)">
        <rect x="-3" y="-5" width="6" height="25" fill="#5a4838" rx="2" />
        <ellipse cx="0" cy="-22" rx="20" ry="24" fill="#5dbc84" />
        <ellipse cx="6" cy="-28" rx="12" ry="14" fill="#4aaa7a" opacity="0.6" />
      </g>
    </g>

    {/* ===== BUSHES ===== */}
    <g className="anim-bushes">
      <ellipse cx="80" cy="540" rx="28" ry="18" fill="#3d9e6e" />
      <ellipse cx="190" cy="535" rx="22" ry="14" fill="#4aaa7a" />
      <ellipse cx="1050" cy="538" rx="26" ry="16" fill="#3d9e6e" />
      <ellipse cx="490" cy="536" rx="20" ry="13" fill="#4aaa7a" />
      <ellipse cx="720" cy="534" rx="22" ry="14" fill="#3d9e6e" />

      {/* Grass tufts */}
      {[110, 220, 450, 550, 670, 780, 980, 1130].map((gx, i) => (
        <g key={`tuft-${i}`} opacity="0.5">
          <line x1={gx} y1="540" x2={gx - 4} y2="526" stroke="#2d8a5a" strokeWidth="2" strokeLinecap="round" />
          <line x1={gx + 4} y1="540" x2={gx + 4} y2="524" stroke="#3d9e6e" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </g>
  </>
);
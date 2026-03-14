import { useState, useEffect, useRef } from 'react';

// ── COLOR PALETTE ──────────────────────────────────────────────────────────────
const C = {
  soil: '#8B5E3C',
  leaf: '#2D6A4F',
  lime: '#52B788',
  gold: '#F4A261',
  sky: '#90E0EF',
  dark: '#081C15',
  panel: '#0D2818',
  card: '#112D20',
  border: '#1B4332',
  muted: '#74C69D',
  red: '#E76F51',
  white: '#F0FFF4',
  orange: '#E9832D',
  purple: '#A78BFA',
};

// ── REGIONAL PRICE MULTIPLIERS ─────────────────────────────────────────────────
const REGION_PRICES = {
  Punjab: { mult: 1.08, label: 'Punjab, India' },
  Maharashtra: { mult: 1.12, label: 'Maharashtra, India' },
  Karnataka: { mult: 1.05, label: 'Karnataka, India' },
  'Uttar Pradesh': { mult: 0.97, label: 'Uttar Pradesh, India' },
  Gujarat: { mult: 1.1, label: 'Gujarat, India' },
  Rajasthan: { mult: 0.94, label: 'Rajasthan, India' },
  'West Bengal': { mult: 1.02, label: 'West Bengal, India' },
  'Tamil Nadu': { mult: 1.06, label: 'Tamil Nadu, India' },
  Telangana: { mult: 1.03, label: 'Telangana, India' },
  'Andhra Pradesh': { mult: 1.01, label: 'Andhra Pradesh, India' },
  'Madhya Pradesh': { mult: 0.99, label: 'Madhya Pradesh, India' },
  Bihar: { mult: 0.96, label: 'Bihar, India' },
};

// ── BASE CROPS DATA ────────────────────────────────────────────────────────────
const BASE_CROPS = [
  {
    name: 'Rice',
    icon: '🌾',
    n: 60,
    p: 40,
    k: 40,
    temp: [22, 32],
    rain: 180,
    score: 94,
    yieldVal: '4.5 t/ha',
    water: 'High',
    fert: 'Urea + DAP',
    color: '#52B788',
    demand: 'Very High',
    basePrice: 2100,
    trend: [1800, 1900, 2000, 2050, 2100],
    profitBase: 28000,
    growDays: 120,
    stages: [
      { name: 'Nursery', days: 25, icon: '🌱' },
      { name: 'Transplanting', days: 10, icon: '🪴' },
      { name: 'Vegetative', days: 40, icon: '🌿' },
      { name: 'Flowering', days: 20, icon: '🌸' },
      { name: 'Maturity', days: 25, icon: '🌾' },
    ],
  },
  {
    name: 'Wheat',
    icon: '🌿',
    n: 80,
    p: 35,
    k: 25,
    temp: [15, 25],
    rain: 100,
    score: 87,
    yieldVal: '3.8 t/ha',
    water: 'Medium',
    fert: 'NPK 20-20-0',
    color: '#F4A261',
    demand: 'High',
    basePrice: 2200,
    trend: [1900, 2000, 2100, 2150, 2200],
    profitBase: 22000,
    growDays: 150,
    stages: [
      { name: 'Germination', days: 10, icon: '🌱' },
      { name: 'Tillering', days: 35, icon: '🪴' },
      { name: 'Stem Ext.', days: 35, icon: '🌿' },
      { name: 'Heading', days: 30, icon: '🌸' },
      { name: 'Ripening', days: 40, icon: '🌾' },
    ],
  },
  {
    name: 'Maize',
    icon: '🌽',
    n: 100,
    p: 50,
    k: 40,
    temp: [20, 30],
    rain: 120,
    score: 82,
    yieldVal: '5.2 t/ha',
    water: 'Medium',
    fert: 'NPK 10-26-26',
    color: '#F4D35E',
    demand: 'High',
    basePrice: 1700,
    trend: [1500, 1550, 1600, 1650, 1700],
    profitBase: 18000,
    growDays: 90,
    stages: [
      { name: 'Germination', days: 8, icon: '🌱' },
      { name: 'Seedling', days: 20, icon: '🪴' },
      { name: 'Vegetative', days: 30, icon: '🌿' },
      { name: 'Tasseling', days: 15, icon: '🌸' },
      { name: 'Maturity', days: 17, icon: '🌽' },
    ],
  },
  {
    name: 'Cotton',
    icon: '🤍',
    n: 90,
    p: 45,
    k: 30,
    temp: [25, 35],
    rain: 80,
    score: 76,
    yieldVal: '2.1 t/ha',
    water: 'Low',
    fert: 'NPK 19-19-19',
    color: '#CBD5E1',
    demand: 'Medium',
    basePrice: 6200,
    trend: [5800, 5900, 6000, 6100, 6200],
    profitBase: 45000,
    growDays: 180,
    stages: [
      { name: 'Germination', days: 10, icon: '🌱' },
      { name: 'Seedling', days: 30, icon: '🪴' },
      { name: 'Squaring', days: 40, icon: '🌿' },
      { name: 'Flowering', days: 50, icon: '🌸' },
      { name: 'Boll Dev.', days: 50, icon: '🤍' },
    ],
  },
  {
    name: 'Sugarcane',
    icon: '🎋',
    n: 120,
    p: 60,
    k: 60,
    temp: [26, 36],
    rain: 200,
    score: 71,
    yieldVal: '70 t/ha',
    water: 'Very High',
    fert: 'Urea + SSP',
    color: '#A8DADC',
    demand: 'Medium',
    basePrice: 350,
    trend: [310, 320, 330, 340, 350],
    profitBase: 52000,
    growDays: 365,
    stages: [
      { name: 'Germination', days: 30, icon: '🌱' },
      { name: 'Tillering', days: 90, icon: '🪴' },
      { name: 'Grand Growth', days: 150, icon: '🎋' },
      { name: 'Maturation', days: 60, icon: '🌾' },
      { name: 'Ripening', days: 35, icon: '✅' },
    ],
  },
  {
    name: 'Soybean',
    icon: '🫘',
    n: 20,
    p: 60,
    k: 40,
    temp: [20, 30],
    rain: 130,
    score: 68,
    yieldVal: '1.8 t/ha',
    water: 'Medium',
    fert: 'Rhizobium + SSP',
    color: '#95D5B2',
    demand: 'Growing',
    basePrice: 4200,
    trend: [3800, 3900, 4000, 4100, 4200],
    profitBase: 15000,
    growDays: 100,
    stages: [
      { name: 'Germination', days: 8, icon: '🌱' },
      { name: 'Seedling', days: 20, icon: '🪴' },
      { name: 'Vegetative', days: 30, icon: '🌿' },
      { name: 'Flowering', days: 20, icon: '🌸' },
      { name: 'Pod Fill', days: 22, icon: '🫘' },
    ],
  },
];

// ── INDIA MAP DATA ─────────────────────────────────────────────────────────────
const CROP_COLORS = {
  Rice: '#52B788',
  Wheat: '#F4A261',
  Maize: '#F4D35E',
  Cotton: '#CBD5E1',
  Soybean: '#A8DADC',
  Sugarcane: '#90E0EF',
};
const STATES = [
  { id: 'Punjab', label: 'PB', x: 160, y: 80, w: 60, h: 45, crop: 'Wheat' },
  {
    id: 'Rajasthan',
    label: 'RJ',
    x: 110,
    y: 145,
    w: 100,
    h: 105,
    crop: 'Maize',
  },
  { id: 'Gujarat', label: 'GJ', x: 85, y: 235, w: 75, h: 85, crop: 'Cotton' },
  {
    id: 'Maharashtra',
    label: 'MH',
    x: 155,
    y: 280,
    w: 95,
    h: 80,
    crop: 'Cotton',
  },
  { id: 'Karnataka', label: 'KA', x: 168, y: 348, w: 78, h: 68, crop: 'Rice' },
  { id: 'Tamil Nadu', label: 'TN', x: 194, y: 408, w: 58, h: 72, crop: 'Rice' },
  {
    id: 'Andhra Pradesh',
    label: 'AP',
    x: 238,
    y: 330,
    w: 68,
    h: 63,
    crop: 'Rice',
  },
  { id: 'Telangana', label: 'TS', x: 226, y: 276, w: 58, h: 55, crop: 'Maize' },
  {
    id: 'Uttar Pradesh',
    label: 'UP',
    x: 250,
    y: 118,
    w: 105,
    h: 75,
    crop: 'Wheat',
  },
  {
    id: 'West Bengal',
    label: 'WB',
    x: 352,
    y: 188,
    w: 54,
    h: 82,
    crop: 'Rice',
  },
  {
    id: 'Madhya Pradesh',
    label: 'MP',
    x: 192,
    y: 188,
    w: 105,
    h: 88,
    crop: 'Soybean',
  },
  { id: 'Bihar', label: 'BR', x: 318, y: 158, w: 62, h: 55, crop: 'Wheat' },
];

// ── CHAT RESPONSES ─────────────────────────────────────────────────────────────
const chatResponses = {
  fertilizer:
    'Based on your NPK values, I recommend:\n• **Urea (46-0-0)** — 120 kg/ha for Nitrogen\n• **DAP (18-46-0)** — 80 kg/ha for Phosphorus\n• **MOP (0-0-60)** — 60 kg/ha for Potassium\n\nApply in split doses for best absorption! 🌱',
  water:
    'Your crop needs approximately **800–1200 mm** of water per season. With drip irrigation you can reduce this by 30–40%. Schedule irrigation every 5–7 days during vegetative growth stage. 💧',
  'best crop':
    'Based on typical soil (N:60, P:40, K:40) at 25°C with 75% humidity, **Rice** scores 94% suitability with 4.5 t/ha yield. Go to the Crops page to analyze your specific soil! 🌾',
  market:
    "Current highlights:\n• **Cotton** — highest price per quintal\n• **Wheat** — MSP-backed, safe choice\n• **Soybean** — fastest growing demand\n\nVisit Market page for price charts and your region's rates! 📈",
  soil: 'Your soil analysis shows:\n• **Nitrogen** — Moderate\n• **Phosphorus** — Adequate\n• **Potassium** — Low\n\nRecommend adding 40 kg/ha Muriate of Potash before sowing. 🪨',
  days: 'Crop grow times:\n• 🌽 Maize — **90 days** (fastest!)\n• 🌾 Rice — **120 days**\n• 🫘 Soybean — **100 days**\n• 🌿 Wheat — **150 days**\n• 🤍 Cotton — **180 days**\n• 🎋 Sugarcane — **365 days**\n\nSee stage-by-stage timelines on the Crops page! ⏱️',
  price:
    'Prices are adjusted for your region:\n• 🤍 Cotton — ₹6,200/q base (highest)\n• 🫘 Soybean — ₹4,200/q (growing demand)\n• 🌿 Wheat — ₹2,200/q (MSP secured)\n\nVisit Market page for full trend analysis! 💰',
  default:
    "I'm your AI Farming Assistant! 🤖 Ask me about:\n• 'best crop for my soil'\n• 'how many days to grow wheat'\n• 'fertilizer recommendations'\n• 'current market prices'\n• 'water requirements'",
};
function getResponse(msg) {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(chatResponses)) {
    if (lower.includes(key)) return chatResponses[key];
  }
  return chatResponses['default'];
}

// ── SPARKLINE ─────────────────────────────────────────────────────────────────
function Spark({ data, color = C.lime }) {
  const w = 110,
    h = 38;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  const lastPt = pts.split(' ').pop().split(',');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: w, height: h, flexShrink: 0 }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        fillOpacity="0.13"
        stroke="none"
      />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color} />
    </svg>
  );
}

// ── GROW TIMELINE COMPONENT ───────────────────────────────────────────────────
function GrowTimeline({ crop }) {
  const total = crop.stages.reduce((s, st) => s + st.days, 0);
  const stageColors = [C.lime, C.gold, C.sky, C.orange, C.purple];
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 13, color: C.muted }}>
          ⏱️ Total grow time:
        </span>
        <span style={{ fontWeight: 700, color: C.lime, fontSize: 16 }}>
          {crop.growDays} days
        </span>
        <span style={{ fontSize: 12, color: C.muted }}>
          ≈ {Math.ceil(crop.growDays / 30)} months
        </span>
      </div>
      {/* Segmented progress bar */}
      <div
        style={{
          display: 'flex',
          borderRadius: 8,
          overflow: 'hidden',
          height: 20,
          marginBottom: 10,
        }}
      >
        {crop.stages.map((st, i) => (
          <div
            key={st.name}
            title={`${st.name}: ${st.days} days`}
            style={{
              width: `${(st.days / total) * 100}%`,
              background: stageColors[i % stageColors.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: C.dark,
              fontWeight: 800,
              transition: 'opacity 0.2s',
              cursor: 'default',
              flexShrink: 0,
            }}
          >
            {st.days / total > 0.12 ? st.name : ''}
          </div>
        ))}
      </div>
      {/* Stage pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {crop.stages.map((st, i) => (
          <div
            key={st.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: stageColors[i % stageColors.length] + '22',
              border: `1px solid ${stageColors[i % stageColors.length]}44`,
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 11,
            }}
          >
            <span>{st.icon}</span>
            <span
              style={{
                color: stageColors[i % stageColors.length],
                fontWeight: 600,
              }}
            >
              {st.name}
            </span>
            <span style={{ color: C.muted }}>{st.days}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INDIA SVG MAP ─────────────────────────────────────────────────────────────
function IndiaMap({ selectedState, onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div>
      <svg
        viewBox="0 0 480 510"
        style={{
          width: '100%',
          maxWidth: 460,
          display: 'block',
          margin: '0 auto',
        }}
      >
        <rect x="0" y="0" width="480" height="510" rx="12" fill="#0A1E12" />
        {[80, 160, 240, 320, 400].map((x) => (
          <line
            key={'v' + x}
            x1={x}
            y1="0"
            x2={x}
            y2="510"
            stroke="#1B4332"
            strokeWidth="0.4"
          />
        ))}
        {[80, 160, 240, 320, 400, 480].map((y) => (
          <line
            key={'h' + y}
            x1="0"
            y1={y}
            x2="480"
            y2={y}
            stroke="#1B4332"
            strokeWidth="0.4"
          />
        ))}
        {/* Water bodies */}
        <ellipse
          cx="280"
          cy="465"
          rx="55"
          ry="28"
          fill="#0D4F6E"
          fillOpacity="0.28"
        />
        <text
          x="280"
          y="469"
          textAnchor="middle"
          fontSize="8"
          fill="#90E0EF"
          fillOpacity="0.55"
        >
          Bay of Bengal
        </text>
        <ellipse
          cx="105"
          cy="305"
          rx="28"
          ry="46"
          fill="#0D4F6E"
          fillOpacity="0.22"
        />
        <text
          x="70"
          y="307"
          textAnchor="middle"
          fontSize="7.5"
          fill="#90E0EF"
          fillOpacity="0.5"
        >
          Arabian Sea
        </text>
        {/* States */}
        {STATES.map((st) => {
          const isHov = hov === st.id;
          const isSel = selectedState === st.id;
          const col = CROP_COLORS[st.crop] || C.lime;
          return (
            <g key={st.id}>
              <rect
                x={st.x}
                y={st.y}
                width={st.w}
                height={st.h}
                rx="6"
                fill={col}
                fillOpacity={isSel ? 0.92 : isHov ? 0.72 : 0.44}
                stroke={isSel ? '#fff' : col}
                strokeWidth={isSel ? 2.5 : 0.8}
                style={{ cursor: 'pointer', transition: 'all 0.18s' }}
                onMouseEnter={() => setHov(st.id)}
                onMouseLeave={() => setHov(null)}
                onClick={() => onSelect(st.id)}
              />
              <text
                x={st.x + st.w / 2}
                y={st.y + st.h / 2 - 5}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={isSel || isHov ? '#081C15' : '#F0FFF4'}
                style={{ pointerEvents: 'none' }}
              >
                {st.label}
              </text>
              <text
                x={st.x + st.w / 2}
                y={st.y + st.h / 2 + 8}
                textAnchor="middle"
                fontSize="7.5"
                fill={isSel || isHov ? '#0D2818' : '#74C69D'}
                style={{ pointerEvents: 'none' }}
              >
                {st.crop}
              </text>
            </g>
          );
        })}
        <text x="8" y="501" fontSize="8.5" fill="#74C69D" fillOpacity="0.6">
          🗺️ Crop Suitability Map — India (Schematic)
        </text>
      </svg>
      {/* Legend */}
      <div
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}
      >
        {Object.entries(CROP_COLORS).map(([name, col]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: C.muted,
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: 3,
                background: col,
                opacity: 0.8,
              }}
            />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ONBOARDING MODAL ──────────────────────────────────────────────────────────
function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Punjab');
  const [farmSize, setFarmSize] = useState('');
  const [err, setErr] = useState('');

  const inp = {
    background: '#0A1E12',
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '12px 16px',
    color: C.white,
    fontSize: 14,
    width: '100%',
    outline: 'none',
    marginTop: 6,
    boxSizing: 'border-box',
  };

  function next() {
    setErr('');
    if (step === 1 && !name.trim()) {
      setErr('Please enter your name to continue.');
      return;
    }
    if (step === 2 && !farmSize) {
      setErr('Please enter your farm size.');
      return;
    }
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    onDone({ name: name.trim(), region, farmSize: parseFloat(farmSize) || 1 });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000cc',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 22,
          padding: 38,
          maxWidth: 430,
          width: '100%',
          boxShadow: '0 32px 90px #000000bb',
        }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: i === step ? 2 : 1,
                height: 4,
                borderRadius: 4,
                background: i <= step ? C.lime : C.border,
                transition: 'all 0.4s',
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ fontSize: 44, marginBottom: 10 }}>👨‍🌾</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.white,
                margin: '0 0 8px',
              }}
            >
              Welcome, Farmer!
            </h2>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
              Let's personalize your CropAI experience. What should we call you?
            </p>
            <label
              style={{
                color: C.muted,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              YOUR NAME
            </label>
            <input
              style={inp}
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              autoFocus
            />
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🗺️</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.white,
                margin: '0 0 6px',
              }}
            >
              Hi, {name}! 👋
            </h2>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>
              Select your region for accurate local mandi prices.
            </p>
            <label
              style={{
                color: C.muted,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              YOUR REGION
            </label>
            <select
              style={inp}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {Object.keys(REGION_PRICES).map((r) => (
                <option key={r} value={r}>
                  {REGION_PRICES[r].label}
                </option>
              ))}
            </select>
            <div
              style={{
                marginTop: 10,
                padding: '10px 14px',
                background: '#0A1E12',
                borderRadius: 8,
                fontSize: 12,
                color: C.muted,
              }}
            >
              📊 Price factor for{' '}
              <strong style={{ color: C.lime }}>{region}</strong>:{' '}
              <strong style={{ color: C.lime }}>
                {REGION_PRICES[region].mult}×
              </strong>{' '}
              — all crop prices will reflect your local mandi rates.
            </div>
            <label
              style={{
                color: C.muted,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase',
                display: 'block',
                marginTop: 14,
              }}
            >
              FARM SIZE (acres)
            </label>
            <input
              style={inp}
              type="number"
              min="0.1"
              step="0.5"
              placeholder="e.g. 5"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
            />
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🌱</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.white,
                margin: '0 0 6px',
              }}
            >
              All set, {name}!
            </h2>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
              Here's your farming profile:
            </p>
            <div
              style={{
                background: '#0A1E12',
                borderRadius: 12,
                padding: '4px 0',
                marginBottom: 20,
              }}
            >
              {[
                ['👤 Name', name],
                ['📍 Region', REGION_PRICES[region].label],
                ['🌾 Farm Size', `${farmSize} acres`],
                [
                  '💱 Price Factor',
                  `${REGION_PRICES[region].mult}× regional adjustment`,
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: `1px solid ${C.border}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: C.muted }}>{k}</span>
                  <span style={{ color: C.white, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ color: C.muted, fontSize: 12 }}>
              Ready to explore AI-powered recommendations tailored to{' '}
              <strong style={{ color: C.lime }}>{region}</strong>!
            </p>
          </>
        )}

        {err && (
          <div style={{ color: C.red, fontSize: 12, marginTop: 8 }}>
            ⚠️ {err}
          </div>
        )}
        <button
          onClick={next}
          style={{
            marginTop: 22,
            width: '100%',
            background: C.lime,
            color: C.dark,
            border: 'none',
            borderRadius: 10,
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {step === 3 ? '🚀 Start Farming Smart!' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [form, setForm] = useState({
    n: 60,
    p: 40,
    k: 40,
    temp: 25,
    humidity: 75,
    rain: 180,
    location: 'Punjab, India',
    soil: 'Loamy',
  });
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: "👋 Hello! I'm your AI Farming Assistant. Ask me anything about crops, grow days, fertilizers, or market prices!",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const chatEnd = useRef();
  const [lang, setLang] = useState('en');
  const [mapState, setMapState] = useState('Punjab');

  const t = {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      crops: 'Crops',
      market: 'Market',
      map: 'Map',
      chat: 'AI Chat',
      tagline: 'Smart Crop Planning & Land Use Optimization',
      sub: 'AI-powered insights for modern farmers',
      start: 'Get Started',
      analyze: 'Analyze Land',
    },
    hi: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      crops: 'फसलें',
      market: 'बाज़ार',
      map: 'नक्शा',
      chat: 'AI सहायक',
      tagline: 'स्मार्ट फसल योजना',
      sub: 'आधुनिक किसानों के लिए AI आधारित सलाह',
      start: 'शुरू करें',
      analyze: 'भूमि विश्लेषण',
    },
    te: {
      home: 'హోమ్',
      dashboard: 'డ్యాష్‌బోర్డ్',
      crops: 'పంటలు',
      market: 'మార్కెట్',
      map: 'మ్యాప్',
      chat: 'AI సహాయకుడు',
      tagline: 'స్మార్ట్ పంట ప్రణాళిక',
      sub: 'ఆధునిక రైతుల కోసం AI అంతర్దృష్టులు',
      start: 'ప్రారంభించండి',
      analyze: 'భూమి విశ్లేషణ',
    },
  }[lang];

  // Regional price multiplier
  const mult = user ? REGION_PRICES[user.region]?.mult ?? 1 : 1;
  const crops = BASE_CROPS.map((c) => ({
    ...c,
    price: Math.round(c.basePrice * mult),
    trend: c.trend.map((v) => Math.round(v * mult)),
    profit: `₹${Math.round(
      c.profitBase * mult * (user?.farmSize || 1)
    ).toLocaleString('en-IN')}`,
  }));

  function analyze() {
    setLoading(true);
    setTimeout(() => {
      const scored = crops
        .map((c) => ({
          ...c,
          score: Math.min(
            99,
            Math.round(
              c.score -
                Math.abs(form.n - c.n) * 0.15 -
                Math.abs(form.p - c.p) * 0.1 -
                Math.abs(form.rain - c.rain) * 0.05 +
                Math.random() * 4
            )
          ),
        }))
        .sort((a, b) => b.score - a.score);
      setRecs(scored);
      setLoading(false);
      setPage('crops');
    }, 1400);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatLog((l) => [...l, { role: 'user', text: msg }]);
    setChatInput('');
    setAiTyping(true);
    setTimeout(() => {
      setChatLog((l) => [...l, { role: 'ai', text: getResponse(msg) }]);
      setAiTyping(false);
    }, 700 + Math.random() * 600);
  }

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, aiTyping]);

  const nav = [
    { id: 'home', icon: '🏠', label: t.home },
    { id: 'dashboard', icon: '📊', label: t.dashboard },
    { id: 'crops', icon: '🌱', label: t.crops },
    { id: 'market', icon: '📈', label: t.market },
    { id: 'map', icon: '🗺️', label: t.map },
    { id: 'chat', icon: '🤖', label: t.chat },
  ];

  const S = {
    card: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 20,
      marginBottom: 16,
    },
    h1: { fontSize: 26, fontWeight: 700, color: C.white, margin: '0 0 6px' },
    h2: { fontSize: 17, fontWeight: 700, color: C.lime, margin: '0 0 12px' },
    label: {
      fontSize: 11,
      color: C.muted,
      marginBottom: 4,
      display: 'block',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    input: {
      background: '#0A1E12',
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '9px 12px',
      color: C.white,
      fontSize: 13,
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box',
    },
    btn: (col = C.lime, outline = false) => ({
      background: outline ? 'transparent' : col,
      color: outline ? col : C.dark,
      border: outline ? `1px solid ${col}` : 'none',
      borderRadius: 8,
      padding: '10px 22px',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
    }),
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      gap: 16,
    },
    row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    tag: (col) => ({
      background: col + '22',
      color: col,
      borderRadius: 6,
      padding: '2px 10px',
      fontSize: 11,
      fontWeight: 700,
      display: 'inline-block',
    }),
    bar: (w, col) => ({
      height: 8,
      borderRadius: 4,
      background: col,
      width: `${Math.max(0, Math.min(100, w))}%`,
      transition: 'width 0.9s ease',
    }),
    stat: { textAlign: 'center', padding: '15px 10px' },
  };

  // ── HOME ────────────────────────────────────────────────────────────────────
  const HomePage = () => (
    <div>
      <div
        style={{
          ...S.card,
          background:
            'linear-gradient(135deg,#0D3320 0%,#1B4332 55%,#2D6A4F 100%)',
          padding: '52px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 10 }}>🌾</div>
        {user && (
          <div
            style={{
              display: 'inline-block',
              background: '#52B78822',
              border: `1px solid ${C.lime}44`,
              borderRadius: 20,
              padding: '4px 18px',
              fontSize: 13,
              color: C.lime,
              marginBottom: 14,
            }}
          >
            👨‍🌾 Welcome back, <strong>{user.name}</strong>! &nbsp;·&nbsp;{' '}
            {REGION_PRICES[user.region]?.label}
          </div>
        )}
        <h1 style={{ ...S.h1, fontSize: 28, marginBottom: 8 }}>{t.tagline}</h1>
        <p
          style={{
            color: C.muted,
            fontSize: 14,
            maxWidth: 460,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}
        >
          {t.sub}
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button style={S.btn(C.lime)} onClick={() => setPage('dashboard')}>
            {t.start} →
          </button>
          <button style={S.btn(C.gold, true)} onClick={() => setPage('chat')}>
            🤖 AI Chat
          </button>
          <button style={S.btn(C.sky, true)} onClick={() => setPage('map')}>
            🗺️ Land Map
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginTop: 22,
            flexWrap: 'wrap',
          }}
        >
          {[
            '🧠 AI Powered',
            '🌦️ Weather Aware',
            '📊 Market Insights',
            '🗺️ Location Smart',
            '⏱️ Grow Timelines',
            '💰 Regional Prices',
          ].map((b) => (
            <span
              key={b}
              style={{
                background: '#ffffff12',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                color: C.muted,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
          }}
        >
          {[
            ['1.2M+', 'Farmers Served'],
            ['94%', 'AI Accuracy'],
            ['₹2.4L', 'Avg Profit Gain'],
            ['28', 'Crops Supported'],
          ].map(([v, l]) => (
            <div
              key={l}
              style={{ ...S.stat, borderRight: `1px solid ${C.border}` }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: C.lime }}>
                {v}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.grid2}>
        {[
          {
            icon: '🌱',
            title: 'Smart Crop Recommendation',
            desc: 'ML models analyze NPK, weather & location to suggest the perfect crop with probability score.',
          },
          {
            icon: '⏱️',
            title: 'Grow Day Timelines',
            desc: 'See exactly how many days each crop takes — from germination to harvest, stage by stage.',
          },
          {
            icon: '💰',
            title: 'Regional Price Engine',
            desc: 'Market prices auto-adjusted for your mandi region for accurate local profit estimation.',
          },
          {
            icon: '🗺️',
            title: 'Interactive Land Map',
            desc: 'Color-coded India map showing crop suitability per state. Click any state to explore.',
          },
          {
            icon: '🤖',
            title: 'AI Farming Assistant',
            desc: 'Ask any farming question in natural language — grow days, fertilizers, water, market prices.',
          },
          {
            icon: '📈',
            title: 'Market Demand Analysis',
            desc: 'Price trend charts and demand analysis for all major crops, updated for your region.',
          },
        ].map((f) => (
          <div key={f.title} style={S.card}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
            <div
              style={{
                fontWeight: 700,
                color: C.white,
                marginBottom: 5,
                fontSize: 14,
              }}
            >
              {f.title}
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── DASHBOARD ───────────────────────────────────────────────────────────────
  const DashboardPage = () => (
    <div>
      {user && (
        <div
          style={{
            ...S.card,
            background: '#1B4332',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 26 }}>👨‍🌾</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: C.white }}>{user.name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>
              {REGION_PRICES[user.region]?.label} · {user.farmSize} acres ·
              Price factor {mult}×
            </div>
          </div>
          <button
            onClick={() => setUser(null)}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.muted,
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ✏️ Edit Profile
          </button>
        </div>
      )}
      <div style={S.card}>
        <h2 style={S.h2}>🌍 Farmer Input Dashboard</h2>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
          Enter your land details to get AI-powered crop recommendations with
          grow timelines
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))',
            gap: 14,
          }}
        >
          {[
            {
              key: 'location',
              label: '📍 Location',
              type: 'text',
              placeholder: 'Punjab, India',
            },
            {
              key: 'soil',
              label: '🪨 Soil Type',
              type: 'select',
              options: ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty'],
            },
            { key: 'n', label: '🧪 Nitrogen (N) kg/ha', type: 'number' },
            { key: 'p', label: '🧪 Phosphorus (P) kg/ha', type: 'number' },
            { key: 'k', label: '🧪 Potassium (K) kg/ha', type: 'number' },
            { key: 'temp', label: '🌡️ Temperature (°C)', type: 'number' },
            { key: 'humidity', label: '💧 Humidity (%)', type: 'number' },
            { key: 'rain', label: '🌧️ Rainfall (mm)', type: 'number' },
          ].map((f) => (
            <div key={f.key}>
              <label style={S.label}>{f.label}</label>
              {f.type === 'select' ? (
                <select
                  style={S.input}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  style={S.input}
                  type={f.type}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      [f.key]:
                        f.type === 'number' ? +e.target.value : e.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: '#0A1E12',
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: C.muted,
              fontSize: 11,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            NPK ANALYSIS
          </div>
          {[
            ['Nitrogen', form.n, 200, C.lime],
            ['Phosphorus', form.p, 200, C.gold],
            ['Potassium', form.k, 200, C.sky],
          ].map(([name, val, max, col]) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: C.muted,
                  marginBottom: 4,
                }}
              >
                <span>{name}</span>
                <span style={{ color: col }}>{val} kg/ha</span>
              </div>
              <div
                style={{ height: 8, background: '#1B4332', borderRadius: 4 }}
              >
                <div style={S.bar((val / max) * 100, col)} />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <button style={S.btn(C.lime)} onClick={analyze} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🧠 ' + t.analyze}
          </button>
          <button
            style={S.btn(C.gold, true)}
            onClick={() =>
              setForm({
                n: 60,
                p: 40,
                k: 40,
                temp: 25,
                humidity: 75,
                rain: 180,
                location: 'Punjab, India',
                soil: 'Loamy',
              })
            }
          >
            ↺ Reset
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(145px,1fr))',
          gap: 12,
        }}
      >
        {[
          {
            icon: '🌡️',
            label: 'Temperature',
            val: `${form.temp}°C`,
            col: C.gold,
          },
          {
            icon: '💧',
            label: 'Humidity',
            val: `${form.humidity}%`,
            col: C.sky,
          },
          {
            icon: '🌧️',
            label: 'Rainfall',
            val: `${form.rain} mm`,
            col: C.lime,
          },
          {
            icon: '☀️',
            label: 'Season',
            val: form.temp > 25 ? 'Kharif' : 'Rabi',
            col: C.orange,
          },
        ].map((w) => (
          <div
            key={w.label}
            style={{ ...S.card, textAlign: 'center', padding: 16 }}
          >
            <div style={{ fontSize: 22 }}>{w.icon}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: w.col,
                margin: '4px 0',
              }}
            >
              {w.val}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>{w.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── CROPS ───────────────────────────────────────────────────────────────────
  const CropsPage = () => {
    const [expanded, setExpanded] = useState(null);
    const list = recs.length ? recs : crops;
    return (
      <div>
        <div style={{ ...S.row, marginBottom: 14 }}>
          <h1 style={{ ...S.h1, margin: 0 }}>🌱 Crop Recommendations</h1>
          {recs.length > 0 && <span style={S.tag(C.lime)}>AI Analyzed</span>}
        </div>
        {!recs.length && (
          <div style={{ ...S.card, background: '#1B4332', marginBottom: 16 }}>
            <div style={{ color: C.muted, fontSize: 13 }}>
              💡 Enter your soil & weather data in{' '}
              <strong style={{ color: C.lime }}>Dashboard</strong> for
              personalized AI recommendations. Showing default data below.
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((c, i) => (
            <div
              key={c.name}
              style={{
                ...S.card,
                borderLeft: `4px solid ${c.color}`,
                marginBottom: 0,
                cursor: 'pointer',
              }}
              onClick={() => setExpanded(expanded === c.name ? null : c.name)}
            >
              {/* Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: 30 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {c.name}
                    </span>
                    {i === 0 && recs.length > 0 && (
                      <span style={S.tag(C.lime)}>⭐ TOP PICK</span>
                    )}
                    <span style={S.tag(c.color)}>{c.demand} Demand</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    ⏱️{' '}
                    <strong style={{ color: C.white }}>
                      {c.growDays} days
                    </strong>{' '}
                    to harvest &nbsp;·&nbsp; 📦 {c.yieldVal} &nbsp;·&nbsp; 💰{' '}
                    {c.profit}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 60 }}>
                  <div
                    style={{ fontSize: 22, fontWeight: 700, color: c.color }}
                  >
                    {c.score}%
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    Suitability
                  </div>
                </div>
                <div style={{ color: C.muted, fontSize: 14 }}>
                  {expanded === c.name ? '▲' : '▼'}
                </div>
              </div>
              {/* Bar */}
              <div
                style={{
                  height: 5,
                  background: '#1B4332',
                  borderRadius: 3,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: c.color,
                    width: `${c.score}%`,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
              {/* Expanded */}
              {expanded === c.name && (
                <div style={{ marginTop: 16 }}>
                  {/* Grow timeline – highlighted */}
                  <div
                    style={{
                      background: '#0A1E12',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 14,
                      border: `1px solid ${c.color}33`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: c.color,
                        fontSize: 12,
                        marginBottom: 8,
                        letterSpacing: 1,
                      }}
                    >
                      🌱 GROWING TIMELINE
                    </div>
                    <GrowTimeline crop={c} />
                  </div>
                  {/* Info grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))',
                      gap: 8,
                    }}
                  >
                    {[
                      ['📦 Expected Yield', c.yieldVal],
                      ['💰 Est. Profit', c.profit],
                      ['💧 Water Req.', c.water],
                      ['🧪 Fertilizer', c.fert],
                      [
                        '⏱️ Grow Days',
                        `${c.growDays} days (~${Math.ceil(
                          c.growDays / 30
                        )} mo)`,
                      ],
                      [
                        '💱 Mandi Price',
                        `₹${c.price.toLocaleString('en-IN')}/q`,
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          background: '#0A1E12',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <div style={{ color: C.muted, fontSize: 10 }}>{k}</div>
                        <div
                          style={{
                            color: C.white,
                            fontWeight: 600,
                            marginTop: 2,
                            fontSize: 12,
                          }}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                  {user && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        background: '#1B4332',
                        borderRadius: 8,
                        fontSize: 12,
                        color: C.muted,
                      }}
                    >
                      📍 Profit & price adjusted for{' '}
                      <strong style={{ color: C.lime }}>{user.region}</strong> (
                      {mult}×) on{' '}
                      <strong style={{ color: C.lime }}>
                        {user.farmSize} acres
                      </strong>
                      .
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── MARKET ──────────────────────────────────────────────────────────────────
  const MarketPage = () => {
    const [sel, setSel] = useState(crops[0]);
    return (
      <div>
        <div style={{ ...S.row, marginBottom: 6 }}>
          <h1 style={{ ...S.h1, margin: 0 }}>📈 Market Demand Analysis</h1>
          {user && (
            <span style={S.tag(C.lime)}>
              📍 {user.region} ({mult}×)
            </span>
          )}
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>
          {user
            ? `Local mandi prices for ${
                REGION_PRICES[user.region]?.label
              }, adjusted by regional factor ${mult}×.`
            : 'Complete onboarding to see your local mandi prices.'}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            alignItems: 'start',
          }}
        >
          {/* Crop list */}
          <div>
            {crops.map((c) => (
              <div
                key={c.name}
                style={{
                  ...S.card,
                  cursor: 'pointer',
                  borderLeft: `3px solid ${
                    sel.name === c.name ? c.color : 'transparent'
                  }`,
                  transition: 'all 0.2s',
                  marginBottom: 10,
                  padding: 14,
                }}
                onClick={() => setSel(c)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      ⏱️ {c.growDays} days · {c.demand} demand
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 8 }}>
                    <div
                      style={{ fontWeight: 700, color: c.color, fontSize: 15 }}
                    >
                      ₹{c.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted }}>
                      per quintal
                    </div>
                  </div>
                  <Spark data={c.trend} color={c.color} />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    height: 4,
                    background: '#1B4332',
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: c.color,
                      width: `${Math.round((c.price / 7000) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Detail panel */}
          <div style={{ position: 'sticky', top: 70 }}>
            <div style={S.card}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 36 }}>{sel.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    {sel.name}
                  </div>
                  <span style={S.tag(sel.color)}>{sel.demand} Demand</span>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {[
                  [
                    'Mandi Price',
                    `₹${sel.price.toLocaleString('en-IN')}/q`,
                    C.lime,
                  ],
                  ['Est. Profit', sel.profit, C.gold],
                  ['Yield', sel.yieldVal, C.sky],
                  ['Grow Time', `${sel.growDays} days`, C.orange],
                ].map(([k, v, col]) => (
                  <div
                    key={k}
                    style={{
                      background: '#0A1E12',
                      borderRadius: 8,
                      padding: 12,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: col }}>
                      {v}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                      {k}
                    </div>
                  </div>
                ))}
              </div>
              {/* Price trend chart */}
              <div
                style={{
                  background: '#0A1E12',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: C.muted,
                    fontSize: 11,
                    marginBottom: 8,
                    letterSpacing: 1,
                  }}
                >
                  PRICE TREND (5 MONTHS)
                </div>
                <svg viewBox="0 0 300 80" style={{ width: '100%', height: 80 }}>
                  {(() => {
                    const data = sel.trend;
                    const min = Math.min(...data),
                      max = Math.max(...data);
                    const pts = data.map((v, i) => ({
                      x: 10 + (i / (data.length - 1)) * 280,
                      y: 68 - ((v - min) / (max - min || 1)) * 58,
                      v,
                    }));
                    const line = pts.map((p) => `${p.x},${p.y}`).join(' ');
                    return (
                      <>
                        <polyline
                          points={`10,70 ${line} 290,70`}
                          fill={sel.color}
                          fillOpacity="0.1"
                          stroke="none"
                        />
                        <polyline
                          points={line}
                          fill="none"
                          stroke={sel.color}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {pts.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="4" fill={sel.color} />
                            <text
                              x={p.x}
                              y={p.y - 8}
                              textAnchor="middle"
                              fontSize="8"
                              fill={C.muted}
                            >
                              ₹{p.v}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
                {user && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                    📍 Adjusted for {user.region} (×{mult})
                  </div>
                )}
              </div>
              {/* Grow timeline in market */}
              <div
                style={{ background: '#0A1E12', borderRadius: 10, padding: 14 }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: C.muted,
                    fontSize: 11,
                    marginBottom: 8,
                    letterSpacing: 1,
                  }}
                >
                  ⏱️ GROWING TIMELINE
                </div>
                <GrowTimeline crop={sel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── MAP ─────────────────────────────────────────────────────────────────────
  const MapPage = () => {
    const stateInfo = STATES.find((s) => s.id === mapState);
    const stateCrop = crops.find((c) => c.name === stateInfo?.crop);
    return (
      <div>
        <div style={{ ...S.row, marginBottom: 14 }}>
          <h1 style={{ ...S.h1, margin: 0 }}>🗺️ Land Use Optimization Map</h1>
          {user && <span style={S.tag(C.lime)}>📍 {user.region}</span>}
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>
          Click any state to see recommended crop, grow timeline, and local
          market prices.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* SVG Map */}
          <div style={S.card}>
            <IndiaMap selectedState={mapState} onSelect={setMapState} />
          </div>
          {/* State detail */}
          <div>
            {stateInfo && stateCrop ? (
              <div style={S.card}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 34 }}>{stateCrop.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {stateInfo.id}
                    </div>
                    <span style={S.tag(stateCrop.color)}>
                      Best Crop: {stateCrop.name}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {[
                    [
                      '💱 Mandi Price',
                      `₹${stateCrop.price.toLocaleString('en-IN')}/q`,
                    ],
                    ['💰 Est. Profit', stateCrop.profit],
                    ['📦 Yield', stateCrop.yieldVal],
                    ['💧 Water', stateCrop.water],
                    ['🧪 Fertilizer', stateCrop.fert],
                    ['📊 Demand', stateCrop.demand],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: '#0A1E12',
                        borderRadius: 8,
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ color: C.muted, fontSize: 10 }}>{k}</div>
                      <div
                        style={{
                          color: C.white,
                          fontWeight: 600,
                          marginTop: 2,
                          fontSize: 12,
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Suitability bar */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 4,
                    }}
                  >
                    <span>AI Suitability</span>
                    <span style={{ color: stateCrop.color, fontWeight: 700 }}>
                      {stateCrop.score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: '#1B4332',
                      borderRadius: 4,
                    }}
                  >
                    <div style={S.bar(stateCrop.score, stateCrop.color)} />
                  </div>
                </div>
                {/* Grow timeline */}
                <div
                  style={{
                    background: '#0A1E12',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: C.muted,
                      fontSize: 11,
                      marginBottom: 8,
                      letterSpacing: 1,
                    }}
                  >
                    ⏱️ GROWING TIMELINE
                  </div>
                  <GrowTimeline crop={stateCrop} />
                </div>
                {user && stateInfo.id === user.region && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '8px 14px',
                      background: '#1B4332',
                      borderRadius: 8,
                      fontSize: 12,
                      color: C.lime,
                    }}
                  >
                    ✅ This is your registered region — prices reflect your
                    local mandi rates.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...S.card, textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 40 }}>🗺️</div>
                <div style={{ color: C.muted, marginTop: 12, lineHeight: 1.6 }}>
                  Click any state on the map to see its recommended crop, grow
                  timeline, and regional prices.
                </div>
              </div>
            )}
            {/* All states quick list */}
            <div style={S.card}>
              <div
                style={{
                  fontWeight: 700,
                  color: C.muted,
                  fontSize: 11,
                  marginBottom: 12,
                  letterSpacing: 1,
                }}
              >
                ALL STATES OVERVIEW
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {STATES.map((st) => {
                  const stCrop = crops.find((c) => c.name === st.crop);
                  return (
                    <div
                      key={st.id}
                      onClick={() => setMapState(st.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '7px 10px',
                        background: mapState === st.id ? '#1B4332' : '#0A1E12',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: CROP_COLORS[st.crop],
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: mapState === st.id ? 700 : 400,
                          color: mapState === st.id ? C.white : C.muted,
                        }}
                      >
                        {st.id}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {stCrop?.icon} {st.crop}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: stCrop?.color,
                          fontWeight: 600,
                          minWidth: 70,
                          textAlign: 'right',
                        }}
                      >
                        ₹{stCrop?.price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {stCrop?.growDays}d
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── CHAT ────────────────────────────────────────────────────────────────────
  const ChatPage = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 115px)',
      }}
    >
      <div style={{ ...S.row, marginBottom: 12 }}>
        <h1 style={{ ...S.h1, margin: 0, fontSize: 22 }}>
          🤖 AI Farming Assistant
        </h1>
        {user && <span style={S.tag(C.lime)}>👨‍🌾 {user.name}</span>}
      </div>
      <div
        style={{
          ...S.card,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          marginBottom: 0,
        }}
      >
        {/* Quick prompts */}
        <div
          style={{
            padding: '10px 14px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {[
            '🌱 Best crop for my soil',
            '⏱️ How many days to grow rice?',
            '💰 Current market prices',
            '🧪 Fertilizer recommendations',
            '💧 Water requirements',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setChatInput(q)}
              style={{
                background: '#1B4332',
                border: `1px solid ${C.border}`,
                color: C.muted,
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {q}
            </button>
          ))}
        </div>
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {chatLog.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  background: m.role === 'user' ? C.lime : C.card,
                  color: m.role === 'user' ? C.dark : C.white,
                  border: m.role === 'ai' ? `1px solid ${C.border}` : 'none',
                  borderRadius:
                    m.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.role === 'ai' && (
                  <div
                    style={{ fontSize: 10, color: C.muted, marginBottom: 5 }}
                  >
                    🤖 AI Assistant{user ? ` · Hi, ${user.name}!` : ''}
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {aiTyping && (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: '18px 18px 18px 4px',
                  padding: '10px 16px',
                  fontSize: 13,
                  color: C.muted,
                }}
              >
                Thinking
                <span style={{ animation: 'dots 1.2s infinite' }}>...</span>
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>
        {/* Input */}
        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            gap: 8,
          }}
        >
          <input
            style={{
              ...S.input,
              flex: 1,
              borderRadius: 20,
              padding: '10px 18px',
            }}
            placeholder="Ask about crops, grow days, prices, fertilizers..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          />
          <button
            style={{ ...S.btn(C.lime), borderRadius: 20, padding: '10px 20px' }}
            onClick={sendChat}
          >
            Send ↑
          </button>
        </div>
      </div>
    </div>
  );

  // ── RENDER ──────────────────────────────────────────────────────────────────
  const pages = {
    home: <HomePage />,
    dashboard: <DashboardPage />,
    crops: <CropsPage />,
    market: <MarketPage />,
    map: <MapPage />,
    chat: <ChatPage />,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.dark,
        color: C.white,
        fontFamily: "'Georgia', serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        * { box-sizing:border-box; }
        select option { background:#112D20; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0D2818; }
        ::-webkit-scrollbar-thumb { background:#1B4332; border-radius:3px; }
        @keyframes dots { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }
      `}</style>

      {!user && (
        <OnboardingModal
          onDone={(u) => {
            setUser(u);
            setPage('home');
          }}
        />
      )}

      {/* Navbar */}
      <nav
        style={{
          background: C.panel,
          borderBottom: `1px solid ${C.border}`,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.lime,
            marginRight: 10,
            letterSpacing: -0.5,
            whiteSpace: 'nowrap',
          }}
        >
          🌾 CropAI
        </div>
        {nav.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '13px 10px',
              fontSize: 12,
              cursor: 'pointer',
              borderBottom:
                page === n.id ? `2px solid ${C.lime}` : '2px solid transparent',
              color: page === n.id ? C.lime : C.muted,
              transition: 'all 0.18s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
            }}
            onClick={() => setPage(n.id)}
          >
            <span>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 5,
            alignItems: 'center',
          }}
        >
          {['en', 'hi', 'te'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? C.lime : 'transparent',
                color: lang === l ? C.dark : C.muted,
                border: `1px solid ${lang === l ? C.lime : C.border}`,
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'తె'}
            </button>
          ))}
          {user && (
            <div
              style={{
                background: '#1B4332',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                color: C.lime,
                marginLeft: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              👤 {user.name}
            </div>
          )}
        </div>
      </nav>

      {/* Page content */}
      <div
        style={{
          padding: '24px 20px',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          flex: 1,
        }}
      >
        {pages[page] || <HomePage />}
      </div>
    </div>
  );
}

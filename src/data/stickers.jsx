export const STICKER_CATEGORIES = [
  { id: 'all', label: 'All Stickers' },
  { id: 'tech', label: 'Tech & Retro' },
  { id: 'cozy', label: 'Cozy & Nature' },
  { id: 'stationery', label: 'Stationery & Tape' },
];

export const RETRO_STICKERS = [
  // --- TECH & RETRO ---
  {
    id: 'gameboy',
    name: 'Retro Gameboy',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <rect x="8" y="4" width="32" height="40" rx="3" fill="#6c5ce7" stroke="#000" strokeWidth="2.5" />
        <rect x="13" y="8" width="22" height="16" rx="2" fill="#81ecec" stroke="#000" strokeWidth="2" />
        <rect x="16" y="11" width="16" height="10" fill="#00b894" />
        {/* D-Pad */}
        <path d="M16 28h4v-3h2v3h4v2h-4v3h-2v-3h-4z" fill="#2d3436" stroke="#000" strokeWidth="1" />
        {/* A/B Buttons */}
        <circle cx="33" cy="30" r="2.5" fill="#ff7675" stroke="#000" strokeWidth="1" />
        <circle cx="28" cy="33" r="2.5" fill="#ff7675" stroke="#000" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'computer',
    name: 'Retro PC',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        {/* Monitor */}
        <rect x="6" y="6" width="36" height="26" rx="2" fill="#dfe6e9" stroke="#000" strokeWidth="2.5" />
        <rect x="10" y="10" width="28" height="18" fill="#0984e3" stroke="#000" strokeWidth="1.5" />
        <text x="14" y="22" fill="#f3df23" fontSize="8" fontFamily="monospace" fontWeight="bold">&gt;_DJ</text>
        {/* Stand */}
        <rect x="20" y="32" width="8" height="4" fill="#b2bec3" stroke="#000" strokeWidth="2" />
        <rect x="14" y="36" width="20" height="4" rx="1" fill="#dfe6e9" stroke="#000" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'mini_cd',
    name: 'Mini CD-ROM',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <circle cx="24" cy="24" r="18" fill="#dfe6e9" stroke="#000" strokeWidth="2.5" />
        <path d="M24 6 A18 18 0 0 1 42 24 L34 24 A10 10 0 0 0 24 14 Z" fill="#fd79a8" opacity="0.75" />
        <path d="M24 42 A18 18 0 0 1 6 24 L14 24 A10 10 0 0 0 24 34 Z" fill="#74b9ff" opacity="0.75" />
        <circle cx="24" cy="24" r="8" fill="#ffffff" stroke="#000" strokeWidth="2" />
        <circle cx="24" cy="24" r="3.5" fill="#242262" stroke="#000" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'cassette',
    name: 'Mixtape Cassette',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <rect x="5" y="10" width="38" height="28" rx="3" fill="#ffeaa7" stroke="#000" strokeWidth="2.5" />
        <rect x="10" y="14" width="28" height="14" fill="#fab1a0" stroke="#000" strokeWidth="1.5" />
        <circle cx="18" cy="21" r="3.5" fill="#2d3436" stroke="#000" strokeWidth="1" />
        <circle cx="30" cy="21" r="3.5" fill="#2d3436" stroke="#000" strokeWidth="1" />
        <rect x="14" y="30" width="20" height="6" fill="#dfe6e9" stroke="#000" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'pixel_heart',
    name: '8-Bit Heart',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M14 10h6v4h-6z M28 10h6v4h-6z M8 14h6v4H8z M20 14h8v4h-8z M34 14h6v4h-6z M8 18h32v8H8z M12 26h24v4H12z M16 30h16v4H16z M20 34h8v4h-8z M22 38h4v4h-4z"
          fill="#ff7675"
          stroke="#000"
          strokeWidth="1.5"
        />
        <rect x="14" y="16" width="4" height="4" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'floppy',
    name: 'Floppy Disk',
    category: 'tech',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path d="M8 8h26l6 6v26H8z" fill="#0984e3" stroke="#000" strokeWidth="2.5" />
        <rect x="14" y="8" width="18" height="12" fill="#dfe6e9" stroke="#000" strokeWidth="1.5" />
        <rect x="18" y="10" width="4" height="8" fill="#2d3436" />
        <rect x="12" y="24" width="24" height="16" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
        <line x1="15" y1="28" x2="33" y2="28" stroke="#b2bec3" strokeWidth="1.5" />
        <line x1="15" y1="32" x2="33" y2="32" stroke="#b2bec3" strokeWidth="1.5" />
      </svg>
    ),
  },

  // --- COZY & NATURE ---
  {
    id: 'sparkle_star',
    name: 'Sparkle Star',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M24 4 L28 18 L42 24 L28 30 L24 44 L20 30 L6 24 L20 18 Z"
          fill="#f3df23"
          stroke="#000"
          strokeWidth="2.5"
        />
        <circle cx="24" cy="24" r="3" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'crescent_moon',
    name: 'Cozy Moon',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M28 8 A18 18 0 1 0 38 34 A14 14 0 0 1 28 8 Z"
          fill="#ffeaa7"
          stroke="#000"
          strokeWidth="2.5"
        />
        {/* Sleeping eye */}
        <path d="M22 24 Q24 27 26 24" fill="none" stroke="#2d3436" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="27" r="2" fill="#ff7675" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'fluffy_cloud',
    name: 'Pastel Cloud',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M14 34 h22 a8 8 0 0 0 2-15 a10 10 0 0 0-18-4 a9 9 0 0 0-8 9 a7 7 0 0 0 2 10 z"
          fill="#81ecec"
          stroke="#000"
          strokeWidth="2.5"
        />
        {/* Raindrops / sparkle */}
        <circle cx="18" cy="40" r="1.5" fill="#0984e3" />
        <circle cx="26" cy="42" r="1.5" fill="#0984e3" />
        <circle cx="34" cy="39" r="1.5" fill="#0984e3" />
      </svg>
    ),
  },
  {
    id: 'retro_flower',
    name: 'Retro Daisy',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        {/* 6 petals */}
        <circle cx="24" cy="12" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <circle cx="34" cy="18" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <circle cx="34" cy="30" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <circle cx="24" cy="36" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <circle cx="14" cy="30" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <circle cx="14" cy="18" r="7" fill="#ff7675" stroke="#000" strokeWidth="2" />
        {/* Center */}
        <circle cx="24" cy="24" r="8" fill="#f3df23" stroke="#000" strokeWidth="2.5" />
        <circle cx="21" cy="22" r="1" fill="#000" />
        <circle cx="27" cy="22" r="1" fill="#000" />
        <path d="M22 26 Q24 28 26 26" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'coffee_mug',
    name: 'Warm Coffee',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        {/* Steam */}
        <path d="M18 10 Q16 6 18 2" fill="none" stroke="#b2bec3" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 10 Q22 6 24 2" fill="none" stroke="#b2bec3" strokeWidth="2" strokeLinecap="round" />
        {/* Mug */}
        <rect x="12" y="12" width="22" height="26" rx="4" fill="#a29bfe" stroke="#000" strokeWidth="2.5" />
        {/* Handle */}
        <path d="M34 18 h4 a5 5 0 0 1 5 5 v4 a5 5 0 0 1-5 5 h-4" fill="none" stroke="#000" strokeWidth="2.5" />
        <circle cx="23" cy="25" r="4" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'open_book',
    name: 'Diary Book',
    category: 'cozy',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path d="M24 14 Q32 10 42 12 v24 Q32 22 24 26 Q16 22 6 36 v-24 Q16 10 24 14 z" fill="#fab1a0" stroke="#000" strokeWidth="2.5" />
        <line x1="24" y1="14" x2="24" y2="38" stroke="#000" strokeWidth="2" />
        <path d="M24 20 L27 34 L29 32 L31 34 L28 20" fill="#f3df23" stroke="#000" strokeWidth="1" />
      </svg>
    ),
  },

  // --- STATIONERY & TAPE ---
  {
    id: 'washi_pink',
    name: 'Pink Washi Tape',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 64 24" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M0 4 l3 -4 l3 4 l3 -4 l55 0 l-3 4 l3 4 l-3 4 l-3 4 l-3 -4 l-52 0 l3 -4 l-3 -4 l3 -4 z"
          fill="#ff7675"
          opacity="0.9"
          stroke="#000"
          strokeWidth="1.5"
        />
        <line x1="12" y1="0" x2="6" y2="24" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <line x1="24" y1="0" x2="18" y2="24" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <line x1="36" y1="0" x2="30" y2="24" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <line x1="48" y1="0" x2="42" y2="24" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'washi_mint',
    name: 'Mint Washi Tape',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 64 24" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M0 4 l3 -4 l3 4 l3 -4 l55 0 l-3 4 l3 4 l-3 4 l-3 4 l-3 -4 l-52 0 l3 -4 l-3 -4 l3 -4 z"
          fill="#55efc4"
          opacity="0.9"
          stroke="#000"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="12" r="2" fill="#00b894" />
        <circle cx="28" cy="12" r="2" fill="#00b894" />
        <circle cx="40" cy="12" r="2" fill="#00b894" />
        <circle cx="52" cy="12" r="2" fill="#00b894" />
      </svg>
    ),
  },
  {
    id: 'washi_yellow',
    name: 'Arcade Yellow Tape',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 64 24" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M0 4 l3 -4 l3 4 l3 -4 l55 0 l-3 4 l3 4 l-3 4 l-3 4 l-3 -4 l-52 0 l3 -4 l-3 -4 l3 -4 z"
          fill="#f3df23"
          stroke="#000"
          strokeWidth="1.5"
        />
        <text x="14" y="15" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold">★ DIGI JOURNAL ★</text>
      </svg>
    ),
  },
  {
    id: 'cute_bow',
    name: 'Cute Bow',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path d="M24 24 C14 10 4 20 18 26 C8 32 18 38 24 24 Z" fill="#fd79a8" stroke="#000" strokeWidth="2" />
        <path d="M24 24 C34 10 44 20 30 26 C40 32 30 38 24 24 Z" fill="#fd79a8" stroke="#000" strokeWidth="2" />
        <circle cx="24" cy="24" r="4.5" fill="#ff7675" stroke="#000" strokeWidth="2" />
        <path d="M22 28 L17 40" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 28 L31 40" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'stamp',
    name: 'Postage Stamp',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <rect x="6" y="6" width="36" height="36" rx="1" fill="#fff" stroke="#000" strokeWidth="2.5" strokeDasharray="3 2" />
        <rect x="10" y="10" width="28" height="28" fill="#e17055" stroke="#000" strokeWidth="1.5" />
        <polygon points="24,14 27,22 35,23 29,28 31,36 24,31 17,36 19,28 13,23 21,22" fill="#f3df23" />
      </svg>
    ),
  },
  {
    id: 'paperclip',
    name: 'Paperclip',
    category: 'stationery',
    render: () => (
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_#000]">
        <path
          d="M18 16 v18 a8 8 0 0 0 16 0 v-22 a5 5 0 0 0-10 0 v20 a2 2 0 0 0 4 0 v-16"
          fill="none"
          stroke="#e84393"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

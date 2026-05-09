import type { Game } from "./data/games";

export const STATUS_COLORS: Record<Game["status"], string> = {
  completed: "bg-green-500",
  playing: "bg-blue-500",
  backlog: "bg-orange-500",
  dropped: "bg-red-500",
  "100%": "bg-purple-500",
};

export const STATUS_LABELS: Record<Game["status"], string> = {
  completed: "Zerado",
  playing: "Jogando",
  backlog: "Backlog",
  dropped: "Dropado",
  "100%": "100% Completo",
};

export const STATUS_LABELS_SHORT: Record<Game["status"], string> = {
  completed: "Zerado",
  playing: "Jogando",
  backlog: "Backlog",
  dropped: "Dropado",
  "100%": "100%",
};

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1a1a24",
  border: "1px solid #8b5cf6",
  borderRadius: "8px",
} as const;

export const CHART_GRID_STROKE = "#27273a";
export const CHART_AXIS_STROKE = "#a0a0b8";

export const PLATFORMS = [
  // ── Sony ──────────────────────────────────────────────────────────────────
  "PlayStation 5",
  "PlayStation 4",
  "PlayStation 3",
  "PlayStation 2",
  "PlayStation",
  "PlayStation Portable",
  "PlayStation Vita",
  "PlayStation TV",
  // ── Microsoft ─────────────────────────────────────────────────────────────
  "Xbox Series X/S",
  "Xbox One",
  "Xbox 360",
  "Xbox",
  // ── Nintendo ──────────────────────────────────────────────────────────────
  "Nintendo Switch",
  "Nintendo Switch OLED",
  "Nintendo Switch Lite",
  "Wii U",
  "Wii",
  "GameCube",
  "Nintendo 64",
  "Super Nintendo (SNES)",
  "Nintendo Entertainment System (NES)",
  "Game Boy Advance",
  "Game Boy Color",
  "Game Boy",
  "Nintendo DS",
  "Nintendo DSi",
  "Nintendo DSi XL",
  "Nintendo 3DS",
  "Nintendo 3DS XL",
  "New Nintendo 3DS",
  "New Nintendo 3DS XL",
  "Nintendo 2DS",
  "New Nintendo 2DS",
  "New Nintendo 2DS XL",
  "Virtual Boy",
  "Nintendo 64DD",
  "Famicom Disk System",
  // ── Sega ──────────────────────────────────────────────────────────────────
  "Sega Mega Drive / Genesis",
  "Sega Saturn",
  "Sega Dreamcast",
  "Sega Master System",
  "Sega CD / Mega-CD",
  "Sega 32X",
  "Sega Game Gear",
  "Sega Pico",
  "Sega SG-1000",
  "Sega SC-3000",
  // ── Atari ─────────────────────────────────────────────────────────────────
  "Atari 2600",
  "Atari 5200",
  "Atari 7800",
  "Atari Jaguar",
  "Atari Jaguar CD",
  "Atari Lynx",
  "Atari 8-bit",
  "Atari ST",
  "Atari XE",
  // ── SNK / NeoGeo ──────────────────────────────────────────────────────────
  "Neo Geo AES",
  "Neo Geo MVS",
  "Neo Geo CD",
  "Neo Geo Pocket",
  "Neo Geo Pocket Color",
  // ── NEC ───────────────────────────────────────────────────────────────────
  "PC Engine / TurboGrafx-16",
  "PC Engine CD-ROM²",
  "PC Engine SuperGrafx",
  "PC-FX",
  "PC-88",
  "PC-98",
  // ── 3DO ───────────────────────────────────────────────────────────────────
  "3DO Interactive Multiplayer",
  // ── Bandai / Bandai Namco ─────────────────────────────────────────────────
  "WonderSwan",
  "WonderSwan Color",
  "Bandai Playdia",
  // ── Philips ───────────────────────────────────────────────────────────────
  "Philips CD-i",
  // ── Mattel ────────────────────────────────────────────────────────────────
  "Mattel Intellivision",
  "Mattel Aquarius",
  // ── Magnavox / Philips ────────────────────────────────────────────────────
  "Magnavox Odyssey",
  "Magnavox Odyssey 2",
  // ── Coleco ────────────────────────────────────────────────────────────────
  "ColecoVision",
  "Coleco Telstar",
  // ── Vectrex ───────────────────────────────────────────────────────────────
  "Vectrex",
  // ── Casio ─────────────────────────────────────────────────────────────────
  "Casio Loopy",
  "Casio PV-1000",
  // ── Commodore ─────────────────────────────────────────────────────────────
  "Commodore 64",
  "Commodore 128",
  "Commodore VIC-20",
  "Commodore PET",
  "Amiga",
  "Amiga CD32",
  "Amiga CDTV",
  // ── Sinclair / Spectrum ───────────────────────────────────────────────────
  "ZX Spectrum",
  "ZX Spectrum 128",
  "ZX81",
  // ── Amstrad ───────────────────────────────────────────────────────────────
  "Amstrad CPC",
  "Amstrad GX4000",
  // ── MSX ───────────────────────────────────────────────────────────────────
  "MSX",
  "MSX2",
  "MSX2+",
  "MSX Turbo-R",
  // ── Sharp ─────────────────────────────────────────────────────────────────
  "Sharp X68000",
  "Sharp X1",
  "Sharp MZ",
  // ── Fujitsu ───────────────────────────────────────────────────────────────
  "FM Towns",
  "FM-7",
  "FM-77",
  // ── Apple ─────────────────────────────────────────────────────────────────
  "Apple II",
  "Apple IIGS",
  "Apple Macintosh",
  // ── PC ────────────────────────────────────────────────────────────────────
  "PC (Windows)",
  "PC (DOS)",
  "PC (Linux)",
  "PC (macOS)",
  "Steam",
  "Steam Deck",
  // ── VR Headsets ───────────────────────────────────────────────────────────
  "Meta Quest 3",
  "Meta Quest 2",
  "Meta Quest",
  "Meta Quest Pro",
  "PlayStation VR2",
  "PlayStation VR",
  "Valve Index",
  "HTC Vive",
  "HTC Vive Pro",
  "HTC Vive Cosmos",
  "Oculus Rift",
  "Oculus Rift S",
  "Windows Mixed Reality",
  "Samsung Gear VR",
  "Google Cardboard",
  "Pimax 8K",
  "HP Reverb G2",
  // ── Mobile ────────────────────────────────────────────────────────────────
  "iOS (iPhone / iPad)",
  "Android",
  "Windows Phone",
  "Nokia N-Gage",
  // ── Handheld / Retro ──────────────────────────────────────────────────────
  "Tiger Electronics",
  "Microvision",
  "Epoch Game Pocket Computer",
  "Watara Supervision",
  "Gamate",
  "Gizmondo",
  // ── Stadia / Cloud ────────────────────────────────────────────────────────
  "Google Stadia",
  "Amazon Luna",
  "Xbox Cloud Gaming",
  "NVIDIA GeForce NOW",
  "PlayStation Now",
  // ── Arcade ────────────────────────────────────────────────────────────────
  "Arcade",
  "Neo Geo MVS (Arcade)",
  "Sega NAOMI",
  "Sega Hikaru",
  "Sega System 32",
  "Namco System",
  "Konami System",
  "Capcom CPS-1",
  "Capcom CPS-2",
  "Capcom CPS-3",
  // ── Leapfrog / Educational ────────────────────────────────────────────────
  "LeapFrog Leapster",
  "VTech V.Smile",
  // ── Other / Misc ──────────────────────────────────────────────────────────
  "Ouya",
  "GameStick",
  "Nvidia Shield",
  "Zeebo",
  "Amazon Fire TV",
  "Apple TV",
  "Analogue Pocket",
  "Evercade",
  "Polymega",
];

export const STATUS_OPTIONS_FORM = [
  { value: "backlog", label: "Backlog" },
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Zerado" },
  { value: "100%", label: "100% Completo" },
  { value: "dropped", label: "Dropado" },
] as const;

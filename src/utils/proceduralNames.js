const PREFIXES = ['Cyber', 'Neon', 'Volt', 'Pulse', 'Nova', 'Glitch', 'Flux', 'Zen', 'Chrono', 'Nitro', 'Lumen', 'Zap'];
const SUFFIXES = ['Core', 'Shift', 'Blade', 'Drive', 'Pulse', 'Chip', 'Link', 'Wave', 'Spark', 'Rush', 'Mode', 'Storm'];

export function generatePowerName() {
  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  return `${p} ${s}`;
}
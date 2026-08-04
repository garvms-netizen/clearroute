/**
 * Renders the RouteMark into an .ico for the desktop shortcut and favicon.
 *
 * Run:  node scripts/gen-icon.mjs
 *
 * Uses sharp, which is already present as a Next.js dependency — no new
 * package, nothing to install, nothing to pay for.
 *
 * The mark is drawn on the Deep Route Blue field rather than transparent,
 * because a desktop icon sits on an unknown wallpaper and a bare teal stroke
 * would vanish against half of them. Same geometry as components/art/
 * RouteMark: one stroke, one bend, three nodes, the middle one Signal Teal.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const SIZE = 256;

// Geometry is the 60x36 mark, scaled and centred in a 256 square.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="56" fill="#1B3A6B"/>
  <g transform="translate(28, 74) scale(3.34)">
    <path d="M6 30 L30 30 L54 6" stroke="#00B8A9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="6" cy="30" r="8" fill="#E4E9F2"/>
    <circle cx="30" cy="30" r="8" fill="#00B8A9"/>
    <circle cx="54" cy="6" r="8" fill="#E4E9F2"/>
  </g>
</svg>`;

/**
 * Wrap a PNG in an ICO container.
 *
 * ICO has supported an embedded PNG payload since Vista, so this is a 6-byte
 * directory header plus one 16-byte entry in front of the PNG bytes — no
 * bitmap re-encoding needed. A width/height byte of 0 means 256.
 */
function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0); // width  256
  entry.writeUInt8(0, 1); // height 256
  entry.writeUInt8(0, 2); // palette size (0 = truecolour)
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

const png = await sharp(Buffer.from(svg)).resize(SIZE, SIZE).png().toBuffer();
const ico = pngToIco(png);

mkdirSync(join(ROOT, "public"), { recursive: true });
writeFileSync(join(ROOT, "public", "clearroute.ico"), ico);
writeFileSync(join(ROOT, "app", "favicon.ico"), ico);
writeFileSync(join(ROOT, "public", "icon.png"), png);

/**
 * Open Graph card, 1200x630.
 *
 * Drawn here rather than screenshotted: the mark, the wordmark and the
 * tagline composed on the brand ground, with the same one-bend route line the
 * hero uses. Text is real SVG type, so it stays crisp and never garbles the
 * way a generated image would.
 */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0B1220"/>
  <g opacity="0.28">
    <path d="M0 470 L520 470 L1200 250" stroke="#00B8A9" stroke-width="3" fill="none"/>
  </g>
  <g transform="translate(80, 96) scale(1.5)">
    <path d="M6 30 L30 30 L54 6" stroke="#00B8A9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="6" cy="30" r="6" fill="#E4E9F2"/>
    <circle cx="30" cy="30" r="6" fill="#00B8A9"/>
    <circle cx="54" cy="6" r="6" fill="#E4E9F2"/>
  </g>
  <text x="80" y="300" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="#E4E9F2" letter-spacing="-2">Clear Route</text>
  <text x="80" y="386" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="40" font-weight="600" fill="#00B8A9" letter-spacing="-1">See every step your money takes.</text>
  <text x="80" y="440" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="40" font-weight="600" fill="#00B8A9" letter-spacing="-1">Every time.</text>
  <text x="80" y="546" font-family="IBM Plex Mono, Consolas, monospace" font-size="22" fill="#8B99B0">Cross-border payments · fictional company · academic project</text>
</svg>`;

const ogPng = await sharp(Buffer.from(og)).png().toBuffer();
writeFileSync(join(ROOT, "public", "og.png"), ogPng);

console.log(`Wrote clearroute.ico, favicon.ico, icon.png (${SIZE}px) and og.png (1200x630)`);

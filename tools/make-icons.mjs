/**
 * Chrome Web Store icon'larini (16/32/48/128 px) bagimlilik olmadan uretir.
 * Cizim: yesil yuvarlatilmis kare + beyaz onay isareti.
 *   node tools/make-icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const BG = [22, 163, 74];
const FG = [255, 255, 255];
const SIZES = [16, 32, 48, 128];

function main() {
  mkdirSync('public/icons', { recursive: true });
  for (const size of SIZES) {
    // Magaza ikonu (128) icin Google 96x96 gorsel alan + her kenarda 16 px seffaf bosluk istiyor.
    const padding = size === 128 ? 16 : 0;
    writeFileSync(`public/icons/icon${size}.png`, encodePng(size, size, draw(size, padding)));
    console.log(`public/icons/icon${size}.png`);
  }
}

/** @returns {Uint8Array} RGBA piksel verisi */
function draw(size, padding = 0) {
  const px = new Uint8Array(size * size * 4);
  const box = size - padding * 2; // gorsel alan
  const r = box * 0.22; // kose yaricapi
  // onay isareti: iki dogru parcasi (gorsel alana gore normalize)
  const seg = [
    [0.27, 0.52, 0.43, 0.68],
    [0.43, 0.68, 0.75, 0.33],
  ].map(([x1, y1, x2, y2]) => [padding + x1 * box, padding + y1 * box, padding + x2 * box, padding + y2 * box]);
  const stroke = box * 0.085;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = x + 0.5 - padding;
      const cy = y + 0.5 - padding;
      const inside = roundedRectCoverage(cx, cy, box, r);
      if (inside <= 0) continue;

      let d = Infinity;
      for (const s of seg) d = Math.min(d, distanceToSegment(x + 0.5, y + 0.5, s));
      const check = clamp01((stroke - d) / 1.2 + 0.5);

      const i = (y * size + x) * 4;
      const color = mix(BG, FG, check);
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = Math.round(255 * inside);
    }
  }
  return px;
}

function roundedRectCoverage(x, y, size, r) {
  const inner = size - r;
  const dx = Math.max(r - x, 0, x - inner);
  const dy = Math.max(r - y, 0, y - inner);
  const dist = Math.hypot(dx, dy);
  return clamp01((r - dist) / 1.2 + 0.5);
}

function distanceToSegment(px, py, [x1, y1, x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = clamp01(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function mix(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    Buffer.from(rgba.subarray(y * width * 4, (y + 1) * width * 4)).copy(raw, y * (width * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

main();

// Generates the printable QR code for the D6 Global Limited landing page.
//
//   npm run qr:generate                 -> https://d6globalmedia.com/qr
//   npm run qr:generate -- <https-url>  -> a different public URL
//
// Writes public/qr-code/d6-global-qr.png (1024px, for screens/print) and
// public/qr-code/d6-global-qr.svg (vector, for print). Files in public/ ship with
// the site, so they are also downloadable at /qr-code/d6-global-qr.png.
//
// The default is the production domain the site is served from: the same
// canonical URL the backend uses in every email (SITE_URL), confirmed by the
// "update brand to D6 Global Services" commit, which kept d6globalmedia.com.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const DEFAULT_URL = "https://d6globalmedia.com/qr";
const url = process.argv[2] || DEFAULT_URL;

// A printed code must only ever point at the public site.
const parsed = new URL(url);
if (parsed.protocol !== "https:" || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(parsed.hostname) || parsed.hostname.endsWith(".local")) {
  console.error(`Refusing to encode a non-public URL: ${url}`);
  process.exit(1);
}

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "qr-code");
await mkdir(outDir, { recursive: true });

// High error correction survives print wear and small logos/stickers; navy on
// white keeps the contrast scanners need.
const options = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#0B1F3A", light: "#FFFFFF" } };

const png = path.join(outDir, "d6-global-qr.png");
const svg = path.join(outDir, "d6-global-qr.svg");
await QRCode.toFile(png, url, { ...options, type: "png", width: 1024 });
await QRCode.toFile(svg, url, { ...options, type: "svg" });

console.log(`Encoded: ${url}`);
console.log(`PNG: ${path.relative(process.cwd(), png)}`);
console.log(`SVG: ${path.relative(process.cwd(), svg)}`);

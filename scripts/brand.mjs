// สร้าง favicon กับภาพพรีวิวตอนแชร์ลิงก์ ด้วย sharp ที่มีอยู่แล้ว
//   node scripts/brand.mjs
import sharp from "sharp";
import fs from "node:fs";

const GOLD = "#D9B15A", INK = "#14121B", PAPER = "#F0EBE2", MUTED = "#A89C86";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const png = (svg) => sharp(Buffer.from(svg)).png();

// ---------- favicon: กรอบมนสีดำ เลข 64 สีทอง ----------
const markSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  <rect x="3" y="3" width="58" height="58" rx="12" fill="none" stroke="${GOLD}" stroke-opacity=".55" stroke-width="2"/>
  <text x="32" y="45" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial"
        font-size="34" font-weight="700" fill="${GOLD}">64</text>
</svg>`;

fs.writeFileSync("public/favicon.svg", markSvg(64));
for (const [name, size] of [["favicon-32.png", 32], ["favicon-192.png", 192], ["apple-touch-icon.png", 180]]) {
  await png(markSvg(size)).resize(size, size).toFile("public/" + name);
}

// ---------- ภาพพรีวิว 1200x630: ตัวหนังสือซ้าย สติกเกอร์ขวา ----------
const PICKS = ["ENTJ-AS", "INFJ-AC", "ESTJ-AC", "ESTP-AC"];
const title = "64 ตำแหน่งในต่างโลก";
const sub = "แบบประเมินตำแหน่งประจำปี ฝ่ายบุคคลแห่งอาณาจักร";
const meta = "78 ข้อ · 6 แกน · 64 ตำแหน่ง · ทำเล่นกันในทีม";

const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#191527"/><stop offset="1" stop-color="#100E18"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="26" y="26" width="1148" height="578" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width="2"/>
  <rect x="34" y="34" width="1132" height="562" fill="none" stroke="${GOLD}" stroke-opacity=".18" stroke-width="1"/>
  <text x="80" y="188" font-family="Thonburi" font-size="34" fill="${MUTED}">${esc(sub)}</text>
  <text x="80" y="292" font-family="Thonburi" font-size="78" font-weight="700" fill="${GOLD}">${esc(title)}</text>
  <text x="80" y="356" font-family="Thonburi" font-size="30" fill="${PAPER}">${esc(meta)}</text>
  <rect x="80" y="388" width="132" height="3" fill="${GOLD}" fill-opacity=".8"/>
</svg>`;

const stickers = await Promise.all(
  PICKS.map((c, i) =>
    sharp(`public/mob/${c}.webp`).resize(200, 200, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer().then((input) => ({ input, left: 128 + i * 250, top: 404 - (i % 2) * 14 }))
  )
);

await sharp(Buffer.from(base)).composite(stickers).png({ quality: 90 }).toFile("public/og.png");
const kb = (f) => Math.round(fs.statSync(f).size / 1024) + " KB";
console.log("favicon.svg / favicon-32 / favicon-192 / apple-touch-icon เสร็จ");
console.log("og.png", kb("public/og.png"));

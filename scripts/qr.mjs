// สร้าง QR ชี้ไปหน้าเว็บ อ่าน URL จาก site ใน astro.config ทีเดียว จะได้ไม่หลุดกัน
//   node scripts/qr.mjs            -> public/qr.png และ public/qr-card.png
//   node scripts/qr.mjs <url>      -> ใช้ URL อื่นแทน
import QRCode from "qrcode";
import sharp from "sharp";
import fs from "node:fs";
import config from "../astro.config.mjs";

const URL_ = process.argv[2] || config.site;
const SHOWN = URL_.replace(/^https?:\/\//, "").replace(/\/$/, "");
const GOLD = "#D9B15A", INK = "#14121B", PAPER = "#FBF9F6", MUTED = "#A89C86";

// ---------- QR ล้วน เผื่อเอาไปวางเองที่อื่น ----------
await QRCode.toFile("public/qr.png", URL_, {
  errorCorrectionLevel: "H", // เผื่อพิมพ์แล้วเลอะหรือมีอะไรบัง ยังสแกนติด
  margin: 2,
  width: 900,
  color: { dark: INK, light: "#FFFFFF" },
});

// ---------- การ์ดสำหรับโพสหรือปริ้นแปะ ----------
const W = 800, H = 1040, QR = 460;
const qrBuf = await QRCode.toBuffer(URL_, {
  errorCorrectionLevel: "H", margin: 1, width: QR,
  color: { dark: INK, light: "#FFFFFF" },
});

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#191527"/><stop offset="1" stop-color="#100E18"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width="2"/>
  <rect x="32" y="32" width="${W - 64}" height="${H - 64}" fill="none" stroke="${GOLD}" stroke-opacity=".18" stroke-width="1"/>
  <text x="${W / 2}" y="112" text-anchor="middle" font-family="Thonburi" font-size="27" fill="${MUTED}">สแกนเพื่อรับตำแหน่งประจำตัว</text>
  <text x="${W / 2}" y="184" text-anchor="middle" font-family="Thonburi" font-size="54" font-weight="700" fill="${GOLD}">64 ตำแหน่งในต่างโลก</text>
  <text x="${W / 2}" y="236" text-anchor="middle" font-family="Thonburi" font-size="26" fill="${PAPER}">78 ข้อ · 6 แกน · ใช้เวลาราว 8 นาที</text>
  <rect x="${(W - QR - 44) / 2}" y="286" width="${QR + 44}" height="${QR + 44}" rx="10" fill="${PAPER}"/>
  <text x="${W / 2}" y="${H - 96}" text-anchor="middle" font-family="Helvetica Neue, Helvetica" font-size="26" fill="${GOLD}">${SHOWN}</text>
  <text x="${W / 2}" y="${H - 54}" text-anchor="middle" font-family="Thonburi" font-size="21" fill="${MUTED}">ทำเล่นกันในทีม ไม่ใช่เครื่องมือวัดผลทางจิตวิทยา</text>
</svg>`;

await sharp(Buffer.from(card))
  .composite([{ input: qrBuf, left: (W - QR) / 2, top: 308 }])
  .png()
  .toFile("public/qr-card.png");

const kb = (f) => Math.round(fs.statSync(f).size / 1024) + " KB";
console.log("URL:", URL_);
console.log("qr.png", kb("public/qr.png"), "· qr-card.png", kb("public/qr-card.png"));

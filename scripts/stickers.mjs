// แปลงสติกเกอร์ต้นฉบับ 1024px เป็น webp 320px สำหรับใช้บนเว็บ
// ใช้ sharp ที่ Astro ลงมาให้อยู่แล้ว ไม่ต้องลงอะไรเพิ่ม
//   node scripts/stickers.mjs <โฟลเดอร์ต้นฉบับ>
// ต้นฉบับจัดเป็น <โฟลเดอร์>/INTJ/INTJ-AC.png
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { TYPES } from "../src/data/types.js";

const SRC = process.argv[2];
if (!SRC) { console.error("ใส่พาธโฟลเดอร์ต้นฉบับด้วย"); process.exit(1); }
fs.mkdirSync("public/mob", { recursive: true });

let total = 0;
const missing = [];
for (const code of Object.keys(TYPES)) {
  const src = path.join(SRC, code.slice(0, 4), code + ".png");
  if (!fs.existsSync(src)) { missing.push(code); continue; }
  const out = `public/mob/${code}.webp`;
  await sharp(src)
    .trim({ threshold: 1 }) // ตัดขอบโปร่งใสก่อน ทุกใบจะได้เต็มกรอบเท่ากัน
    .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 78, effort: 6 })
    .toFile(out);
  total += fs.statSync(out).size;
}
console.log(`เสร็จ ${64 - missing.length} ไฟล์ รวม ${(total / 1024 / 1024).toFixed(2)} MB`);
if (missing.length) console.log("ไม่เจอ:", missing.join(", "));

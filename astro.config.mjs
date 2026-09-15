import { defineConfig } from "astro/config";

// ทุกอย่างถูกฝังลงใน index.html ไฟล์เดียว (สคริปต์เป็น is:inline + CSS inline)
// จะได้เอา dist/index.html ไปวางที่ไหนก็ได้ ไม่ต้องมีโฟลเดอร์ assets ตามไปด้วย
export default defineConfig({
  build: { inlineStylesheets: "always" },
});

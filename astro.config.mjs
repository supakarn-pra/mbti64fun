import { defineConfig } from "astro/config";

// site ใช้สร้าง URL เต็มให้ og:image กับ og:url เท่านั้น
// ตัวหน้าเว็บยังอ้างไฟล์แบบพาธสัมพัทธ์ทั้งหมด เลยย้ายไปวางโฟลเดอร์ไหนก็ยังใช้ได้
// ย้ายโดเมนเมื่อไหร่ แก้บรรทัดเดียวตรงนี้
export default defineConfig({
  site: "https://mbti64-emp.vercel.app/", // ตามที่ระบุไว้ใน README ของชุด web assets
  build: { inlineStylesheets: "always" },
});

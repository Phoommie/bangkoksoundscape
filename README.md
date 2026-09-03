# BANGKOK SOUNDSCAPE — Real-time Visitor Counter

ระบบนี้ใช้:
- Vercel เป็นเว็บ + Serverless API
- Supabase Realtime Presence สำหรับจำนวนคนที่กำลังออนไลน์
- Supabase Postgres สำหรับจำนวนเข้าชมสะสม
- Vercel environment variables สำหรับเก็บ Service Role Key ฝั่งเซิร์ฟเวอร์

## 1) ตั้งค่า Supabase
1. สร้างโปรเจกต์ใน Supabase
2. เปิด SQL Editor
3. วางโค้ดจาก `supabase.sql` แล้ว Run
4. ไปที่ Settings > API และเตรียมค่า:
   - Project URL
   - Publishable/Anon key
   - Service Role key (ห้ามนำไปใส่ใน HTML)

## 2) ตั้งค่า Vercel
นำโฟลเดอร์นี้ไป Deploy ที่ Vercel แล้วเพิ่ม Environment Variables:

SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

สำคัญ: `SUPABASE_SERVICE_ROLE_KEY` ต้องอยู่เฉพาะใน Environment Variables ของ Vercel
และห้ามเขียนลงใน `index.html`

## 3) ผลลัพธ์
หน้าเว็บจะแสดง:
- 🟢 ออนไลน์ = จำนวน browser session ที่เชื่อมต่อ Realtime อยู่ในขณะนั้น
- 👁️ เข้าชมทั้งหมด = จำนวน session ที่นับเข้าเว็บสะสม

เมื่อผู้ใช้เข้า/ออกเว็บ จำนวน "ออนไลน์" จะเปลี่ยนแบบ Realtime ผ่าน Supabase Presence
และเมื่อยอดรวมเพิ่ม ผู้ใช้ที่เปิดเว็บอยู่จะได้รับค่าใหม่ผ่าน Realtime Database Changes

หมายเหตุ:
- ตัวนับออนไลน์เป็นจำนวน session ไม่ใช่จำนวนคนจริงแบบยืนยันตัวตน
- ผู้ใช้ที่เปิดหลายอุปกรณ์อาจถูกนับหลาย session
- จำนวนเข้าชมสะสมเป็นข้อมูลสาธารณะ จึงอาจถูกเรียก API ซ้ำได้หากมีคนจงใจยิง endpoint
